import { DatabaseIcon, InfinityIcon, PauseIcon, PlayIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { RequestInbox } from "../slide_10_database_pool_strategy/request-inbox";
import { advanceUncappedPoolFrame, createUncappedPoolFrame } from "./uncapped-pool-animation.data";

export function UncappedPoolAnimation() {
	const [frame, setFrame] = useState(createUncappedPoolFrame);
	const [paused, setPaused] = useState(false);
	const reduceMotion = useReducedMotion();
	const running = reduceMotion === false && !paused;
	const advance = useCallback(() => {
		const rolls = [Math.random(), Math.random(), Math.random()] as const;
		setFrame((previous) => advanceUncappedPoolFrame(previous, rolls));
	}, []);
	useEffect(() => {
		if (!running) return;
		const timer = window.setInterval(advance, 1400);
		return () => window.clearInterval(timer);
	}, [running, advance]);

	return (
		<section aria-label="Uncapped database pool animation" className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<h3 className="flex items-center gap-3 text-xl font-semibold">
					<InfinityIcon aria-hidden="true" className="size-7 text-primary" />
					No pool limit
				</h3>
				{reduceMotion ? (
					<Button variant="outline" onClick={advance}>
						Next step
					</Button>
				) : (
					<Button variant="outline" onClick={() => setPaused((current) => !current)}>
						{paused ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}
						{paused ? "Resume animation" : "Pause animation"}
					</Button>
				)}
			</div>
			<RequestInbox requests={frame.requests} />
			<div className="rounded-xl border bg-neutral-200 p-4 dark:bg-neutral-700/70">
				<div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
					<span>Pool · {frame.total} databases</span>
					<span>
						{frame.leased} leased · {frame.ready} ready
					</span>
				</div>
				<div
					className="relative grid min-h-36 grid-cols-4 content-start gap-2 sm:grid-cols-8"
					aria-label="Database pool"
				>
					<AnimatePresence initial={false} mode="popLayout">
						{frame.databases.map((database) => (
							<motion.div
								key={database.id}
								aria-label={`Database ${database.id}: ${database.leased ? "leased" : "ready"}`}
								initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
								layout={!reduceMotion}
								transition={{ duration: reduceMotion ? 0 : 0.25 }}
								className={cn(
									"flex h-16 flex-col items-center justify-center gap-1 rounded-lg border-2 text-xs font-medium",
									database.leased
										? "border-emerald-500 bg-emerald-500/25 text-emerald-900 dark:text-emerald-200"
										: "border-border bg-card text-foreground",
								)}
							>
								<DatabaseIcon aria-hidden="true" className="size-5" />
								<span>DB {database.id}</span>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
				<p className="mt-2 min-h-5 text-sm">
					{frame.hidden > 0 ? `+ ${frame.hidden} earlier databases still allocated` : "\u00a0"}
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<section
					aria-label="Creation worker"
					className="min-h-44 space-y-3 rounded-xl border bg-neutral-200 p-4 dark:bg-neutral-700/70"
				>
					<h4 className="flex items-center gap-2 text-sm font-semibold">
						<PlusIcon aria-hidden="true" className="size-4" /> Creation worker
					</h4>
					<p className="text-xs">{frame.creating ? "Creating a batch of 4 databases…" : "Ready for the next batch"}</p>
					<div className="grid min-h-16 grid-cols-4 gap-2">
						{frame.creating &&
							Array.from({ length: 4 }, (_, index) => (
								<motion.div
									key={frame.nextId + index}
									initial={reduceMotion ? false : { opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: reduceMotion ? 0 : 0.2 }}
									className="flex h-16 flex-col items-center justify-center gap-1 rounded-lg border-2 border-sky-500 bg-sky-500/15 text-xs font-medium text-sky-900 dark:text-sky-200"
								>
									<DatabaseIcon aria-hidden="true" className="size-5" />
									<span>DB {frame.nextId + index}</span>
								</motion.div>
							))}
					</div>
				</section>
				<section
					aria-label="Cleanup worker"
					className="min-h-44 space-y-3 rounded-xl border bg-neutral-200 p-4 dark:bg-neutral-700/70"
				>
					<h4 className="flex items-center gap-2 text-sm font-semibold">
						<Trash2Icon aria-hidden="true" className="size-4" /> Cleanup worker
					</h4>
					<p className="text-xs" aria-live="polite">
						{frame.lastCleaned.length > 0
							? `${frame.cleaned.length > 0 ? "Just cleaned" : "Last cleanup"}: ${frame.lastCleaned.map((id) => `DB ${id}`).join(", ")}`
							: "Waiting for databases to be released"}
					</p>
					<div className="grid min-h-16 grid-cols-4 gap-2">
						{frame.lastCleaned.map((id) => (
							<motion.div
								key={id}
								aria-label={`Database ${id}: cleaned`}
								initial={reduceMotion ? false : { opacity: 0, y: -8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: reduceMotion ? 0 : 0.2 }}
								className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border-2 border-rose-500 bg-rose-500/15 py-2 text-xs font-medium text-rose-900 dark:text-rose-200"
							>
								<DatabaseIcon aria-hidden="true" className="size-5" />
								<span>DB {id}</span>
								<span className="text-[10px]">Cleaned</span>
							</motion.div>
						))}
					</div>
				</section>
			</div>
			<p className="text-sm text-foreground">
				If cleanup falls behind, databases accumulate and memory usage keeps growing.
			</p>
		</section>
	);
}
