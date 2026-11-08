export type SideListItem = { text: string; href?: string };

export type ReasonId = "strategies" | "issues" | "rust";

export const reasons: readonly { id: ReasonId; question: string; answer: string }[] = [
	{
		id: "strategies",
		question: "Postgres testing strategies tend to not scale",
		answer:
			"Other lightweight approaches tend to slow the suite as operations become slower, or give up on replicating production for speed.",
	},
	{
		id: "issues",
		question: "Issues found using IntegreSQL.",
		answer: "The service became harder to use as the test suite grew. The issues are:",
	},
	{
		id: "rust",
		question: "Excuse to use Rust.",
		answer: "The best way to learn something is building something you will use",
	},
];

export const strategies: readonly SideListItem[] = [
	{ text: "Isolating tests with transactions" },
	{ text: "Resetting the database" },
	{ text: "Isolating mutations" },
	{ text: "Mocking" },
	{ text: "Database templates" },
];

export const issues: readonly SideListItem[] = [
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
