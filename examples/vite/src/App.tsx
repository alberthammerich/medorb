import { useState } from "react";
import {
  MedOrb,
  medicalWorkflowStates,
  type MedicalWorkflowState,
} from "medorb";
import "medorb/styles.css";

export function App() {
  const [state, setState] = useState<MedicalWorkflowState>("checking");

  return (
    <main>
      <MedOrb state={state} size={144} />

      <label>
        Workflow state
        <select
          value={state}
          onChange={(event) =>
            setState(event.target.value as MedicalWorkflowState)
          }
        >
          {medicalWorkflowStates.map((next) => (
            <option key={next} value={next}>
              {next}
            </option>
          ))}
        </select>
      </label>
    </main>
  );
}
