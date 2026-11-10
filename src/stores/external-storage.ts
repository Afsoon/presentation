export type ExternalStorage<T> = {
	getSnapshot: () => T;
	getServerSnapshot: () => T;
	subscribe: (listener: () => void) => () => void;
};

/** Own resources while observed; React only subscribes to the cached snapshot. */
export function createExternalStorage<T>(initial: T, connect?: () => void | (() => void)) {
	let snapshot = initial;
	let disconnect: void | (() => void);
	const listeners = new Set<() => void>();
	return {
		getSnapshot: () => snapshot,
		getServerSnapshot: () => initial,
		setSnapshot: (next: T) => {
			if (Object.is(snapshot, next)) return;
			snapshot = next;
			listeners.forEach((listener) => listener());
		},
		subscribe: (listener: () => void) => {
			listeners.add(listener);
			if (listeners.size === 1) disconnect = connect?.();
			return () => {
				if (!listeners.delete(listener) || listeners.size > 0) return;
				disconnect?.();
				disconnect = undefined;
			};
		},
	};
}
