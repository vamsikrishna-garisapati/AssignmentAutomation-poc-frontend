"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getTopics,
  generateAssignment,
  createAssignment,
} from "@/lib/api";
import TopicSelector from "@/components/mentor/TopicSelector";
import AssignmentPreview from "@/components/mentor/AssignmentPreview";
import StudentAssigner from "@/components/mentor/StudentAssigner";

const ASSIGNMENT_TYPES = [
  { value: "react", label: "React" },
  { value: "sql", label: "SQL" },
  { value: "python", label: "Python" },
  { value: "html_css", label: "HTML/CSS" },
];
const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const STEPS = 5;

export default function MentorGeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [assignmentType, setAssignmentType] = useState("python");
  const [difficulty, setDifficulty] = useState("easy");
  const [generated, setGenerated] = useState(null);
  const [createdId, setCreatedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .catch((e) => setError(e.message));
  }, []);

  const handleGenerate = () => {
    setError(null);
    setLoading(true);
    generateAssignment({
      topic_ids: selectedTopicIds,
      difficulty,
      assignment_type: assignmentType,
    })
      .then((data) => {
        setGenerated(data);
        setStep(4);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  const handleSave = (payload) => {
    return createAssignment(payload).then((created) => {
      setCreatedId(created.id);
      setStep(5);
      return created;
    });
  };

  const handleAssigned = () => {
    router.push(`/mentor/assignment?id=${createdId}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mb-2">
        Generate assignment
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Step {step} of {STEPS}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <TopicSelector
            topics={topics}
            selectedIds={selectedTopicIds}
            onChange={setSelectedTopicIds}
          />
          <button
            type="button"
            onClick={() => setStep(2)}
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Assignment type
            </label>
            <div className="flex flex-wrap gap-2">
              {ASSIGNMENT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAssignmentType(value)}
                  className={`rounded-lg border px-4 py-2 font-medium ${
                    assignmentType === value
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                      : "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDifficulty(value)}
                  className={`rounded-lg border px-4 py-2 font-medium ${
                    difficulty === value
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                      : "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && generated && (
        <div className="space-y-4">
          <AssignmentPreview
            assignment={{
              ...generated,
              topics: (generated.topics || []).map((t) =>
                typeof t === "object" ? t : { id: t, name: String(t) }
              ),
            }}
            topicIds={selectedTopicIds}
            editable
            onSave={handleSave}
          />
          <button
            type="button"
            onClick={() => setStep(2)}
            className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Back to type & difficulty
          </button>
        </div>
      )}

      {step === 5 && createdId && (
        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Assignment saved. Assign it to students below.
          </p>
          <StudentAssigner
            assignmentId={createdId}
            onAssigned={handleAssigned}
          />
          <button
            type="button"
            onClick={() => router.push("/mentor/dashboard")}
            className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Skip — go to dashboard
          </button>
        </div>
      )}

    </div>
  );
}
