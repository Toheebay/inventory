import React, { useEffect, useState } from "react";

const StockItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/items")  // your backend API URL here
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading stock items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Stock Items</h1>
      {items.length === 0 && <p>No items found.</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} {/* adjust to your data shape */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockItems;
