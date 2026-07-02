import * as React from "react";
import { createRoot } from "react-dom/client";
import { Showcase } from "../examples/Showcase";
import { DemoApp } from "../demo/DemoApp";

/* Demo-first preview.
 *
 * Default: DemoApp only, no dev chrome. What Kanchuki sees on Thursday.
 * With ?dev=1 in the URL: tabs revealed for the component Showcase. */

function Preview() {
  const devMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("dev") === "1";
  const [tab, setTab] = React.useState<"demo" | "showcase">("demo");

  if (!devMode) return <DemoApp />;

  return (
    <div className="bg-paper min-h-screen">
      <nav className="sticky top-0 z-10 flex items-center justify-center gap-1 py-2 bg-paper/95 border-b border-paper-edge backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setTab("demo")}
          className={
            "px-4 py-1.5 rounded-pill text-body-sm font-medium " +
            (tab === "demo" ? "bg-brass text-paper" : "text-ink-soft hover:text-ink")
          }
        >
          Demo walkthrough
        </button>
        <button
          type="button"
          onClick={() => setTab("showcase")}
          className={
            "px-4 py-1.5 rounded-pill text-body-sm font-medium " +
            (tab === "showcase" ? "bg-brass text-paper" : "text-ink-soft hover:text-ink")
          }
        >
          Component showcase
        </button>
      </nav>
      {tab === "demo" ? <DemoApp /> : <Showcase />}
    </div>
  );
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<Preview />);
