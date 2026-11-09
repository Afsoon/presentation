import { useActorRef, useSelector } from "@xstate/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { changes, description } from "./slide_21_things_that_didnt_work/slide_21_things_that_didnt_work.data";
import {
	thingsThatDidntWorkMachine,
	selectVisibleChanges,
} from "./slide_21_things_that_didnt_work/slide_21_things_that_didnt_work.machine";

export const metadata = {
	Id: "things-that-didnt-work",
	name: "Things that didn’t work",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideThingsThatDidntWork = () => {
	const actor = useActorRef(thingsThatDidntWorkMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
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
