import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { IntegresqlPoolAnimation } from "./integresql-pool-animation";
import { integresqlPoolFrames, type IntegresqlPoolStage } from "./integresql-pool-animation.data";

describe("IntegreSQL pool animation", () => {
	it.each<{ stage: IntegresqlPoolStage; requests: number; ready: number; dirty: number }>([
		{ stage: "initial", requests: 0, ready: 2, dirty: 0 },
		{ stage: "request", requests: 2, ready: 2, dirty: 0 },
		{ stage: "leasing", requests: 0, ready: 0, dirty: 2 },
		{ stage: "newRequest", requests: 1, ready: 0, dirty: 2 },
		{ stage: "newPoolItemReady", requests: 1, ready: 1, dirty: 2 },
		{ stage: "leaseNewDatabase", requests: 0, ready: 0, dirty: 3 },
		{ stage: "twoNewRequests", requests: 2, ready: 0, dirty: 3 },
		{ stage: "processedOneWaiting", requests: 1, ready: 0, dirty: 4 },
	])("renders the inbox and pool for $stage", ({ stage, requests, ready, dirty }) => {
		const html = renderToStaticMarkup(<IntegresqlPoolAnimation stage={stage} />);
		expect(html.match(/aria-label="request \d+"/g) ?? []).toHaveLength(requests);
		expect(html.match(/aria-label="Database \d+: ready"/g) ?? []).toHaveLength(ready);
		expect(html.match(/aria-label="Database \d+: dirty, leased to request \d+"/g) ?? []).toHaveLength(dirty);
		if (requests === 0) expect(html).toContain("Empty");
	});
	it("identifies inbox requests and retains their database assignments after leasing", () => {
		const waiting = renderToStaticMarkup(<IntegresqlPoolAnimation stage="request" />);
		expect(waiting).toContain("Request 1");
		expect(waiting).toContain("Request 2");
		const leased = renderToStaticMarkup(<IntegresqlPoolAnimation stage="leasing" />);
		expect(leased).toContain('aria-label="Database 1: dirty, leased to request 1"');
		expect(leased).toContain('aria-label="Database 2: dirty, leased to request 2"');
		const final = renderToStaticMarkup(<IntegresqlPoolAnimation stage="processedOneWaiting" />);
		for (let id = 1; id <= 4; id++) {
			expect(final).toContain(`aria-label="Database ${id}: dirty, leased to request ${id}"`);
			expect(final).toContain(`Req ${id}`);
		}
		expect(final).toContain("Request 5");
	});

	it("never assigns a waiting request or assigns a request to multiple databases", () => {
		for (const frame of Object.values(integresqlPoolFrames)) {
			const assigned = frame.pool.flatMap((database) => (database.requestId ? [database.requestId] : []));
			expect(new Set(assigned).size).toBe(assigned.length);
			for (const id of assigned) expect(frame.requests).not.toContain(id);
			for (const database of frame.pool) {
				if (database.status === "ready") expect(database.requestId).toBeNull();
				else expect(database.requestId).not.toBeNull();
			}
		}
	});
});
