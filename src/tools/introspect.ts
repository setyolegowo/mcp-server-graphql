import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { Config } from "../config";
import { safeMcpResponse } from "../helper";

async function introspect(conf: Config): Promise<CallToolResult> {
    const response = await fetch(conf.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...conf.headers,
        },
        body: JSON.stringify({
            query: getIntrospectionQuery(),
        }),
    });

    if (!response.ok) {
		throw new Error(`GraphQL request failed: ${response.statusText}`);
	}

	const responseJson = await response.json();
	// Transform to a schema object
	const schema = buildClientSchema(responseJson.data);

	// Print the schema SDL
	return {
        content: [
            {
                type: "text",
                text: printSchema(schema),
            },
        ],
        isError: false,
    }
}

export function introspectGraphQLSchema(
    conf: Config,
    server: McpServer,
) {
    server.tool(
        'introspect',
        "List all available GraphQL queries and mutations",
        {},
        () => {
            return safeMcpResponse(introspect(conf))
        }
    )
}
