let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export function apiRequest(endpoint, options = {}) {
  return fetch(`/api${endpoint}`, {
    credentials: "include",
    ...options,
  }).then((response) => {
    return response.json().then((data) => {
      if (!response.ok) {
        const error = new Error(data.message || "Request failed");

        error.status = response.status;

        if (
          response.status === 401 &&
          endpoint !== "/auth/me" &&
          endpoint !== "/auth/login"
        ) {
          onUnauthorized?.();
        }

        throw error;
      }

      return data;
    });
  });
}
