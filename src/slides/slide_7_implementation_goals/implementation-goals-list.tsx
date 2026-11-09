import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Typography from "@/components/ui/typography";

import type { ImplementationGoal } from "./slide_7_implementation_goals.data";

export function ImplementationGoalsList({ items }: { items: readonly ImplementationGoal[] }) {
	const reduceMotion = useReducedMotion();
	return (
		<ol role="list" aria-label="Implementation goals" className="workflow-steps grid gap-6 md:grid-cols-2">
			<AnimatePresence initial={false}>
				{items.map((goal) => (
					<motion.li
						key={goal.id}
						className="space-y-3 rounded-xl border bg-card p-6"
						initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
						transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
					>
						<Typography level="p-small">Requirement</Typography>
						<Typography level="h4">{goal.requirement}</Typography>
						<Typography level="p">
							<span className="font-semibold">Solution:</span> {goal.solution}
						</Typography>
					</motion.li>
				))}
			</AnimatePresence>
		</ol>
	);
}
