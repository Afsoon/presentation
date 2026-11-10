import { getNextSnapshot, type AnyStateMachine, type SnapshotFrom } from "xstate";

import type { Slide, SlideSnapshot } from "./slide-store";
import { subslideControlsStore } from "./subslide-controls";

export function upcomingStep(presentation: SlideSnapshot, controls = subslideControlsStore) {
	const current = presentation.currentSlide;
	const actor = controls.getActor(current.Id);
	const snapshot = actor?.getSnapshot();
	if (actor && snapshot?.can({ type: "NEXT" })) {
		return {
			slide: current,
			snapshot: getNextSnapshot(snapshot.machine as AnyStateMachine, snapshot as SnapshotFrom<AnyStateMachine>, {
				type: "NEXT",
			}),
		};
	}
	const slide = presentation.availableNavigations.right;
	return slide ? { slide, snapshot: controls.getRememberedActor(slide.Id)?.getSnapshot() } : null;
}
export function stateKey(state: unknown): string {
	if (typeof state === "string") return state;
	if (!state || typeof state !== "object") return "";
	return Object.entries(state)
		.map(([key, value]) => `${key}.${stateKey(value)}`)
		.join("+");
}
export function speakerNotes(slide: Slide, state: unknown) {
	return slide.subslideNotes?.[stateKey(state)] ?? slide.notes ?? "No speaker notes";
}
export function elapsedTime(started: number, accumulated: number, now: number) {
	return accumulated + Math.max(0, now - started);
}
export function formatElapsed(ms: number) {
	const seconds = Math.floor(ms / 1000);
	return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
		.map((value) => String(value).padStart(2, "0"))
		.join(":");
}
