import { useActorRef, useSelector } from "@xstate/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { ImplementationGoalsList } from "./slide_7_implementation_goals/implementation-goals-list";
import {
	implementationGoalsMachine,
	selectVisibleGoals,
} from "./slide_7_implementation_goals/slide_7_implementation_goals.machine";

export const metadata = {
	Id: "implementation-goals",
	name: "Implementation goals",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideImplementationGoals = () => {
	const actor = useActorRef(implementationGoalsMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const visibleGoals = useSelector(actor, selectVisibleGoals);
	return (
		<div className="space-y-10">
			<Typography level="h3">Implementation goals</Typography>
			<ImplementationGoalsList items={visibleGoals} />
		</div>
	);
};
