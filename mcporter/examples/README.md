# MCPorter Examples

This directory contains example scripts demonstrating how to use MCPorter.

## Examples

### basic-usage.ts

Demonstrates the fundamental MCPorter operations:
- Creating a runtime
- Using server proxies
- Calling tools
- Handling different result formats

**Run it:**
```bash
npx tsx examples/basic-usage.ts
```

### composable-workflow.ts

Shows how to build higher-level functions that compose multiple MCP calls:
- Creating reusable functions
- Chaining tool calls
- Error handling
- Batch processing

**Run it:**
```bash
npx tsx examples/composable-workflow.ts
```

### figma-mcp-usage.ts

Demonstrates how to use Figma MCP via MCPorter:
- Joining a WebSocket channel (required)
- Reading design information (document info, selection)
- Creating design elements (frames, text, rectangles)
- Working with selections and node details

**Prerequisites:**
1. Start WebSocket server: `cd "Figma MCP" && bun socket`
2. Open Figma and run the Cursor MCP Plugin
3. Have a Figma document open

**Run it:**
```bash
npx tsx examples/figma-mcp-usage.ts
```

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up configuration:
   - Copy `config/mcporter.json` and configure your MCP servers
   - Set required environment variables (e.g., `CONTEXT7_API_KEY`)

3. Install tsx (for running TypeScript):
   ```bash
   npm install -D tsx
   ```

## Environment Variables

Some examples require environment variables:

```bash
export CONTEXT7_API_KEY="your-api-key-here"
```

## Notes

- All examples use the `createRuntime` pattern which should be closed when done
- Server proxies provide better ergonomics than direct tool calls
- Error handling is important for production use

