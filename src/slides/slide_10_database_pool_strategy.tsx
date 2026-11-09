import { useActorRef, useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { IntegresqlPoolAnimation } from "./slide_10_database_pool_strategy/integresql-pool-animation";
import { PgtestPoolAnimation } from "./slide_10_database_pool_strategy/pgtest-pool-animation";
import { integresql, pgtest } from "./slide_10_database_pool_strategy/slide_10_database_pool_strategy.data";
import {
	databasePoolStrategyMachine,
	selectIntegresqlPoolStage,
	selectPgtestPoolStage,
} from "./slide_10_database_pool_strategy/slide_10_database_pool_strategy.machine";

export const metadata = {
	Id: "database-pool-strategy",
	name: "Database Pool Strategy",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideDatabasePoolStrategy = () => {
	const actor = useActorRef(databasePoolStrategyMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const snapshot = useSelector(actor, (state) => state);
	const integresqlStage = selectIntegresqlPoolStage(snapshot);
	const pgtestStage = selectPgtestPoolStage(snapshot);
	const reduceMotion = useReducedMotion();
	const hidden = { opacity: 0, y: reduceMotion ? 0 : 16 };
	const visible = { opacity: 1, y: 0 };
	const transition = { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" as const };

	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<Typography level="p-small">PoC Implementation</Typography>
				<Typography level="h2">Database Pool Strategy</Typography>
			</header>
			<div className="h-[80rem] overflow-hidden lg:h-[42rem]">
				<div className="grid items-stretch gap-8 lg:grid-cols-2">
					<AnimatePresence initial={false}>
						{snapshot.hasTag("integresql") && (
							<motion.section
								key="integresql"
								aria-label="IntegreSQL"
								className="flex h-full flex-col gap-5 rounded-2xl border bg-card p-6"
								initial={hidden}
								animate={visible}
								exit={hidden}
								transition={transition}
							>
								<Typography level="h3">{integresql.title}</Typography>
								<Typography level="p">{integresql.content}</Typography>
								<Typography level="p">
									<span className="font-semibold text-foreground">Problem:</span> {integresql.problem}
								</Typography>
								<div className="mt-auto h-96 shrink-0">
									<AnimatePresence initial={false}>
										{integresqlStage && (
											<motion.div
												key="integresql-animation"
												initial={hidden}
												animate={visible}
												exit={hidden}
												transition={transition}
											>
												<IntegresqlPoolAnimation stage={integresqlStage} />
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</motion.section>
						)}
						{snapshot.hasTag("pgtest") && (
							<motion.section
								key="pgtest"
								aria-label="PgTest"
								className="flex h-full flex-col gap-5 rounded-2xl border bg-card p-6"
								initial={hidden}
								animate={visible}
								exit={hidden}
								transition={transition}
							>
								<Typography level="h3">{pgtest.title}</Typography>
								<Typography level="p">{pgtest.content}</Typography>
								<Typography level="p">
									<span className="font-semibold text-foreground">Problem:</span> {pgtest.problem}
								</Typography>
								<div className="mt-auto h-96 shrink-0">
									<AnimatePresence initial={false}>
										{pgtestStage && (
											<motion.div
												key="pgtest-animation"
												initial={hidden}
												animate={visible}
												exit={hidden}
												transition={transition}
											>
												<PgtestPoolAnimation stage={pgtestStage} />
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</motion.section>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};
