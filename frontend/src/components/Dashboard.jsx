export default function Dashboard({ user, onLogout }) {
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>ExpenseFlow</h1>

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="dashboard-content">
        <h2>Welcome back, {user.name}!</h2>
        <p>Here's an overview of your finances.</p>
      </section>
    </main>
  );
}
