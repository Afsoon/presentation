import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { sections } from "@/slides/slide_2_table_of_content/slide_2_table_of_content.data";
import {
	tableOfContentsMachine,
	selectVisibleSections,
} from "@/slides/slide_2_table_of_content/slide_2_table_of_content.machine";
import {
	strategies,
	issues,
} from "@/slides/slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.data";
import {
	reasonsMachine,
	selectReasonsDisplay,
} from "@/slides/slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.machine";

describe("table of contents machine", () => {
	it("traverses its authored states and displays their sections without context", () => {
		const actor = createActor(tableOfContentsMachine).start();
		const states = ["whatIsPgtest", "whyBuildIt", "architecture", "conclusion"];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (let index = 0; index < states.length; index++) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleSections(actor.getSnapshot())).toEqual(sections.slice(0, index + 1));
			expect(actor.getSnapshot().context).toEqual({});
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (let index = states.length - 1; index >= 0; index--) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleSections(actor.getSnapshot())).toEqual(sections.slice(0, index + 1));
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toBe("whatIsPgtest");
		actor.stop();
	});
});

describe("reasons machine", () => {
	it("traverses every reveal in both directions without context", () => {
		const actor = createActor(reasonsMachine).start();
		const reveals = [
			...["transactions", "resetting", "mutations", "mocking", "templates"].map((name, index) => ({
				state: { strategies: name },
				display: {
					activeReason: "strategies",
					rightItems: strategies.slice(0, index + 1),
					rightLabel: "Postgres testing strategies",
				},
			})),
			...["tuning", "testChanges", "leasing", "unsafeHashes", "longHashes", "maintenance"].map((name, index) => ({
				state: { issues: name },
				display: { activeReason: "issues", rightItems: issues.slice(0, index + 1), rightLabel: "IntegreSQL issues" },
			})),
			{ state: "rust", display: { activeReason: "rust", rightItems: [], rightLabel: "Rust" } },
			{ state: "ai", display: { activeReason: "ai", rightItems: [], rightLabel: "AI writing code" } },
		];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (const reveal of reveals) {
			expect(actor.getSnapshot().value).toEqual(reveal.state);
			expect(selectReasonsDisplay(actor.getSnapshot())).toEqual(reveal.display);
			expect(actor.getSnapshot().context).toEqual({});
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (const reveal of [...reveals].reverse()) {
			expect(actor.getSnapshot().value).toEqual(reveal.state);
			expect(selectReasonsDisplay(actor.getSnapshot())).toEqual(reveal.display);
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toEqual({ strategies: "transactions" });
		actor.stop();
	});

	it("jumps to the first reveal of a selected reason and resumes navigation", () => {
		const actor = createActor(reasonsMachine).start();
		actor.send({ type: "SELECT_REASON", reason: "issues" });
		expect(actor.getSnapshot().value).toEqual({ issues: "tuning" });
		actor.send({ type: "NEXT" });
		expect(selectReasonsDisplay(actor.getSnapshot()).rightItems).toEqual(issues.slice(0, 2));
		actor.send({ type: "SELECT_REASON", reason: "issues" });
		expect(actor.getSnapshot().value).toEqual({ issues: "tuning" });
		actor.send({ type: "SELECT_REASON", reason: "rust" });
		expect(selectReasonsDisplay(actor.getSnapshot()).rightItems).toEqual([]);
		actor.send({ type: "PREVIOUS" });
		expect(actor.getSnapshot().value).toEqual({ issues: "maintenance" });
		expect(selectReasonsDisplay(actor.getSnapshot()).rightItems).toEqual(issues);
		actor.send({ type: "SELECT_REASON", reason: "ai" });
		expect(selectReasonsDisplay(actor.getSnapshot())).toEqual({
			activeReason: "ai",
			rightItems: [],
			rightLabel: "AI writing code",
		});
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		expect(actor.getSnapshot().value).toBe("rust");
		actor.send({ type: "SELECT_REASON", reason: "strategies" });
		expect(actor.getSnapshot().value).toEqual({ strategies: "transactions" });
		for (const reason of ["unknown", ""]) {
			// @ts-expect-error Verify unexpected external values are ignored at runtime.
			actor.send({ type: "SELECT_REASON", reason });
			expect(actor.getSnapshot().value).toEqual({ strategies: "transactions" });
		}
		actor.stop();
	});

	it("preserves independent reveal states across presentation instances", () => {
		const first = createActor(reasonsMachine).start();
		const second = createActor(reasonsMachine).start();
		first.send({ type: "SELECT_REASON", reason: "issues" });
		expect(selectReasonsDisplay(first.getSnapshot()).rightItems).toEqual([issues[0]]);
		expect(selectReasonsDisplay(second.getSnapshot()).rightItems).toEqual([strategies[0]]);
		first.stop();
		second.stop();
	});
});
