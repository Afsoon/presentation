import { useActorRef, useSelector } from "@xstate/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { changes, description } from "./slide_14_extract_io_from_manager/slide_14_extract_io_from_manager.data";
import {
	extractIoMachine,
	selectVisibleChanges,
} from "./slide_14_extract_io_from_manager/slide_14_extract_io_from_manager.machine";

export const metadata = {
	Id: "extract-io-from-manager",
	name: "Extract IO from manager and split it",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideExtractIoFromManager = () => {
	const actor = useActorRef(extractIoMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const visibleChanges = useSelector(actor, selectVisibleChanges);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<Typography level="p-small">v0.1 Implementation.</Typography>
				<Typography level="h2">Extract IO from manager and split it</Typography>
			</header>
			<Typography level="p">{description}</Typography>
			{/* Keep every row in layout so text wrapping never moves the heading or earlier bullets. */}
			<ul className="list-disc space-y-6 pl-8 text-xl leading-relaxed sm:text-2xl">
				{changes.map((result) => {
					const visible = visibleChanges.includes(result);
					return (
						<motion.li
							key={result}
							aria-hidden={!visible}
							initial={false}
							animate={{ opacity: visible ? 1 : 0, x: visible || reduceMotion ? 0 : 16 }}
							transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
						>
							{result}
						</motion.li>
					);
				})}
			</ul>
		</div>
	);
};
