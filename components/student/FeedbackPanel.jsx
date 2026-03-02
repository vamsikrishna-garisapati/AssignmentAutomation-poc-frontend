"use client";

import TestResults from "./TestResults";

export default function FeedbackPanel({ submission }) {
  if (!submission) return null;
  const { score, test_results, ai_feedback } = submission;
  const feedback = ai_feedback || {};

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
      <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
        Result
      </h3>
      {score != null && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Score
          </span>
          <div className="flex-1 max-w-xs h-3 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full bg-green-500 dark:bg-green-600 transition-all"
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            {score.toFixed(1)}%
          </span>
        </div>
      )}
      <TestResults testResults={test_results} />
      {(feedback.summary || (feedback.strengths && feedback.strengths.length) || (feedback.improvements && feedback.improvements.length) || (feedback.hints && feedback.hints.length)) && (
        <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          {feedback.summary && (
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Summary
              </p>
              <p className="text-zinc-950 dark:text-zinc-50 text-sm mt-1">
                {feedback.summary}
              </p>
            </div>
          )}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Strengths
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-950 dark:text-zinc-50 mt-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Improvements
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-950 dark:text-zinc-50 mt-1">
                {feedback.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {feedback.hints && feedback.hints.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Hints
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-950 dark:text-zinc-50 mt-1">
                {feedback.hints.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
