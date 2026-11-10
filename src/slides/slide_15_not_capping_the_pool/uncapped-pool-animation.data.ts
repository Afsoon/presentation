export type UncappedPoolFrame = {
	tick: number;
	nextId: number;
	total: number;
	leased: number;
	ready: number;
	requests: string[];
	creating: boolean;
	hidden: number;
	databases: { id: number; leased: boolean }[];
	cleaned: number[];
	lastCleaned: number[];
};

export function createUncappedPoolFrame(): UncappedPoolFrame {
	return {
		tick: 0,
		nextId: 5,
		total: 4,
		leased: 0,
		ready: 4,
		requests: ["request-1", "request-2", "request-3", "request-4"],
		creating: false,
		hidden: 0,
		cleaned: [],
		lastCleaned: [],
		databases: Array.from({ length: 4 }, (_, index) => ({ id: index + 1, leased: false })),
	};
}

export function advanceUncappedPoolFrame(
	previous: UncappedPoolFrame,
	[cleanupRoll, countRoll, selectionRoll]: readonly [number, number, number],
): UncappedPoolFrame {
	const tick = previous.tick + 1;
	const phase = tick % 3;
	let databases = [...previous.databases];
	let { total, leased, nextId } = previous;
	const cleaned: number[] = [];
	if (phase === 1) {
		leased += previous.ready;
		databases = databases.map((database) => ({ ...database, leased: true }));
	} else if (phase === 2) {
		databases.push(...Array.from({ length: 4 }, (_, index) => ({ id: nextId + index, leased: false })));
		nextId += 4;
		total += 4;
	} else if (cleanupRoll < 0.65) {
		const eligible = databases.filter((database) => database.leased);
		const count = Math.min(eligible.length, 1 + Math.floor(countRoll * 3));
		const start = Math.floor(selectionRoll * eligible.length);
		for (let index = 0; index < count; index++) cleaned.push(eligible[(start + index) % eligible.length].id);
		databases = databases.filter((database) => !cleaned.includes(database.id));
		total -= cleaned.length;
		leased -= cleaned.length;
	}
	// Keep the running simulation bounded even when the presentation stays open.
	databases = databases.slice(-16);
	return {
		tick,
		nextId,
		total,
		leased,
		ready: total - leased,
		requests:
			phase === 0 ? Array.from({ length: 4 }, (_, index) => `request-${Math.floor(tick / 3) * 4 + index + 1}`) : [],
		creating: phase === 1,
		hidden: total - databases.length,
		databases,
		cleaned,
		lastCleaned: cleaned.length > 0 ? cleaned : previous.lastCleaned,
	};
}
