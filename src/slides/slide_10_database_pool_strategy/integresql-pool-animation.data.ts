const database1Ready = { id: "database-1", label: "DB 1", status: "ready", requestId: null } as const;
const database1Dirty = { id: "database-1", label: "DB 1", status: "dirty", requestId: "request-1" } as const;
const database2Ready = { id: "database-2", label: "DB 2", status: "ready", requestId: null } as const;
const database2Dirty = { id: "database-2", label: "DB 2", status: "dirty", requestId: "request-2" } as const;
const database3Ready = { id: "database-3", label: "DB 3", status: "ready", requestId: null } as const;
const database3Dirty = { id: "database-3", label: "DB 3", status: "dirty", requestId: "request-3" } as const;
const database4Dirty = { id: "database-4", label: "DB 4", status: "dirty", requestId: "request-4" } as const;

export const integresqlPoolFrames = {
	initial: {
		requests: [],
		pool: [database1Ready, database2Ready],
		description: "Two databases are ready. The inbox is empty.",
	},
	request: {
		requests: ["request-1", "request-2"],
		pool: [database1Ready, database2Ready],
		description: "Two requests arrive in the inbox.",
	},
	leasing: {
		requests: [],
		pool: [database1Dirty, database2Dirty],
		description: "Both requests are leased a database. Both databases are now dirty.",
	},
	newRequest: {
		requests: ["request-3"],
		pool: [database1Dirty, database2Dirty],
		description: "A new request arrives with no ready database available.",
	},
	newPoolItemReady: {
		requests: ["request-3"],
		pool: [database1Dirty, database2Dirty, database3Ready],
		description: "A third database is created and is ready to lease.",
	},
	leaseNewDatabase: {
		requests: [],
		pool: [database1Dirty, database2Dirty, database3Dirty],
		description: "The waiting request leases the new database, which is now dirty.",
	},
	twoNewRequests: {
		requests: ["request-4", "request-5"],
		pool: [database1Dirty, database2Dirty, database3Dirty],
		description: "Two more requests arrive in the inbox.",
	},
	processedOneWaiting: {
		requests: ["request-5"],
		pool: [database1Dirty, database2Dirty, database3Dirty, database4Dirty],
		description: "One request leases a fourth database. The pool is full and one request is still waiting.",
	},
} as const;

export type IntegresqlPoolStage = keyof typeof integresqlPoolFrames;
