import type { SlideMetadata } from "@/slides/types";

export type SubslideControls = {
	Id: string;
	up: (() => void) | null;
	down: (() => void) | null;
};

export function getAvailableSubslideControls(controls: SubslideControls | null, slide: SlideMetadata) {
	return slide.hasSubslides && controls?.Id === slide.Id ? controls : null;
}

export function createSubslideControlsStore() {
	let snapshot: SubslideControls | null = null;
	const listeners = new Set<() => void>();
	const emit = () => listeners.forEach((listener) => listener());

	return {
		getSnapshot: () => snapshot,
		getServerSnapshot: () => null,
		subscribe: (listener: () => void) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		updateSubslidesControl: (controls: SubslideControls | null) => {
			snapshot = controls;
			emit();
		},
	};
}

export const subslideControlsStore = createSubslideControlsStore();
