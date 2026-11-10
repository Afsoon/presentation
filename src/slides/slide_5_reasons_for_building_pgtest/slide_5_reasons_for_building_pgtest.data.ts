export type SideListItem = { text: string; href?: string };

export type ReasonId = "strategies" | "issues" | "rust";

export const reasons: readonly { id: ReasonId; question: string; answer: string }[] = [
	{
		id: "strategies",
		question: "I wanted tests that could scale",
		answer:
			"I wanted to keep tests fast as the suite grew, while preserving isolation and testing against real PostgreSQL.",
	},
	{
		id: "issues",
		question: "Problems I encountered with IntegreSQL",
		answer: "As my test suite grew, the service became harder to tune and use. These were the issues:",
	},
	{
		id: "rust",
		question: "Excuse to use Rust.",
		answer: "I wanted to learn Rust by building something I would use.",
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
	{ text: "Tuning required changes to my test code." },
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
