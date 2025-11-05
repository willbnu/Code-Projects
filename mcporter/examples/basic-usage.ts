/**
 * Basic MCPorter Usage Example
 * 
 * This example demonstrates:
 * - Creating a runtime
 * - Using server proxies
 * - Calling tools
 * - Handling results
 */

import { createRuntime, createServerProxy } from "mcporter";

async function main() {
  // Create runtime with config
  const runtime = await createRuntime({
    configPath: "./config/mcporter.json"
  });

  try {
    // Create a proxy for easier tool access
    const context7 = createServerProxy(runtime, "context7");

    // List available tools
    console.log("Available tools:");
    const tools = await runtime.listTools("context7");
    console.log(tools.map(t => `  - ${t.name}`).join("\n"));

    // Call a tool using the call method
    console.log("\nResolving library ID for 'react':");
    const result = await context7.call("resolve-library-id", {
      args: { query: "react" }
    });

    // Access results in different formats
    console.log("\nResult as text:");
    console.log(result.text());

    console.log("\nResult as JSON:");
    const data = result.json();
    console.log(JSON.stringify(data, null, 2));

    // Extract specific information
    if (data?.candidates) {
      const libraryId = data.candidates.find(
        (c: any) => c?.context7CompatibleLibraryID
      )?.context7CompatibleLibraryID;

      if (libraryId) {
        console.log(`\nFound library ID: ${libraryId}`);
        
        // Fetch documentation
        console.log("\nFetching documentation...");
        const docs = await context7.call("get-library-docs", {
          args: { libraryId }
        });
        console.log("\nDocumentation (first 500 chars):");
        console.log(docs.markdown()?.substring(0, 500) + "...");
      }
    }
  } finally {
    // Always close the runtime
    await runtime.close();
  }
}

main().catch(console.error);

