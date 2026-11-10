import { useSelector } from "@xstate/react";
import { motion, useReducedMotion } from "motion/react";

import Typography from "@/components/ui/typography";
import { pocResultsMetadata as metadata } from "@/slides/metadata";
import { useSlideActor } from "@/stores/use-slide-actor";

import { results } from "./slide_12_poc_results/slide_12_poc_results.data";
import { pocResultsMachine, selectVisibleResults } from "./slide_12_poc_results/slide_12_poc_results.machine";

export { pocResultsMetadata as metadata } from "@/slides/metadata";

export const SlidePocResults = () => {
	const actor = useSlideActor(pocResultsMachine, metadata.Id);
	const visibleResults = useSelector(actor, selectVisibleResults);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-10">
			<Typography level="h2">PoC Results</Typography>
			{/* Keep every row in layout so text wrapping never moves the heading or earlier bullets. */}
			<ul className="list-disc space-y-6 pl-8 text-xl leading-relaxed @min-[640px]/slide:text-2xl">
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
