import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { z } from "zod";

const ConfigSchema = z.object({
	name: z.string().default("mcp-server-graphql"),
	allowMutations: z.boolean().default(false),
	endpoint: z.string().url().min(1, "endpoint is required"),
	headers: z.record(z.string()).default({}),
});

export type Config = z.infer<typeof ConfigSchema>;

export function parseArgs(): Config {
	const argv = yargs(hideBin(process.argv))
		.option("name", {
			type: "string",
			description: "Name of the MCP server",
			default: "mcp-server-graphql",
		})
		.option("endpoint", {
			type: "string",
			description: "GraphQL endpoint URL",
		})
		.option("enable-mutations", {
			type: "boolean",
			description: "Enable mutations",
			default: false,
		})
		.option("headers", {
			type: "string",
			description: "JSON string of headers to send with requests",
			default: "{}",
		})
		.help()
		.parseSync();

	try {
		let headers: Record<string, string> = {};
		if (typeof argv.headers === "string" && argv.headers !== "{}") {
			headers = JSON.parse(argv.headers);
		} else {
			headers = JSON.parse(process.env.MCP_SERVER_GRAPHQL_HEADERS	|| "{}");
		}

		return ConfigSchema.parse({
			name: argv.name,
			endpoint: argv.endpoint || process.env.MCP_SERVER_GRAPHQL_ENDPOINT,
			allowMutations: argv["enable-mutations"],
			headers,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error("Invalid configuration:");
			console.error(
				error.errors
					.map((e) => `  ${e.path.join(".")}: ${e.message}`)
					.join("\n"),
			);
		} else {
			console.error("Error parsing arguments:", error);
		}
		process.exit(1);
	}
}