# 🚀 Code Projects - AI Agents Workspace

> A comprehensive workspace for AI-powered agents enabling design automation, web browser testing, and MCP server interactions.

[![GitHub](https://img.shields.io/badge/GitHub-willbnu-blue?style=flat-square&logo=github)](https://github.com/willbnu/Code-Projects)
[![License](https://img.shields.io/badge/License-Apache%202.0-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Available Agents](#available-agents)
- [Quick Start](#quick-start)
- [Projects](#projects)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## 🎯 Overview

This workspace is designed as a collaborative environment for AI agents working on design automation, web testing, and MCP (Model Context Protocol) server interactions. All projects are optimized for cloud-based agent workflows and ready for production use.

**Repository**: [https://github.com/willbnu/Code-Projects](https://github.com/willbnu/Code-Projects)

### ✨ Features

- 🎨 **Design Automation** - Real-time Figma integration with 40+ tools
- 🌐 **Browser Testing** - AI-powered web automation with natural language
- 🔌 **MCP Integration** - TypeScript runtime and CLI for MCP servers
- ☁️ **Cloud Ready** - Optimized for cloud-based agent workflows
- 📚 **Well Documented** - Comprehensive guides and examples

---

## 🤖 Available Agents

### 1. 🎨 Figma MCP Agent

**Real-time design automation and Figma integration**

- **40+ Tools** for comprehensive design automation
- **WebSocket Communication** for real-time updates
- **Batch Operations** for efficient bulk modifications
- **Auto-Layout Support** with full control
- **Component Management** with override propagation

**Quick Start:**
```bash
cd "Figma MCP"
bun setup
bun socket
```

📖 [Full Documentation →](./Figma%20MCP/readme.md)

---

### 2. 🌐 Magnitude Web Browser Agent

**AI-powered browser testing and automation**

- **Natural Language Commands** - Use plain English to describe actions
- **Declarative API** - Simple `agent.act()` and `agent.check()` pattern
- **Intelligent Interaction** - AI-powered element detection
- **Flexible Configuration** - Per-test and global options

**Quick Start:**
```bash
cd Magnitude
npm install
npm test
```

📖 [Full Documentation →](https://docs.magnitude.run)

---

### 3. 🔌 MCPorter CLI Tool

**TypeScript runtime and CLI for MCP server interactions**

- **Zero-config CLI** - Quick tool execution from command line
- **TypeScript API** - Composable runtime for complex workflows
- **Server Proxies** - Ergonomic API with automatic naming
- **OAuth Support** - Automatic token management
- **Figma Integration** - Helper script for persistent connections

**Quick Start:**
```bash
cd mcporter
npm install
npx mcporter list
```

**Figma MCP Helper:**
```bash
bun scripts/figma-cli.ts get_document_info
```

📖 [Full Documentation →](./mcporter/MCPORTER_GUIDE.md)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20.11.0+) - For Magnitude and MCPorter
- **Bun** - For Figma MCP
- **Git** - For version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/willbnu/Code-Projects.git
   cd Code-Projects
   ```

2. **Setup Figma MCP:**
   ```bash
   cd "Figma MCP"
   bun setup
   ```

3. **Setup Magnitude:**
   ```bash
   cd Magnitude
   npm install
   ```

4. **Setup MCPorter:**
   ```bash
   cd mcporter
   npm install
   ```

### Verify Installations

```bash
# Figma MCP
cd "Figma MCP" && bun socket  # Should start WebSocket server

# Magnitude
cd Magnitude && npm test      # Should run tests

# MCPorter
cd mcporter && npx mcporter list  # Should list servers
```

---

## 📁 Projects

```
Code Projects/
├── 📁 Figma MCP/              # Figma MCP agent
│   ├── src/
│   │   ├── talk_to_figma_mcp/    # MCP server
│   │   ├── cursor_mcp_plugin/    # Figma plugin
│   │   └── socket.ts             # WebSocket server
│   ├── readme.md
│   └── TOOLS_REFERENCE_INDEX.md
│
├── 📁 Magnitude/              # Magnitude browser agent
│   ├── tests/
│   │   └── magnitude/
│   │       ├── example.mag.ts
│   │       └── magnitude.config.ts
│   └── package.json
│
├── 📁 mcporter/               # MCPorter CLI tool
│   ├── config/
│   │   └── mcporter.json         # MCP server configuration
│   ├── examples/
│   │   ├── basic-usage.ts
│   │   ├── composable-workflow.ts
│   │   └── figma-mcp-usage.ts
│   ├── scripts/
│   │   └── figma-cli.ts          # Figma MCP helper script
│   ├── MCPORTER_GUIDE.md
│   └── CHANGELOG.md
│
├── 📄 Agents.md               # Complete workspace documentation
└── 📄 README.md               # This file
```

---

## 📚 Documentation

### Comprehensive Guides

- **[Agents.md](./Agents.md)** - Complete workspace documentation with all agents
- **[Figma MCP Documentation](./Figma%20MCP/readme.md)** - Full Figma MCP guide
- **[MCPorter Guide](./mcporter/MCPORTER_GUIDE.md)** - Complete MCPorter usage guide

### Quick References

- **[Figma MCP Tools Index](./Figma%20MCP/TOOLS_REFERENCE_INDEX.md)** - All 40+ tools
- **[Figma MCP Usage Examples](./Figma%20MCP/TOOLS_USAGE_EXAMPLES.md)** - Practical examples
- **[MCPorter Examples](./mcporter/examples/)** - TypeScript usage examples

### Changelog

- **[MCPorter Changelog](./mcporter/CHANGELOG.md)** - Version history and updates

---

## 🎮 Usage Examples

### Figma MCP via Helper Script

```bash
# Use the helper script for persistent connections
cd mcporter

# Get document info
FIGMA_CHANNEL=your-channel bun scripts/figma-cli.ts get_document_info

# Get selection
FIGMA_CHANNEL=your-channel bun scripts/figma-cli.ts get_selection

# Create a rectangle
FIGMA_CHANNEL=your-channel bun scripts/figma-cli.ts create_rectangle \
  x=100 y=100 width=200 height=150 name="Test"
```

### Magnitude Browser Testing

```typescript
import { test } from 'magnitude-test';

test('can add and complete todos', { url: 'https://magnitodo.com' }, async (agent) => {
  await agent.act('create 3 todos', { data: 'Task 1, Task 2, Task 3' });
  await agent.check('should see all 3 todos');
  await agent.act('mark each todo complete');
  await agent.check('says 0 items left');
});
```

### MCPorter TypeScript API

```typescript
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime({
  configPath: "./config/mcporter.json"
});

const figma = createServerProxy(runtime, "TalkToFigma");
await figma.call("join_channel", { args: { channel: "my-channel" } });
const docInfo = await figma.call("get_document_info");
console.log(docInfo.json());

await runtime.close();
```

---

## 🔧 Configuration

### MCPorter Configuration

Edit `mcporter/config/mcporter.json`:

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

### Magnitude Configuration

Edit `Magnitude/tests/magnitude/magnitude.config.ts`:

```typescript
export default {
  url: "http://localhost:5173"
} satisfies MagnitudeConfig;
```

---

## 🌟 Key Features by Agent

| Feature | Figma MCP | Magnitude | MCPorter |
|---------|-----------|-----------|----------|
| **Tools Available** | 40+ | Natural Language | All MCP Tools |
| **Connection Type** | WebSocket | HTTP/SSE | stdio/HTTP |
| **Setup Complexity** | Medium | Low | Low |
| **Best For** | Design Automation | Browser Testing | MCP Integration |
| **Cloud Ready** | ✅ Yes | ✅ Yes | ✅ Yes |

---

## 🛠️ Development

### Project Structure

- **Figma MCP**: TypeScript, Bun runtime
- **Magnitude**: TypeScript/JavaScript, Node.js
- **MCPorter**: TypeScript, Node.js/Bun

### Environment Requirements

- **Node.js** v20.11.0+ (for Magnitude and MCPorter)
- **Bun** (for Figma MCP)
- **Git** (for version control)

---

## 📝 Best Practices

### Figma MCP
- Always join a channel before sending commands
- Use batch operations when modifying multiple elements
- Verify changes using `get_node_info` after operations

### Magnitude
- Use descriptive test names
- Break complex tests into smaller, focused tests
- Keep tests independent

### MCPorter
- Always close runtime when done
- Use server proxies for better ergonomics
- Generate CLIs for frequently used servers

---

## 🤝 Contributing

This workspace is actively maintained. For issues, questions, or contributions:

- **Figma MCP**: Check the [Figma MCP repository](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp)
- **Magnitude**: Check the [Magnitude documentation](https://docs.magnitude.run)
- **MCPorter**: Check the [MCPorter repository](https://github.com/steipete/mcporter)

---

## 📄 License

See individual project licenses:
- **Figma MCP**: MIT License
- **Magnitude**: Check Magnitude documentation
- **MCPorter**: MIT License

---

## 🔗 Resources

### Official Documentation
- [Figma MCP Tools Reference](./Figma%20MCP/TOOLS_REFERENCE_INDEX.md)
- [MCPorter Complete Guide](./mcporter/MCPORTER_GUIDE.md)
- [Magnitude Documentation](https://docs.magnitude.run)

### External Links
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Figma MCP GitHub](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp)
- [MCPorter GitHub](https://github.com/steipete/mcporter)

---

## 📊 Status

| Component | Status | Version |
|-----------|--------|---------|
| Figma MCP | ✅ Active | 0.3.5 |
| Magnitude | ✅ Active | 0.3.12 |
| MCPorter | ✅ Active | 0.1.0 |

---

**Made with ❤️ for AI Agent Workflows**

*Last Updated: November 2024*

