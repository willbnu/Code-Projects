/**
 * Figma MCP Usage Example via MCPorter
 * 
 * This example demonstrates:
 * - Connecting to Figma MCP server
 * - Joining a WebSocket channel
 * - Reading design information
 * - Creating design elements
 * - Working with selections
 * 
 * Prerequisites:
 * 1. Start WebSocket server: cd "Figma MCP" && bun socket
 * 2. Open Figma and run the Cursor MCP Plugin
 * 3. Make sure you have a Figma document open
 */

import { createRuntime, createServerProxy } from "mcporter";

async function main() {
  // Create runtime with config
  const runtime = await createRuntime({
    configPath: "./config/mcporter.json"
  });

  try {
    const figma = createServerProxy(runtime, "figma");

    console.log("=== Figma MCP via MCPorter ===\n");

    // Step 1: Join a channel (REQUIRED before other operations)
    // The channel ID is used to route messages through the WebSocket server
    const channelId = `channel-${Date.now()}`;
    console.log(`1. Joining channel: ${channelId}`);
    
    const joinResult = await figma.joinChannel({ channelId });
    console.log(`   Result: ${joinResult.text()}\n`);

    // Step 2: Get document information
    console.log("2. Getting document info...");
    const docInfo = await figma.getDocumentInfo();
    const docData = docInfo.json();
    console.log(`   Document: ${docData?.name || "Unknown"}`);
    console.log(`   Pages: ${docData?.pages?.length || 0}\n`);

    // Step 3: Get current selection
    console.log("3. Getting current selection...");
    const selection = await figma.getSelection();
    const selectionData = selection.json();
    
    if (selectionData?.selection && selectionData.selection.length > 0) {
      console.log(`   Selected nodes: ${selectionData.selection.length}`);
      selectionData.selection.forEach((node: any, i: number) => {
        console.log(`   ${i + 1}. ${node.name} (${node.type})`);
      });
    } else {
      console.log("   No selection");
    }
    console.log();

    // Step 4: Read design details (if something is selected)
    if (selectionData?.selection && selectionData.selection.length > 0) {
      console.log("4. Reading design details...");
      const design = await figma.readMyDesign();
      console.log(`   Design data: ${design.text()?.substring(0, 200)}...\n`);
    }

    // Step 5: Create a frame (example)
    console.log("5. Creating a frame...");
    try {
      const frameResult = await figma.createFrame({
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        name: "MCPorter Test Frame",
        layoutMode: "VERTICAL",
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20
      });
      console.log(`   Frame created: ${frameResult.text()}\n`);
    } catch (error) {
      console.log(`   Error creating frame: ${error}\n`);
    }

    // Step 6: Create text element
    console.log("6. Creating text element...");
    try {
      const textResult = await figma.createText({
        x: 150,
        y: 150,
        content: "Hello from MCPorter!",
        fontSize: 24,
        fontFamily: "Inter",
        name: "MCPorter Text"
      });
      console.log(`   Text created: ${textResult.text()}\n`);
    } catch (error) {
      console.log(`   Error creating text: ${error}\n`);
    }

    // Step 7: Example - Get node info by ID (if you have a node ID)
    // const nodeId = "123:456";
    // console.log(`7. Getting node info for ${nodeId}...`);
    // const nodeInfo = await figma.getNodeInfo({ nodeId });
    // console.log(`   Node info: ${nodeInfo.text()}\n`);

    console.log("=== Done ===");

  } catch (error) {
    console.error("Error:", error);
    console.error("\nMake sure:");
    console.error("1. WebSocket server is running: cd 'Figma MCP' && bun socket");
    console.error("2. Figma plugin is running and connected");
    console.error("3. You have a Figma document open");
  } finally {
    await runtime.close();
  }
}

main().catch(console.error);

