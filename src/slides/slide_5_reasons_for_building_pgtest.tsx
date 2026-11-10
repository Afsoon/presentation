import { useActorRef, useSelector } from "@xstate/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useRef } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { ReasonsSideList } from "./slide_5_reasons_for_building_pgtest/reasons-side-list";
import { reasons } from "./slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.data";
import {
	selectReasonsDisplay,
	reasonsMachine,
} from "./slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.machine";

export const metadata = {
	Id: "reasons-for-building-pgtest",
	name: "Reasons for building PgTest",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideReasonsForBuildingPgtest = () => {
	const actor = useActorRef(reasonsMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const hasEntered = useRef(false);

	const { activeReason, rightItems, rightLabel } = useSelector(actor, selectReasonsDisplay);
	const containerRef = (container: HTMLDivElement | null) => {
		if (container) hasEntered.current = true;
	};

	return (
		<div ref={containerRef} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
			<Accordion
				value={[activeReason]}
				onValueChange={(values) => {
					const reason = reasons.find((item) => item.id === values[0]);
					if (reason) {
						actor.send({ type: "SELECT_REASON", reason: reason.id });
					}
				}}
				className="reasons-accordion w-full flex flex-col gap-4"
			>
				{reasons.map((faq) => (
					<AccordionItem
						key={faq.id}
						value={faq.id}
						className={cn(
							"border border-border bg-card text-card-foreground shadow-2xl shadow-black/25 dark:shadow-black/50 rounded-2xl flex flex-col group/item data-open:bg-accent data-open:border-transparent dark:data-open:text-accent-foreground transition-colors",
							!hasEntered.current &&
								"animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both motion-reduce:animate-none",
							!hasEntered.current && faq.id === "strategies" && "delay-100",
							!hasEntered.current && faq.id === "issues" && "delay-200",
							!hasEntered.current && faq.id === "rust" && "delay-300",
						)}
					>
						<AccordionTrigger className="px-4 py-3 items-center text-base font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden cursor-pointer">
							<div className="flex gap-6 items-center text-left">
								<span
									aria-hidden="true"
									className="reason-number text-muted-foreground group-data-open/item:text-inherit tabular-nums shrink-0"
								/>
								{faq.question}
							</div>
							<PlusIcon className="w-5 h-5 shrink-0 text-muted-foreground group-data-open/item:text-inherit group-aria-expanded/accordion-trigger:hidden" />
							<MinusIcon className="w-5 h-5 shrink-0 text-muted-foreground group-data-open/item:text-inherit hidden group-aria-expanded/accordion-trigger:inline" />
						</AccordionTrigger>
						<AccordionContent className="px-4 pb-5 ps-16 text-muted-foreground group-data-open/item:text-inherit">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<Separator orientation="vertical" className="hidden rounded-full data-vertical:w-1 lg:block" />
			<ReasonsSideList key={activeReason} items={rightItems} label={rightLabel} />
		</div>
	);
};
