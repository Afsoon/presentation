import type { SlideMetadata } from "@/slides/types";

export const titleMetadata = {
	Id: "title",
	name: "PgTest",
	hasSubslides: false,
	notes: `15s
• I built PgTest to manage isolated PostgreSQL databases for integration tests.
• I want to share why I built it, the decisions I made, and how it evolved from a PoC to v0.2.`,
} satisfies SlideMetadata;

export const tableOfContentsMetadata = {
	Id: "table-of-contents",
	name: "Table of contents",
	hasSubslides: true,
	notes: `15s
• I'll start with the problem I wanted to solve, then walk through the implementation, the setbacks, and the results.`,
} satisfies SlideMetadata;

export const whatIsPgtestMetadata = {
	Id: "what-is-pgtest",
	name: "What is pgtest?",
	hasSubslides: false,
	notes: `35s
• I built a PostgreSQL proxy that gives tests isolated copies of a prepared template.
• Same lease ID: same database. Different IDs: separate databases.
• IntegreSQL was a big inspiration for the project.`,
} satisfies SlideMetadata;

export const whyAmIBuildingItMetadata = {
	Id: "why-am-i-building-it",
	name: "Why I built PgTest",
	hasSubslides: false,
	notes: `5s
• These are the problems that led me to build PgTest.`,
} satisfies SlideMetadata;

export const reasonsForBuildingPgtestMetadata = {
	Id: "reasons-for-building-pgtest",
	name: "Reasons for building PgTest",
	hasSubslides: true,
	notes: `75s
• I wanted fast tests without giving up isolation or a real PostgreSQL database.
• With IntegreSQL, tuning and leasing became harder as my test suite grew.
• First bug: URL encoding of the template name caused problems with non-URL-safe characters.
• Second bug: PostgreSQL truncates database names to 63 bytes by default. IntegreSQL searched for the full name instead of the truncated name.
• Maintenance: Last commit was two years ago.
• Rust: I wanted to learn by building something I would use.
• With AI writing more code, detecting incorrect behavior as early as possible matters even more.`,
} satisfies SlideMetadata;

export const architectureMetadata = {
	Id: "architecture-and-implementation",
	name: "Architecture and implementation",
	hasSubslides: false,
	notes: `5s
• I'll walk through my initial goals and the changes I made over three versions.`,
} satisfies SlideMetadata;

export const implementationGoalsMetadata = {
	Id: "implementation-goals",
	name: "Implementation goals",
	hasSubslides: true,
	notes: `40s
• I wanted to keep using the existing PostgreSQL client, so I chose a proxy.
• I wanted databases ready before tests needed them.
• I wanted fewer settings to tune and enough concurrency to keep up with the suite.`,
} satisfies SlideMetadata;

export const proofOfConceptMetadata = {
	Id: "proof-of-concept-implementation",
	name: "Proof of concept implementation",
	hasSubslides: false,
	notes: `15s
• For the PoC, I kept IntegreSQL's template idea and changed connection setup, pool growth, and cleanup.
• Those three decisions shaped the first implementation.`,
} satisfies SlideMetadata;

export const clientConnectionMetadata = {
	Id: "client-connection",
	name: "Client connection",
	hasSubslides: true,
	notes: `50s
• With IntegreSQL, my setup requested a database through REST, then constructed the connection URL.
• I moved assignment into the proxy: the test connects to template/lease-id.
• The test supplies a fresh ID for isolation; connections sharing that ID share the database.
• That let me simplify the setup code. This was the PoC; I added explicit cleanup later.`,
} satisfies SlideMetadata;

export const databasePoolMetadata = {
	Id: "database-pool-strategy",
	name: "Database Pool Strategy",
	hasSubslides: true,
	notes: `80s
• With IntegreSQL, requests waited for creation once ready databases ran out. At the cap, requests stayed queued.
• I added a threshold that triggered a new batch in the background before the ready pool ran out.
• The animations show the difference between waiting for creation and replenishing early.
• I still capped the pool in the PoC, so prewarming alone did not solve the problem.`,
} satisfies SlideMetadata;

export const cleanupMetadata = {
	Id: "cleanup-database-trigger",
	name: "Cleanup database trigger",
	hasSubslides: true,
	notes: `40s
• IntegreSQL uses a lifetime and explicit cleanup controls.
• In the PoC, I tried cleaning up when the active connection count reached zero.
• Client pools behave differently, so that was not a reliable signal that a test had finished.
• I later replaced that trigger with explicit release.`,
} satisfies SlideMetadata;

export const pocResultsMetadata = {
	Id: "poc-results",
	name: "PoC Results",
	hasSubslides: true,
	notes: `35s
• My PoC ran into pool starvation and contention for internal PostgreSQL connections.
• I had seven states per pool slot, which made the lifecycle complicated.
• My cleanup trigger made it slower and less reliable, so I moved to explicit release.
• These results guided the changes I made in v0.1.`,
} satisfies SlideMetadata;

export const v01ImplementationMetadata = {
	Id: "v0-1-implementation",
	name: "v0.1 implementation",
	hasSubslides: false,
	notes: `5s
• For v0.1, I focused on those bottlenecks and a more predictable lifecycle.`,
} satisfies SlideMetadata;

export const extractIoMetadata = {
	Id: "extract-io-from-manager",
	name: "Extract IO from manager and split it",
	hasSubslides: true,
	notes: `65s
• The manager leased databases, triggered creation and cleanup, tracked requests waiting for a database, and returned already-leased databases for existing lease IDs.
• It also handled I/O, adding more states to track.
• I split creation and cleanup into workers with their own PostgreSQL clients and resource policies.
• I changed database creation from one at a time to batches.
• The diagrams show how I moved I/O out of the manager into the two workers.`,
} satisfies SlideMetadata;

export const uncappedPoolMetadata = {
	Id: "not-capping-the-pool",
	name: "Not capping the pool.",
	hasSubslides: true,
	notes: `40s
• I found that a full pool defeated prewarming: new requests depended on cleanup freeing slots.
• I removed the cap so replenishment could continue as tests consumed databases.
• The tradeoff is resource use: cleanup still has to keep up.
• One animation cycle shows creation and cleanup working independently.`,
} satisfies SlideMetadata;

export const explicitCleanupMetadata = {
	Id: "explicit-cleanup-database-command",
	name: "Explicit cleanup database command",
	hasSubslides: true,
	notes: `40s
• I moved to an explicit cleanup command, with a configurable lifetime as a fallback. The default is 30 seconds.
• I stopped treating the last disconnection as the end of a test.
• I exposed cleanup through the pgtest control database so users can reuse their PostgreSQL client for admin operations instead of building a separate REST client.
• The diagram shows how I separated test traffic from admin commands.`,
} satisfies SlideMetadata;

export const v01ResultsMetadata = {
	Id: "v0-1-results",
	name: "v0.1 Results",
	hasSubslides: true,
	notes: `30s`,
} satisfies SlideMetadata;

export const v02ImplementationMetadata = {
	Id: "v0-2-implementation",
	name: "v0.2 implementation",
	hasSubslides: false,
	notes: `10s
• Once I had a usable release, I focused v0.2 on simplifying the code and architecture while preserving performance.`,
} satisfies SlideMetadata;

export const v02ChangesMetadata = {
	Id: "changes-done-for-v0-2",
	name: "Changes done for v0.2",
	hasSubslides: true,
	notes: `50s
• I adopted Pingora, Cloudflare's framework for building proxy servers.
• I moved lease tracking into a concurrent, lock-free structure and reduced pool states from four to two.
• This let me remove the manager worker entirely, reducing the architecture from three workers to two: creation and cleanup.
• I batched messages between I/O workers and simplified tracking of waiting requests.`,
} satisfies SlideMetadata;

export const conclusionMetadata = {
	Id: "conclusion",
	name: "Conclusion",
	hasSubslides: false,
	notes: `5s
• I'll finish with the experiments that did not work, my results, and what I want to try next.`,
} satisfies SlideMetadata;

export const things_that_didnt_workMetadata = {
	Id: "things-that-didnt-work",
	name: "Things that didn’t work",
	hasSubslides: true,
	notes: `35s`,
} satisfies SlideMetadata;

export const resultsMetadata = {
	Id: "results",
	name: "Results",
	hasSubslides: true,
	notes: `55s
• My initial measurements show PgTest running 40–50% faster in CI and 20–30% faster locally than IntegreSQL.
• I ended up with three main pool settings: initial size, replenishment threshold, and growth batch size.
• The final design keeps the PostgreSQL client and puts assignment and lifecycle management behind the proxy.
• The biggest changes along the way were early replenishment, explicit cleanup, and fewer states to manage.`,
} satisfies SlideMetadata;

export const next_stepsMetadata = {
	Id: "next-steps",
	name: "Next Steps",
	hasSubslides: true,
	notes: `35s
• PgTest is usable today; I still want to test it across more projects.
• Next I want repeatable benchmarks on stable CI runners, better setup documentation, and a tuning-focused release.
• I'll keep exploring ideas and testing how the project behaves with other suites.`,
} satisfies SlideMetadata;
