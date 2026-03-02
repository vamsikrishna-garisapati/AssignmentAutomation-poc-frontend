This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Phase E — Submission verification checklist

Use this checklist to verify submission and grading for all four assignment types. Backend must be running (e.g. `python manage.py runserver`) with required env (e.g. `OPENROUTER_API_KEY`, `JUDGE0_*` for Python). Frontend: `pnpm dev`.

1. **Python**
   - Mentor: create a Python assignment (Generate → topics, type Python, difficulty → Generate → Save → Assign to student).
   - Student: open **My assignments**, open the assignment, edit code in the editor, click **Submit**.
   - Expect: brief "Grading…" then score bar, test results table, and AI feedback (summary, strengths, improvements, hints). No 400/500.

2. **SQL**
   - Same as above with an SQL assignment. Run query locally if desired, then **Submit**.
   - Expect: same result UI after submit.

3. **React**
   - Same with a React assignment. Edit in Sandpack, click **Submit**.
   - Expect: same result UI.

4. **HTML/CSS**
   - Same with an HTML/CSS assignment. Edit HTML/CSS and use the live preview, then **Submit**.
   - Expect: same result UI.

5. **Polling (optional)**  
   If the backend is later changed to return 201 with `status: "grading"` instead of `"completed"`, the UI should show "Grading…" and then update to the result after a few seconds without code changes.
