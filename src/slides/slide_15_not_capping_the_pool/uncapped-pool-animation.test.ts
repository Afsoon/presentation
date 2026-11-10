import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { uncappedPoolMachine } from "./slide_15_not_capping_the_pool.machine";
import { advanceUncappedPoolFrame, createUncappedPoolFrame } from "./uncapped-pool-animation.data";

describe("uncapped pool subslide", () => {
	it("navigates from the existing description to the animation and back", () => {
		const actor = createActor(uncappedPoolMachine, { id: "not-capping-the-pool" }).start();
		const store = createSubslideControlsStore();
		const unregister = store.registerActor(actor);
		expect(actor.getSnapshot().value).toBe("description");
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		store.getActor(actor.id)?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("animation");
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		store.getActor(actor.id)?.send({ type: "PREVIOUS" });
		expect(actor.getSnapshot().value).toBe("description");
		unregister();
		expect(store.getActor(actor.id)).toBeUndefined();
		actor.stop();
	});

	it("leases a burst, then replenishes the ready pool in a batch", () => {
		const incoming = createUncappedPoolFrame();
		const leasing = advanceUncappedPoolFrame(incoming, [0.9, 0, 0]);
		const replenished = advanceUncappedPoolFrame(leasing, [0.9, 0, 0]);
		expect(incoming.requests).toHaveLength(4);
		expect(incoming.ready).toBe(4);
		expect(leasing).toMatchObject({ requests: [], leased: 4, ready: 0, creating: true });
		expect(replenished).toMatchObject({ total: 8, leased: 4, ready: 4, creating: false });
		expect(advanceUncappedPoolFrame(replenished, [0.9, 0, 0]).requests).toEqual([
			"request-5",
			"request-6",
			"request-7",
			"request-8",
		]);
	});

	it("keeps growing beyond the visible window without allocating an unbounded list", () => {
		let frame = createUncappedPoolFrame();
		for (let tick = 0; tick < 300; tick++) {
			frame = advanceUncappedPoolFrame(frame, [tick % 2 ? 0.2 : 0.9, 0.8, 0.5]);
			expect(frame.ready + frame.leased).toBe(frame.total);
			expect(frame.leased).toBeGreaterThanOrEqual(0);
			expect(frame.ready).toBeGreaterThanOrEqual(0);
			expect(frame.databases.length).toBeLessThanOrEqual(16);
			expect(frame.hidden + frame.databases.length).toBe(frame.total);
			expect(frame.databases.filter((database) => !database.leased)).toHaveLength(frame.ready);
			expect(new Set(frame.databases.map((database) => database.id)).size).toBe(frame.databases.length);
		}
		expect(frame.total).toBeGreaterThan(100);
	});

	it("randomly cleans leased databases while preserving ready databases and unique IDs", () => {
		let frame = createUncappedPoolFrame();
		frame = advanceUncappedPoolFrame(frame, [0, 0, 0]);
		frame = advanceUncappedPoolFrame(frame, [0, 0, 0]);
		const cleaned = advanceUncappedPoolFrame(frame, [0.2, 0.8, 0.75]);
		expect(cleaned.cleaned).toEqual([4, 1, 2]);
		expect(cleaned).toMatchObject({ total: 5, leased: 1, ready: 4 });
		expect(cleaned.databases.map((database) => database.id)).toEqual([3, 5, 6, 7, 8]);
		expect(advanceUncappedPoolFrame(frame, [0.9, 0.8, 0.75]).cleaned).toEqual([]);
		expect(advanceUncappedPoolFrame(frame, [0.2, 0, 0]).cleaned).toEqual([1]);
		const leasing = advanceUncappedPoolFrame(cleaned, [0, 0, 0]);
		const replenished = advanceUncappedPoolFrame(leasing, [0, 0, 0]);
		expect(replenished.cleaned).toEqual([]);
		expect(replenished.lastCleaned).toEqual([4, 1, 2]);
		expect(replenished.databases.slice(-4).map((database) => database.id)).toEqual([9, 10, 11, 12]);
		expect(frame.total).toBe(8);
	});
});
