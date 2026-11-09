export const description =
	"The manager had many responsibilities, including I/O. This added two more states to track. Extracting I/O and splitting the work resulted in:";

export const changes = [
	"Each worker has its own resource management policy.",
	"Each worker has its own PostgreSQL client, with no shared connection pool.",
	"Database creation was converted from sequential creation to a batch operation.",
];
