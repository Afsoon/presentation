import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { reasonsMachine } from "@/slides/slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.machine";
import { createSlideStore } from "@/stores/slide-store";
import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { createSpeakerPresentation, readSpeakerMessage } from "./speaker-messages";

describe("speaker messages", () => {
	it("transfers nested current and upcoming states without live actors or functions", () => {
		const slides = createSlideStore();
		slides.goToSlide("reasons-for-building-pgtest");
		const controls = createSubslideControlsStore();
		const actor = createActor(reasonsMachine, { id: "reasons-for-building-pgtest" }).start();
		controls.registerActor(actor);
		actor.send({ type: "NEXT" });
		const state = structuredClone(createSpeakerPresentation(slides.getSnapshot(), true, 7, controls));
		const restored = createActor(reasonsMachine, {
			snapshot: state.current.snapshot as ReturnType<typeof actor.getPersistedSnapshot>,
		}).start();
		const upcoming = createActor(reasonsMachine, {
			snapshot: state.upcoming?.snapshot as ReturnType<typeof actor.getPersistedSnapshot>,
		}).start();
		expect(restored.getSnapshot().value).toEqual({ strategies: "resetting" });
		expect(upcoming.getSnapshot().value).toEqual({ strategies: "mutations" });
		expect(actor.getSnapshot().value).toEqual({ strategies: "resetting" });
		expect(state.dark).toBe(true);
		expect(state.available.up).toBe(true);
		expect(state.revision).toBe(7);
		actor.stop();
		restored.stop();
		upcoming.stop();
	});

	const peer = {} as Window;
	const origin = "https://presentation.test";
	const event = (data: unknown, source = peer, eventOrigin = origin) =>
		({ data, source, origin: eventOrigin }) as MessageEvent;
	it("accepts commands only from the paired window and origin", () => {
		const command = { channel: "presentation-speaker", type: "navigate", direction: "down" };
		expect(readSpeakerMessage(event(command), peer, origin)).toEqual({ type: "navigate", direction: "down" });
		expect(readSpeakerMessage(event(command, {} as Window), peer, origin)).toBeNull();
		expect(readSpeakerMessage(event(command, peer, "https://unrelated.test"), peer, origin)).toBeNull();
		expect(readSpeakerMessage(event(command), null, origin)).toBeNull();
	});
	it("rejects malformed commands, timer values, and presentation data", () => {
		for (const data of [
			null,
			{ type: "ready" },
			{ channel: "presentation-speaker", type: "navigate", direction: "diagonal" },
			{ channel: "presentation-speaker", type: "timer", timer: { started: null, accumulated: -1 } },
			{ channel: "presentation-speaker", type: "state", presentation: {} },
		]) {
			expect(readSpeakerMessage(event(data), peer, origin)).toBeNull();
		}
	});
	it("transfers timer pause state for reopening without sending clock ticks", () => {
		const timer = { started: null, accumulated: 12345 };
		expect(readSpeakerMessage(event({ channel: "presentation-speaker", type: "timer", timer }), peer, origin)).toEqual({
			type: "timer",
			timer,
		});
		expect(readSpeakerMessage(event({ channel: "presentation-speaker", type: "init", timer }), peer, origin)).toEqual({
			type: "init",
			timer,
		});
	});
});
