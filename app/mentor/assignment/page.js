import { Suspense } from "react";
import MentorAssignmentContent from "./MentorAssignmentContent";

export default function MentorAssignmentPage() {
  return (
    <Suspense
      fallback={
        <div className="text-zinc-600 dark:text-zinc-400">
          Loading assignment…
        </div>
      }
    >
      <MentorAssignmentContent />
    </Suspense>
  );
}
