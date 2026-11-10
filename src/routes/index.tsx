import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Activity, lazy, Suspense, useDeferredValue, ViewTransition } from "react";

import { KeyboardNavigation } from "@/components/keyboard_navigation";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { GridPattern } from "@/components/ui/grid-pattern";
import LiquidWaveSpinner from "@/components/ui/spinner";
import { getInitialPresentation } from "@/server/initial-presentation";
import {
	titleMetadata,
	tableOfContentsMetadata,
	whatIsPgtestMetadata,
	whyAmIBuildingItMetadata,
	reasonsForBuildingPgtestMetadata,
	architectureMetadata,
	implementationGoalsMetadata,
	proofOfConceptMetadata,
	clientConnectionMetadata,
	databasePoolMetadata,
	cleanupMetadata,
	pocResultsMetadata,
	v01ImplementationMetadata,
	extractIoMetadata,
	uncappedPoolMetadata,
	explicitCleanupMetadata,
	v01ResultsMetadata,
	v02ImplementationMetadata,
	v02ChangesMetadata,
	conclusionMetadata,
	things_that_didnt_workMetadata,
	resultsMetadata,
	next_stepsMetadata,
} from "@/slides/metadata";
import { useSlides } from "@/stores/use-slides";

const SlideTitle = lazy(() => import("@/slides/slide_1_title").then((module) => ({ default: module.SlideTitle })));
const SlideTableOfContent = lazy(() =>
	import("@/slides/slide_2_table_of_content").then((module) => ({ default: module.SlideTableOfContent })),
);
const SlideWhatIsPgtest = lazy(() =>
	import("@/slides/slide_3_what_is_pgtest").then((module) => ({ default: module.SlideWhatIsPgtest })),
);
const SlideWhyAmIBuildingIt = lazy(() =>
	import("@/slides/slide_4_why_am_i_building_it").then((module) => ({ default: module.SlideWhyAmIBuildingIt })),
);
const SlideReasonsForBuildingPgtest = lazy(() =>
	import("@/slides/slide_5_reasons_for_building_pgtest").then((module) => ({
		default: module.SlideReasonsForBuildingPgtest,
	})),
);
const SlideArchitectureAndImplementation = lazy(() =>
	import("@/slides/slide_6_architecture_and_implementation").then((module) => ({
		default: module.SlideArchitectureAndImplementation,
	})),
);
const SlideImplementationGoals = lazy(() =>
	import("@/slides/slide_7_implementation_goals").then((module) => ({ default: module.SlideImplementationGoals })),
);
const SlideProofOfConceptImplementation = lazy(() =>
	import("@/slides/slide_8_proof_of_concept_implementation").then((module) => ({
		default: module.SlideProofOfConceptImplementation,
	})),
);
const SlideClientConnection = lazy(() =>
	import("@/slides/slide_9_client_connection").then((module) => ({ default: module.SlideClientConnection })),
);
const SlideDatabasePoolStrategy = lazy(() =>
	import("@/slides/slide_10_database_pool_strategy").then((module) => ({ default: module.SlideDatabasePoolStrategy })),
);
const SlideCleanupDatabaseTrigger = lazy(() =>
	import("@/slides/slide_11_cleanup_database_trigger").then((module) => ({
		default: module.SlideCleanupDatabaseTrigger,
	})),
);
const SlidePocResults = lazy(() =>
	import("@/slides/slide_12_poc_results").then((module) => ({ default: module.SlidePocResults })),
);
const SlideV01Implementation = lazy(() =>
	import("@/slides/slide_13_v0_1_implementation").then((module) => ({ default: module.SlideV01Implementation })),
);
const SlideExtractIoFromManager = lazy(() =>
	import("@/slides/slide_14_extract_io_from_manager").then((module) => ({ default: module.SlideExtractIoFromManager })),
);
const SlideNotCappingThePool = lazy(() =>
	import("@/slides/slide_15_not_capping_the_pool").then((module) => ({ default: module.SlideNotCappingThePool })),
);
const SlideExplicitCleanupDatabaseCommand = lazy(() =>
	import("@/slides/slide_16_explicit_cleanup_database_command").then((module) => ({
		default: module.SlideExplicitCleanupDatabaseCommand,
	})),
);
const SlideV01Results = lazy(() =>
	import("@/slides/slide_17_v0_1_results").then((module) => ({ default: module.SlideV01Results })),
);
const SlideV02Implementation = lazy(() =>
	import("@/slides/slide_18_v0_2_implementation").then((module) => ({ default: module.SlideV02Implementation })),
);
const SlideChangesDoneForV02 = lazy(() =>
	import("@/slides/slide_19_changes_done_for_v0_2").then((module) => ({ default: module.SlideChangesDoneForV02 })),
);
const SlideConclusion = lazy(() =>
	import("@/slides/slide_20_conclusion").then((module) => ({ default: module.SlideConclusion })),
);
const SlideThingsThatDidntWork = lazy(() =>
	import("@/slides/slide_21_things_that_didnt_work").then((module) => ({ default: module.SlideThingsThatDidntWork })),
);
const SlideResults = lazy(() =>
	import("@/slides/slide_22_results").then((module) => ({ default: module.SlideResults })),
);
const SlideNextSteps = lazy(() =>
	import("@/slides/slide_23_next_steps").then((module) => ({ default: module.SlideNextSteps })),
);

export const Route = createFileRoute("/")({
	loader: ({ location }) => getInitialPresentation({ data: location.searchStr }),
	component: Home,
});

function Home() {
	const { snapshot } = useSlides();
	const { theme } = getRouteApi("__root__").useLoaderData();
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideTitle />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideTableOfContent />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideWhatIsPgtest />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideWhyAmIBuildingIt />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideReasonsForBuildingPgtest />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideArchitectureAndImplementation />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideImplementationGoals />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideProofOfConceptImplementation />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideClientConnection />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideDatabasePoolStrategy />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideCleanupDatabaseTrigger />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlidePocResults />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideV01Implementation />
							</Suspense>
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
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideExtractIoFromManager />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === uncappedPoolMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideNotCappingThePool />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === explicitCleanupMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideExplicitCleanupDatabaseCommand />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === v01ResultsMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideV01Results />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === v02ImplementationMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideV02Implementation />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === v02ChangesMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideChangesDoneForV02 />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === conclusionMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideConclusion />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === things_that_didnt_workMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideThingsThatDidntWork />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === resultsMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideResults />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
				<Activity mode={currentSlide.Id === next_stepsMetadata.Id ? "visible" : "hidden"}>
					<ViewTransition
						default="none"
						enter={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
						exit={{ default: "slide-in", forward: "slide-in", backward: "slide-back" }}
					>
						<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
							<Suspense fallback={<LiquidWaveSpinner role="status" aria-label="Loading slide" />}>
								<SlideNextSteps />
							</Suspense>
						</div>
					</ViewTransition>
				</Activity>
			</section>
			<KeyboardNavigation />
			<div className="absolute top-4 left-4 z-20">
				<AnimatedThemeToggler
					initialTheme={theme}
					className="flex size-[42px] items-center justify-center rounded-md hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
				/>
			</div>
		</main>
	);
}
