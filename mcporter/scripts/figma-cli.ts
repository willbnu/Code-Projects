#!/usr/bin/env node
/**
 * Figma MCP CLI Helper
 * 
 * This script maintains a persistent connection to Figma MCP,
 * automatically joins a channel, and executes commands.
 * 
 * Usage:
 *   npx tsx scripts/figma-cli.ts <tool-name> [args...]
 *   npx tsx scripts/figma-cli.ts get_document_info
 *   npx tsx scripts/figma-cli.ts get_selection
 *   npx tsx scripts/figma-cli.ts create_rectangle x=100 y=100 width=200 height=150 name="Test"
 */

import { createRuntime, createServerProxy } from "mcporter";
import { existsSync } from "fs";

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: npx tsx scripts/figma-cli.ts <tool-name> [key=value...]");
  console.error("\nExamples:");
  console.error("  npx tsx scripts/figma-cli.ts get_document_info");
  console.error("  npx tsx scripts/figma-cli.ts get_selection");
  console.error("  npx tsx scripts/figma-cli.ts create_rectangle x=100 y=100 width=200 height=150");
  process.exit(1);
}

const toolName = args[0];
const toolArgs = args.slice(1);

// Parse key=value arguments into object
function parseArgs(args: string[]): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const arg of args) {
    const [key, ...valueParts] = arg.split("=");
    const value = valueParts.join("="); // In case value contains =
    
    // Try to parse as number
    if (/^-?\d+$/.test(value)) {
      result[key] = parseInt(value, 10);
    } else if (/^-?\d+\.\d+$/.test(value)) {
      result[key] = parseFloat(value);
    } else if (value === "true") {
      result[key] = true;
    } else if (value === "false") {
      result[key] = false;
    } else {
      // Remove quotes if present
      result[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  
  return result;
}

// Get channel ID from environment or use default
const channelId = process.env.FIGMA_CHANNEL || `cli-${Date.now()}`;

async function main() {
  // Find config file - prefer test config without imports to avoid URL issues
  let configPath = process.env.MCPORTER_CONFIG;
  
  if (!configPath) {
    // Try test config first, fallback to main config
    const testConfig = "./config/test-figma.json";
    const mainConfig = "./config/mcporter.json";
    
    try {
      // Check if test config exists
      if (existsSync(testConfig)) {
        configPath = testConfig;
      } else {
        configPath = mainConfig;
      }
    } catch {
      configPath = mainConfig;
    }
  }
  
  // Create runtime with config
  const runtime = await createRuntime({
    configPath,
    servers: [
      {
        name: "TalkToFigma",
        command: {
          kind: "stdio",
          command: "bunx",
          args: ["cursor-talk-to-figma-mcp@latest"],
          cwd: process.cwd()
        }
      }
    ]
  });

  try {
    const figma = createServerProxy(runtime, "TalkToFigma");

    // Auto-join channel (required for all Figma operations)
    if (toolName !== "join_channel") {
      console.log(`Joining channel: ${channelId}...`);
      try {
        const joinResult = await figma.call("join_channel", {
          args: { channel: channelId }
        });
        const joinText = joinResult.text();
        if (joinText && !joinText.includes("Error")) {
          console.log(`✓ Connected to channel: ${channelId}\n`);
          // Small delay to ensure channel is fully established
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          console.error(`Channel join failed: ${joinText}`);
          process.exit(1);
        }
      } catch (error) {
        console.error(`Error joining channel: ${error}`);
        console.error("\nMake sure:");
        console.error("1. WebSocket server is running: bunx cursor-talk-to-figma-socket");
        console.error("2. Figma plugin is running and connected");
        process.exit(1);
      }
    }

    // Prepare arguments
    let toolArguments: Record<string, any> = {};
    
    if (toolName === "join_channel") {
      // Special handling for join_channel
      if (toolArgs.length > 0) {
        const parsed = parseArgs(toolArgs);
        toolArguments = { channel: parsed.channel || parsed.channelId || channelId };
      } else {
        toolArguments = { channel: channelId };
      }
    } else if (toolArgs.length > 0) {
      // Parse key=value arguments
      toolArguments = parseArgs(toolArgs);
    }

    // Call the tool
    console.log(`Calling: ${toolName}`);
    if (Object.keys(toolArguments).length > 0) {
      console.log(`Arguments:`, JSON.stringify(toolArguments, null, 2));
    }
    console.log();

    const result = await figma.call(toolName, {
      args: toolArguments
    });

    // Output result
    const resultText = result.text();
    const resultJson = result.json();
    
    if (resultText) {
      console.log("Result:");
      console.log(resultText);
    }
    
    // Try to pretty-print JSON if it's valid JSON
    if (resultJson && typeof resultJson === "object") {
      console.log("\nJSON:");
      console.log(JSON.stringify(resultJson, null, 2));
    }

  } catch (error: any) {
    console.error("Error:", error.message || error);
    if (error.message?.includes("Must join a channel")) {
      console.error("\nNote: Channel join failed. Make sure:");
      console.error("1. WebSocket server is running: bunx cursor-talk-to-figma-socket");
      console.error("2. Figma plugin is running");
    }
    process.exit(1);
  } finally {
    await runtime.close();
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

