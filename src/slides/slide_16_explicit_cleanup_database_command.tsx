import { useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Typography from "@/components/ui/typography";
import { explicitCleanupMetadata as metadata } from "@/slides/metadata";
import { useSlideActor } from "@/stores/use-slide-actor";

import { CleanupRoutingDiagram } from "./slide_16_explicit_cleanup_database_command/cleanup-routing-diagram";
import { explicitCleanupMachine } from "./slide_16_explicit_cleanup_database_command/slide_16_explicit_cleanup_database_command.machine";

export { explicitCleanupMetadata as metadata } from "@/slides/metadata";

export const SlideExplicitCleanupDatabaseCommand = () => {
	const actor = useSlideActor(explicitCleanupMachine, metadata.Id);
	const stage = useSelector(actor, (snapshot) => snapshot.value);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-8">
			<header className="space-y-3">
				<Typography level="p-small">v0.1 Implementation.</Typography>
				<Typography level="h2">Explicit cleanup database command</Typography>
			</header>
			<div className="min-h-[28rem]">
				<AnimatePresence initial={false} mode="wait">
					<motion.div
						key={stage}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
						transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
					>
						{stage === "routing" ? (
							<CleanupRoutingDiagram />
						) : (
							<div className="max-w-4xl space-y-8">
								<Typography level="p">
									I replaced cleanup on the last disconnection with explicit release and a configurable lease lifetime.
									The default lifetime is 30 seconds from assignment.
								</Typography>
								<Typography level="p">
									I exposed early cleanup as a SQL command in the PgTest admin panel, reached through the{" "}
									<Typography level="code">pgtest</Typography> database. This kept cleanup within the existing
									PostgreSQL client.
								</Typography>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
