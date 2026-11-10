import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function RequestInbox({ requests }: { requests: readonly string[] }) {
	const reduceMotion = useReducedMotion();
	const transition = { duration: reduceMotion ? 0 : 0.25, ease: "easeOut" as const };
	return (
		<div className="rounded-xl border bg-neutral-200 dark:bg-neutral-700/70 p-3">
			<div className="mb-2 flex items-center justify-between text-xs font-medium">
				<span>Inbox</span>
				<span className="text-muted-foreground">{requests.length} waiting</span>
			</div>
			<div className="relative flex h-8 items-center gap-2 overflow-hidden" aria-label="Request inbox">
				{requests.length === 0 && <span className="absolute text-xs text-muted-foreground">Empty</span>}
				<AnimatePresence initial={false}>
					{requests.map((request) => (
						<motion.div
							key={request}
							aria-label={request.replace("-", " ")}
							initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
							transition={transition}
							className="flex h-8 items-center rounded-md border border-primary/40 bg-card px-3 text-xs font-medium"
						>
							{request.replace("request-", "Request ")}
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
