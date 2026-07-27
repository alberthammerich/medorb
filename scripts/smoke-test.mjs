import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MedOrb,
  MedicalWorkflowOrb,
  medicalWorkflowStates,
} from "../dist/lib/medorb.js";

assert.equal(medicalWorkflowStates.length, 7);
assert.equal(MedOrb, MedicalWorkflowOrb);

for (const state of medicalWorkflowStates) {
  const html = renderToStaticMarkup(
    createElement(MedOrb, {
      state,
      label: `Testing ${state}`,
      size: 48,
    }),
  );

  assert.match(html, /role="img"/);
  assert.match(html, new RegExp(`data-state="${state}"`));
  assert.match(html, new RegExp(`aria-label="Testing ${state}`));
  assert.doesNotMatch(html, /NaN|Infinity|undefined/);
}

console.log(`Rendered ${medicalWorkflowStates.length} workflow states.`);
