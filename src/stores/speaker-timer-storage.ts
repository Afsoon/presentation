import type { TimerState } from "@/lib/speaker-messages";

import { createExternalStorage } from "./external-storage";
import { elapsedTime } from "./speaker-state";

export function createSpeakerTimerStorage(initial: TimerState, onChange: (timer: TimerState) => void) {
	let timer = initial;
	let active = false;
	let interval: ReturnType<typeof setInterval> | undefined;
	const elapsed = () =>
		timer.started === null ? timer.accumulated : elapsedTime(timer.started, timer.accumulated, Date.now());
	const refresh = () => {
		const next = { paused: timer.started === null, elapsed: elapsed() };
		const previous = storage.getSnapshot();
		if (next.paused !== previous.paused || next.elapsed !== previous.elapsed) storage.setSnapshot(next);
	};
	const schedule = () => {
		clearInterval(interval);
		interval = active && timer.started !== null ? setInterval(refresh, 250) : undefined;
	};
	const storage = createExternalStorage({ paused: timer.started === null, elapsed: elapsed() }, () => {
		active = true;
		refresh();
		schedule();
		return () => {
			active = false;
			clearInterval(interval);
		};
	});
	const update = (next: TimerState) => {
		timer = next;
		refresh();
		schedule();
		onChange(timer);
	};
	return {
		...storage,
		toggle: () =>
			update(timer.started === null ? { ...timer, started: Date.now() } : { started: null, accumulated: elapsed() }),
		reset: () => update({ started: timer.started === null ? null : Date.now(), accumulated: 0 }),
	};
}
