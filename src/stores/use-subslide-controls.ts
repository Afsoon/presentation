import { useSelector } from "@xstate/react";
import { useSyncExternalStore } from "react";

import { subslideControlsStore } from "@/stores/subslide-controls";

export function useSubslideControls(id: string) {
	const actor = useSyncExternalStore(
		subslideControlsStore.subscribeActors,
		() => subslideControlsStore.getActor(id),
		() => undefined,
	);
	const canGoUp = useSelector(actor, (state) => state?.can({ type: "PREVIOUS" }) ?? false);
	const canGoDown = useSelector(actor, (state) => state?.can({ type: "NEXT" }) ?? false);
	const up = () => actor?.send({ type: "PREVIOUS" });
	const down = () => actor?.send({ type: "NEXT" });

	return { canGoUp, canGoDown, up, down };
}
