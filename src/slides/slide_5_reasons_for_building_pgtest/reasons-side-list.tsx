import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { SideListItem } from "./slide_5_reasons_for_building_pgtest.data";

export function ReasonsSideList({ items, label }: { items: readonly SideListItem[]; label: string }) {
	const reduceMotion = useReducedMotion();
	return (
		<div className="h-[28rem] overflow-y-auto">
			<ul aria-label={label} className="list-disc space-y-5 pl-6 text-lg leading-relaxed text-foreground">
				<AnimatePresence initial={false}>
					{items.map((issue) => (
						<motion.li
							key={issue.text}
							initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
							transition={{ duration: 0.18, ease: "easeOut" }}
						>
							{issue.href ? (
								<a
									href={issue.href}
									target="_blank"
									rel="noreferrer"
									className="underline underline-offset-4 hover:text-foreground"
								>
									{issue.text}
								</a>
							) : (
								issue.text
							)}
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</div>
	);
}
