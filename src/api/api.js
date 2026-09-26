const API_BASE = "/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`,
    );
  }

  return data;
}

/* =========================
   AUTH
========================= */

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function register(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export async function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

/* =========================
   FORMS
========================= */

export async function getForms() {
  return request("/forms");
}

export async function getForm(id) {
  return request(`/forms/${id}`);
}

export async function createForm(form) {
  return request("/forms", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export async function updateForm(id, form) {
  return request(`/forms/${id}`, {
    method: "PUT",
    body: JSON.stringify(form),
  });
}

export async function deleteForm(id) {
  return request(`/forms/${id}`, {
    method: "DELETE",
  });
}

export async function publishForm(id) {
  return request(`/forms/${id}/publish`, {
    method: "PUT",
  });
}

/* =========================
   SUBMISSIONS
========================= */

export async function submitForm(formId, values) {
  return request(`/submissions`, {
    method: "POST",
    body: JSON.stringify({
      formId,
      values,
    }),
  });
}

export async function getSubmissions(formId) {
  return request(`/submissions/form/${formId}`);
}

/* =========================
   ACCESSIBILITY
========================= */

export async function runAccessibilityAudit(formId) {
  return request(`/accessibility/audit/${formId}`, {
    method: "POST",
  });
}

/* =========================
   HEALTH CHECK
========================= */

export async function checkBackend() {
  return request("/health");
}
