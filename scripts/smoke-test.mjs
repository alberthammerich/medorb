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

  assert.match(html, /role="status"/);
  assert.match(html, new RegExp(`data-state="${state}"`));
  assert.match(
    html,
    new RegExp(
      `<span class="medical-orb__label">Testing ${state}\\. AI workflow status\\.</span>`,
    ),
  );
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /NaN|Infinity|undefined/);
}

console.log(`Rendered ${medicalWorkflowStates.length} workflow states.`);
