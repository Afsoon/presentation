import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function TableOfContentsList({ items }: { items: readonly string[] }) {
	const reduceMotion = useReducedMotion();
	return (
		<ol className="h-72 list-decimal space-y-5 pl-8 text-xl sm:pl-10 sm:text-3xl">
			<AnimatePresence initial={false}>
				{items.map((section) => (
					<motion.li
						key={section}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
					>
						{section}
					</motion.li>
				))}
			</AnimatePresence>
		</ol>
	);
}
