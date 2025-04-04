import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { Config } from "../config";
import { safeMcpResponse } from "../helper";

async function query(conf: Config, query: string, variables: any): Promise<any> {
    const response = await fetch(conf.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...conf.headers,
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const responseJson = await response.json();
    return responseJson.data;
}

export function queryGraphql(
    conf: Config,
    server: McpServer,
) {
    server.tool(
        'query-graphql',
        "Execute a GraphQL query or mutation",
        {
            query: z.string(),
            variables: z.record(z.any()).refine((val) => {
                // Check if the value is a valid JSON object
                try {
                    JSON.parse(JSON.stringify(val));
                    return true;
                } catch (e) {
                    return false;
                }
            }, {
                message: "Variables must be a valid JSON object",
            }).optional(),
        },
        ({query: q, variables: v}) => {
            return safeMcpResponse(query(conf, q, v))
        }
    )
}