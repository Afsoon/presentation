import { useActorRef, useSelector } from "@xstate/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { results } from "./slide_12_poc_results/slide_12_poc_results.data";
import { pocResultsMachine, selectVisibleResults } from "./slide_12_poc_results/slide_12_poc_results.machine";

export const metadata = { Id: "poc-results", name: "PoC Results", hasSubslides: true } satisfies SlideMetadata;

export const SlidePocResults = () => {
	const actor = useActorRef(pocResultsMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const visibleResults = useSelector(actor, selectVisibleResults);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-10">
			<Typography level="h2">PoC Results</Typography>
			{/* Keep every row in layout so text wrapping never moves the heading or earlier bullets. */}
			<ul className="list-disc space-y-6 pl-8 text-xl leading-relaxed sm:text-2xl">
				{results.map((result) => {
					const visible = visibleResults.includes(result);
					return (
						<motion.li
							key={result}
							aria-hidden={!visible}
							initial={false}
							animate={{ opacity: visible ? 1 : 0, x: visible || reduceMotion ? 0 : 16 }}
							transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
						>
							{result}
						</motion.li>
					);
				})}
			</ul>
		</div>
	);
};
