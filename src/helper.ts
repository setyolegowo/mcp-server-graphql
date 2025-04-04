import { CallToolResult } from '@modelcontextprotocol/sdk/types';

export async function safeMcpResponse(exec: Promise<CallToolResult>): Promise<CallToolResult> {
    try {
        return await exec;
    } catch (error) {
        console.error('Error executing tool:', error);
        return {
            isError: true,
            content: [
                {
                    type: 'text',
                    text: `Error executing tool: ${error}`,
                },
            ],
        };
    }
}