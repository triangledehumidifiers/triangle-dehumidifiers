// Removes @graph wrapper from all service/city pages — flattens to a single
// HomeAndConstructionBusiness JSON-LD object. If a FAQPage was embedded inside
// @graph (encapsulated and ERV pages), it is extracted to its own faqSchema
// const and rendered in a separate <script> block.

import { readFileSync, writeFileSync } from 'fs';

const pages = [
  'src/pages/crawl-space-dehumidifier-apex-nc.astro',
  'src/pages/crawl-space-dehumidifier-cary-nc.astro',
  'src/pages/crawl-space-dehumidifier-raleigh-nc.astro',
  'src/pages/crawl-space-dehumidifier-fuquay-varina-nc.astro',
  'src/pages/crawl-space-dehumidifier-holly-springs-nc.astro',
  'src/pages/whole-house-dehumidifier-raleigh.astro',
  'src/pages/encapsulated-crawl-space-dehumidifier-raleigh-nc.astro',
  'src/pages/erv-installation-raleigh-nc.astro',
  'src/pages/crawl-space-mold-treatment-raleigh.astro',
];

/** Remove 4 spaces of indentation from every line. */
function deindent(str) {
  return str
    .split('\n')
    .map(line => (line.startsWith('    ') ? line.slice(4) : line))
    .join('\n');
}

/** Return the index of the bracket (closeChar) that closes the one at depth=1
 *  starting at startIdx.  openChar/closeChar are single characters e.g. '{'/'}'. */
function findClose(str, openChar, closeChar, startIdx) {
  let depth = 1;
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] === openChar) depth++;
    else if (str[i] === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function transform(rawContent) {
  // Normalize CRLF → LF so all string searches work uniformly
  const content = rawContent.replace(/\r\n/g, '\n');
  // Locate 'const schema = {'
  const schemaOpenStr = 'const schema = {';
  const schemaOpenIdx = content.indexOf(schemaOpenStr);
  if (schemaOpenIdx === -1) return null;

  // Locate '@graph': [ ... first item opening {
  const graphMarker = "  '@graph': [\n    {\n";
  const graphMarkerIdx = content.indexOf(graphMarker, schemaOpenIdx);
  if (graphMarkerIdx === -1) return null;

  // Everything before 'const schema = {'
  const prefix = content.slice(0, schemaOpenIdx);

  // Business object properties start right after the opening "    {\n"
  const businessPropsStart = graphMarkerIdx + graphMarker.length;

  // Find the closing } of the HomeAndConstructionBusiness object
  const businessCloseIdx = findClose(content, '{', '}', businessPropsStart);
  if (businessCloseIdx === -1) return null;

  // Extract and de-indent business properties
  const businessPropsRaw = content.slice(businessPropsStart, businessCloseIdx);
  const businessProps = deindent(businessPropsRaw).trimEnd();

  // Find the @graph array closing '\n  ],\n};'
  const graphCloseStr = '\n  ],\n};';
  const graphCloseIdx = content.indexOf(graphCloseStr, businessCloseIdx);
  if (graphCloseIdx === -1) return null;

  // Look for an embedded FAQPage in the remaining @graph items
  const otherItems = content.slice(businessCloseIdx + 1, graphCloseIdx);
  let faqMainEntity = null;

  if (otherItems.includes("'@type': 'FAQPage'")) {
    const faqArrayMarker = '      mainEntity: [';
    const faqMarkerIdx = otherItems.indexOf(faqArrayMarker);
    if (faqMarkerIdx !== -1) {
      const faqContentStart = faqMarkerIdx + faqArrayMarker.length;
      const faqCloseIdx = findClose(otherItems, '[', ']', faqContentStart);
      if (faqCloseIdx !== -1) {
        const rawMainEntity = otherItems.slice(faqContentStart, faqCloseIdx);
        faqMainEntity = deindent(rawMainEntity);
      }
    }
  }

  // Everything after the schema block
  let suffix = content.slice(graphCloseIdx + graphCloseStr.length);

  // Build flat schema
  const newSchema = `const schema = {\n  '@context': 'https://schema.org',\n${businessProps}\n};`;

  // Build optional faqSchema and inject its <script> tag
  let faqPart = '';
  if (faqMainEntity !== null) {
    faqPart =
      `\nconst faqSchema = {\n` +
      `  '@context': 'https://schema.org',\n` +
      `  '@type': 'FAQPage',\n` +
      `  mainEntity: [${faqMainEntity}\n  ],\n};`;

    // Add faqSchema script tag right after the schema script tag in the template
    const mainTag = '<script type="application/ld+json" set:html={JSON.stringify(schema)} />';
    const mainTagIdx = suffix.indexOf(mainTag);
    if (mainTagIdx !== -1) {
      const faqTag = `\n  <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />`;
      suffix =
        suffix.slice(0, mainTagIdx + mainTag.length) +
        faqTag +
        suffix.slice(mainTagIdx + mainTag.length);
    }
  }

  return prefix + newSchema + faqPart + suffix;
}

let updated = 0;
for (const relPath of pages) {
  const rawContent = readFileSync(relPath, 'utf8');
  const result = transform(rawContent);
  if (result) {
    writeFileSync(relPath, result, 'utf8');
    console.log('✓', relPath);
    updated++;
  } else {
    console.log('⚠ skipped (no @graph):', relPath);
  }
}
console.log(`\nDone — ${updated}/${pages.length} files updated.`);
