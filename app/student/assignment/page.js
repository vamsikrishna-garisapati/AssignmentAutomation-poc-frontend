import { Suspense } from "react";
import StudentAssignmentContent from "./StudentAssignmentContent";

export default function StudentAssignmentPage() {
  return (
    <Suspense
      fallback={
        <div className="text-zinc-600 dark:text-zinc-400">
          Loading assignment…
        </div>
      }
    >
      <StudentAssignmentContent />
    </Suspense>
  );
}
