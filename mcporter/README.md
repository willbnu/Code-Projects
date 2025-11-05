# MCPorter CLI Tool

MCPorter is a TypeScript runtime and CLI generator that makes it easy to interact with Model Context Protocol (MCP) servers. It provides both command-line tools and a TypeScript API for calling MCP tools.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure MCP servers** in `config/mcporter.json`

3. **List available tools**:
   ```bash
   npx mcporter list
   ```

4. **Call a tool**:
   ```bash
   npx mcporter call <server> <tool> [args]
   ```

## Documentation

- **[MCPORTER_GUIDE.md](./MCPORTER_GUIDE.md)** - Complete usage guide with examples
- **[Examples](./examples/)** - TypeScript usage examples
- **[Configuration](./config/mcporter.json)** - Example configuration file

## Key Features

- ✅ Zero-config CLI for quick operations
- ✅ TypeScript API for composable workflows
- ✅ Server proxies with automatic naming conversion
- ✅ OAuth support with automatic token management
- ✅ Config import from Cursor/Claude Code
- ✅ Generate standalone CLIs for any MCP server
- ✅ Full TypeScript type safety

## Examples

### Basic CLI Usage

```bash
# List all configured servers
npx mcporter list

# Call a tool
npx mcporter call context7 resolve-library-id react
```

### TypeScript API

```typescript
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const context7 = createServerProxy(runtime, "context7");
const result = await context7.call("resolve-library-id", {
  args: { query: "react" }
});

console.log(result.text());
await runtime.close();
```

### Figma MCP Helper Script

For Figma MCP, use the helper script that maintains persistent connections:

```bash
# Install dependencies
npm install -D tsx

# Run Figma commands
npx tsx scripts/figma-cli.ts get_document_info
npx tsx scripts/figma-cli.ts get_selection
bun scripts/figma-cli.ts create_rectangle x=100 y=100 width=200 height=150
```

See [examples/](./examples/) for more complete examples.

## Resources

- [GitHub Repository](https://github.com/steipete/mcporter)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Complete Guide](./MCPORTER_GUIDE.md)

---

**Part of the Code Projects workspace** - See [../Agents.md](../Agents.md) for workspace documentation.

