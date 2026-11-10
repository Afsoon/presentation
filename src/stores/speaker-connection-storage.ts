import {
	readSpeakerMessage,
	sendSpeakerMessage,
	type NavigationDirection,
	type SpeakerPresentation,
	type TimerState,
} from "@/lib/speaker-messages";

import { createExternalStorage } from "./external-storage";

type ConnectionSnapshot = {
	presentation: SpeakerPresentation | null;
	initialTimer: TimerState | null;
	disconnected: boolean;
};

export function createSpeakerConnectionStorage() {
	const disconnect = () => {
		const snapshot = storage.getSnapshot();
		if (!snapshot.disconnected) storage.setSnapshot({ ...snapshot, disconnected: true });
	};
	const storage = createExternalStorage<ConnectionSnapshot>(
		{ presentation: null, initialTimer: null, disconnected: false },
		() => {
			if (typeof window === "undefined") return;
			const opener = window.opener as Window | null;
			if (!opener || opener.closed) {
				disconnect();
				return;
			}

			const messages = (event: MessageEvent) => {
				const message = readSpeakerMessage(event, opener, window.location.origin);
				if (message?.type === "init" && !storage.getSnapshot().initialTimer) {
					storage.setSnapshot({ ...storage.getSnapshot(), initialTimer: message.timer });
				}
				if (message?.type === "state") {
					document.documentElement.classList.toggle("dark", message.presentation.dark);
					storage.setSnapshot({ ...storage.getSnapshot(), presentation: message.presentation, disconnected: false });
				}
			};
			window.addEventListener("message", messages);
			sendSpeakerMessage(opener, { type: "ready" });
			const interval = window.setInterval(() => {
				if (opener.closed) {
					disconnect();
					return;
				}
				if (!storage.getSnapshot().initialTimer) sendSpeakerMessage(opener, { type: "ready" });
			}, 1000);
			return () => {
				window.removeEventListener("message", messages);
				window.clearInterval(interval);
			};
		},
	);
	const navigate = (direction: NavigationDirection) => {
		if (window.opener && !window.opener.closed) sendSpeakerMessage(window.opener, { type: "navigate", direction });
	};
	const saveTimer = (timer: TimerState) => {
		if (window.opener && !window.opener.closed) sendSpeakerMessage(window.opener, { type: "timer", timer });
	};
	return { ...storage, navigate, saveTimer };
}

export const speakerConnectionStorage = createSpeakerConnectionStorage();
