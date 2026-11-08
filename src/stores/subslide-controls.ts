import type { SlideMetadata } from "@/slides/types";

export type SubslideControls = {
	Id: string;
	up: (() => void) | null;
	down: (() => void) | null;
};
export type SubslideControlsSnapshot = SubslideControls & { canGoUp: boolean; canGoDown: boolean };

export function getAvailableSubslideControls<T extends { Id: string }>(controls: T | null, slide: SlideMetadata) {
	return slide.hasSubslides && controls?.Id === slide.Id ? controls : null;
}

export function createSubslideControlsStore() {
	let snapshot: SubslideControlsSnapshot | null = null;
	let initialized = false;
	const listeners = new Set<() => void>();
	const emit = () => listeners.forEach((listener) => listener());

	return {
		getSnapshot: () => snapshot,
		getServerSnapshot: () => null,
		hydrate: (initial: SubslideControlsSnapshot) => {
			if (initialized) return;
			initialized = true;
			if (!snapshot) snapshot = initial;
		},
		subscribe: (listener: () => void) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		updateSubslidesControl: (controls: SubslideControls | null) => {
			snapshot = controls ? { ...controls, canGoUp: !!controls.up, canGoDown: !!controls.down } : null;
			emit();
		},
	};
}

export const subslideControlsStore = createSubslideControlsStore();
