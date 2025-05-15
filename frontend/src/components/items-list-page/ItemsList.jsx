import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import ItemsFilter from "./items-filter/ItemsFilter";
import ItemsTable from "./items-table/ItemsTable";

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
  const [itemsListStatusChanged, setItemsListStatusChanged] = useState(false);

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
  }, [itemsListStatusChanged]);

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
          {!itemsList && <p>Loading Items....</p>}
          {itemsList && (
            <ItemsTable
              userId={userId}
              itemsList={itemsList}
              hideItem={hideItem}
              setMessage={setMessage}
              setErrorMessage={setErrorMessage}
              itemsListStatusChanged={itemsListStatusChanged}
              setItemsListStatusChanged={setItemsListStatusChanged}
            />
          )}
        </section>
      )}
    </main>
  );
}
