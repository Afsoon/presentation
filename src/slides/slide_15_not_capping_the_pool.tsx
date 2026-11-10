import { useActorRef, useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { uncappedPoolMachine } from "./slide_15_not_capping_the_pool/slide_15_not_capping_the_pool.machine";
import { UncappedPoolAnimation } from "./slide_15_not_capping_the_pool/uncapped-pool-animation";

export const metadata = {
	Id: "not-capping-the-pool",
	name: "Not capping the pool.",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideNotCappingThePool = () => {
	const actor = useActorRef(uncappedPoolMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
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
									Batching and prewarming are the right strategy for handling bursts of lease requests, but capping the
									pool size makes this strategy ineffective once the pool is full. At that point, we rely on the system
									to free slots fast enough to avoid waiting for a database.
								</Typography>
								<Typography level="p">
									Removing the cap comes with potential problems: if our cleanup policy is not fast enough, memory
									consumption can grow significantly.
								</Typography>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
