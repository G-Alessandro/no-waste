import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import AddStoreItem from "../finds-stores-page/add-store-item/AddStoreItem";
import ItemsFilter from "./items-filter/ItemsFilter";
import ItemsTable from "./items-table/ItemsTable";

export default function ItemsList() {
  const location = useLocation();
  const { store } = location.state;
  const [userId, setUserId] = useState(null);
  const [itemsList, setItemsList] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [typesFilter, setTypesFilter] = useState([]);
  const [selectedType, setSelectedType] = useState("none");
  const [statusChanged, setStatusChanged] = useState(false);

  useEffect(() => {
    const fetchStoreItemList = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/stores/items-list/${store.id}`,
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
          }
        );

        const data = await response.json();
        if (!data) {
          setError("No data found");
          setTimeout(() => setError(null), 5000);
        } else {
          setItemsList(data.itemsList);
        }
      } catch (error) {
        setError(error);
        setTimeout(() => setError(null), 5000);
        console.log("Error while searching for items:", error);
      }
    };
    fetchStoreItemList();
  }, [statusChanged]);

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
      {error && <p aria-live="polite">{error}</p>}
      {itemsList && (
        <section>
          <AddStoreItem
            statusChanged={statusChanged}
            setStatusChanged={setStatusChanged}
            userId={userId}
            storesList={[store]}
            setMessage={setMessage}
            setError={setError}
          />
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
          {!itemsList && <p>Loading Items....</p>}
          {itemsList && (
            <ItemsTable
              userId={userId}
              itemsList={itemsList}
              hideItem={hideItem}
              setMessage={setMessage}
              setError={setError}
              statusChanged={statusChanged}
              setStatusChanged={setStatusChanged}
            />
          )}
        </section>
      )}
    </main>
  );
}
