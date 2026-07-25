# Medical AI Orbs

Accessible animated status orbs for AI-assisted medical workflows.

Medical AI Orbs gives clinical products a calm, legible way to show what an
AI system is doing, what boundary applies, and when a human needs to take over.
It is inspired by the interaction pattern of
[Thinking Orbs](https://orbs.jakubantalik.com/) while using an original visual
system and medical-workflow vocabulary.

## Workflow states

| State | Meaning | Boundary copy |
| --- | --- | --- |
| `listening` | Ambient capture is active | Audio stays within the encounter boundary |
| `transcribing` | Dialogue is becoming structured text | No clinical interpretation yet |
| `checking` | Context and contradictions are being reviewed | Source-linked evidence only |
| `summarizing` | A visit narrative is being drafted | Clinician review required |
| `routing` | The next workflow step is being prepared | Nothing is sent automatically |
| `escalating` | Human attention is required | AI action paused |

## Quick start

```bash
npm install
npm run dev
```

## Component usage

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

### Props

| Prop | Type | Default |
| --- | --- | --- |
| `state` | `listening \| transcribing \| checking \| summarizing \| routing \| escalating` | required |
| `size` | `number` | `72` |
| `label` | `string` | State-specific accessible label |
| `speed` | `number` | `1` |
| `className` | `string` | `""` |

## Design principles

- Motion communicates activity, never certainty.
- Every visual state should be paired with explicit boundary copy.
- Escalation is visually distinct and pauses automated action.
- `prefers-reduced-motion` is respected.
- The component exposes a plain-language accessible label.

## Development

```bash
npm run typecheck
npm run build
npm run preview
```

The build produces both the demo site and an ES module package in `dist/lib`.

## Scope

This is a visual interface component, not a medical device and not a source of
clinical guidance.

## License

MIT
