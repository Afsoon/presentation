import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { reasonsMachine } from "@/slides/slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.machine";
import { clientConnectionMachine } from "@/slides/slide_9_client_connection/slide_9_client_connection.machine";

import { createSlideStore } from "./slide-store";
import { elapsedTime, formatElapsed, speakerNotes, upcomingStep } from "./speaker-state";
import { createSubslideControlsStore } from "./subslide-controls";

describe("speaker state", () => {
	it("previews the next nested subslide without advancing the live actor", () => {
		const slides = createSlideStore();
		slides.goToSlide("reasons-for-building-pgtest");
		const controls = createSubslideControlsStore();
		const actor = createActor(reasonsMachine, { id: "reasons-for-building-pgtest" }).start();
		controls.registerActor(actor);
		const before = actor.getSnapshot();
		const preview = upcomingStep(slides.getSnapshot(), controls);
		expect(preview?.snapshot?.value).toEqual({ strategies: "resetting" });
		expect(actor.getSnapshot()).toBe(before);
		actor.stop();
	});
	it("advances to the next slide at the last subslide and reports the deck end", () => {
		const slides = createSlideStore();
		slides.goToSlide("client-connection");
		const controls = createSubslideControlsStore();
		const actor = createActor(clientConnectionMachine, { id: "client-connection" }).start();
		controls.registerActor(actor);
		actor.send({ type: "NEXT" });
		actor.send({ type: "NEXT" });
		actor.send({ type: "NEXT" });
		expect(upcomingStep(slides.getSnapshot(), controls)?.slide.Id).toBe("database-pool-strategy");
		slides.goToSlide("next-steps");
		expect(upcomingStep(slides.getSnapshot(), controls)).toBeNull();
		actor.stop();
	});
	it("uses the remembered state of an inactive upcoming slide", () => {
		const slides = createSlideStore();
		slides.goToSlide("proof-of-concept-implementation");
		const controls = createSubslideControlsStore();
		const actor = createActor(clientConnectionMachine, { id: "client-connection" }).start();
		const unregister = controls.registerActor(actor);
		actor.send({ type: "NEXT" });
		unregister();
		expect(upcomingStep(slides.getSnapshot(), controls)?.snapshot?.value).toBe("integresql");
		actor.stop();
	});
	it("resolves nested notes, slide fallback, and missing notes", () => {
		const slide = {
			...createSlideStore().getSnapshot().currentSlide,
			notes: "Overview",
			subslideNotes: { "strategies.transactions": "Transaction notes" },
		};
		expect(speakerNotes(slide, { strategies: "transactions" })).toBe("Transaction notes");
		expect(speakerNotes(slide, "unknown")).toBe("Overview");
		expect(speakerNotes({ ...slide, notes: undefined }, undefined)).toBe("No speaker notes");
	});
	it("accounts for paused time and formats durations over an hour", () => {
		const paused = elapsedTime(1000, 0, 4000);
		expect(paused).toBe(3000);
		expect(elapsedTime(10000, paused, 12000)).toBe(5000);
		expect(formatElapsed(3661000)).toBe("01:01:01");
		expect(formatElapsed(0)).toBe("00:00:00");
	});
});
