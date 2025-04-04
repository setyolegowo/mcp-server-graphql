import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Config, parseArgs } from "./config";
import { introspectGraphQLSchema } from "./tools/introspect";
import { queryGraphql } from "./tools/query";

export async function createGraphQLMcpServer(
	conf: Config
) {
	const server = new McpServer({
		name: conf.name,
		version: "0.0.1",
	});

	introspectGraphQLSchema(conf, server);
	queryGraphql(conf, server);

	return server;
}

async function main() {
	const transport = new StdioServerTransport();
	const validatedConfig = parseArgs();
	const server = await createGraphQLMcpServer(validatedConfig);

	await server.connect(transport);

	process.on("SIGINT", async () => {
		await server.close();
		process.exit(0);
	});
}

main().catch((error) => {
	console.error(`Fatal error in main(): ${error}`);
	process.exit(1);
});