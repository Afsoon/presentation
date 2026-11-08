import { metadata as titleMetadata } from "@/slides/slide_1_title";
import { metadata as tableOfContentsMetadata } from "@/slides/slide_2_table_of_content";
import { metadata as whatIsPgtestMetadata } from "@/slides/slide_3_what_is_pgtest";
import { metadata as whyAmIBuildingItMetadata } from "@/slides/slide_4_why_am_i_building_it";
import { metadata as reasonsForBuildingPgtestMetadata } from "@/slides/slide_5_reasons_for_building_pgtest";
import type { SlideMetadata } from "@/slides/types";

export type SlideDirection = "left" | "right";

export type Slide = Readonly<SlideMetadata & { position: number }>;

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
		{ ...titleMetadata, position: 0 },
		{ ...tableOfContentsMetadata, position: 1 },
		{ ...whatIsPgtestMetadata, position: 2 },
		{ ...whyAmIBuildingItMetadata, position: 3 },
		{ ...reasonsForBuildingPgtestMetadata, position: 4 },
	],
	currentPosition: 0,
	direction: null,
};

export function createSlideStore(initialState: SlideInitialState = defaultSlideState) {
	if (initialState.slides.length === 0) {
		throw new Error("The presentation needs at least one slide.");
	}
	if (new Set(initialState.slides.map((slide) => slide.Id)).size !== initialState.slides.length) {
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
