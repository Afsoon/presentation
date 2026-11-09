import { createFileRoute } from "@tanstack/react-router";
import { Activity, useDeferredValue, ViewTransition } from "react";

import { KeyboardNavigation } from "@/components/keyboard_navigation";
import { GridPattern } from "@/components/ui/grid-pattern";
import { getInitialPresentation } from "@/server/initial-presentation";
import { SlideTitle, metadata as titleMetadata } from "@/slides/slide_1_title";
import { SlideTableOfContent, metadata as tableOfContentsMetadata } from "@/slides/slide_2_table_of_content";
import { SlideWhatIsPgtest, metadata as whatIsPgtestMetadata } from "@/slides/slide_3_what_is_pgtest";
import { SlideWhyAmIBuildingIt, metadata as whyAmIBuildingItMetadata } from "@/slides/slide_4_why_am_i_building_it";
import {
	SlideReasonsForBuildingPgtest,
	metadata as reasonsForBuildingPgtestMetadata,
} from "@/slides/slide_5_reasons_for_building_pgtest";
import {
	SlideArchitectureAndImplementation,
	metadata as architectureMetadata,
} from "@/slides/slide_6_architecture_and_implementation";
import {
	SlideImplementationGoals,
	metadata as implementationGoalsMetadata,
} from "@/slides/slide_7_implementation_goals";
import {
	SlideProofOfConceptImplementation,
	metadata as proofOfConceptMetadata,
} from "@/slides/slide_8_proof_of_concept_implementation";
import { SlideClientConnection, metadata as clientConnectionMetadata } from "@/slides/slide_9_client_connection";
import { SlideDatabasePoolStrategy, metadata as databasePoolMetadata } from "@/slides/slide_10_database_pool_strategy";
import { SlideCleanupDatabaseTrigger, metadata as cleanupMetadata } from "@/slides/slide_11_cleanup_database_trigger";
import { SlidePocResults, metadata as pocResultsMetadata } from "@/slides/slide_12_poc_results";
import { SlideV01Implementation, metadata as v01ImplementationMetadata } from "@/slides/slide_13_v0_1_implementation";
import { SlideExtractIoFromManager, metadata as extractIoMetadata } from "@/slides/slide_14_extract_io_from_manager";
import { useSlides } from "@/stores/use-slides";

export const Route = createFileRoute("/")({
	loader: ({ location }) => getInitialPresentation({ data: location.searchStr }),
	component: Home,
});

function Home() {
	const { snapshot } = useSlides();
	// Defer rendering so synchronous store updates can activate React ViewTransitions.
	const { currentSlide } = useDeferredValue(snapshot);
	return (
		<main
			id="presentation"
			aria-label="Presentation"
			className="relative isolate grid h-dvh w-full grid-rows-[minmax(0,1fr)] overflow-hidden bg-background text-foreground"
		>
			<div
				aria-hidden="true"
				className="opacity-50 pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_70%)]"
			>
				<GridPattern
					width={80}
					height={80}
					squares={[
						[4, 4],
						[5, 1],
						[8, 2],
						[5, 3],
						[5, 5],
						[10, 10],
						[12, 15],
						[15, 10],
						[10, 15],
					]}
					className="inset-x-0 inset-y-[-15vw] h-[calc(100%+30vw)] skew-y-12"
				/>
			</div>
			<section
				aria-label={currentSlide.name}
				aria-roledescription="slide"
				tabIndex={0}
				className="min-h-0 overflow-hidden p-6 outline-offset-[-4px] sm:p-12 lg:p-20"
			>
				<Activity mode={currentSlide.Id === titleMetadata.Id ? "visible" : "hidden"}>
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
				<Activity mode={currentSlide.Id === tableOfContentsMetadata.Id ? "visible" : "hidden"}>
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
				<Activity mode={currentSlide.Id === whatIsPgtestMetadata.Id ? "visible" : "hidden"}>
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
				<Activity mode={currentSlide.Id === whyAmIBuildingItMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideWhyAmIBuildingIt />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === reasonsForBuildingPgtestMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideReasonsForBuildingPgtest />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === architectureMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideArchitectureAndImplementation />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === implementationGoalsMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideImplementationGoals />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === proofOfConceptMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideProofOfConceptImplementation />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === clientConnectionMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideClientConnection />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === databasePoolMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideDatabasePoolStrategy />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === cleanupMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideCleanupDatabaseTrigger />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === pocResultsMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlidePocResults />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === v01ImplementationMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideV01Implementation />
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === extractIoMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<SlideExtractIoFromManager />
						</div>
					</ViewTransition>
				</Activity>
			</section>
			<KeyboardNavigation />
		</main>
	);
}
