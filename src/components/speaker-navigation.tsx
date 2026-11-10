import { Button } from "@/components/ui/button";
import { useNavigationHotkeys } from "@/hooks/use-navigation-hotkeys";
import type { NavigationAvailability, NavigationDirection } from "@/lib/speaker-messages";

export function SpeakerNavigation({
	available,
	onNavigate,
}: {
	available: NavigationAvailability;
	onNavigate: (direction: NavigationDirection) => void;
}) {
	useNavigationHotkeys({ available, onNavigate, onOpenSpeaker: () => window.focus() });
	return (
		<nav aria-label="Speaker navigation" className="relative z-10 flex flex-wrap gap-3">
			<Button
				type="button"
				autoComplete="off"
				variant="outline"
				className="h-auto border-neutral-400 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
				onClick={() => onNavigate("left")}
				disabled={!available.left}
			>
				Previous slide
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="outline"
				className="h-auto border-neutral-400 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
				onClick={() => onNavigate("right")}
				disabled={!available.right}
			>
				Next slide
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="outline"
				className="h-auto border-neutral-400 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
				onClick={() => onNavigate("up")}
				disabled={!available.up}
			>
				Previous subslide
			</Button>
			<Button
				type="button"
				autoComplete="off"
				variant="outline"
				className="h-auto border-neutral-400 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
				onClick={() => onNavigate("down")}
				disabled={!available.down}
			>
				Next subslide
			</Button>
		</nav>
	);
}
