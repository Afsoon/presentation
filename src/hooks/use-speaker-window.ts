import { useExternalStorage } from "@/hooks/use-external-storage";
import { speakerWindowStorage } from "@/stores/speaker-window-storage";

export function useSpeakerWindow() {
	const snapshot = useExternalStorage(speakerWindowStorage);
	return { ...snapshot, open: speakerWindowStorage.open };
}
