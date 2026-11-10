import { useHotkey } from "@tanstack/react-hotkeys";

import type { NavigationAvailability, NavigationDirection } from "@/lib/speaker-messages";

type NavigationHotkeysOptions = {
	available: NavigationAvailability;
	onNavigate: (direction: NavigationDirection) => void;
	onOpenSpeaker: () => void;
};

export function useNavigationHotkeys({ available, onNavigate, onOpenSpeaker }: NavigationHotkeysOptions) {
	const options = { ignoreInputs: true, ignoreDefaultPrevented: true, stopPropagation: false };
	useHotkey("ArrowLeft", () => onNavigate("left"), { ...options, enabled: available.left });
	useHotkey("ArrowRight", () => onNavigate("right"), { ...options, enabled: available.right });
	useHotkey("ArrowUp", () => onNavigate("up"), { ...options, enabled: available.up });
	useHotkey("ArrowDown", () => onNavigate("down"), { ...options, enabled: available.down });
	useHotkey("Alt+S", onOpenSpeaker, { ...options, preventDefault: true, requireReset: true });
}
