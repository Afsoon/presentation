import { useSelector } from "@xstate/react";

import { tableOfContentsMetadata as metadata } from "@/slides/metadata";
import { useSlideActor } from "@/stores/use-slide-actor";

import {
	selectVisibleSections,
	tableOfContentsMachine,
} from "./slide_2_table_of_content/slide_2_table_of_content.machine";
import { TableOfContentsList } from "./slide_2_table_of_content/table-of-contents-list";

export { tableOfContentsMetadata as metadata } from "@/slides/metadata";

export const SlideTableOfContent = () => {
	const actor = useSlideActor(tableOfContentsMachine, metadata.Id);
	const visibleSections = useSelector(actor, selectVisibleSections);

	return (
		<div className="space-y-10">
			<h2 className="text-3xl font-semibold text-balance @min-[640px]/slide:text-5xl @min-[1024px]/slide:text-6xl">
				Table of contents
			</h2>
			<TableOfContentsList items={visibleSections} />
		</div>
	);
};
