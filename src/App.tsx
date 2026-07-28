import { useMemo, useState } from "react";
import {
  MedicalWorkflowOrb as MedOrb,
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
    detail: "stream open",
  },
  {
    state: "checking",
    label: "Checking data",
    detail: "reading records",
  },
  {
    state: "full-picture",
    label: "Full picture",
    detail: "joining context",
  },
  {
    state: "documenting",
    label: "Documenting",
    detail: "drafting note",
  },
  {
    state: "summarizing",
    label: "Summarising",
    detail: "building brief",
  },
  {
    state: "routing",
    label: "Routing",
    detail: "next step",
  },
  {
    state: "review-needed",
    label: "Review needed",
    detail: "clinician needed",
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
      `import { MedOrb } from 'medorb';\nimport 'medorb/styles.css';\n\n<MedOrb state="${activeState}" size={${
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
        <a className="nav__mark" href="#top" aria-label="MedOrb home">
          <MedOrb state="listening" size={28} />
        </a>
        <div className="nav__links">
          <a href="#states">States</a>
          <a href="#usage">Install</a>
          <a href="#playground">Try it</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero__icon">
          <MedOrb state="listening" size={68} />
        </div>
        <p className="hero__kicker">OPEN SOURCE / REACT</p>
        <h1>medorb</h1>
        <p>A motion system for clinical AI work.</p>
      </header>

      <section className="orb-grid" id="states" aria-label="MedOrb states">
        {states.map((item, index) => (
          <article
            className={`orb-card orb-card--${item.state}`}
            key={item.state}
          >
            <span className="orb-card__number">0{index + 1}</span>
            <MedOrb
              state={item.state}
              size={item.state === "full-picture" ? 170 : 150}
              speed={speed}
            />
            <span className="status-pill">
              <span aria-hidden="true">
                <MedOrb
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
            <h2>Install</h2>
          </div>
          <div className="code-line">
            <code>npm install medorb</code>
            <button
              type="button"
              onClick={() => void copyText("install", "npm install medorb")}
            >
              {copied === "install" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="docs__section">
          <div className="section-title">
            <span>02</span>
            <h2>Render one</h2>
          </div>
          <div className="code-block">
            <pre>
              <code>
                <span className="syntax-muted">import</span>{" "}
                <span className="syntax-bright">{"{ MedOrb }"}</span>{" "}
                <span className="syntax-muted">from</span>{" "}
                <span className="syntax-string">'medorb'</span>;
                {"\n"}
                <span className="syntax-muted">import</span>{" "}
                <span className="syntax-string">'medorb/styles.css'</span>;
                {"\n\n"}
                {"<"}
                <span className="syntax-bright">MedOrb</span>{" "}
                state=<span className="syntax-string">"checking"</span> size=
                <span className="syntax-string">{"{72}"}</span> {"/>"}
              </code>
            </pre>
            <button
              type="button"
              onClick={() =>
                void copyText(
                  "usage",
                  `import { MedOrb } from 'medorb';\nimport 'medorb/styles.css';\n\n<MedOrb state="checking" size={72} />`,
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
          <h2>Tune it</h2>
        </div>

        <div className="playground__panel">
          <div className="controls">
            <fieldset>
              <legend>state</legend>
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
              <legend>size</legend>
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
              <legend>speed</legend>
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
            <MedOrb
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
        <span>medorb</span>
        <div className="footer__credit">
          <p>
            Open-sourced by{" "}
            <a href="https://github.com/alberthammerich">Albert Hammerich</a>
          </p>
          <p>
            Inspired by working with and contributing to{" "}
            <a href="https://openmed.life/">OpenMed</a>.
          </p>
        </div>
        <div className="footer__meta">
          <nav className="footer__links" aria-label="MedOrb links">
            <a
              href="https://www.npmjs.com/package/medorb"
              aria-label="MedOrb on npm"
              title="npm"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5h18v14h-9v2H8v-2H3V5Zm3 3v8h3v-5h2v5h3v-5h2v5h2V8H6Z" />
              </svg>
            </a>
            <a
              href="https://github.com/alberthammerich/medorb"
              aria-label="MedOrb on GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.94c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
              </svg>
            </a>
          </nav>
          <span>MIT / 2026</span>
        </div>
      </footer>
    </main>
  );
}
