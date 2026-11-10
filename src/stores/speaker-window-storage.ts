import type { AnyActorRef } from "xstate";

import {
	createSpeakerPresentation,
	readSpeakerMessage,
	sendSpeakerMessage,
	type TimerState,
} from "@/lib/speaker-messages";
import { navigatePresentation } from "@/stores/presentation-navigation";
import { slideStore } from "@/stores/slide-store";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { createExternalStorage } from "./external-storage";

export function createSpeakerWindowStorage() {
	let popup: Window | null = null;
	let timer: TimerState | null = null;
	const setError = (error: string) => {
		if (storage.getSnapshot().error !== error) storage.setSnapshot({ error });
	};
	const open = () => {
		if (popup && !popup.closed) {
			popup.focus();
			return;
		}
		const child = window.open(
			new URL("/speaker", window.location.href),
			"presentation-speaker",
			"popup,width=1200,height=850",
		);
		if (!child) {
			setError("Allow popups for this site, then press Alt + S to open speaker view.");
			return;
		}
		popup = child;
		timer ??= { started: Date.now(), accumulated: 0 };
		setError("");
	};
	const storage = createExternalStorage({ error: "" }, () => {
		if (typeof window === "undefined") return;
		let revision = 0;
		const publish = () => {
			if (!popup || popup.closed) return;
			sendSpeakerMessage(popup, {
				type: "state",
				presentation: createSpeakerPresentation(
					slideStore.getSnapshot(),
					document.documentElement.classList.contains("dark"),
					++revision,
				),
			});
		};
		let unsubscribeActor = () => {};
		const subscribeActor = () => {
			unsubscribeActor();
			const actor = subslideControlsStore.getActor(slideStore.getSnapshot().currentSlide.Id) as AnyActorRef | undefined;
			const subscription = actor?.subscribe(publish);
			unsubscribeActor = () => subscription?.unsubscribe();
			publish();
		};
		const unsubscribeSlides = slideStore.subscribe(subscribeActor);
		const unsubscribeRegistry = subslideControlsStore.subscribeActors(subscribeActor);
		subscribeActor();
		const messages = (event: MessageEvent) => {
			const message = readSpeakerMessage(event, popup, window.location.origin);
			if (!message) return;
			switch (message.type) {
				case "ready":
					if (popup && timer) sendSpeakerMessage(popup, { type: "init", timer: timer });
					publish();
					break;
				case "navigate":
					navigatePresentation(message.direction);
					break;
				case "timer":
					timer = message.timer;
					break;
			}
		};
		window.addEventListener("message", messages);
		const themeObserver = new MutationObserver(publish);
		themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		const close = () => popup?.close();
		window.addEventListener("pagehide", close);
		return () => {
			unsubscribeActor();
			unsubscribeSlides();
			unsubscribeRegistry();
			themeObserver.disconnect();
			window.removeEventListener("message", messages);
			window.removeEventListener("pagehide", close);
			close();
		};
	});
	return { ...storage, open };
}

export const speakerWindowStorage = createSpeakerWindowStorage();
