"use client";

function formatExpectedActual(expected, actual) {
  const fmt = (v) => {
    if (v == null) return "";
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === "object")
      return `${v.length} row(s)`;
    return String(v);
  };
  return `expected: ${fmt(expected)} / actual: ${fmt(actual)}`;
}

export default function TestResults({ testResults }) {
  if (!testResults) return null;
  const results = testResults.results || [];
  const passed = testResults.passed_tests ?? 0;
  const total = testResults.total_tests ?? (results.length || 0);
  const error = testResults.error;

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
        <p className="font-medium text-amber-900 dark:text-amber-100">
          Run error
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
          {error}
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {total > 0 ? `${passed}/${total} tests passed` : "No test results."}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Tests: {passed}/{total} passed
      </p>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-3 py-2 font-medium text-zinc-950 dark:text-zinc-50">
                Test
              </th>
              <th className="px-3 py-2 font-medium text-zinc-950 dark:text-zinc-50">
                Result
              </th>
              <th className="px-3 py-2 font-medium text-zinc-950 dark:text-zinc-50">
                Expected / Actual
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                className="border-t border-zinc-200 dark:border-zinc-800"
              >
                <td className="px-3 py-2 text-zinc-900 dark:text-zinc-100 font-mono">
                  {r.name ?? `Test ${i + 1}`}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      r.passed
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {r.passed ? "Passed" : "Failed"}
                  </span>
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400 font-mono text-xs max-w-xs truncate">
                  {r.error
                    ? r.error
                    : r.expected != null || r.actual != null
                    ? formatExpectedActual(r.expected, r.actual)
                    : r.message ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
