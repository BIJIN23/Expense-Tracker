import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import ExpenseChart from "./ExpenseChart";
import TransactionList from "./TransactionList";
import TransactionForm from "./TransactionForm";

export default function Dashboard({ user, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);

  function formatCurrency(cents) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(cents / 100);
  }

  function handleDelete(transaction) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${transaction.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setDeletingId(transaction.id);

    apiRequest(`/transactions/${transaction.id}`, {
      method: "DELETE",
    })
      .then(() => {
        if (editingTransaction?.id === transaction.id) {
          setShowForm(false);
          setEditingTransaction(null);
        }

        setRefreshKey((current) => current + 1);
      })
      .catch((err) => {
        setDeleteError(err.message);
      })
      .finally(() => {
        setDeletingId(null);
      });
  }
  useEffect(() => {
    setError("");
    setLoading(true);

    apiRequest("/transactions/summary")
      .then((data) => {
        setSummary(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey]);

  if (loading) {
    return <p> Getting users Data....</p>;
  }
  if (error) {
    return <p>{error}....</p>;
  }
  if (!summary) {
    return <p>No financial data available.</p>;
  }

  return (
    <main className="dashboard-page">
      {deleteError && (
        <p className="form-error" role="alert">
          {deleteError}
        </p>
      )}
      <header className="dashboard-header">
        <h1>ExpenseFlow</h1>

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-topbar">
          <div>
            <h2>Welcome back, {user.name}!</h2>
            <p>Here's an overview of your finances.</p>
          </div>

          <button
            type="button"
            className="add-transaction-btn"
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
          >
            + Add Transaction
          </button>
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Total Income</h3>
            <p>{formatCurrency(summary.totalIncomeCents)}</p>
          </div>

          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p>{formatCurrency(summary.totalExpenseCents)}</p>
          </div>

          <div className="summary-card">
            <h3>Balance</h3>
            <p>{formatCurrency(summary.balanceCents)}</p>
          </div>
        </div>
        <ExpenseChart key={`chart-${refreshKey}`} />
        <TransactionList
          key={`list-${refreshKey}`}
          onEdit={(transaction) => {
            setEditingTransaction(transaction);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          deletingId={deletingId}
        />

        {showForm && (
          <TransactionForm
            key={editingTransaction?.id ?? "new"}
            transaction={editingTransaction}
            onSuccess={() => {
              setShowForm(false);
              setEditingTransaction(null);
              setRefreshKey((current) => current + 1);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
          />
        )}
      </section>
    </main>
  );
}
