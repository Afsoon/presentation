import { useExternalStorage } from "@/hooks/use-external-storage";
import { speakerConnectionStorage } from "@/stores/speaker-connection-storage";

export function useSpeakerConnection() {
	const snapshot = useExternalStorage(speakerConnectionStorage);
	return { ...snapshot, navigate: speakerConnectionStorage.navigate, saveTimer: speakerConnectionStorage.saveTimer };
}
