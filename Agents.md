# Agents Workspace Documentation

This workspace contains AI-powered agents for design automation and web browser testing. This document provides comprehensive documentation for all agents available in this repository, enabling effective cloud-based collaboration and agent workflows.

## Table of Contents

- [Overview](#overview)
- [Figma MCP Agent](#figma-mcp-agent)
  - [Quick Start](#quick-start)
  - [Key Features](#key-features)
  - [Setup Instructions](#setup-instructions)
  - [Common Use Cases](#common-use-cases)
  - [Cloud Agent Integration](#cloud-agent-integration)
- [Magnitude Web Browser Agent](#magnitude-web-browser-agent)
  - [Quick Start](#quick-start-1)
  - [Key Features](#key-features-1)
  - [Configuration](#configuration)
  - [Cloud Agent Integration](#cloud-agent-integration-1)
- [MCPorter CLI Tool](#mcporter-cli-tool)
  - [Quick Start](#quick-start-2)
  - [Key Features](#key-features-2)
  - [CLI Usage](#cli-usage)
  - [TypeScript API](#typescript-api-1)
  - [Cloud Agent Integration](#cloud-agent-integration-2)
- [Workspace Setup](#workspace-setup)
- [Quick Reference](#quick-reference)
- [Best Practices](#best-practices)

---

## Overview

This workspace is designed as a collaborative environment for AI agents working on design automation and web testing tasks. The repository is hosted on GitHub and optimized for cloud-based agent workflows.

**Repository**: [https://github.com/willbnu/Code-Projects](https://github.com/willbnu/Code-Projects)

### Available Agents

1. **Figma MCP Agent** - Real-time design automation and Figma integration
2. **Magnitude Web Browser Agent** - AI-powered browser testing and automation
3. **MCPorter CLI Tool** - TypeScript runtime and CLI for MCP server interactions

---

## Figma MCP Agent

The Figma MCP (Model Context Protocol) agent enables Cursor AI to communicate with Figma for reading designs and modifying them programmatically. It provides 40+ tools for comprehensive design automation through a WebSocket-based real-time connection.

### Quick Start

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Run setup** (installs MCP in Cursor's active project):
   ```bash
   cd "Figma MCP"
   bun setup
   ```

3. **Start the WebSocket server**:
   ```bash
   bun socket
   ```

4. **Install Figma Plugin**:
   - From [Figma Community](https://www.figma.com/community/plugin/1485687494525374295/cursor-talk-to-figma-mcp-plugin)
   - Or install locally from `src/cursor_mcp_plugin/manifest.json`

### Key Features

- **40+ Tools** for design automation
- **Real-time WebSocket Communication** (ws://localhost:3055)
- **Batch Operations** for efficient bulk modifications
- **Auto-Layout Support** with full control
- **Component Management** with override propagation
- **Prototype & Annotation Tools** for design documentation
- **Text Content Management** with intelligent chunking
- **Visual Design Operations** (colors, shapes, layouts, exports)

#### Tool Categories

- **Reading & Querying** (5 tools): Document info, selection, node details
- **Creation** (4 tools): Rectangles, frames, text, component instances
- **Modification** (6 tools): Colors, positioning, sizing, styling
- **Auto-Layout** (5 tools): Layout modes, padding, alignment, spacing
- **Text Operations** (3 tools): Scan, set, batch update text content
- **Annotations** (4 tools): Create, update, scan annotations
- **Prototyping** (3 tools): Reactions, connectors, connections
- **Components & Styles** (4 tools): Style management, component instances, overrides
- **Layout & Organization** (6 tools): Move, resize, delete, clone nodes
- **Advanced** (2 tools): Export, connection management

### Setup Instructions

#### MCP Server Configuration

Add to your Cursor MCP configuration (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bunx",
      "args": ["cursor-talk-to-figma-mcp@latest"]
    }
  }
}
```

#### For Local Development

```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bun",
      "args": ["/path-to-repo/Figma MCP/src/talk_to_figma_mcp/server.ts"]
    }
  }
}
```

#### WebSocket Server

The WebSocket server must be running for the agent to communicate with Figma:

```bash
# Start WebSocket server
bun socket

# Or run in background
nohup bun socket > websocket.log 2>&1 &
```

#### Figma Plugin Installation

1. In Figma, go to **Plugins > Development > New Plugin**
2. Choose **"Link existing plugin"**
3. Select `Figma MCP/src/cursor_mcp_plugin/manifest.json`
4. The plugin will be available in your Figma development plugins

### Common Use Cases

#### 1. Reading Design Information
```typescript
// Get document overview
const docInfo = await get_document_info();

// Get current selection
const selection = await get_selection();

// Read detailed design information
const design = await read_my_design();
```

#### 2. Bulk Text Replacement
```typescript
// Scan all text nodes
const textNodes = await scan_text_nodes({ 
  chunkSize: 100 
});

// Batch update text content
await set_multiple_text_contents({
  updates: [
    { nodeId: "123:456", content: "New Text 1" },
    { nodeId: "789:012", content: "New Text 2" }
  ]
});
```

#### 3. Creating Design Elements
```typescript
// Create a frame with auto-layout
await create_frame({
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

// Create text element
await create_text({
  x: 150,
  y: 150,
  content: "Hello, Figma!",
  fontSize: 24,
  fontFamily: "Inter"
});
```

#### 4. Component Instance Overrides
```typescript
// Extract overrides from source instance
const overrides = await get_instance_overrides({
  sourceInstanceId: "123:456"
});

// Apply to target instances
await set_instance_overrides({
  targetInstanceIds: ["789:012", "345:678"],
  overrides: overrides
});
```

#### 5. Design Annotations
```typescript
// Create annotation with markdown
await set_annotation({
  nodeId: "123:456",
  content: "## Important Note\n\nThis component needs review.",
  category: "INFO"
});

// Batch create annotations
await set_multiple_annotations({
  annotations: [
    { nodeId: "123:456", content: "Note 1", category: "INFO" },
    { nodeId: "789:012", content: "Note 2", category: "WARNING" }
  ]
});
```

### Cloud Agent Integration

The Figma MCP agent is designed for cloud-based workflows:

- **WebSocket Server**: Runs on `localhost:3055` (configurable for cloud environments)
- **MCP Protocol**: Uses standard Model Context Protocol for agent communication
- **Stateless Operations**: All operations are stateless and can be executed by any agent instance
- **Error Handling**: Comprehensive error handling for cloud reliability

**For Cloud Deployment**:
- Ensure WebSocket server is accessible (configure hostname/port)
- MCP server can run via `bunx cursor-talk-to-figma-mcp@latest` or local build
- Figma plugin connects to WebSocket server via channel joining

---

## Magnitude Web Browser Agent

Magnitude is an AI-powered web browser testing and automation agent that uses natural language commands to interact with web pages. It provides a simple, declarative API for browser automation tasks.

### Quick Start

1. **Install dependencies**:
   ```bash
   cd Magnitude
   npm install
   # or
   yarn install
   ```

2. **Create a test file**:
   ```typescript
   import { test } from 'magnitude-test';

   test('my test', { url: 'https://example.com' }, async (agent) => {
     await agent.act('click the login button');
     await agent.check('should see the login form');
   });
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

### Key Features

- **Natural Language Commands**: Use plain English to describe actions
- **AI-Powered Interaction**: Intelligent element detection and interaction
- **Declarative API**: Simple `agent.act()` and `agent.check()` pattern
- **Async/Await Support**: Modern JavaScript async patterns
- **Flexible Configuration**: Per-test and global configuration options

#### Core API Pattern

```typescript
test('test name', { url: 'target-url' }, async (agent) => {
  // Actions - things to do
  await agent.act('description of action', { data: 'optional data' });
  
  // Checks - assertions to verify
  await agent.check('what should be true');
});
```

### Configuration

Create a `magnitude.config.ts` file in your test directory:

```typescript
import { type MagnitudeConfig } from 'magnitude-test';

export default {
  url: "http://localhost:5173",
  // Additional configuration options
} satisfies MagnitudeConfig;
```

**Configuration Options**:
- `url`: Default URL for tests
- Additional options available in [Magnitude documentation](https://docs.magnitude.run)

### Example: Todo Application Testing

```typescript
import { test } from 'magnitude-test';

const sampleTodos = [
  "Take out the trash",
  "Pay AWS bill",
  "Build more test cases with Magnitude"
];

test('can add and complete todos', { url: 'https://magnitodo.com' }, async (agent) => {
  // Create todos
  await agent.act('create 3 todos', { data: sampleTodos.join(', ') });
  
  // Verify todos are created
  await agent.check('should see all 3 todos');
  
  // Mark todos as complete
  await agent.act('mark each todo complete');
  
  // Verify completion
  await agent.check('says 0 items left');
});
```

### Common Patterns

#### Form Filling
```typescript
await agent.act('fill in the email field', { data: 'user@example.com' });
await agent.act('fill in the password field', { data: 'securepassword' });
await agent.act('click the submit button');
```

#### Navigation
```typescript
await agent.act('navigate to the dashboard');
await agent.check('should see the dashboard header');
```

#### Data Extraction
```typescript
await agent.act('extract all product names');
await agent.check('should have extracted product data');
```

### Cloud Agent Integration

Magnitude is cloud-ready for agent workflows:

- **Stateless Execution**: Tests can run independently in any environment
- **Configuration-Based**: Easy to configure for different environments
- **Natural Language**: Agents can easily understand and generate test commands
- **Async Operations**: Non-blocking operations suitable for cloud execution

**For Cloud Deployment**:
- Configure base URL for target environment
- Ensure test dependencies are installed
- Run tests via CI/CD pipelines or agent execution environments

---

## MCPorter CLI Tool

MCPorter is a TypeScript runtime and CLI generator that makes it easy to interact with Model Context Protocol (MCP) servers. It provides both command-line tools and a TypeScript API for calling MCP tools, making it perfect for automation, agent workflows, and building custom CLIs.

### Quick Start

1. **Install MCPorter**:
   ```bash
   cd mcporter
   npm install
   ```

2. **Create configuration** (`config/mcporter.json`):
   ```json
   {
     "mcpServers": {
       "context7": {
         "baseUrl": "https://mcp.context7.com/mcp",
         "headers": {
           "Authorization": "$env:CONTEXT7_API_KEY"
         }
       }
     }
   }
   ```

3. **List available tools**:
   ```bash
   npx mcporter list
   ```

4. **Call a tool**:
   ```bash
   npx mcporter call context7 resolve-library-id react
   ```

### Key Features

- **Zero-config CLI** - Quick tool execution from command line
- **TypeScript API** - Composable runtime for complex workflows
- **Server Proxies** - Ergonomic API with automatic naming conversion
- **OAuth Support** - Automatic browser launches and token management
- **Config Import** - Automatically merges Cursor/Claude Code configs
- **Standalone CLIs** - Generate single-purpose command-line tools
- **Type Safety** - Full TypeScript support with validation

### CLI Usage

#### List Tools
```bash
# List all configured servers
npx mcporter list

# List tools for a specific server
npx mcporter list context7

# Show tool schemas
npx mcporter list context7 --schema
```

#### Call Tools
```bash
# Basic call
npx mcporter call context7 resolve-library-id '{"query": "react"}'

# With positional arguments
npx mcporter call linear searchIssues owner=ENG status=InProgress

# Tail log files
npx mcporter call signoz query --tail-log
```

#### OAuth Authentication
```bash
# Authenticate with a server
npx mcporter auth vercel

# Reset credentials
npx mcporter auth vercel --reset
```

#### Generate Standalone CLIs
```bash
# Generate a CLI for a server
npx mcporter generate-cli \
  --command https://mcp.context7.com/mcp \
  --compile

# Use the generated CLI
./context7 list-tools
./context7 resolve-library-id react
```

### TypeScript API

#### Basic Usage
```typescript
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const context7 = createServerProxy(runtime, "context7");

// Call tools with camelCase method names
const result = await context7.resolveLibraryId("react");

// Access results
console.log(result.text());      // Plain text
console.log(result.markdown());  // Markdown content
console.log(result.json());      // Parsed JSON

await runtime.close();
```

#### Composable Workflows
```typescript
async function getLibraryDocs(libraryName: string) {
  const runtime = await createRuntime({ configPath: "./config/mcporter.json" });
  const context7 = createServerProxy(runtime, "context7");
  
  // Resolve library ID
  const resolved = await context7.resolveLibraryId(libraryName);
  const libraryId = extractLibraryId(resolved);
  
  // Fetch documentation
  const docs = await context7.getLibraryDocs(libraryId);
  
  await runtime.close();
  return docs.markdown();
}
```

### Configuration

MCPorter reads from `config/mcporter.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "baseUrl": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "$env:API_KEY"
      }
    },
    "stdio-server": {
      "command": "bash",
      "args": ["npx", "-y", "some-mcp-server@latest"]
    }
  },
  "imports": ["cursor", "claude-code"]
}
```

MCPorter automatically imports configurations from:
- Cursor (`~/.cursor/mcp.json`)
- Claude Code
- Claude Desktop
- Codex

### Cloud Agent Integration

MCPorter is designed for cloud-based agent workflows:

- **Connection Pooling**: Runtime caches connections for efficiency
- **Retry Logic**: Automatic retries for transient failures
- **OAuth Token Caching**: Tokens stored in `~/.mcporter/<server>/`
- **Stateless Operations**: All operations are stateless
- **Type Safety**: Full TypeScript support for agent code generation

**For Cloud Deployment**:
- Configure MCP servers in `config/mcporter.json`
- Use environment variables for API keys
- Generate standalone CLIs for frequently used servers
- Use runtime API for complex workflows

### Documentation

For comprehensive documentation, see:
- **[MCPORTER_GUIDE.md](./mcporter/MCPORTER_GUIDE.md)** - Complete usage guide
- **[Examples](./mcporter/examples/)** - TypeScript usage examples
- **[Configuration](./mcporter/config/mcporter.json)** - Example configuration

---

## Workspace Setup

### Git Repository

- **Repository**: [https://github.com/willbnu/Code-Projects](https://github.com/willbnu/Code-Projects)
- **Branch**: `main`
- **Status**: Active and ready for cloud collaboration

### Project Structure

```
Code Projects/
├── Figma MCP/          # Figma MCP agent
│   ├── src/
│   │   ├── talk_to_figma_mcp/    # MCP server
│   │   ├── cursor_mcp_plugin/    # Figma plugin
│   │   └── socket.ts             # WebSocket server
│   └── readme.md
├── Magnitude/          # Magnitude browser agent
│   └── tests/
│       └── magnitude/
│           ├── example.mag.ts
│           └── magnitude.config.ts
├── mcporter/           # MCPorter CLI tool
│   ├── config/
│   │   └── mcporter.json         # MCP server configuration
│   ├── examples/
│   │   ├── basic-usage.ts       # Basic usage example
│   │   └── composable-workflow.ts  # Workflow example
│   └── MCPORTER_GUIDE.md        # Complete usage guide
└── Agents.md          # This file
```

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/willbnu/Code-Projects.git
   cd Code-Projects
   ```

2. **Setup Figma MCP**:
   ```bash
   cd "Figma MCP"
   bun setup
   ```

3. **Setup Magnitude**:
   ```bash
   cd Magnitude
   npm install
   ```

4. **Setup MCPorter**:
   ```bash
   cd mcporter
   npm install
   ```

5. **Verify installations**:
   - Figma MCP: Run `bun socket` and verify WebSocket server starts
   - Magnitude: Run `npm test` and verify tests execute
   - MCPorter: Run `npx mcporter list` and verify CLI works

### Environment Requirements

- **Node.js** (for Magnitude and MCPorter)
- **Bun** (for Figma MCP)
- **Figma Desktop** (optional, for Figma plugin)
- **Git** (for version control)

---

## Quick Reference

### Figma MCP Commands

```bash
# Start WebSocket server
bun socket

# Setup MCP in Cursor
bun setup

# Build project
bun run build

# Development mode
bun run dev
```

### Magnitude Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run specific test
npx magnitude-test path/to/test.mag.ts
```

### MCPorter Commands

```bash
# List available tools
npx mcporter list

# Call a tool
npx mcporter call <server> <tool> [args]

# Authenticate (OAuth)
npx mcporter auth <server>

# Generate standalone CLI
npx mcporter generate-cli --command <url> --compile

# Run examples
npx tsx examples/basic-usage.ts
npx tsx examples/composable-workflow.ts
```

### Common Workflows

#### Starting a Figma Automation Session
1. Start WebSocket server: `bun socket`
2. Open Figma and run the Cursor MCP plugin
3. Join channel: Use `join_channel` tool
4. Begin design operations

#### Running Browser Tests
1. Configure `magnitude.config.ts` with target URL
2. Write test using `agent.act()` and `agent.check()`
3. Run test: `npm test`

#### Using MCPorter
1. Configure `config/mcporter.json` with MCP servers
2. List available tools: `npx mcporter list`
3. Call tools: `npx mcporter call <server> <tool>`
4. Use TypeScript API for complex workflows

---

## Best Practices

### Figma MCP

1. **Always join a channel** before sending commands
2. **Get document overview** using `get_document_info` first
3. **Check current selection** with `get_selection` before modifications
4. **Use batch operations** when modifying multiple elements
5. **Verify changes** using `get_node_info` after operations
6. **Handle errors appropriately** - all commands can throw exceptions
7. **For large designs**: Use chunking parameters in `scan_text_nodes`
8. **For text operations**: Consider structural relationships and verify changes

### Magnitude

1. **Use descriptive test names** that clearly indicate what is being tested
2. **Break complex tests** into smaller, focused tests
3. **Use data parameter** for dynamic content in actions
4. **Verify state** after each significant action
5. **Keep tests independent** - each test should be able to run standalone
6. **Use configuration** for environment-specific settings

### MCPorter

1. **Always close runtime** when done to free resources
2. **Use server proxies** for better ergonomics than direct tool calls
3. **Handle errors gracefully** with try-catch blocks
4. **Use TypeScript types** for result parsing and validation
5. **Cache runtime** for multiple calls instead of creating new ones
6. **Generate CLIs** for frequently used MCP servers
7. **Use environment variables** for API keys and sensitive data
8. **Check authentication status** before making tool calls

### Cloud Agent Collaboration

1. **Document agent capabilities** clearly in this file
2. **Keep configurations** environment-agnostic when possible
3. **Use version control** for all agent configurations
4. **Test agent workflows** before deploying to cloud
5. **Monitor agent execution** logs and errors
6. **Share agent knowledge** through documentation updates

---

## Additional Resources

### Figma MCP
- [Full Documentation](./Figma%20MCP/readme.md)
- [Tools Reference Index](./Figma%20MCP/TOOLS_REFERENCE_INDEX.md)
- [Usage Examples](./Figma%20MCP/TOOLS_USAGE_EXAMPLES.md)
- [GitHub Repository](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp)

### Magnitude
- [Official Documentation](https://docs.magnitude.run)
- [Core Concepts](https://docs.magnitude.run/core-concepts/building-test-cases)
- [Configuration Guide](https://docs.magnitude.run/customizing/configuration)

### MCPorter
- [GitHub Repository](https://github.com/steipete/mcporter)
- [MCPORTER_GUIDE.md](./mcporter/MCPORTER_GUIDE.md) - Complete usage guide
- [Examples](./mcporter/examples/) - TypeScript usage examples

---

## Support & Contribution

For issues, questions, or contributions related to:

- **Figma MCP**: Check the [Figma MCP repository](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp)
- **Magnitude**: Check the [Magnitude documentation](https://docs.magnitude.run)

---

**Last Updated**: November 2024  
**Workspace Version**: 1.0.0

