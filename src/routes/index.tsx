import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Activity, Suspense, useDeferredValue, ViewTransition } from "react";

import { KeyboardNavigation } from "@/components/keyboard_navigation";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Progress, ProgressIndicator } from "@/components/ui/progress";
import LiquidWaveSpinner from "@/components/ui/spinner";
import { useSpeakerWindow } from "@/hooks/use-speaker-window";
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
import { slideComponents } from "@/slides/slide-content";
import { useSlides } from "@/stores/use-slides";

const {
	[titleMetadata.Id]: SlideTitle,
	[tableOfContentsMetadata.Id]: SlideTableOfContent,
	[whatIsPgtestMetadata.Id]: SlideWhatIsPgtest,
	[whyAmIBuildingItMetadata.Id]: SlideWhyAmIBuildingIt,
	[reasonsForBuildingPgtestMetadata.Id]: SlideReasonsForBuildingPgtest,
	[architectureMetadata.Id]: SlideArchitectureAndImplementation,
	[implementationGoalsMetadata.Id]: SlideImplementationGoals,
	[proofOfConceptMetadata.Id]: SlideProofOfConceptImplementation,
	[clientConnectionMetadata.Id]: SlideClientConnection,
	[databasePoolMetadata.Id]: SlideDatabasePoolStrategy,
	[cleanupMetadata.Id]: SlideCleanupDatabaseTrigger,
	[pocResultsMetadata.Id]: SlidePocResults,
	[v01ImplementationMetadata.Id]: SlideV01Implementation,
	[extractIoMetadata.Id]: SlideExtractIoFromManager,
	[uncappedPoolMetadata.Id]: SlideNotCappingThePool,
	[explicitCleanupMetadata.Id]: SlideExplicitCleanupDatabaseCommand,
	[v01ResultsMetadata.Id]: SlideV01Results,
	[v02ImplementationMetadata.Id]: SlideV02Implementation,
	[v02ChangesMetadata.Id]: SlideChangesDoneForV02,
	[conclusionMetadata.Id]: SlideConclusion,
	[things_that_didnt_workMetadata.Id]: SlideThingsThatDidntWork,
	[resultsMetadata.Id]: SlideResults,
	[next_stepsMetadata.Id]: SlideNextSteps,
} = slideComponents;

export const Route = createFileRoute("/")({
	loader: ({ location }) => getInitialPresentation({ data: location.searchStr }),
	component: Home,
});

function Home() {
	const speaker = useSpeakerWindow();
	const { snapshot } = useSlides();
	const { theme } = getRouteApi("__root__").useLoaderData();
	// Defer rendering so synchronous store updates can activate React ViewTransitions.
	const { currentSlide, currentPosition, slides } = useDeferredValue(snapshot);
	return (
		<main
			id="presentation"
			aria-label="Presentation"
			className="@container/slide relative isolate grid h-dvh w-full grid-rows-[minmax(0,1fr)] overflow-hidden bg-background text-foreground"
		>
			<Progress
				aria-label="Slide progress"
				value={currentPosition + 1}
				max={slides.length}
				aria-valuetext={`Slide ${currentPosition + 1} of ${slides.length}`}
				className="pointer-events-none absolute inset-x-0 top-0 z-30 gap-0 [&_[data-slot=progress-track]]:h-1 [&_[data-slot=progress-track]]:rounded-none"
				indicator={
					<ViewTransition default="none" update="slide-progress">
						{/* Capture the final width so the View Transition animates between slide positions. */}
						<ProgressIndicator className="transition-none" />
					</ViewTransition>
				}
			/>
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
			<KeyboardNavigation onOpenSpeaker={speaker.open} />
			{speaker.error && (
				<p role="alert" className="absolute bottom-4 left-4 z-50 max-w-md rounded border bg-background p-4">
					{speaker.error}
				</p>
			)}
			<div className="absolute top-4 left-4 z-20">
				<AnimatedThemeToggler
					initialTheme={theme}
					className="flex size-[42px] items-center justify-center rounded-md hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
				/>
			</div>
		</main>
	);
}
