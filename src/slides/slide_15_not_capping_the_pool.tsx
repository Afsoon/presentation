import { useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Typography from "@/components/ui/typography";
import { uncappedPoolMetadata as metadata } from "@/slides/metadata";
import { useSlideActor } from "@/stores/use-slide-actor";

import { uncappedPoolMachine } from "./slide_15_not_capping_the_pool/slide_15_not_capping_the_pool.machine";
import { UncappedPoolAnimation } from "./slide_15_not_capping_the_pool/uncapped-pool-animation";

export { uncappedPoolMetadata as metadata } from "@/slides/metadata";

export const SlideNotCappingThePool = () => {
	const actor = useSlideActor(uncappedPoolMachine, metadata.Id);
	const stage = useSelector(actor, (snapshot) => snapshot.value);
	const reduceMotion = useReducedMotion();
	return (
		<div className="max-w-4xl space-y-8">
			<header className="space-y-3">
				<Typography level="p-small">v0.1 Implementation.</Typography>
				<Typography level="h2">Not capping the pool.</Typography>
			</header>
			<div className="min-h-[36rem]">
				<AnimatePresence initial={false} mode="wait">
					<motion.div
						key={stage}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
						transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
					>
						{stage === "animation" ? (
							<UncappedPoolAnimation />
						) : (
							<div className="space-y-8">
								<Typography level="p">
									Batching and prewarming helped with bursts of lease requests, but my pool cap stopped replenishment
									when the pool was full. New requests then depended on cleanup freeing slots, so I removed the cap.
								</Typography>
								<Typography level="p">
									That introduced a tradeoff: if cleanup cannot keep up, memory consumption can grow significantly.
								</Typography>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
