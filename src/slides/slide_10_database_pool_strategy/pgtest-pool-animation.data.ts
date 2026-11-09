const ready1 = { id: "database-1", label: "DB 1", status: "ready", requestId: null } as const;
const dirty1 = { id: "database-1", label: "DB 1", status: "dirty", requestId: "request-1" } as const;
const ready2 = { id: "database-2", label: "DB 2", status: "ready", requestId: null } as const;
const dirty2 = { id: "database-2", label: "DB 2", status: "dirty", requestId: "request-2" } as const;
const ready3 = { id: "database-3", label: "DB 3", status: "ready", requestId: null } as const;
const dirty3 = { id: "database-3", label: "DB 3", status: "dirty", requestId: "request-3" } as const;
const ready4 = { id: "database-4", label: "DB 4", status: "ready", requestId: null } as const;
const dirty4 = { id: "database-4", label: "DB 4", status: "dirty", requestId: "request-4" } as const;
const ready5 = { id: "database-5", label: "DB 5", status: "ready", requestId: null } as const;
const dirty5 = { id: "database-5", label: "DB 5", status: "dirty", requestId: "request-5" } as const;
const ready6 = { id: "database-6", label: "DB 6", status: "ready", requestId: null } as const;
const ready7 = { id: "database-7", label: "DB 7", status: "ready", requestId: null } as const;
const ready8 = { id: "database-8", label: "DB 8", status: "ready", requestId: null } as const;
export const pgtestPoolFrames = {
	initial: {
		requests: [],
		pool: [ready1, ready2, ready3, ready4],
		backgroundJob: false,
		description: "0 requests waiting, 0 dirty databases, 4 ready databases.",
	},
	request: {
		requests: ["request-1", "request-2"],
		pool: [ready1, ready2, ready3, ready4],
		backgroundJob: false,
		description: "2 requests waiting, 0 dirty databases, 4 ready databases.",
	},
	leasing: {
		requests: [],
		pool: [dirty1, dirty2, ready3, ready4],
		backgroundJob: false,
		description: "0 requests waiting, 2 dirty databases, 2 ready databases.",
	},
	growPool: {
		requests: [],
		pool: [dirty1, dirty2, ready3, ready4],
		backgroundJob: true,
		description: "0 requests waiting, 2 dirty databases, 2 ready databases.",
	},
	newPoolItems: {
		requests: [],
		pool: [dirty1, dirty2, ready3, ready4, ready5, ready6],
		backgroundJob: false,
		description: "0 requests waiting, 2 dirty databases, 4 ready databases.",
	},
	threeRequests: {
		requests: ["request-3", "request-4", "request-5"],
		pool: [dirty1, dirty2, ready3, ready4, ready5, ready6],
		backgroundJob: false,
		description: "3 requests waiting, 2 dirty databases, 4 ready databases.",
	},
	leaseThree: {
		requests: [],
		pool: [dirty1, dirty2, dirty3, dirty4, dirty5, ready6],
		backgroundJob: true,
		description: "0 requests waiting, 5 dirty databases, 1 ready databases.",
	},
	secondBatchReady: {
		requests: [],
		pool: [dirty1, dirty2, dirty3, dirty4, dirty5, ready6, ready7, ready8],
		backgroundJob: false,
		description: "0 requests waiting, 5 dirty databases, 3 ready databases.",
	},
} as const;
export type PgtestPoolStage = keyof typeof pgtestPoolFrames;
