import { useSyncExternalStore } from "react";

import { slideStore } from "@/stores/slide-store";

export function useSlides() {
	const snapshot = useSyncExternalStore(slideStore.subscribe, slideStore.getSnapshot, slideStore.getServerSnapshot);
	return { snapshot, navigate: slideStore.navigate };
}
