import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function TransactionList({ onEdit, onDelete, deletingId }) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/transactions")
      .then((data) => setTransactions(data.transactions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  function formatCurrency(cents) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(cents / 100);
  }

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }
  if (transactions.length === 0) {
    return <p>No transactions yet. Add your first transaction!</p>;
  }
  return (
    <section className="transactions-card">
      <div className="transactions-header">
        <div>
          <h3>Recent Transactions</h3>
          <p>View and manage your income and expenses</p>
        </div>

        <span className="transactions-count">
          {transactions.length} transactions
        </span>
      </div>

      <div className="transaction-controls">
        <input
          type="search"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="transactions-empty">No transactions match your search.</p>
      ) : (
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th className="amount-column">Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="transaction-title">{transaction.title}</td>

                  <td>{transaction.category}</td>

                  <td>{transaction.transaction_date}</td>

                  <td>
                    <span
                      className={
                        transaction.type === "income"
                          ? "type-badge income-badge"
                          : "type-badge expense-badge"
                      }
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td
                    className={`amount-column ${
                      transaction.type === "income"
                        ? "transaction-income"
                        : "transaction-expense"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "−"}
                    {formatCurrency(transaction.amount_cents)}
                  </td>
                  <td>
                    <button
                      className="transaction-edit-btn"
                      type="button"
                      onClick={() => {
                        onEdit(transaction);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="transaction-delete-btn"
                      type="button"
                      onClick={() => {
                        onDelete(transaction);
                      }}
                    >
                      {deletingId === transaction.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
