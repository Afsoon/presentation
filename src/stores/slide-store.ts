import { metadata as titleMetadata } from "@/slides/slide_1_title";
import { metadata as tableOfContentsMetadata } from "@/slides/slide_2_table_of_content";
import { metadata as whatIsPgtestMetadata } from "@/slides/slide_3_what_is_pgtest";
import { metadata as whyAmIBuildingItMetadata } from "@/slides/slide_4_why_am_i_building_it";
import { metadata as reasonsForBuildingPgtestMetadata } from "@/slides/slide_5_reasons_for_building_pgtest";
import { metadata as architectureMetadata } from "@/slides/slide_6_architecture_and_implementation";
import { metadata as implementationGoalsMetadata } from "@/slides/slide_7_implementation_goals";
import { metadata as proofOfConceptMetadata } from "@/slides/slide_8_proof_of_concept_implementation";
import { metadata as clientConnectionMetadata } from "@/slides/slide_9_client_connection";
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
		{ ...architectureMetadata, position: 5 },
		{ ...implementationGoalsMetadata, position: 6 },
		{ ...proofOfConceptMetadata, position: 7 },
		{ ...clientConnectionMetadata, position: 8 },
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

	let slides = initialState.slides;
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

	let serverSnapshot = createSnapshot(initialState.currentPosition, initialState.direction ?? null);
	let snapshot = serverSnapshot;
	let initialized = false;
	const positionForId = (Id: string) =>
		Math.max(
			0,
			slides.findIndex((slide) => slide.Id === Id),
		);
	const updateUrl = () => {
		if (typeof window === "undefined") return;
		const url = new URL(window.location.href);
		if (url.searchParams.get("slide") === snapshot.currentSlide.Id) return;
		url.searchParams.set("slide", snapshot.currentSlide.Id);
		window.history.replaceState(window.history.state, "", url);
	};

	return {
		getSnapshot: () => snapshot,
		// Keep the hydration snapshot stable even after client-side navigation.
		getServerSnapshot: () => serverSnapshot,
		hydrate: (initial: SlideSnapshot) => {
			if (initialized) return;
			initialized = true;
			slides = initial.slides;
			serverSnapshot = initial;
			snapshot = serverSnapshot;
			if (typeof window !== "undefined") {
				const Id = new URL(window.location.href).searchParams.get("slide") ?? slides[0].Id;
				snapshot = createSnapshot(positionForId(Id), null);
				updateUrl();
			}
		},
		goToSlide: (Id: string) => {
			const position = positionForId(Id);
			if (position === snapshot.currentPosition) return;
			snapshot = createSnapshot(position, position < snapshot.currentPosition ? "left" : "right");
			updateUrl();
			listeners.forEach((listener) => listener());
		},
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
			updateUrl();
			listeners.forEach((listener) => listener());
		},
	};
}

export const slideStore = createSlideStore();
export type SlideStore = ReturnType<typeof createSlideStore>;
