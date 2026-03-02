import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950 px-6">
      <main className="flex flex-col items-center gap-8 max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Assignment Automation POC
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Choose your role to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/mentor/dashboard"
            className="flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Mentor Dashboard
          </Link>
          <Link
            href="/student/assignments"
            className="flex h-12 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-600 px-6 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Student Assignments
          </Link>
        </div>
      </main>
    </div>
  );
}
