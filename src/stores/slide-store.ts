export type SlideDirection = "left" | "right";

export type Slide = Readonly<{
	id: string;
	name: string;
	position: number;
}>;

export type SlideInitialState = Readonly<{
	slides: readonly Slide[];
	currentPosition: number;
	direction?: SlideDirection | null;
}>;

export type SlideSnapshot = Readonly<{
	slides: readonly Slide[];
	currentSlide: Slide;
	currentPosition: number;
	direction: SlideDirection | null;
	transitionClass: "slide-back" | "slide-in";
	availableNavigations: Readonly<Record<SlideDirection, Slide | null>>;
}>;

export const defaultSlideState: SlideInitialState = {
	slides: [
		{ id: "title", name: "Tech presentation", position: 0 },
		{ id: "table-of-contents", name: "Table of contents", position: 1 },
		{ id: "what-is-pgtest", name: "What is pgtest?", position: 2 },
	],
	currentPosition: 0,
	direction: null,
};

export function createSlideStore(initialState: SlideInitialState = defaultSlideState) {
	if (initialState.slides.length === 0) {
		throw new Error("The presentation needs at least one slide.");
	}
	if (new Set(initialState.slides.map((slide) => slide.id)).size !== initialState.slides.length) {
		throw new Error("Slide IDs must be unique.");
	}
	if (
		!Number.isInteger(initialState.currentPosition) ||
		initialState.currentPosition < 0 ||
		initialState.currentPosition >= initialState.slides.length
	) {
		throw new Error("The initial slide position is outside the presentation.");
	}

	const slides = initialState.slides;
	const listeners = new Set<() => void>();

	const createSnapshot = (currentPosition: number, direction: SlideDirection | null): SlideSnapshot => ({
		slides,
		currentSlide: slides[currentPosition],
		currentPosition,
		direction,
		transitionClass: direction === "left" ? "slide-back" : "slide-in",
		availableNavigations: {
			left: slides[currentPosition - 1] ?? null,
			right: slides[currentPosition + 1] ?? null,
		},
	});

	const serverSnapshot = createSnapshot(initialState.currentPosition, initialState.direction ?? null);
	let snapshot = serverSnapshot;

	return {
		getSnapshot: () => snapshot,
		// Keep the hydration snapshot stable even after client-side navigation.
		getServerSnapshot: () => serverSnapshot,
		subscribe: (listener: () => void) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		navigate: (direction: SlideDirection) => {
			const target = snapshot.availableNavigations[direction];
			if (!target) return;

			snapshot = createSnapshot(target.position, direction);
			listeners.forEach((listener) => listener());
		},
	};
}

export const slideStore = createSlideStore();
