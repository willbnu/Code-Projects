# Changelog

All notable changes to this mcporter workspace will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Figma MCP CLI Helper Script** (`scripts/figma-cli.ts`)
  - Maintains persistent connection to Figma MCP server
  - Automatically joins WebSocket channel before each command
  - Supports key=value argument format for easy CLI usage
  - Better error handling and connection state management
  - Usage: `npx tsx scripts/figma-cli.ts <tool-name> [key=value...]`
  - Example: `bun scripts/figma-cli.ts get_document_info`
  
### Fixed
- Fixed Figma MCP channel parameter name (use `channel` not `channelId`)
- Resolved connection persistence issues when using multiple commands
- Fixed TypeScript type errors in example files by using `.call()` method

### Changed
- Updated documentation to recommend helper script for Figma MCP operations
- Added comprehensive Figma MCP integration guide in MCPORTER_GUIDE.md
- Updated examples to use proper ServerProxy.call() API

---

## [2024-11-05] - Initial Setup

### Added
- MCPorter project setup and configuration
- Comprehensive MCPORTER_GUIDE.md documentation
- Example TypeScript scripts for basic usage and composable workflows
- Figma MCP integration examples
- Configuration examples in `config/mcporter.json`

