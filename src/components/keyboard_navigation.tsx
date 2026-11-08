import { useHotkey } from "@tanstack/react-hotkeys";
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from "lucide-react";
import { addTransitionType, startTransition } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import type { SlideDirection } from "@/stores/slide-store";
import { getAvailableSubslideControls } from "@/stores/subslide-controls";
import { useSlides, useSubslideControls } from "@/stores/use-slides";

export const KeyboardNavigation = () => {
	const { snapshot, navigate } = useSlides();
	const { availableNavigations } = snapshot;
	const subslideSnapshot = useSubslideControls();
	const subslideControls = getAvailableSubslideControls(subslideSnapshot, snapshot.currentSlide);

	const handleNavigation = (direction: SlideDirection) => {
		if (!availableNavigations[direction]) return;

		// Schedule the deferred slide render before attaching its transition type.
		flushSync(() => navigate(direction));
		startTransition(() => {
			addTransitionType(direction === "left" ? "backward" : "forward");
		});
	};

	useHotkey("ArrowLeft", () => handleNavigation("left"), {
		enabled: availableNavigations.left !== null,
		ignoreInputs: true,
		ignoreDefaultPrevented: true,
		stopPropagation: false,
	});

	useHotkey("ArrowRight", () => handleNavigation("right"), {
		enabled: availableNavigations.right !== null,
		ignoreInputs: true,
		ignoreDefaultPrevented: true,
		stopPropagation: false,
	});

	return (
		<nav
			aria-label="Slide navigation"
			className="absolute z-10 bottom-4 right-4 grid grid-cols-3 grid-rows-3 gap-4 size-[140px]"
		>
			<Button
				type="button"
				autoComplete="off"
				variant="ghost"
				size="icon"
				className="col-start-2"
				onClick={() => subslideControls?.up?.()}
				disabled={!subslideControls?.canGoUp}
			>
				<ChevronUp aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to previous subslide</span>
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="ghost"
				size="icon"
				className="row-start-2"
				onClick={() => handleNavigation("left")}
				disabled={!availableNavigations.left}
			>
				<ChevronLeft aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to previous slide</span>
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="ghost"
				size="icon"
				className="col-start-3 row-start-2"
				onClick={() => handleNavigation("right")}
				disabled={!availableNavigations.right}
			>
				<ChevronRight aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to next slide</span>
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="ghost"
				size="icon"
				className="col-start-2 row-start-3"
				onClick={() => subslideControls?.down?.()}
				disabled={!subslideControls?.canGoDown}
			>
				<ChevronDown aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to next subslide</span>
			</Button>
		</nav>
	);
};
