# medorb

A motion system for clinical work in progress.

[Live playground →](https://alberthammerich.github.io/medorb/)

## Install

```bash
npm install medorb
```

## Use

```tsx
import { MedOrb } from "medorb";
import "medorb/styles.css";

<MedOrb state="checking" size={72} />
```

## Switch states

```tsx
import { useState } from "react";
import {
  MedOrb,
  medicalWorkflowStates,
  type MedicalWorkflowState,
} from "medorb";
import "medorb/styles.css";

export function WorkflowSignal() {
  const [state, setState] = useState<MedicalWorkflowState>("listening");

  return (
    <>
      <MedOrb state={state} size={96} />

      {medicalWorkflowStates.map((next) => (
        <button key={next} onClick={() => setState(next)}>
          {next}
        </button>
      ))}
    </>
  );
}
```

## States

| State | Signal |
| --- | --- |
| `listening` | Stream open |
| `checking` | Reading records |
| `full-picture` | Joining context |
| `documenting` | Drafting note |
| `summarizing` | Building brief |
| `routing` | Next step |
| `review-needed` | Clinician needed |

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `state` | `MedicalWorkflowState` | required |
| `size` | `number` | `72` |
| `label` | `string` | accessible state label |
| `speed` | `number` | `1` |
| `className` | `string` | `""` |

Reduced motion is built in. Motion signals activity—not clinical certainty.

```bash
npm install
npm run dev
npm run check
```

Sparked by [Thinking Orbs](https://orbs.jakubantalik.com/). Built and
open-sourced by [Albert Hammerich](https://github.com/alberthammerich).

MIT. Interface component only; not a medical device or clinical guidance.
