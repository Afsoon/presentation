import type { AnyStateMachine, SnapshotFrom } from "xstate";

import type { SlideSnapshot } from "@/stores/slide-store";
import { speakerNotes, upcomingStep } from "@/stores/speaker-state";
import { subslideControlsStore } from "@/stores/subslide-controls";

export type NavigationDirection = "left" | "right" | "up" | "down";
export type NavigationAvailability = Record<NavigationDirection, boolean>;
export type TimerState = { started: number | null; accumulated: number };
type PreviewState = { id: string; name: string; snapshot: unknown };
export type SpeakerPresentation = {
	current: PreviewState;
	upcoming: PreviewState | null;
	notes: string;
	available: NavigationAvailability;
	dark: boolean;
	revision: number;
};
export type SpeakerMessage =
	| { type: "ready" }
	| { type: "init"; timer: TimerState }
	| { type: "state"; presentation: SpeakerPresentation }
	| { type: "navigate"; direction: NavigationDirection }
	| { type: "timer"; timer: TimerState };

const channel = "presentation-speaker";
export function sendSpeakerMessage(peer: Window, message: SpeakerMessage) {
	peer.postMessage({ channel, ...message }, window.location.origin);
}
function record(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object";
}
function isTimer(value: unknown): value is TimerState {
	return (
		record(value) &&
		(value.started === null || (typeof value.started === "number" && Number.isFinite(value.started))) &&
		typeof value.accumulated === "number" &&
		Number.isFinite(value.accumulated) &&
		value.accumulated >= 0
	);
}
function isPreview(value: unknown): boolean {
	return record(value) && typeof value.id === "string" && typeof value.name === "string";
}
export function readSpeakerMessage(event: MessageEvent, peer: Window | null, origin: string): SpeakerMessage | null {
	if (
		!peer ||
		event.source !== peer ||
		event.origin !== origin ||
		!record(event.data) ||
		event.data.channel !== channel
	)
		return null;
	const data = event.data;
	switch (data.type) {
		case "ready":
			return { type: "ready" };
		case "navigate":
			return ["left", "right", "up", "down"].includes(data.direction as string)
				? { type: "navigate", direction: data.direction as NavigationDirection }
				: null;
		case "timer":
		case "init":
			return isTimer(data.timer) ? { type: data.type, timer: data.timer } : null;
		case "state": {
			const state = data.presentation;
			if (
				!record(state) ||
				!isPreview(state.current) ||
				(state.upcoming !== null && !isPreview(state.upcoming)) ||
				typeof state.notes !== "string" ||
				typeof state.dark !== "boolean" ||
				typeof state.revision !== "number" ||
				!record(state.available)
			)
				return null;
			const available = state.available;
			if (!["left", "right", "up", "down"].every((key) => typeof available[key] === "boolean")) return null;
			return { type: "state", presentation: state as SpeakerPresentation };
		}
		default:
			return null;
	}
}

export function persistPreview(snapshot: unknown): unknown {
	if (!snapshot) return undefined;
	const state = snapshot as SnapshotFrom<AnyStateMachine>;
	return state.machine.getPersistedSnapshot(state);
}
export function createSpeakerPresentation(
	presentation: SlideSnapshot,
	dark: boolean,
	revision: number,
	controls = subslideControlsStore,
): SpeakerPresentation {
	const current = presentation.currentSlide;
	const snapshot = controls.getActor(current.Id)?.getSnapshot();
	const next = upcomingStep(presentation, controls);
	return {
		current: { id: current.Id, name: current.name, snapshot: persistPreview(snapshot) },
		upcoming: next ? { id: next.slide.Id, name: next.slide.name, snapshot: persistPreview(next.snapshot) } : null,
		notes: speakerNotes(current, snapshot?.value),
		available: {
			left: !!presentation.availableNavigations.left,
			right: !!presentation.availableNavigations.right,
			up: snapshot?.can({ type: "PREVIOUS" }) ?? false,
			down: snapshot?.can({ type: "NEXT" }) ?? false,
		},
		dark,
		revision,
	};
}
