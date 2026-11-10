import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { navigatePresentation } from "./presentation-navigation";
import { createSpeakerWindowStorage } from "./speaker-window-storage";

vi.mock("./presentation-navigation", () => ({ navigatePresentation: vi.fn() }));

import { createExternalStorage } from "./external-storage";
import { createSpeakerConnectionStorage } from "./speaker-connection-storage";
import { createSpeakerTimerStorage } from "./speaker-timer-storage";

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe("external storage lifecycle", () => {
	it("connects once for multiple subscribers and cleans up after the last unsubscribe", () => {
		const stop = vi.fn();
		const start = vi.fn(() => stop);
		const initial = { value: 0 };
		const storage = createExternalStorage(initial, start);
		const first = vi.fn();
		const second = vi.fn();
		expect(start).not.toHaveBeenCalled();
		const unsubscribeFirst = storage.subscribe(first);
		const unsubscribeSecond = storage.subscribe(second);
		expect(start).toHaveBeenCalledTimes(1);
		storage.setSnapshot({ value: 1 });
		expect(first).toHaveBeenCalledOnce();
		expect(second).toHaveBeenCalledOnce();
		expect(storage.getServerSnapshot()).toBe(initial);
		storage.setSnapshot(storage.getSnapshot());
		expect(first).toHaveBeenCalledOnce();
		unsubscribeFirst();
		expect(stop).not.toHaveBeenCalled();
		unsubscribeSecond();
		unsubscribeSecond();
		expect(stop).toHaveBeenCalledTimes(1);
		const unsubscribeAgain = storage.subscribe(first);
		expect(start).toHaveBeenCalledTimes(2);
		unsubscribeAgain();
		expect(stop).toHaveBeenCalledTimes(2);
	});
});

describe("speaker connection storage", () => {
	it("handles messages and commands without React and removes listeners on unsubscribe", () => {
		vi.useFakeTimers();
		const opener = { closed: false, postMessage: vi.fn() };
		const host = Object.assign(new EventTarget(), {
			opener,
			location: { origin: "https://presentation.test" },
			setInterval,
			clearInterval,
		});
		const toggleTheme = vi.fn();
		vi.stubGlobal("window", host);
		vi.stubGlobal("document", { documentElement: { classList: { toggle: toggleTheme } } });
		const storage = createSpeakerConnectionStorage();
		const listener = vi.fn();
		const unsubscribe = storage.subscribe(listener);
		expect(opener.postMessage).toHaveBeenCalledWith(
			{ channel: "presentation-speaker", type: "ready" },
			host.location.origin,
		);
		const dispatch = (data: unknown) => {
			const event = new Event("message");
			Object.assign(event, { data, source: opener, origin: host.location.origin });
			host.dispatchEvent(event);
		};
		const timer = { started: null, accumulated: 2500 };
		dispatch({ channel: "presentation-speaker", type: "init", timer });
		const presentation = {
			current: { id: "title", name: "PgTest" },
			upcoming: null,
			notes: "Notes",
			available: { left: false, right: false, up: false, down: false },
			dark: true,
			revision: 1,
		};
		dispatch({ channel: "presentation-speaker", type: "state", presentation });
		expect(storage.getSnapshot()).toEqual({ initialTimer: timer, presentation, disconnected: false });
		expect(toggleTheme).toHaveBeenCalledWith("dark", true);
		storage.navigate("down");
		expect(opener.postMessage).toHaveBeenLastCalledWith(
			{ channel: "presentation-speaker", type: "navigate", direction: "down" },
			host.location.origin,
		);
		storage.saveTimer(timer);
		expect(opener.postMessage).toHaveBeenLastCalledWith(
			{ channel: "presentation-speaker", type: "timer", timer },
			host.location.origin,
		);
		opener.closed = true;
		vi.advanceTimersByTime(1000);
		expect(storage.getSnapshot().disconnected).toBe(true);
		const snapshot = storage.getSnapshot();
		vi.advanceTimersByTime(1000);
		expect(storage.getSnapshot()).toBe(snapshot);
		unsubscribe();
		expect(vi.getTimerCount()).toBe(0);
		dispatch({ channel: "presentation-speaker", type: "state", presentation: { ...presentation, revision: 2 } });
		expect(storage.getSnapshot()).toBe(snapshot);
	});
});

describe("speaker timer storage", () => {
	it("ticks only while subscribed and running, and reports only explicit timer changes", () => {
		vi.useFakeTimers();
		vi.setSystemTime(1000);
		const onChange = vi.fn();
		const storage = createSpeakerTimerStorage({ started: 1000, accumulated: 0 }, onChange);
		expect(vi.getTimerCount()).toBe(0);
		const unsubscribe = storage.subscribe(vi.fn());
		vi.advanceTimersByTime(1250);
		expect(storage.getSnapshot()).toEqual({ paused: false, elapsed: 1250 });
		expect(onChange).not.toHaveBeenCalled();
		storage.toggle();
		expect(vi.getTimerCount()).toBe(0);
		expect(onChange).toHaveBeenLastCalledWith({ started: null, accumulated: 1250 });
		vi.advanceTimersByTime(5000);
		expect(storage.getSnapshot().elapsed).toBe(1250);
		storage.toggle();
		vi.advanceTimersByTime(1000);
		expect(storage.getSnapshot().elapsed).toBe(2250);
		storage.reset();
		expect(storage.getSnapshot()).toEqual({ paused: false, elapsed: 0 });
		expect(onChange).toHaveBeenCalledTimes(3);
		unsubscribe();
		expect(vi.getTimerCount()).toBe(0);
	});
	it("preserves a restored paused timer and keeps it paused after reset", () => {
		vi.useFakeTimers();
		const storage = createSpeakerTimerStorage({ started: null, accumulated: 5000 }, vi.fn());
		const unsubscribe = storage.subscribe(vi.fn());
		expect(storage.getSnapshot()).toEqual({ paused: true, elapsed: 5000 });
		expect(vi.getTimerCount()).toBe(0);
		storage.reset();
		expect(storage.getSnapshot()).toEqual({ paused: true, elapsed: 0 });
		expect(vi.getTimerCount()).toBe(0);
		unsubscribe();
	});
});

describe("audience speaker storage", () => {
	it("opens the speaker, responds to ready, and routes messages without React", () => {
		const child = { closed: false, focus: vi.fn(), close: vi.fn(), postMessage: vi.fn() };
		const host = Object.assign(new EventTarget(), {
			open: vi.fn(() => child),
			location: { href: "https://presentation.test/", origin: "https://presentation.test" },
		});
		const disconnect = vi.fn();
		vi.stubGlobal("window", host);
		vi.stubGlobal("document", { documentElement: { classList: { contains: () => false } } });
		vi.stubGlobal(
			"MutationObserver",
			class {
				observe() {}
				disconnect = disconnect;
			},
		);
		const storage = createSpeakerWindowStorage();
		const unsubscribe = storage.subscribe(vi.fn());
		storage.open();
		storage.open();
		expect(host.open).toHaveBeenCalledTimes(1);
		expect(child.focus).toHaveBeenCalledOnce();
		const dispatch = (data: unknown) => {
			const event = new Event("message");
			Object.assign(event, { data, source: child, origin: host.location.origin });
			host.dispatchEvent(event);
		};
		dispatch({ channel: "presentation-speaker", type: "ready" });
		expect(child.postMessage).toHaveBeenCalledWith(expect.objectContaining({ type: "init" }), host.location.origin);
		expect(child.postMessage).toHaveBeenCalledWith(expect.objectContaining({ type: "state" }), host.location.origin);
		dispatch({ channel: "presentation-speaker", type: "navigate", direction: "right" });
		expect(navigatePresentation).toHaveBeenCalledWith("right");
		const timer = { started: null, accumulated: 7000 };
		dispatch({ channel: "presentation-speaker", type: "timer", timer });
		dispatch({ channel: "presentation-speaker", type: "ready" });
		expect(child.postMessage).toHaveBeenCalledWith(
			{ channel: "presentation-speaker", type: "init", timer },
			host.location.origin,
		);
		unsubscribe();
		expect(disconnect).toHaveBeenCalledOnce();
		expect(child.close).toHaveBeenCalledOnce();
		child.postMessage.mockClear();
		dispatch({ channel: "presentation-speaker", type: "ready" });
		expect(child.postMessage).not.toHaveBeenCalled();
	});
});
