import Link from "next/link";

export default function MentorLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3 flex gap-6">
        <Link
          href="/mentor/dashboard"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 font-medium"
        >
          Dashboard
        </Link>
        <Link
          href="/mentor/generate"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 font-medium"
        >
          Generate new
        </Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
