import { createSlideStore, defaultSlideState } from "@/stores/slide-store";

export function validateSlideSearch(search: Record<string, unknown>): { slide: string } {
	return {
		slide: defaultSlideState.slides.find((slide) => slide.Id === search.slide)?.Id ?? defaultSlideState.slides[0].Id,
	};
}

export function getInitialPresentationState(search: string) {
	const { slide: Id } = validateSlideSearch({ slide: new URLSearchParams(search).get("slide") });
	const store = createSlideStore({
		...defaultSlideState,
		currentPosition: defaultSlideState.slides.findIndex((slide) => slide.Id === Id),
	});
	const slide = store.getSnapshot();
	return { slide };
}
