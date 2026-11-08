import { useActorRef, useSelector } from "@xstate/react";
import { useEffect } from "react";

import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import {
	selectVisibleSections,
	tableOfContentsMachine,
} from "./slide_2_table_of_content/slide_2_table_of_content.machine";
import { TableOfContentsList } from "./slide_2_table_of_content/table-of-contents-list";

export const metadata = {
	Id: "table-of-contents",
	name: "Table of contents",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideTableOfContent = () => {
	const actor = useActorRef(tableOfContentsMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const visibleSections = useSelector(actor, selectVisibleSections);

	return (
		<div className="space-y-10">
			<h2 className="text-3xl font-semibold text-balance sm:text-5xl lg:text-6xl">Table of contents</h2>
			<TableOfContentsList items={visibleSections} />
		</div>
	);
};
