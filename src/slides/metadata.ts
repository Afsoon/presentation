import type { SlideMetadata } from "@/slides/types";

export const titleMetadata = {
	Id: "title",
	name: "PgTest",
	hasSubslides: false,
} satisfies SlideMetadata;

export const tableOfContentsMetadata = {
	Id: "table-of-contents",
	name: "Table of contents",
	hasSubslides: true,
} satisfies SlideMetadata;

export const whatIsPgtestMetadata = {
	Id: "what-is-pgtest",
	name: "What is pgtest?",
	hasSubslides: false,
} satisfies SlideMetadata;

export const whyAmIBuildingItMetadata = {
	Id: "why-am-i-building-it",
	name: "Why am I building it?",
	hasSubslides: false,
} satisfies SlideMetadata;

export const reasonsForBuildingPgtestMetadata = {
	Id: "reasons-for-building-pgtest",
	name: "Reasons for building PgTest",
	hasSubslides: true,
} satisfies SlideMetadata;

export const architectureMetadata = {
	Id: "architecture-and-implementation",
	name: "Architecture and implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const implementationGoalsMetadata = {
	Id: "implementation-goals",
	name: "Implementation goals",
	hasSubslides: true,
} satisfies SlideMetadata;

export const proofOfConceptMetadata = {
	Id: "proof-of-concept-implementation",
	name: "Proof of concept implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const clientConnectionMetadata = {
	Id: "client-connection",
	name: "Client connection",
	hasSubslides: true,
} satisfies SlideMetadata;

export const databasePoolMetadata = {
	Id: "database-pool-strategy",
	name: "Database Pool Strategy",
	hasSubslides: true,
} satisfies SlideMetadata;

export const cleanupMetadata = {
	Id: "cleanup-database-trigger",
	name: "Cleanup database trigger",
	hasSubslides: true,
} satisfies SlideMetadata;

export const pocResultsMetadata = {
	Id: "poc-results",
	name: "PoC Results",
	hasSubslides: true,
} satisfies SlideMetadata;

export const v01ImplementationMetadata = {
	Id: "v0-1-implementation",
	name: "v0.1 implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const extractIoMetadata = {
	Id: "extract-io-from-manager",
	name: "Extract IO from manager and split it",
	hasSubslides: true,
} satisfies SlideMetadata;

export const uncappedPoolMetadata = {
	Id: "not-capping-the-pool",
	name: "Not capping the pool.",
	hasSubslides: true,
} satisfies SlideMetadata;

export const explicitCleanupMetadata = {
	Id: "explicit-cleanup-database-command",
	name: "Explicit cleanup database command",
	hasSubslides: true,
} satisfies SlideMetadata;

export const v01ResultsMetadata = {
	Id: "v0-1-results",
	name: "v0.1 Results",
	hasSubslides: true,
} satisfies SlideMetadata;

export const v02ImplementationMetadata = {
	Id: "v0-2-implementation",
	name: "v0.2 implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const v02ChangesMetadata = {
	Id: "changes-done-for-v0-2",
	name: "Changes done for v0.2",
	hasSubslides: true,
} satisfies SlideMetadata;

export const conclusionMetadata = { Id: "conclusion", name: "Conclusion", hasSubslides: false } satisfies SlideMetadata;

export const things_that_didnt_workMetadata = {
	Id: "things-that-didnt-work",
	name: "Things that didn’t work",
	hasSubslides: true,
} satisfies SlideMetadata;

export const resultsMetadata = { Id: "results", name: "Results", hasSubslides: true } satisfies SlideMetadata;

export const next_stepsMetadata = {
	Id: "next-steps",
	name: "Next Steps",
	hasSubslides: true,
} satisfies SlideMetadata;
