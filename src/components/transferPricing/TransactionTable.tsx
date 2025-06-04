// Sample TransactionTable component with necessary export modifications

import React from 'react';

interface TransactionTableProps {
  transactions: any[]; // Replace 'any' with a more specific type if available
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.id}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};