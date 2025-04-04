import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function createGraphQLMcpServer(
	config: GraphQLConfig
) {
	const server = new McpServer({
		name: "graphql-mcp-server",
		version: "0.0.1",
	});

	return server;
}

async function main() {
	const transport = new StdioServerTransport();
	const server = await createGraphQLMcpServer(config);

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