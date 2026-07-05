"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import type { CSSProperties } from "react";

SyntaxHighlighter.registerLanguage("python", python);

// Custom Prism theme matching the WatQ palette.
const watqTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: "#E2E8F0",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "13px",
    lineHeight: "1.7",
  },
  'pre[class*="language-"]': {
    color: "#E2E8F0",
    background: "transparent",
    margin: 0,
    padding: 0,
    overflow: "auto",
  },
  comment: { color: "#64748B", fontStyle: "italic" },
  string: { color: "#7DD3A8" },
  "triple-quoted-string": { color: "#64748B", fontStyle: "italic" },
  keyword: { color: "#FF007F" },
  boolean: { color: "#D900FF" },
  number: { color: "#D900FF" },
  function: { color: "#00F0FF" },
  "class-name": { color: "#00F0FF" },
  operator: { color: "#94A3B8" },
  punctuation: { color: "#94A3B8" },
  builtin: { color: "#00F0FF" },
  decorator: { color: "#FF007F" },
};

export default function CodeBlock({ code }: { code: string }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-photon/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-photon-deep/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-qubit/60" />
        <span className="ml-3 font-mono text-xs text-ink-dim">
          qiskit · python
        </span>
      </div>
      <div className="overflow-x-auto p-5">
        <SyntaxHighlighter language="python" style={watqTheme}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
