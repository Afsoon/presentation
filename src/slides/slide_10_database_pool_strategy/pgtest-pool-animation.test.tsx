import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { PgtestPoolAnimation } from "./pgtest-pool-animation";
import { type PgtestPoolStage } from "./pgtest-pool-animation.data";

describe("PgTest pool animation", () => {
	it.each<{ stage: PgtestPoolStage; requests: number; ready: number; dirty: number }>([
		{ stage: "initial", requests: 0, ready: 4, dirty: 0 },
		{ stage: "request", requests: 2, ready: 4, dirty: 0 },
		{ stage: "leasing", requests: 0, ready: 2, dirty: 2 },
		{ stage: "growPool", requests: 0, ready: 2, dirty: 2 },
		{ stage: "newPoolItems", requests: 0, ready: 4, dirty: 2 },
		{ stage: "threeRequests", requests: 3, ready: 4, dirty: 2 },
		{ stage: "leaseThree", requests: 0, ready: 1, dirty: 5 },
		{ stage: "secondBatchReady", requests: 0, ready: 3, dirty: 5 },
	])("renders the inbox and pool for $stage", ({ stage, requests, ready, dirty }) => {
		const html = renderToStaticMarkup(<PgtestPoolAnimation stage={stage} />);
		expect(html.match(/aria-label="request \d+"/g) ?? []).toHaveLength(requests);
		expect(html.match(/aria-label="Database \d+: ready"/g) ?? []).toHaveLength(ready);
		expect(html.match(/aria-label="Database \d+: dirty, leased to request \d+"/g) ?? []).toHaveLength(dirty);
		expect(html.includes("Creating a batch of 2 databases")).toBe(stage === "growPool" || stage === "leaseThree");
		if (requests === 0) expect(html).toContain("Empty");
	});
});
