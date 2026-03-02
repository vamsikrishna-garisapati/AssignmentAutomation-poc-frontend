"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
// sql.js exports initSqlJs as default in browser bundle
import initSqlJs from "sql.js";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

const SQL_WASM_CDN =
  "https://cdn.jsdelivr.net/npm/sql.js@1.14.0/dist/sql-wasm-browser.wasm";

export default function SqlEditor({
  assignmentId,
  dbSetup,
  starterQuery,
  onSubmit,
}) {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState(starterQuery || "");
  const [loading, setLoading] = useState(true);
  const [runError, setRunError] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const init = typeof initSqlJs === "function" ? initSqlJs : (initSqlJs?.default ?? initSqlJs?.initSqlJs);
    if (typeof init !== "function") {
      setRunError("sql.js failed to load");
      setLoading(false);
      return;
    }
    init({
      locateFile: () => SQL_WASM_CDN,
    })
      .then((SQL) => {
        if (cancelled) return;
        const database = new SQL.Database();
        const setup = (dbSetup || "").trim();
        if (setup) {
          try {
            database.run(setup);
          } catch (e) {
            console.warn("dbSetup error:", e);
          }
        }
        setDb(database);
      })
      .catch((e) => {
        if (!cancelled)
          setRunError(e.message || "Failed to load SQL environment");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dbSetup]);

  const handleRun = useCallback(() => {
    if (!db) return;
    setRunError(null);
    setRunResult(null);
    try {
      const stmt = db.exec(query);
      setRunResult(stmt);
    } catch (e) {
      setRunError(e.message || "Query error");
    }
  }, [db, query]);

  const handleSubmit = () => {
    setSubmitting(true);
    onSubmit({
      assignment_id: assignmentId,
      code: query,
    }).finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-800/50 min-h-[280px] flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Loading SQL environment…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 min-h-[300px]">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <MonacoEditor
          height="280px"
          language="sql"
          value={query}
          onChange={(v) => setQuery(v ?? "")}
          theme="light"
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRun}
          disabled={!db}
          className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          Run
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
      {runError && (
        <p className="text-sm text-red-600 dark:text-red-400">{runError}</p>
      )}
      {runResult && runResult.length > 0 && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                {runResult[0].columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 font-medium text-zinc-950 dark:text-zinc-50"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runResult[0].values.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-2 text-zinc-900 dark:text-zinc-100"
                    >
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
