import { useActorRef, useSelector } from "@xstate/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import { v01ResultsMetadata as metadata } from "@/slides/metadata";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { results } from "./slide_17_v0_1_results/slide_17_v0_1_results.data";
import { v01ResultsMachine, selectVisibleResults } from "./slide_17_v0_1_results/slide_17_v0_1_results.machine";

export { v01ResultsMetadata as metadata } from "@/slides/metadata";

export const SlideV01Results = () => {
	const actor = useActorRef(v01ResultsMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const visibleResults = useSelector(actor, selectVisibleResults);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-10">
			<Typography level="h2">v0.1 Results</Typography>
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
