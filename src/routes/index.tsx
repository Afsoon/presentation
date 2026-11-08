import { createFileRoute } from "@tanstack/react-router";
import { Activity, useDeferredValue, ViewTransition } from "react";

import { SlideTableOfContent } from "#/slides/slide_2_table_of_content.tsx";
import { KeyboardNavigation } from "@/components/keyboard_navigation";
import { SlideTitle } from "@/slides/slide_1_title";
import { SlideWhatIsPgtest } from "@/slides/slide_3_what_is_pgtest";
import { useSlides } from "@/stores/use-slides";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { snapshot } = useSlides();
	// Defer rendering so synchronous store updates can activate React ViewTransitions.
	const { currentSlide } = useDeferredValue(snapshot);

	return (
		<main
			id="presentation"
			aria-label="Presentation"
			className="grid h-dvh w-full grid-rows-[minmax(0,1fr)_auto] bg-background text-foreground"
		>
			<section
				aria-label={currentSlide.name}
				aria-roledescription="slide"
				tabIndex={0}
				className="min-h-0 overflow-y-auto p-6 outline-offset-[-4px] sm:p-12 lg:p-20"
			>
				<Activity mode={currentSlide.id === "title" ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideTitle />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.id === "table-of-contents" ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideTableOfContent />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.id === "what-is-pgtest" ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideWhatIsPgtest />
						</div>
					</ViewTransition>
				</Activity>
			</section>
			<footer className="relative min-h-40">
				<KeyboardNavigation />
			</footer>
		</main>
	);
}
