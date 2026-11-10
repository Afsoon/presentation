import { addTransitionType, startTransition } from "react";
import { flushSync } from "react-dom";

import { slideStore } from "./slide-store";
import { subslideControlsStore } from "./subslide-controls";

export function navigatePresentation(direction: "left" | "right" | "up" | "down") {
	document.activeViewTransition?.skipTransition();
	if (direction === "up" || direction === "down") {
		subslideControlsStore
			.getActor(slideStore.getSnapshot().currentSlide.Id)
			?.send({ type: direction === "up" ? "PREVIOUS" : "NEXT" });
		return;
	}
	if (!slideStore.getSnapshot().availableNavigations[direction]) return;
	flushSync(() => slideStore.navigate(direction));
	startTransition(() => addTransitionType(direction === "left" ? "backward" : "forward"));
}
