import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigationHotkeys } from "@/hooks/use-navigation-hotkeys";
import { navigatePresentation } from "@/stores/presentation-navigation";
import { useSlides } from "@/stores/use-slides";
import { useSubslideControls } from "@/stores/use-subslide-controls";

export function KeyboardNavigation({ onOpenSpeaker }: { onOpenSpeaker: () => void }) {
	const { snapshot } = useSlides();
	const { canGoUp, canGoDown } = useSubslideControls(snapshot.currentSlide.Id);
	const available = {
		left: !!snapshot.availableNavigations.left,
		right: !!snapshot.availableNavigations.right,
		up: canGoUp,
		down: canGoDown,
	};
	useNavigationHotkeys({ available, onNavigate: navigatePresentation, onOpenSpeaker });
	return (
		<nav
			aria-label="Slide navigation"
			className="absolute bottom-4 right-4 z-10 grid grid-cols-3 grid-rows-3 gap-4 size-[140px]"
		>
			<Button
				type="button"
				autoComplete="off"
				variant="ghost"
				size="icon"
				className="row-start-2"
				onClick={() => navigatePresentation("left")}
				disabled={!available.left}
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
				onClick={() => navigatePresentation("right")}
				disabled={!available.right}
			>
				<ChevronRight aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to next slide</span>
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="ghost"
				size="icon"
				className="col-start-2 row-start-1"
				onClick={() => navigatePresentation("up")}
				disabled={!available.up}
			>
				<ChevronUp aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to previous subslide</span>
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="ghost"
				size="icon"
				className="col-start-2 row-start-3"
				onClick={() => navigatePresentation("down")}
				disabled={!available.down}
			>
				<ChevronDown aria-hidden="true" strokeWidth={3} className="size-[42px] drop-shadow-sm drop-shadow-black/50" />
				<span className="sr-only">Go to next subslide</span>
			</Button>
		</nav>
	);
}
