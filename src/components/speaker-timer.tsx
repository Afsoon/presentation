import { useState } from "react";

import { useExternalStorage } from "@/hooks/use-external-storage";
import type { TimerState } from "@/lib/speaker-messages";
import { formatElapsed } from "@/stores/speaker-state";
import { createSpeakerTimerStorage } from "@/stores/speaker-timer-storage";

export function SpeakerTimer({
	initialState,
	onChange,
}: {
	initialState: TimerState;
	onChange: (timer: TimerState) => void;
}) {
	const [storage] = useState(() => createSpeakerTimerStorage(initialState, onChange));
	const { elapsed, paused } = useExternalStorage(storage);

	return (
		<div className="flex items-center gap-3">
			<output aria-label="Elapsed time" className="font-mono text-3xl">
				{formatElapsed(elapsed)}
			</output>
			<button
				className="rounded-md border border-neutral-400 bg-white px-3 py-2 font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-500 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
				onClick={storage.toggle}
			>
				{paused ? "Resume" : "Pause"}
			</button>
			<button
				className="rounded-md border border-neutral-400 bg-white px-3 py-2 font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-500 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
				onClick={storage.reset}
			>
				Reset
			</button>
		</div>
	);
}
