import { useState, useEffect } from "react";

export default function ItemsTable({
  userId,
  itemsList,
  hideItem,
  setMessage,
  setErrorMessage,
}) {
  const [showDeleteLoader, setShowDeleteLoader] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("accessToken"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (itemsList && itemsList.length > 0) {
      setShowDeleteLoader(Array(itemsList.length).fill(false));
    }
  }, [itemsList]);
  const handleShowLoader = (index) => {
    setShowDeleteLoader((prevLoader) =>
      prevLoader.map((loader, i) => (i === index ? !loader : loader))
    );
  };

  const handleDeleteItem = async (index, itemId) => {
    handleShowLoader(index);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stores/delete-item`,
        {
          method: "DELETE",
          credentials: "include",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        }
      );
      const data = await response.json();
      if (!data) {
        setErrorMessage("Item not found!");
      } else {
        setMessage(data.message);
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      setErrorMessage(error);
      console.log("Error while deleting item:", error);
    } finally {
      handleShowLoader(index);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Price</th>
          <th>Expiration date</th>
          <th>Days before expiration</th>
        </tr>
      </thead>
      <tbody>
        {itemsList.map((item, index) => {
          if (hideItem(item, "both")) return null;
          return (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{`${item.price} €`}</td>
              <td>{new Date(item.expirationDate).toLocaleDateString()}</td>
              <td>{item.daysRemaining}</td>
              {userId === item.createdByUserId && (
                <td>
                  {!showDeleteLoader[index] && (
                    <button
                      aria-label={`delete item ${item.name}`}
                      onClick={() => handleDeleteItem(index, item.id)}
                    >
                      delete
                    </button>
                  )}
                  {showDeleteLoader[index] && <div></div>}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
