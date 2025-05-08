import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import ItemsFilter from "./items-filter/ItemsFilter";

export default function ItemsList() {
  const location = useLocation();
  const { storeId } = location.state;
  const [userId, setUserId] = useState(null);
  const [itemsList, setItemsList] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [typesFilter, setTypesFilter] = useState([]);
  const [selectedType, setSelectedType] = useState("none");
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

  useEffect(() => {
    const fetchStoreItemList = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/stores/items-list/${storeId}`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
          }
        );

        const data = await response.json();
        if (!data) {
          setErrorMessage("No data found");
          setTimeout(() => setErrorMessage(null), 5000);
        } else {
          setItemsList(data.itemsList);
        }
      } catch (error) {
        setErrorMessage(error);
        setTimeout(() => setErrorMessage(null), 5000);
        console.log("Error while searching for items:", error);
      }
    };
    fetchStoreItemList();
  }, []);

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

  function hideItem(item, hideType) {
    const hideByType = selectedType !== "none" && selectedType !== item.type;
    const hideBySearch =
      searchText && !item.name.toLowerCase().includes(searchText.toLowerCase());
    if (hideType === "search") {
      return hideBySearch;
    } else {
      return hideByType || hideBySearch;
    }
  }

  return (
    <main>
      <TopBar setUserId={setUserId} />
      {message && <p aria-live="polite">{message}</p>}
      {errorMessage && <p aria-live="polite">{errorMessage}</p>}
      {itemsList && (
        <section>
          <ItemsFilter
            itemsList={itemsList}
            setItemsList={setItemsList}
            searchText={searchText}
            setSearchText={setSearchText}
            typesFilter={typesFilter}
            setTypesFilter={setTypesFilter}
            setSelectedType={setSelectedType}
            hideItem={hideItem}
          />
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
        </section>
      )}
    </main>
  );
}
