import { useMemo, useState } from "react";
import {
  MedicalWorkflowOrb,
  type MedicalWorkflowState,
} from "./MedicalWorkflowOrb";

const states: Array<{
  state: MedicalWorkflowState;
  label: string;
  detail: string;
}> = [
  {
    state: "listening",
    label: "Listening",
    detail: "Capture is active",
  },
  {
    state: "checking",
    label: "Checking data",
    detail: "Reading health signals",
  },
  {
    state: "full-picture",
    label: "Getting the full picture",
    detail: "Connecting the patient context",
  },
  {
    state: "documenting",
    label: "Documenting",
    detail: "Writing the encounter note",
  },
  {
    state: "summarizing",
    label: "Summarising",
    detail: "Preparing the clinical brief",
  },
  {
    state: "routing",
    label: "Routing",
    detail: "Finding the next care step",
  },
  {
    state: "review-needed",
    label: "Review needed",
    detail: "Waiting for a clinician",
  },
];

export function App() {
  const [activeState, setActiveState] =
    useState<MedicalWorkflowState>("listening");
  const [size, setSize] = useState<"compact" | "regular">("regular");
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState<
    "install" | "usage" | "playground" | null
  >(null);

  const active = states.find((item) => item.state === activeState)!;
  const code = useMemo(
    () =>
      `import { MedicalWorkflowOrb } from 'medical-ai-orbs';\nimport 'medical-ai-orbs/styles.css';\n\n<MedicalWorkflowOrb state="${activeState}" size={${
        size === "regular" ? 72 : 24
      }} />`,
    [activeState, size],
  );

  async function copyText(
    target: "install" | "usage" | "playground",
    text: string,
  ) {
    await navigator.clipboard.writeText(text);
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <main>
      <nav className="nav" aria-label="Page navigation">
        <a className="nav__mark" href="#top" aria-label="Medical AI Orbs home">
          <MedicalWorkflowOrb state="listening" size={28} />
        </a>
        <div className="nav__links">
          <a href="#states">States</a>
          <a href="#usage">Usage</a>
          <a href="#playground">Playground</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero__icon">
          <MedicalWorkflowOrb state="listening" size={68} />
        </div>
        <p className="hero__kicker">React component</p>
        <h1>Medical AI orbs</h1>
        <p>
          Quiet, legible activity indicators for clinical AI workflows.
        </p>
      </header>

      <section className="orb-grid" id="states" aria-label="Medical AI states">
        {states.map((item, index) => (
          <article
            className={`orb-card orb-card--${item.state}`}
            key={item.state}
          >
            <span className="orb-card__number">0{index + 1}</span>
            <MedicalWorkflowOrb
              state={item.state}
              size={item.state === "full-picture" ? 170 : 150}
              speed={speed}
            />
            <span className="status-pill">
              <span aria-hidden="true">
                <MedicalWorkflowOrb
                  state={item.state}
                  size={20}
                  speed={speed}
                />
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
            </span>
          </article>
        ))}
      </section>

      <section className="docs" id="usage">
        <div className="docs__section">
          <div className="section-title">
            <span>01</span>
            <h2>Installation</h2>
          </div>
          <div className="code-line">
            <code>npm install medical-ai-orbs</code>
            <button
              type="button"
              onClick={() =>
                void copyText("install", "npm install medical-ai-orbs")
              }
            >
              {copied === "install" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="docs__section">
          <div className="section-title">
            <span>02</span>
            <h2>Usage</h2>
          </div>
          <div className="code-block">
            <pre>
              <code>
                <span className="syntax-muted">import</span>{" "}
                <span className="syntax-bright">
                  {"{ MedicalWorkflowOrb }"}
                </span>{" "}
                <span className="syntax-muted">from</span>{" "}
                <span className="syntax-string">'medical-ai-orbs'</span>;
                {"\n"}
                <span className="syntax-muted">import</span>{" "}
                <span className="syntax-string">
                  'medical-ai-orbs/styles.css'
                </span>;
                {"\n\n"}
                {"<"}
                <span className="syntax-bright">MedicalWorkflowOrb</span>{" "}
                state=<span className="syntax-string">"checking"</span> size=
                <span className="syntax-string">{"{72}"}</span> {"/>"}
              </code>
            </pre>
            <button
              type="button"
              onClick={() =>
                void copyText(
                  "usage",
                  `import { MedicalWorkflowOrb } from 'medical-ai-orbs';\nimport 'medical-ai-orbs/styles.css';\n\n<MedicalWorkflowOrb state="checking" size={72} />`,
                )
              }
            >
              {copied === "usage" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>

      <section className="playground" id="playground">
        <div className="section-title">
          <span>03</span>
          <h2>Playground</h2>
        </div>

        <div className="playground__panel">
          <div className="controls">
            <fieldset>
              <legend>State</legend>
              <div className="segmented segmented--wrap">
                {states.map((item) => (
                  <button
                    type="button"
                    data-active={activeState === item.state}
                    onClick={() => setActiveState(item.state)}
                    key={item.state}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Size</legend>
              <div className="segmented">
                <button
                  type="button"
                  data-active={size === "regular"}
                  onClick={() => setSize("regular")}
                >
                  72px
                </button>
                <button
                  type="button"
                  data-active={size === "compact"}
                  onClick={() => setSize("compact")}
                >
                  24px
                </button>
              </div>
            </fieldset>

            <fieldset className="speed-control">
              <legend>Speed</legend>
              <div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  aria-label="Animation speed"
                />
                <output>{speed.toFixed(2)}×</output>
              </div>
            </fieldset>
          </div>

          <div className="playground__stage">
            <MedicalWorkflowOrb
              state={activeState}
              size={size === "regular" ? 154 : 52}
              speed={speed}
            />
            <div className="playground__status">
              <strong>{active.label}</strong>
              <span>{active.detail}</span>
            </div>
          </div>

          <div className="code-block code-block--result">
            <pre>
              <code>{code}</code>
            </pre>
            <button
              type="button"
              onClick={() => void copyText("playground", code)}
            >
              {copied === "playground" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>

      <footer>
        <span>Medical AI orbs</span>
        <p>
          Activity, not certainty. Always pair motion with plain-language
          status.
        </p>
        <span>MIT · 2026</span>
      </footer>
    </main>
  );
}
