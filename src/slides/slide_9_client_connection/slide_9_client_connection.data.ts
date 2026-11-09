export const integresql = {
	title: "IntegreSQL",
	content: "The client is responsible for obtaining the connection string for an isolated database.",
	problem: "Extra roundtrips and cumbersome setup.",
};

export const pgtest = {
	title: "PgTest",
	// TODO: Change We move from a REST API to be a Postgres Proxy in front our postgres.
	content: "The PostgreSQL client needs to send the lease ID as part of the database name.",
	problem: "We rely on the user to generate unique IDs.",
};

export const connectionCode = {
	integresql: `async function createTestDatabase() {
  const ctx = inject("integresql");
  const client = new IntegreSQLClient({ url: ctx.url });

  const { id, database } =
    await client.api.getTestDatabase(ctx.templateHash);

  const url = client.databaseConfigToConnectionUrl({
    ...database.config,
    host: ctx.host,
    port: ctx.port,
  });
  const { db, pool } = createDb(url);

  return {
    db,
    pool,
    url,
    async release() {
      await pool.end();
      //await client.api.recreateTestDatabase(ctx.templateHash, id);
    },
  };
}`,
	pgtest: `function createTestDatabase() {
  const id = randomUUID();
  const url = \`postgres://metered:metered@localhost/metered/\${id}\`;
  const { db, pool } = createDb(url);

  return {
    db,
    pool,
    url,
    async release() {
      await pool.end();
    },
  };
}`,
	language: "typescript",
	filename: "connection.ts",
};
