import { useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Typography from "@/components/ui/typography";
import { cleanupMetadata as metadata } from "@/slides/metadata";
import { useSlideActor } from "@/stores/use-slide-actor";

import { integresql, pgtest } from "./slide_11_cleanup_database_trigger/slide_11_cleanup_database_trigger.data";
import { cleanupDatabaseTriggerMachine } from "./slide_11_cleanup_database_trigger/slide_11_cleanup_database_trigger.machine";

export { cleanupMetadata as metadata } from "@/slides/metadata";

export const SlideCleanupDatabaseTrigger = () => {
	const actor = useSlideActor(cleanupDatabaseTriggerMachine, metadata.Id);
	const state = useSelector(actor, (snapshot) => snapshot.value);
	const reduceMotion = useReducedMotion();
	const hidden = { opacity: 0, x: reduceMotion ? 0 : 16 };
	const visible = { opacity: 1, x: 0 };
	const transition = { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" as const };
	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<Typography level="p-small">PoC Implementation</Typography>
				<Typography level="h2">Cleanup database trigger</Typography>
			</header>
			<div className="h-[32rem] overflow-hidden">
				<div className="grid items-stretch gap-8 @min-[1024px]/slide:grid-cols-2">
					<AnimatePresence initial={false}>
						{state !== "heading" && (
							<motion.section
								key="integresql"
								aria-label="IntegreSQL"
								className="space-y-5 rounded-2xl border bg-card shadow-2xl shadow-black/25 dark:shadow-black/50 p-6"
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
							</motion.section>
						)}
						{state === "bothClients" && (
							<motion.section
								key="pgtest"
								aria-label="PgTest"
								className="space-y-5 rounded-2xl border bg-card shadow-2xl shadow-black/25 dark:shadow-black/50 p-6"
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
							</motion.section>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};
