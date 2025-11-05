/**
 * Composable Workflow Example
 * 
 * This example demonstrates:
 * - Building higher-level functions
 * - Chaining multiple tool calls
 * - Error handling
 * - Processing multiple items
 */

import { createRuntime, createServerProxy } from "mcporter";

interface LibraryInfo {
  candidates?: Array<{
    context7CompatibleLibraryID?: string;
    name?: string;
  }>;
}

/**
 * Get library documentation by name
 * This is a higher-level function that composes multiple MCP calls
 */
async function getLibraryDocs(
  runtime: Awaited<ReturnType<typeof createRuntime>>,
  libraryName: string
) {
  const context7 = createServerProxy(runtime, "context7");

  // Step 1: Resolve library ID
  const resolved = await context7.resolveLibraryId(libraryName);
  const data = resolved.json<LibraryInfo>();

  // Step 2: Extract library ID
  const libraryId =
    data?.candidates?.find(
      (candidate) => candidate?.context7CompatibleLibraryID
    )?.context7CompatibleLibraryID ??
    resolved
      .text()
      ?.match(/Context7-compatible library ID:\s*([^\s]+)/)?.[1];

  if (!libraryId) {
    throw new Error(`Library "${libraryName}" not found in Context7`);
  }

  // Step 3: Fetch documentation
  const docs = await context7.getLibraryDocs(libraryId);

  return {
    libraryId,
    name: libraryName,
    documentation: docs.markdown() || "",
    raw: docs.raw,
  };
}

/**
 * Process multiple libraries
 */
async function processLibraries(libraryNames: string[]) {
  const runtime = await createRuntime({
    configPath: "./config/mcporter.json",
  });

  try {
    const results = await Promise.all(
      libraryNames.map(async (name) => {
        try {
          return await getLibraryDocs(runtime, name);
        } catch (error) {
          console.error(`Error processing ${name}:`, error);
          return null;
        }
      })
    );

    // Filter out errors
    const successful = results.filter((r): r is NonNullable<typeof r> => r !== null);

    return successful;
  } finally {
    await runtime.close();
  }
}

/**
 * Extract headings from markdown documentation
 */
function extractHeadings(markdown: string): string[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const matches = markdown.matchAll(headingRegex);
  return Array.from(matches, (m) => m[1]);
}

// Main execution
async function main() {
  const libraries = ["react", "vue", "typescript"];

  console.log(`Processing ${libraries.length} libraries...\n`);

  const results = await processLibraries(libraries);

  results.forEach((result) => {
    console.log(`\n=== ${result.name.toUpperCase()} ===`);
    console.log(`Library ID: ${result.libraryId}`);
    console.log(`\nHeadings found:`);
    const headings = extractHeadings(result.documentation);
    headings.slice(0, 10).forEach((h) => console.log(`  - ${h}`));
    if (headings.length > 10) {
      console.log(`  ... and ${headings.length - 10} more`);
    }
  });
}

main().catch(console.error);

