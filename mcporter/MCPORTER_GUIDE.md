# MCPorter CLI Guide

**MCPorter** is a TypeScript runtime and CLI tool that makes it easy to interact with Model Context Protocol (MCP) servers. It provides both a command-line interface and a TypeScript API for calling MCP tools, making it perfect for automation, agent workflows, and building custom CLIs.

## Table of Contents

- [What is MCPorter?](#what-is-mcporter)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [TypeScript API](#typescript-api)
- [Configuration](#configuration)
- [Generating Standalone CLIs](#generating-standalone-clis)
- [OAuth Authentication](#oauth-authentication)
- [Composable Workflows](#composable-workflows)
- [Integration Examples](#integration-examples)
- [Best Practices](#best-practices)

---

## What is MCPorter?

MCPorter is a toolkit that allows you to:

- **Call MCP servers from the command line** - No need to write code for simple operations
- **Use TypeScript APIs** - Build composable workflows with full type safety
- **Generate standalone CLIs** - Package MCP servers as single-purpose command-line tools
- **Handle OAuth flows** - Automatic browser launches and token management
- **Import existing configs** - Automatically merge Cursor, Claude Code, Claude Desktop configs

**Key Benefits:**
- Zero-config CLI for quick operations
- Composable runtime API for complex workflows
- Automatic connection pooling and retry logic
- Token persistence for OAuth flows
- Type-safe tool calls with validation

---

## Installation

### Option 1: Global Installation (Recommended for CLI)

```bash
npm install -g mcporter
# or
pnpm add -g mcporter
# or
yarn global add mcporter
```

### Option 2: Local Installation (For Projects)

```bash
cd /path/to/your/project
npm install mcporter
# or
pnpm add mcporter
```

### Option 3: Use via npx (No Installation)

```bash
npx mcporter list
npx mcporter call <server> <tool>
```

---

## Quick Start

### 1. Create Configuration File

Create `config/mcporter.json` in your project:

```json
{
  "mcpServers": {
    "context7": {
      "description": "Context7 documentation MCP",
      "baseUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "Authorization": "$env:CONTEXT7_API_KEY"
      }
    }
  }
}
```

### 2. List Available Tools

```bash
npx mcporter list
```

This will show all configured servers and their available tools.

### 3. Call a Tool

```bash
npx mcporter call context7 resolve-library-id react
```

### 4. Use in TypeScript

```typescript
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const context7 = createServerProxy(runtime, "context7");
const result = await context7.resolveLibraryId("react");

console.log(result.text());
await runtime.close();
```

---

## CLI Usage

### Basic Commands

#### List Available Tools

```bash
# List all configured servers
npx mcporter list

# List tools for a specific server
npx mcporter list context7

# Show tool schemas
npx mcporter list context7 --schema

# Set custom timeout (default 30s)
MCPORTER_LIST_TIMEOUT=120000 npx mcporter list vercel
```

#### Call a Tool

```bash
# Basic call
npx mcporter call <server> <tool-name>

# With arguments (JSON)
npx mcporter call context7 resolve-library-id '{"query": "react"}'

# With positional arguments
npx mcporter call linear searchIssues owner=ENG status=InProgress

# Tail log files after execution
npx mcporter call signoz query --tail-log

# Custom config path
npx mcporter call context7 resolve-library-id --config ./my-config.json

# Custom working directory (for stdio commands)
npx mcporter call chrome-devtools getTabs --root /path/to/project
```

#### OAuth Authentication

```bash
# Authenticate with a server
npx mcporter auth vercel

# Reset and re-authenticate
npx mcporter auth vercel --reset

# Pre-authorize without listing tools
npx mcporter auth vercel
```

### Common Flags

| Flag | Description |
|------|-------------|
| `--config <path>` | Path to `mcporter.json` (defaults to `./config/mcporter.json`) |
| `--root <path>` | Working directory for stdio commands |
| `--tail-log` | Print last 20 lines of referenced log files after tool completes |
| `--schema` | Show tool signatures and schemas when listing |

### Example Workflows

```bash
# 1. Check what tools are available
npx mcporter list

# 2. Authenticate if needed (OAuth servers)
npx mcporter auth vercel

# 3. Call a tool with arguments
npx mcporter call context7 get-library-docs '{"libraryId": "react"}'

# 4. Generate a standalone CLI for a server
npx mcporter generate-cli --command https://mcp.context7.com/mcp --compile
```

---

## TypeScript API

### Basic Runtime Setup

```typescript
import { createRuntime } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

// List tools
const tools = await runtime.listTools("context7");

// Call a tool
const result = await runtime.callTool("context7", "resolve-library-id", {
  args: { query: "react" }
});

// Always close when done
await runtime.close();
```

### Using Server Proxies (Recommended)

Server proxies provide a more ergonomic API with automatic naming conversion:

```typescript
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const context7 = createServerProxy(runtime, "context7");

// CamelCase method names automatically map to tool names
// resolveLibraryId → resolve-library-id
const search = await context7.resolveLibraryId("react");
const docs = await context7.getLibraryDocs("react");

// Access results
console.log(search.text());      // Plain text
console.log(docs.markdown());    // Markdown content
console.log(docs.json());        // Parsed JSON
console.log(docs.raw);           // Raw response

await runtime.close();
```

### Single Tool Call (No Runtime)

For one-off calls without managing a runtime:

```typescript
import { callOnce } from "mcporter";

const result = await callOnce({
  server: "firecrawl",
  toolName: "crawl",
  args: { url: "https://anthropic.com" },
  configPath: "./config/mcporter.json"
});

console.log(result.text());
```

### Advanced: Positional Arguments

Some tools accept multiple arguments. The proxy handles this:

```typescript
const firecrawl = createServerProxy(runtime, "firecrawl");

// Multi-argument tool
await firecrawl.firecrawlScrape(
  "https://example.com/docs",        // 1st argument
  ["markdown", "html"],              // 2nd argument
  { waitFor: 5000 },                 // Optional args
  { tailLog: true }                  // Call options
);
```

### Result Handling

All tool calls return a `CallResult` object with helpful methods:

```typescript
const result = await context7.resolveLibraryId("react");

// Text extraction
const text = result.text();

// Markdown extraction
const markdown = result.markdown();

// JSON parsing with type safety
interface LibraryInfo {
  candidates?: Array<{ context7CompatibleLibraryID?: string }>;
}
const data = result.json<LibraryInfo>();

// Raw response
const raw = result.raw;
```

---

## Configuration

### Configuration File Structure

Create `config/mcporter.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "description": "Optional description",
      "baseUrl": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "$env:API_KEY"
      },
      "env": {
        "CUSTOM_VAR": "value"
      },
      "auth": "oauth",
      "tokenCacheDir": "~/.mcporter/custom-server"
    }
  },
  "imports": ["cursor", "claude-code", "claude-desktop", "codex"]
}
```

### Server Types

#### HTTP/SSE Servers

```json
{
  "context7": {
    "baseUrl": "https://mcp.context7.com/mcp",
    "headers": {
      "Authorization": "$env:CONTEXT7_API_KEY"
    }
  }
}
```

#### Stdio Servers

```json
{
  "chrome-devtools": {
    "command": "bash",
    "args": [
      "scripts/mcp_stdio_wrapper.sh",
      "env",
      "npx",
      "-y",
      "chrome-devtools-mcp@latest"
    ]
  }
}
```

#### OAuth Servers

```json
{
  "vercel": {
    "baseUrl": "https://mcp.vercel.com/mcp",
    "auth": "oauth",
    "clientName": "MyApp"
  }
}
```

### Configuration Features

- **Environment Variables**: Use `$env:VAR_NAME` in headers
- **Bearer Tokens**: Use `bearerToken` or `bearerTokenEnv` for automatic Authorization headers
- **Config Imports**: Automatically merge configs from Cursor, Claude Code, etc.
- **Token Caching**: OAuth tokens stored in `~/.mcporter/<server>/`

### Importing from Existing Configs

MCPorter can automatically import MCP server configurations from:

- Cursor (`~/.cursor/mcp.json`)
- Claude Code
- Claude Desktop
- Codex

```json
{
  "imports": ["cursor", "claude-code"]
}
```

Or disable imports:

```json
{
  "imports": []
}
```

---

## Generating Standalone CLIs

Generate a single-purpose CLI for any MCP server:

### Basic Generation

```bash
npx mcporter generate-cli \
  --command https://mcp.context7.com/mcp \
  --compile
```

This creates:
- `context7.ts` - TypeScript source
- `context7` - Compiled binary (if `--compile` is used)

### Usage

```bash
chmod +x context7
./context7 list-tools
./context7 resolve-library-id react
```

### Advanced Options

```bash
# Custom name
npx mcporter generate-cli \
  --command https://mcp.context7.com/mcp \
  --name my-context7 \
  --compile

# With description
npx mcporter generate-cli \
  --command https://mcp.context7.com/mcp \
  --description "Context7 documentation CLI" \
  --compile

# With headers/env vars
npx mcporter generate-cli \
  --server '{
    "baseUrl": "https://mcp.example.com/mcp",
    "headers": {"Authorization": "$env:API_KEY"}
  }' \
  --compile

# Bundle without compilation
npx mcporter generate-cli \
  --command https://mcp.context7.com/mcp \
  --bundle context7-bundle

# Custom timeout
npx mcporter generate-cli \
  --command https://mcp.context7.com/mcp \
  --timeout 60000 \
  --compile

# Minified bundle
npx mcporter generate-cli \
  --command https://mcp.context7.com/mcp \
  --bundle \
  --minify
```

### Runtime Options

- Default: Uses Bun if available, falls back to Node
- Explicit: `--runtime bun` or `--runtime node`

---

## OAuth Authentication

### How It Works

When a server uses OAuth authentication:

1. MCPorter launches a temporary callback server on `127.0.0.1`
2. Opens authorization URL in your default browser
3. Exchanges the code for tokens
4. Stores tokens in `~/.mcporter/<server>/`

### Usage

```bash
# Authenticate
npx mcporter auth vercel

# Reset credentials (delete cached tokens)
npx mcporter auth vercel --reset

# The next call will trigger fresh login
npx mcporter auth vercel
```

### Token Storage

Tokens are stored in:
```
~/.mcporter/<server-name>/
```

To manually reset:
```bash
rm -rf ~/.mcporter/vercel
```

---

## Composable Workflows

Build complex workflows by composing multiple MCP calls:

### Example: Fetch Library Documentation

```typescript
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const context7 = createServerProxy(runtime, "context7");

async function getLibraryDocs(libraryName: string) {
  // Step 1: Resolve library ID
  const resolved = await context7.resolveLibraryId(libraryName);
  
  // Step 2: Extract library ID from response
  const libraryId = resolved
    .json<{ candidates?: Array<{ context7CompatibleLibraryID?: string }> }>()
    ?.candidates?.find(c => c?.context7CompatibleLibraryID)
    ?.context7CompatibleLibraryID;
  
  if (!libraryId) {
    throw new Error(`Library "${libraryName}" not found`);
  }
  
  // Step 3: Fetch documentation
  const docs = await context7.getLibraryDocs(libraryId);
  
  return docs;
}

// Use the workflow
const reactDocs = await getLibraryDocs("react");
console.log(reactDocs.markdown());

await runtime.close();
```

### Example: Batch Processing

```typescript
const libraries = ["react", "vue", "angular"];

const docs = await Promise.all(
  libraries.map(lib => getLibraryDocs(lib))
);

docs.forEach((doc, i) => {
  console.log(`\n=== ${libraries[i]} ===\n`);
  console.log(doc.markdown());
});
```

### Example: Chaining Multiple Servers

```typescript
const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const context7 = createServerProxy(runtime, "context7");
const firecrawl = createServerProxy(runtime, "firecrawl");

// Get library docs
const docs = await context7.getLibraryDocs("react");

// Extract URLs from docs
const urls = extractUrls(docs.markdown());

// Scrape each URL
const scraped = await Promise.all(
  urls.map(url => firecrawl.firecrawlScrape(url, ["markdown"]))
);

await runtime.close();
```

---

## Integration Examples

### Integrating with Figma MCP

Figma MCP requires a WebSocket server to communicate with Figma. Here's how to set it up:

#### Prerequisites

1. **Start the WebSocket server**:
   ```bash
   cd "Figma MCP"
   bun socket
   ```
   This runs on `ws://localhost:3055`

2. **Open Figma and run the plugin**:
   - In Figma, go to Plugins > Development > Cursor MCP Plugin
   - Run the plugin to connect it to the WebSocket server
   - Make sure you have a Figma document open

3. **Configure in mcporter.json**:
   ```json
   {
     "mcpServers": {
       "figma": {
         "description": "Figma MCP - Design automation and Figma integration",
         "command": "bunx",
         "args": ["cursor-talk-to-figma-mcp@latest"]
       }
     }
   }
   ```

#### TypeScript API Usage

```typescript
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const figma = createServerProxy(runtime, "figma");

try {
  // Step 1: Join channel (REQUIRED before other operations)
  await figma.joinChannel({ channelId: "my-channel" });
  
  // Step 2: Get document info
  const docInfo = await figma.getDocumentInfo();
  console.log(docInfo.json());
  
  // Step 3: Get current selection
  const selection = await figma.getSelection();
  console.log(selection.json());
  
  // Step 4: Create a frame
  await figma.createFrame({
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    name: "Container",
    layoutMode: "VERTICAL",
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20
  });
  
  // Step 5: Create text
  await figma.createText({
    x: 150,
    y: 150,
    content: "Hello from MCPorter!",
    fontSize: 24,
    fontFamily: "Inter",
    name: "MCPorter Text"
  });
  
  // Step 6: Read design details
  const design = await figma.readMyDesign();
  console.log(design.text());
  
} finally {
  await runtime.close();
}
```

#### CLI Usage

```bash
# List available Figma tools
npx mcporter list figma

# Join a channel (required first)
npx mcporter call figma join_channel '{"channelId": "my-channel"}'

# Get document info
npx mcporter call figma get_document_info

# Get current selection
npx mcporter call figma get_selection

# Create a rectangle
npx mcporter call figma create_rectangle '{
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 150,
  "name": "My Rectangle"
}'

# Create a frame with auto-layout
npx mcporter call figma create_frame '{
  "x": 100,
  "y": 100,
  "width": 400,
  "height": 300,
  "name": "Container",
  "layoutMode": "VERTICAL"
}'
```

#### Important Notes

- **WebSocket Server Required**: The Figma MCP server communicates with Figma via WebSocket, so the server must be running (`bun socket` in the Figma MCP directory)
- **Join Channel First**: Always call `join_channel` before other operations - this connects the MCP server to the Figma plugin via WebSocket
- **Figma Plugin Active**: The Figma plugin must be running and connected to the WebSocket server
- **40+ Tools Available**: Figma MCP provides 40+ tools for design automation including:
  - Reading & Querying (document info, selection, node details)
  - Creation (rectangles, frames, text, components)
  - Modification (colors, positioning, sizing)
  - Auto-Layout (layout modes, padding, alignment)
  - Text Operations (scan, set, batch update)
  - Annotations (create, update, scan)
  - Prototyping (reactions, connectors)
  - Components & Styles (instances, overrides)

See [Figma MCP Documentation](../Figma%20MCP/readme.md) for complete tool reference.

### Using with Existing MCP Servers

MCPorter works with any MCP-compatible server. Just add it to your config:

```json
{
  "mcpServers": {
    "my-custom-server": {
      "baseUrl": "http://localhost:3000/mcp",
      "headers": {
        "X-API-Key": "$env:MY_API_KEY"
      }
    }
  }
}
```

---

## Best Practices

### 1. Always Close Runtime

```typescript
const runtime = await createRuntime({ ... });
try {
  // Your code
} finally {
  await runtime.close();
}
```

### 2. Use Server Proxies

Prefer `createServerProxy` over direct `callTool` for better ergonomics:

```typescript
// ✅ Good
const context7 = createServerProxy(runtime, "context7");
await context7.resolveLibraryId("react");

// ❌ Less ergonomic
await runtime.callTool("context7", "resolve-library-id", {
  args: { query: "react" }
});
```

### 3. Handle Errors Gracefully

```typescript
try {
  const result = await context7.resolveLibraryId("nonexistent");
} catch (error) {
  if (error.message.includes("not found")) {
    console.error("Library not found");
  } else {
    throw error;
  }
}
```

### 4. Use TypeScript Types

```typescript
interface LibraryInfo {
  candidates?: Array<{
    context7CompatibleLibraryID?: string;
    name?: string;
  }>;
}

const result = await context7.resolveLibraryId("react");
const data = result.json<LibraryInfo>();
```

### 5. Cache Runtime for Multiple Calls

```typescript
// ✅ Good - reuse runtime
const runtime = await createRuntime({ ... });
const server = createServerProxy(runtime, "context7");

await server.resolveLibraryId("react");
await server.getLibraryDocs("react");
await runtime.close();

// ❌ Avoid - creating new runtime each time
await callOnce({ server: "context7", toolName: "resolve-library-id", ... });
await callOnce({ server: "context7", toolName: "get-library-docs", ... });
```

### 6. Use Environment Variables

```json
{
  "headers": {
    "Authorization": "$env:API_KEY"
  }
}
```

### 7. Generate CLIs for Frequent Use

If you frequently use a specific MCP server, generate a standalone CLI:

```bash
npx mcporter generate-cli --command https://mcp.example.com/mcp --compile
```

### 8. Check Authentication Status

```bash
# List tools will show auth status
npx mcporter list vercel
# Output: "auth required — run 'mcporter auth vercel'"
```

---

## Troubleshooting

### "ENOENT: no such file or directory, open 'config/mcporter.json'"

Create the config file:
```bash
mkdir -p config
touch config/mcporter.json
```

### "auth required — run 'mcporter auth <name>'"

Authenticate with the server:
```bash
npx mcporter auth <server-name>
```

### OAuth Flow Not Working

1. Check if browser opens automatically
2. Try `--reset` flag to clear cached tokens
3. Manually delete `~/.mcporter/<server>/` directory

### Timeout Issues

Increase timeout:
```bash
MCPORTER_LIST_TIMEOUT=120000 npx mcporter list <server>
```

---

## Additional Resources

- **GitHub Repository**: [https://github.com/steipete/mcporter](https://github.com/steipete/mcporter)
- **MCP Protocol**: [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- **Example Projects**: See `examples/` directory in the mcporter repository

---

## Summary

MCPorter provides:

✅ **CLI Interface** - Call MCP tools from command line  
✅ **TypeScript API** - Build composable workflows  
✅ **Standalone CLIs** - Generate single-purpose tools  
✅ **OAuth Support** - Automatic authentication flows  
✅ **Config Import** - Use existing Cursor/Claude configs  
✅ **Type Safety** - Full TypeScript support  
✅ **Error Handling** - Robust retry and connection pooling  

Start with `npx mcporter list` to see what's available, then build your workflows!

---

**Last Updated**: November 2024  
**MCPorter Version**: 0.1.0+

