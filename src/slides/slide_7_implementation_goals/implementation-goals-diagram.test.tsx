import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { ImplementationGoalsDiagram } from "./implementation-goals-diagram";
import type { ImplementationGoalStage } from "./slide_7_implementation_goals.data";

describe("implementation goals diagram", () => {
	it.each<{ stage: ImplementationGoalStage; pool: boolean; config: boolean; suites: boolean }>([
		{ stage: "transparency", pool: false, config: false, suites: false },
		{ stage: "poolStrategy", pool: true, config: false, suites: false },
		{ stage: "tuning", pool: true, config: true, suites: false },
		{ stage: "performance", pool: true, config: true, suites: true },
	])("shows the cumulative elements for $stage", ({ stage, pool, config, suites }) => {
		const html = renderToStaticMarkup(<ImplementationGoalsDiagram stage={stage} />);
		for (const name of ["PgTest", "Postgres Server", "PostgreSQL"]) expect(html).toContain(`aria-label="${name}"`);
		for (const name of ["Database pool", "Creation Worker", "Cleanup Worker"]) {
			expect(html.includes(`aria-label="${name}"`)).toBe(pool);
		}
		expect(html.match(/aria-label="Database \d: ready"/g) ?? []).toHaveLength(pool ? 4 : 0);
		for (const name of ["Database Pool Config", "PgTest Admin Panel"]) {
			expect(html.includes(`aria-label="${name}"`)).toBe(config);
		}
		if (config) {
			for (const text of ["Initial Size: 4", "Threshold pre warm: 2", "Batch size: 4"]) expect(html).toContain(text);
		}
		expect(html.includes('aria-label="Test suite"')).toBe(suites);
		expect(html.match(/aria-label="Test suite \d"/g) ?? []).toHaveLength(suites ? 4 : 0);
	});
});
