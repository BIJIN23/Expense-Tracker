import { useState } from "react";
import { apiRequest } from "../api/api";

export default function TransactionForm({
  onSuccess,
  onCancel,
  transaction = null,
}) {
  const [title, setTitle] = useState(transaction?.title ?? "");
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount_cents / 100) : "",
  );
  const [type, setType] = useState(transaction?.type ?? "expense");
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [transactionDate, setTransactionDate] = useState(
    transaction?.transaction_date ?? "",
  );
  const isEditing = Boolean(transaction);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);
    apiRequest(
      isEditing ? `/transactions/${transaction.id}` : "/transactions",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          type,
          category,
          transaction_date: transactionDate,
        }),
      },
    )
      .then(() => {
        onSuccess();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? "Edit Transaction" : "Add Transaction"}</h3>

      <label htmlFor="title"> Title </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label> type </label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <label> Category </label>
      <input
        id="category"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <label> Transaction Date </label>
      <input
        id="transactionDate"
        type="date"
        value={transactionDate}
        onChange={(e) => setTransactionDate(e.target.value)}
        required
      />
      <label htmlFor="amount">Amount (₹)</label>
      <input
        id="amount"
        type="number"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading
          ? "Saving..."
          : isEditing
            ? "Update Transaction"
            : "Save Transaction"}
      </button>

      <button type="button" onClick={onCancel} disabled={loading}>
        Cancel
      </button>
    </form>
  );
}
