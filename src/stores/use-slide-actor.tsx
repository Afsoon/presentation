import { useActorRef } from "@xstate/react";
import { createContext, useContext, useEffect } from "react";
import type { AnyStateMachine, SnapshotFrom } from "xstate";

import { subslideControlsStore, type SlideActor } from "./subslide-controls";

export const PreviewContext = createContext<{ id: string; snapshot: unknown } | null>(null);
export function useSlideActor<T extends AnyStateMachine>(machine: T, id: string) {
	const preview = useContext(PreviewContext);
	const actor = useActorRef(machine, {
		id,
		snapshot: preview?.id === id ? (preview.snapshot as SnapshotFrom<T>) : undefined,
	});
	useEffect(() => {
		if (preview) return;
		return subslideControlsStore.registerActor(actor as unknown as SlideActor);
	}, [actor, preview]);
	return actor;
}
