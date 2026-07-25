# Medical AI Orbs

Calm, accessible React activity indicators for clinical AI workflows.

## Install

```bash
npm install medical-ai-orbs
```

## Use

```tsx
import { MedicalWorkflowOrb } from "medical-ai-orbs";
import "medical-ai-orbs/styles.css";

export function EncounterStatus() {
  return (
    <MedicalWorkflowOrb
      state="checking"
      size={72}
      label="Checking medication history"
    />
  );
}
```

### Build a state picker

```tsx
import { useState } from "react";
import {
  MedicalWorkflowOrb,
  medicalWorkflowStates,
  type MedicalWorkflowState,
} from "medical-ai-orbs";
import "medical-ai-orbs/styles.css";

export function WorkflowPicker() {
  const [state, setState] = useState<MedicalWorkflowState>("listening");

  return (
    <section>
      <MedicalWorkflowOrb state={state} size={96} />

      {medicalWorkflowStates.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => setState(option)}
        >
          {option}
        </button>
      ))}
    </section>
  );
}
```

Run `npm run dev` to open the included playground. Switching state, size, or
speed updates both the live orb and its exact import example.

## States

| State | Communicates |
| --- | --- |
| `listening` | Encounter capture is active |
| `checking` | Health signals are being read |
| `full-picture` | Patient context is being connected |
| `documenting` | The encounter note is being written |
| `summarizing` | Information is condensing into a brief |
| `routing` | The next care step is being prepared |
| `review-needed` | Work is handed to a clinician |

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `state` | `MedicalWorkflowState` | required |
| `size` | `number` | `72` |
| `label` | `string` | State-specific accessible label |
| `speed` | `number` | `1` |
| `className` | `string` | `""` |

`speed` is a multiplier (`2` is twice as fast). Invalid sizes and speeds fall
back to safe values.

## Accessibility

- Plain-language accessible labels are included by default.
- Custom workflow detail belongs in `label`.
- `prefers-reduced-motion` is respected.
- Motion indicates activity, never clinical certainty.

## Develop

```bash
npm install
npm run dev
npm test
npm run check
```

`npm run check` builds the demo and library, runs package smoke tests, and
inspects the npm tarball.

Inspired by [Thinking Orbs](https://orbs.jakubantalik.com/), with an original
medical workflow vocabulary and visual system.

MIT. This is an interface component, not a medical device or clinical guidance.
