import { useHotkey } from "@tanstack/react-hotkeys";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore, type SubslideControls } from "@/stores/subslide-controls";
import { useSlides } from "@/stores/use-slides";

export const metadata = {
	Id: "table-of-contents",
	name: "Table of contents",
	hasSubslides: true,
} satisfies SlideMetadata;

const sections = ["What is PgTest?", "Why am I building it?", "Architecture and implementation", "Conclusion"];

export const SlideTableOfContent = () => {
	const [visibleCount, setVisibleCount] = useState(1);
	const reduceMotion = useReducedMotion();

	const { snapshot } = useSlides();
	const active = snapshot.currentSlide.Id === metadata.Id && snapshot.currentSlide.hasSubslides;

	const changeSubslide = (next: number) => {
		setVisibleCount(next);
		controls.current = {
			Id: metadata.Id,
			up: next > 1 ? () => changeSubslide(next - 1) : null,
			down: next < sections.length ? () => changeSubslide(next + 1) : null,
		};
		subslideControlsStore.updateSubslidesControl(controls.current);
	};

	const controls = useRef<SubslideControls>({
		Id: metadata.Id,
		up: null,
		down: () => changeSubslide(2),
	});

	useHotkey("ArrowUp", () => changeSubslide(Math.max(1, visibleCount - 1)), {
		enabled: active && visibleCount > 1,
		ignoreInputs: true,
		ignoreDefaultPrevented: true,
		stopPropagation: false,
	});
	useHotkey("ArrowDown", () => changeSubslide(Math.min(sections.length, visibleCount + 1)), {
		enabled: active && visibleCount < sections.length,
		ignoreInputs: true,
		ignoreDefaultPrevented: true,
		stopPropagation: false,
	});

	const containerRef = (container: HTMLDivElement | null) => {
		if (!container) return;
		subslideControlsStore.updateSubslidesControl(controls.current);
		return () => {
			if (subslideControlsStore.getSnapshot()?.Id === metadata.Id) {
				subslideControlsStore.updateSubslidesControl(null);
			}
		};
	};

	return (
		<div ref={containerRef} className="space-y-10">
			<h2 className="text-3xl font-semibold text-balance sm:text-5xl lg:text-6xl">Table of contents</h2>
			<ol className="h-72 list-decimal space-y-5 pl-8 text-xl sm:pl-10 sm:text-3xl">
				<AnimatePresence initial={false}>
					{sections.slice(0, visibleCount).map((section) => (
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
		</div>
	);
};
