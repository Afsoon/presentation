import { lazy, Suspense } from "react";

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

export const slideComponents = {
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
};
export function SlideContent({ id }: { id: string }) {
	const Component = slideComponents[id];
	return Component ? (
		<Suspense fallback={<p>Loading slide…</p>}>
			<Component />
		</Suspense>
	) : null;
}
