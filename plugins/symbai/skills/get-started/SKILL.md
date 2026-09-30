---
name: get-started
description: Connect an existing Symbai employee account and identify the company, available locations and access for this plugin.
---

# Connect to Symbai

This plugin uses the remote `symbai` MCP server. Sign-in asks for the company's Symbai address, then authenticates the employee on that company's own site. The company administrator must have enabled AI access for the employee. Credentials belong in that sign-in flow, never in the conversation.

After connecting, call `verifica_conexiune`, then `list_brands` and `list_locations` to identify the available business context. Reuse that identity until the connection changes. If several locations match the request, ask which one unless the user clearly wants a comparison or company total.

The public plugin consults sales, products, orders and recorded stock. Tool availability also depends on the employee's permissions. A missing operation does not by itself mean the connection is broken. Describe the actual authorization error and direct the user to their Symbai administrator when access is missing.

For requests to change records, send messages or process payments, explain the available read-only scope. Do not switch to a generic executor, SQL, a different company or a separate plugin to bypass that scope. Do not install Symbai Connect as a prerequisite for this remote connection.

Respond in the user's language. For Romanian users, use normal Romanian business terms and preserve the exact identifiers and values returned by tools.
