# Medical AI Orbs

Calm, accessible React activity indicators for clinical AI workflows.

## Try it

[Open the interactive playground →](https://alberthammerich.github.io/medical-ai-orbs/)

Switch between every workflow state, test compact and regular sizes, adjust the
animation speed, and copy the generated React snippet.

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

## Interactive state picker

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

The hosted playground uses this same public component API—there is no separate
demo implementation.

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
inspects the npm tarball. `npm run build:pages` creates the hosted playground.

Inspired by [Thinking Orbs](https://orbs.jakubantalik.com/), with an original
medical workflow vocabulary and visual system.

MIT. This is an interface component, not a medical device or clinical guidance.
