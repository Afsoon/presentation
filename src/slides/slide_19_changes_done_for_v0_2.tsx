import { useActorRef, useSelector } from "@xstate/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import { v02ChangesMetadata as metadata } from "@/slides/metadata";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { changes, description } from "./slide_19_changes_done_for_v0_2/slide_19_changes_done_for_v0_2.data";
import {
	v02ChangesMachine,
	selectVisibleChanges,
} from "./slide_19_changes_done_for_v0_2/slide_19_changes_done_for_v0_2.machine";

export { v02ChangesMetadata as metadata } from "@/slides/metadata";

export const SlideChangesDoneForV02 = () => {
	const actor = useActorRef(v02ChangesMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const visibleChanges = useSelector(actor, selectVisibleChanges);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<Typography level="p-small">v0.2</Typography>
				<Typography level="h2">Changes done for v0.2</Typography>
			</header>
			<Typography level="p">{description}</Typography>
			{/* Keep every row in layout so text wrapping never moves the heading or earlier bullets. */}
			<ul className="list-disc space-y-6 pl-8 text-xl leading-relaxed sm:text-2xl">
				{changes.map((result) => {
					const visible = visibleChanges.includes(result);
					return (
						<motion.li
							key={result.id}
							aria-hidden={!visible}
							inert={!visible}
							initial={false}
							animate={{ opacity: visible ? 1 : 0, x: visible || reduceMotion ? 0 : 16 }}
							transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
						>
							{result.content}
						</motion.li>
					);
				})}
			</ul>
		</div>
	);
};
