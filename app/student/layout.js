import Link from "next/link";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3">
        <Link
          href="/student/assignments"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 font-medium"
        >
          My assignments
        </Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
