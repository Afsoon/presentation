import { useActorRef, useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import { implementationGoalsMetadata as metadata } from "@/slides/metadata";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { ImplementationGoalsDiagram } from "./slide_7_implementation_goals/implementation-goals-diagram";
import {
	implementationGoalsMachine,
	selectImplementationGoal,
} from "./slide_7_implementation_goals/slide_7_implementation_goals.machine";

export { implementationGoalsMetadata as metadata } from "@/slides/metadata";

export const SlideImplementationGoals = () => {
	const actor = useActorRef(implementationGoalsMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const goal = useSelector(actor, selectImplementationGoal);
	const stage = useSelector(actor, (snapshot) => snapshot.value);
	const reduceMotion = useReducedMotion();
	return (
		<AnimatePresence initial={false} mode="wait">
			<motion.div
				key={stage}
				className="space-y-8"
				initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
				transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
			>
				<header className="space-y-3">
					<Typography level="p-small">Implementation goals</Typography>
					<Typography level="h2">{goal.title}</Typography>
					<Typography level="p">{goal.description}</Typography>
				</header>
				<ImplementationGoalsDiagram stage={stage} />
			</motion.div>
		</AnimatePresence>
	);
};
