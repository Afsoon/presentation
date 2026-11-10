import { useSyncExternalStore } from "react";

import type { ExternalStorage } from "@/stores/external-storage";

export function useExternalStorage<T>(storage: ExternalStorage<T>) {
	return useSyncExternalStore(storage.subscribe, storage.getSnapshot, storage.getServerSnapshot);
}
