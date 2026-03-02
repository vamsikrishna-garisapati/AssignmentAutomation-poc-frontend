const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000";

async function api(method, path, body = null) {
  const url = API_BASE.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path}: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function getHealth() {
  return api("GET", "/api/health/");
}

export function getTopics() {
  return api("GET", "/api/topics/");
}

export function generateAssignment(body) {
  return api("POST", "/api/assignments/generate/", body);
}

export function createAssignment(body) {
  return api("POST", "/api/assignments/", body);
}

export function getAssignments() {
  return api("GET", "/api/assignments/");
}

export function getAssignment(id) {
  return api("GET", `/api/assignments/${id}/`);
}

export function assignStudents(assignmentId, studentIds) {
  return api("POST", `/api/assignments/${assignmentId}/assign/`, {
    student_ids: studentIds,
  });
}

export function getStudentAssignments() {
  return api("GET", "/api/student/assignments/");
}

/**
 * POST /api/submissions/. Body must include assignment_id.
 * Per-type payload shapes (backend GraderRouter):
 * - python:  { assignment_id, code }
 * - sql:     { assignment_id, code }
 * - react:   { assignment_id, files: { '/App.js': string } }
 * - html_css: { assignment_id, files: { html, css } }
 */
export function submitSubmission(body) {
  return api("POST", "/api/submissions/", body);
}

export function getSubmission(id) {
  return api("GET", `/api/submissions/${id}/`);
}

export function runTests(body) {
  return api("POST", "/api/run-tests/", body);
}
