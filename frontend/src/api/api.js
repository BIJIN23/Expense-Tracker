export function apiRequest(endpoint, options = {}) {
  return fetch(`/api${endpoint}`, { credentials: "include", ...options }).then(
    (res) => {
      return res.json().then((data) => {
        if (!res.ok) {
          throw new Error(data.message || "Request failed");
        }
        return data;
      });
    },
  );
}
