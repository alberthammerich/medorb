import { useState } from "react";
import {
  MedicalWorkflowOrb,
  type MedicalWorkflowState,
} from "./MedicalWorkflowOrb";

const states: Array<{
  state: MedicalWorkflowState;
  label: string;
  detail: string;
  note: string;
}> = [
  {
    state: "listening",
    label: "Listening",
    detail: "Ambient capture is active",
    note: "Audio stays within the encounter boundary",
  },
  {
    state: "transcribing",
    label: "Transcribing",
    detail: "Turning dialogue into structure",
    note: "No clinical interpretation yet",
  },
  {
    state: "checking",
    label: "Checking",
    detail: "Reviewing context and contradictions",
    note: "Source-linked evidence only",
  },
  {
    state: "summarizing",
    label: "Summarizing",
    detail: "Drafting the visit narrative",
    note: "Clinician review required",
  },
  {
    state: "routing",
    label: "Routing",
    detail: "Preparing the next workflow step",
    note: "Nothing is sent automatically",
  },
  {
    state: "escalating",
    label: "Needs review",
    detail: "Human attention requested",
    note: "AI action paused",
  },
];

export function App() {
  const [activeState, setActiveState] =
    useState<MedicalWorkflowState>("checking");
  const [speed, setSpeed] = useState(1);
  const active = states.find((item) => item.state === activeState)!;

  return (
    <main>
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Medical AI Orbs home">
          <span>MAO</span>
          Medical AI Orbs
        </a>
        <div className="masthead__note">
          <span className="status-dot" />
          React component · v0.1
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero__copy">
          <p className="eyebrow">Calm signals for high-stakes software</p>
          <h1>
            Clinical work,
            <br />
            made <em>visible.</em>
          </h1>
          <p className="lede">
            Animated status orbs that tell care teams what an AI is doing,
            what it is not doing, and when a human needs to take over.
          </p>
        </div>

        <div className="hero__stage" aria-label="Interactive orb preview">
          <div className="stage__grid" />
          <div className="stage__meta stage__meta--top">
            <span>ROOM 03</span>
            <span>13:42:08</span>
          </div>
          <MedicalWorkflowOrb
            state={activeState}
            label={active.label}
            size={238}
            speed={speed}
          />
          <div className="stage__caption">
            <span className="stage__index">
              0{states.findIndex((item) => item.state === activeState) + 1}
            </span>
            <div>
              <strong>{active.label}</strong>
              <span>{active.detail}</span>
            </div>
          </div>
          <p className="stage__boundary">{active.note}</p>
        </div>
      </section>

      <section className="workflow" aria-labelledby="workflow-title">
        <div className="section-heading">
          <p className="eyebrow">Workflow vocabulary</p>
          <h2 id="workflow-title">One glance. No guessing.</h2>
          <p>
            Each state carries a distinct motion signature, color family, and
            plain-language boundary.
          </p>
        </div>

        <div className="state-list">
          {states.map((item, index) => (
            <button
              type="button"
              className="state-row"
              data-active={activeState === item.state}
              onClick={() => setActiveState(item.state)}
              key={item.state}
            >
              <span className="state-row__number">0{index + 1}</span>
              <MedicalWorkflowOrb state={item.state} size={62} speed={speed} />
              <span className="state-row__label">{item.label}</span>
              <span className="state-row__detail">{item.detail}</span>
              <span className="state-row__arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="playground" aria-labelledby="playground-title">
        <div>
          <p className="eyebrow">Implementation preview</p>
          <h2 id="playground-title">Drop into the workflow.</h2>
        </div>

        <div className="code-card">
          <div className="code-card__bar">
            <span>Patient encounter · live</span>
            <label>
              Motion
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                aria-label="Animation speed"
              />
              <output>{speed.toFixed(2)}s</output>
            </label>
          </div>
          <pre>
            <code>
              <span className="token-muted">import</span>{" "}
              <span className="token-accent">{"{ MedicalWorkflowOrb }"}</span>{" "}
              <span className="token-muted">from</span>{" "}
              <span className="token-string">'medical-ai-orbs'</span>;
              {"\n\n"}
              {"<"}
              <span className="token-accent">MedicalWorkflowOrb</span>
              {"\n  "}state=
              <span className="token-string">"{activeState}"</span>
              {"\n  "}size=
              <span className="token-string">{"{72}"}</span>
              {"\n/>"}
            </code>
          </pre>
          <div className="code-card__result">
            <MedicalWorkflowOrb
              state={activeState}
              size={96}
              speed={speed}
            />
            <div>
              <strong>{active.label}</strong>
              <span>{active.note}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="principles" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">Clinical interaction principles</p>
          <h2 id="principles-title">Motion with a duty of care.</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <strong>Never imply certainty.</strong>
            <p>State motion communicates activity—not correctness.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Name the boundary.</strong>
            <p>Every visual state pairs with explicit supporting copy.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Defer with clarity.</strong>
            <p>Escalation looks distinct and pauses automated action.</p>
          </li>
        </ol>
      </section>

      <footer>
        <span>Medical AI Orbs</span>
        <p>
          A visual language for responsible AI-assisted care. Not a medical
          device.
        </p>
        <span>MIT · 2026</span>
      </footer>
    </main>
  );
}

