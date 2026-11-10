import { useHotkey } from "@tanstack/react-hotkeys";
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from "lucide-react";
import { addTransitionType, startTransition } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import type { SlideDirection } from "@/stores/slide-store";
import { useSlides } from "@/stores/use-slides";
import { useSubslideControls } from "@/stores/use-subslide-controls";

export const KeyboardNavigation = () => {
	const { snapshot, navigate } = useSlides();
	const { availableNavigations } = snapshot;
	const { canGoUp, canGoDown, up, down } = useSubslideControls(snapshot.currentSlide.Id);

	const handleNavigation = (direction: SlideDirection) => {
		if (!availableNavigations[direction]) return;

		document.activeViewTransition?.skipTransition();

		// Schedule the deferred slide render before attaching its transition type.
		flushSync(() => navigate(direction));
		startTransition(() => {
			addTransitionType(direction === "left" ? "backward" : "forward");
		});
	};

	const handleSubslideNavigation = (direction: "up" | "down") => {
		document.activeViewTransition?.skipTransition();
		if (direction === "up") up();
		else down();
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

	useHotkey("ArrowUp", () => handleSubslideNavigation("up"), {
		enabled: canGoUp,
		ignoreInputs: true,
		ignoreDefaultPrevented: true,
		stopPropagation: false,
	});
	useHotkey("ArrowDown", () => handleSubslideNavigation("down"), {
		enabled: canGoDown,
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
				onClick={() => handleSubslideNavigation("up")}
				disabled={!canGoUp}
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
				onClick={() => handleSubslideNavigation("down")}
				disabled={!canGoDown}
			>
				<ChevronDown aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to next subslide</span>
			</Button>
		</nav>
	);
};
