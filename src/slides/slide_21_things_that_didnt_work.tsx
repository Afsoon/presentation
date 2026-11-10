import { useSelector } from "@xstate/react";
import { motion, useReducedMotion } from "motion/react";

import Typography from "@/components/ui/typography";
import { things_that_didnt_workMetadata as metadata } from "@/slides/metadata";
import { useSlideActor } from "@/stores/use-slide-actor";

import { changes, description } from "./slide_21_things_that_didnt_work/slide_21_things_that_didnt_work.data";
import {
	thingsThatDidntWorkMachine,
	selectVisibleChanges,
} from "./slide_21_things_that_didnt_work/slide_21_things_that_didnt_work.machine";

export { things_that_didnt_workMetadata as metadata } from "@/slides/metadata";

export const SlideThingsThatDidntWork = () => {
	const actor = useSlideActor(thingsThatDidntWorkMachine, metadata.Id);
	const visibleChanges = useSelector(actor, selectVisibleChanges);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<Typography level="p-small">Conclusion</Typography>
				<Typography level="h2">Things that didn’t work</Typography>
			</header>
			<Typography level="p">{description}</Typography>
			{/* Keep every row in layout so text wrapping never moves the heading or earlier bullets. */}
			<ul className="list-disc space-y-6 pl-8 text-xl leading-relaxed @min-[640px]/slide:text-2xl">
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
