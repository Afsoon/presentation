import { useLoaderData } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";

import { slideStore } from "@/stores/slide-store";
import { subslideControlsStore } from "@/stores/subslide-controls";

export function useSlides() {
	const initial = useLoaderData({ from: "/" });
	if (typeof window !== "undefined") slideStore.hydrate(initial.slide);
	const snapshot = useSyncExternalStore(slideStore.subscribe, slideStore.getSnapshot, () => initial.slide);
	return { snapshot, navigate: slideStore.navigate };
}

export function useSubslideControls() {
	const initial = useLoaderData({ from: "/" });
	if (typeof window !== "undefined") subslideControlsStore.hydrate(initial.subslideControls);
	return useSyncExternalStore(
		subslideControlsStore.subscribe,
		subslideControlsStore.getSnapshot,
		() => initial.subslideControls,
	);
}
