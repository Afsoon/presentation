import { useHotkey } from "@tanstack/react-hotkeys";
import { MinusIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore, type SubslideControls } from "@/stores/subslide-controls";
import { useSlides } from "@/stores/use-slides";

export const metadata = {
	Id: "reasons-for-building-pgtest",
	name: "Reasons for building PgTest",
	hasSubslides: true,
} satisfies SlideMetadata;

const reasons = [
	{
		question: "Postgres testing strategies tend to not scale",
		answer:
			"Other lightweight approaches tend to slow the suite as operations become slower, or give up on replicating production for speed.",
	},
	{
		question: "Issues found using IntegreSQL.",
		answer: "The service became harder to use as the test suite grew. The issues are:",
	},
	{ question: "Excuse to use Rust.", answer: "The best way to learn something is building something you will use" },
];

const strategies: { text: string; href?: string }[] = [
	{ text: "Isolating tests with transactions" },
	{ text: "Resetting the database" },
	{ text: "Isolating mutations" },
	{ text: "Mocking" },
	{ text: "Database templates" },
];

const issues = [
	{ text: "It is hard to tune the service to handle a large test suite." },
	{ text: "Tuning requires changes to our test code." },
	{ text: "Parallel test suites can be slowed down by database leasing." },
	{
		text: "Bug: Non-URL-safe symbols in hashes",
		href: "https://github.com/allaboutapps/integresql/issues/20",
	},
	{
		text: "Bug: IntegreSQL returns a non-existent database when a long hash is used",
		href: "https://github.com/allaboutapps/integresql/issues/21",
	},
	{ text: "The last commit was two years ago." },
];

const lastStep = strategies.length + issues.length;

export const SlideReasonsForBuildingPgtest = () => {
	const hasEntered = useRef(false);

	const [currentStep, setCurrentStep] = useState(0);
	const currentItem = currentStep < strategies.length ? 0 : currentStep === lastStep ? 2 : 1;
	const visibleItems =
		currentItem === 0
			? strategies.slice(0, currentStep + 1)
			: currentItem === 1
				? issues.slice(0, currentStep - strategies.length + 1)
				: [];
	const reduceMotion = useReducedMotion();
	const { snapshot } = useSlides();
	const active = snapshot.currentSlide.Id === metadata.Id && snapshot.currentSlide.hasSubslides;

	const changeSubslide = (next: number) => {
		setCurrentStep(next);
		controls.current = {
			Id: metadata.Id,
			up: next > 0 ? () => changeSubslide(next - 1) : null,
			down: next < lastStep ? () => changeSubslide(next + 1) : null,
		};
		subslideControlsStore.updateSubslidesControl(controls.current);
	};

	const controls = useRef<SubslideControls>({
		Id: metadata.Id,
		up: null,
		down: () => changeSubslide(1),
	});

	useHotkey("ArrowUp", () => changeSubslide(Math.max(0, currentStep - 1)), {
		enabled: active && currentStep > 0,
		ignoreInputs: true,
		ignoreDefaultPrevented: true,
		stopPropagation: false,
	});
	useHotkey("ArrowDown", () => changeSubslide(Math.min(lastStep, currentStep + 1)), {
		enabled: active && currentStep < lastStep,
		ignoreInputs: true,
		ignoreDefaultPrevented: true,
		stopPropagation: false,
	});

	const containerRef = (container: HTMLDivElement | null) => {
		if (!container) return;
		hasEntered.current = true;
		subslideControlsStore.updateSubslidesControl(controls.current);
		return () => {
			if (subslideControlsStore.getSnapshot()?.Id === metadata.Id) {
				subslideControlsStore.updateSubslidesControl(null);
			}
		};
	};

	return (
		<div ref={containerRef} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
			<Accordion
				value={[currentItem]}
				onValueChange={(values) => {
					if (values.length > 0) {
						changeSubslide(values[0] === 2 ? lastStep : values[0] === 1 ? strategies.length : 0);
					}
				}}
				className="reasons-accordion w-full flex flex-col gap-4"
			>
				{reasons.map((faq, index) => (
					<AccordionItem
						key={`item-${index}`}
						value={index}
						className={cn(
							"border border-border rounded-2xl flex flex-col group/item data-open:bg-accent data-open:border-transparent transition-colors",
							!hasEntered.current &&
								"animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both motion-reduce:animate-none",
							!hasEntered.current && index === 0 && "delay-100",
							!hasEntered.current && index === 1 && "delay-200",
							!hasEntered.current && index === 2 && "delay-300",
						)}
					>
						<AccordionTrigger className="px-4 py-3 items-center text-base font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden cursor-pointer">
							<div className="flex gap-6 items-center text-left">
								<span aria-hidden="true" className="reason-number text-muted-foreground tabular-nums shrink-0" />
								{faq.question}
							</div>
							<PlusIcon className="w-5 h-5 shrink-0 text-muted-foreground group-aria-expanded/accordion-trigger:hidden" />
							<MinusIcon className="w-5 h-5 shrink-0 text-muted-foreground hidden group-aria-expanded/accordion-trigger:inline" />
						</AccordionTrigger>
						<AccordionContent className="px-4 pb-5 ps-16 text-muted-foreground">{faq.answer}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<Separator orientation="vertical" className="hidden lg:block" />
			<div className="h-[28rem] overflow-y-auto">
				<ul
					aria-label={currentItem === 0 ? "Postgres testing strategies" : "IntegreSQL issues"}
					className="list-disc space-y-5 pl-6 text-lg leading-relaxed text-foreground"
				>
					<AnimatePresence key={currentItem} initial={false}>
						{visibleItems.map((issue) => (
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
		</div>
	);
};
