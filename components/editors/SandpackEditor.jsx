"use client";

import { useSandpack } from "@codesandbox/sandpack-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

function SandpackSubmit({ assignmentId, onSubmit }) {
  const { sandpack } = useSandpack();
  const files = sandpack?.files ?? {};
  const appCode = files["/App.js"]?.code ?? "";

  const handleSubmit = () => {
    onSubmit({
      assignment_id: assignmentId,
      files: { "/App.js": appCode },
    });
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
      >
        Submit
      </button>
    </div>
  );
}

export default function SandpackEditor({ assignmentId, starterCode, onSubmit }) {
  const files = {
    "/App.js": {
      code: starterCode || "export default function App() {\n  return <div>Hello</div>;\n}\n",
    },
  };

  return (
    <div className="min-h-[300px] rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <SandpackProvider
        template="react"
        files={files}
        theme="light"
      >
        <SandpackLayout>
          <SandpackCodeEditor
            style={{ minHeight: 280 }}
            showLineNumbers
          />
          <SandpackPreview style={{ minHeight: 280 }} />
        </SandpackLayout>
        <SandpackSubmit assignmentId={assignmentId} onSubmit={onSubmit} />
      </SandpackProvider>
    </div>
  );
}
