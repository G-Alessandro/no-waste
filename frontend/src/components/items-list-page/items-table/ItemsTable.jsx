import { useState, useEffect } from "react";
import DeleteSvg from "/assets/images/svg/delete.svg";
import style from "./ItemsTable.module.css";

export default function ItemsTable({
  userId,
  itemsList,
  hideItem,
  setMessage,
  setErrorMessage,
  statusChanged,
  setStatusChanged,
}) {
  const [showDeleteLoader, setShowDeleteLoader] = useState([]);

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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        }
      );

      const newToken = response.headers.get("Authorization");
      const data = await response.json();

      if (!data) {
        setErrorMessage("Item not found!");
      } else {
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        }
        setMessage(data.message);
        setStatusChanged(!statusChanged);
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
    <>
      {!itemsList && <p className={style.loadingItems}>Loading Items....</p>}
      {itemsList.length === 0 && (
        <p className={style.noItems}>No items on sale, add some!</p>
      )}
      {itemsList && itemsList.length > 0 && (
        <div className={style.tableContainer}>
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
                    <td>
                      {new Date(item.expirationDate).toLocaleDateString()}
                    </td>
                    <td>{item.daysRemaining}</td>
                    {userId === item.createdByUserId && (
                      <td style={{ padding: "0 10px" }}>
                        {!showDeleteLoader[index] && (
                          <button
                            aria-label={`click to delete item ${item.name} from list`}
                            onClick={() => handleDeleteItem(index, item.id)}
                          >
                            <img src={DeleteSvg} />
                          </button>
                        )}
                        {showDeleteLoader[index] && (
                          <div className={style.loader} role="status">
                            <span className="sr-only">
                              Adding new item, please wait
                            </span>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
