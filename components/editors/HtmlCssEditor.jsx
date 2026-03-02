"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

export default function HtmlCssEditor({
  assignmentId,
  starterHtml,
  starterCss,
  onSubmit,
}) {
  const [html, setHtml] = useState(starterHtml || "<div>Hello</div>");
  const [css, setCss] = useState(starterCss || "body { }\n");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    onSubmit({
      assignment_id: assignmentId,
      files: { html, css },
    }).finally(() => setSubmitting(false));
  };

  const srcDoc = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`;

  return (
    <div className="space-y-3 min-h-[300px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 py-1 border-b border-zinc-200 dark:border-zinc-800">
            HTML
          </p>
          <MonacoEditor
            height="240px"
            language="html"
            value={html}
            onChange={(v) => setHtml(v ?? "")}
            theme="light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 py-1 border-b border-zinc-200 dark:border-zinc-800">
            CSS
          </p>
          <MonacoEditor
            height="240px"
            language="css"
            value={css}
            onChange={(v) => setCss(v ?? "")}
            theme="light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>
      </div>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 py-1 border-b border-zinc-200 dark:border-zinc-800">
          Preview
        </p>
        <iframe
          title="Preview"
          srcDoc={srcDoc}
          className="w-full h-[240px] border-0"
          sandbox="allow-same-origin"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </div>
  );
}
