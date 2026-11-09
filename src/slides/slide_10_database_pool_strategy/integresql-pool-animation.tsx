import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { integresqlPoolFrames, type IntegresqlPoolStage } from "./integresql-pool-animation.data";
import { RequestInbox } from "./request-inbox";

export function IntegresqlPoolAnimation({ stage }: { stage: IntegresqlPoolStage }) {
	const frame = integresqlPoolFrames[stage];
	const reduceMotion = useReducedMotion();
	const transition = { duration: reduceMotion ? 0 : 0.25, ease: "easeOut" as const };

	return (
		<div role="group" aria-label="IntegreSQL database pool animation" className="h-56 space-y-3">
			<RequestInbox requests={frame.requests} />
			<div className="rounded-xl border bg-muted/50 p-3">
				<div className="mb-2 flex items-center justify-between text-xs font-medium">
					<span>Pool</span>
					<span className="text-muted-foreground">{frame.pool.length} / 4 databases</span>
				</div>
				<div className="grid grid-cols-4 gap-2" aria-label="Database pool">
					<AnimatePresence initial={false}>
						{frame.pool.map((database) => (
							<motion.div
								key={database.id}
								aria-label={`${database.id.replace("database-", "Database ")}: ${database.status}${database.requestId ? `, leased to ${database.requestId.replace("-", " ")}` : ""}`}
								initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
								transition={transition}
								className={cn(
									"flex aspect-square w-full max-w-16 flex-col gap-0.5 items-center justify-center justify-self-center rounded-lg border-2 text-xs font-semibold transition-colors duration-200 motion-reduce:transition-none",
									database.status === "dirty"
										? "border-emerald-500 bg-emerald-500/25 text-emerald-900 dark:text-emerald-200"
										: "border-border bg-card text-foreground",
								)}
							>
								<span className="text-[10px] font-medium">{database.label}</span>
								<span>{database.status}</span>
								{database.requestId && (
									<span className="text-[10px] font-medium" title={database.requestId.replace("request-", "Request ")}>
										{database.requestId.replace("request-", "Req ")}
									</span>
								)}
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
			<p className="sr-only" aria-live="polite">
				{frame.description}
			</p>
		</div>
	);
}
