import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import ItemsFilter from "./items-filter/ItemsFilter";
import newItemsList from "../../utils/FakeItemsList";

export default function ItemsList() {
  const [itemsList, setItemsList] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [typesFilter, setTypesFilter] = useState([]);
  const [selectedType, setSelectedType] = useState("none");

  //Remove after uncomment
  useEffect(() => {
    setItemsList(newItemsList);
  }, []);

  const location = useLocation();
  const { storeId } = location.state;

  //   useEffect(() => {
  //     const fetchStoreItemList = async () => {
  //       try {
  //         const response = await fetch(
  //           `${import.meta.env.VITE_BACKEND_URL}/stores/items-list/${storeId}`,
  //           {
  //             method: "GET",
  //             credentials: "include",
  //             mode: "cors",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );

  //         const data = await response.json();
  //         if (!data) {
  //           setErrorMessage("No data found");
  //         } else {
  //           setItemsList(data.itemsList);
  //         }
  //       } catch (error) {
  //         setErrorMessage(error);
  //         console.log("Error fetching user data:", error);
  //       }
  //     };
  //     fetchStoreItemList();
  //   }, []);

  //aggiungere possibilità di eliminare un item inviando gli id dal backend

  useEffect(() => {
    if (itemsList && itemsList.length > 0) {
      const visibleItems = itemsList.filter((item) => !hideItem(item));
      const types = [...new Set(visibleItems.map((item) => item.type))];
      types.unshift("none");
      setTypesFilter(types);
    }
  }, [itemsList, selectedType, searchText]);

  function hideItem(item) {
    const hideByType = selectedType !== "none" && selectedType !== item.type;
    const hideBySearch =
      searchText && !item.name.toLowerCase().includes(searchText.toLowerCase());
    return hideByType || hideBySearch;
  }

  return (
    <main>
      <TopBar />
      {errorMessage && <div>{errorMessage}</div>}
      {itemsList && !errorMessage && (
        <section>
          <ItemsFilter
            itemsList={itemsList}
            setItemsList={setItemsList}
            setSearchText={setSearchText}
            typesFilter={typesFilter}
            setSelectedType={setSelectedType}
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
              {itemsList.map((item) => {
                if (hideItem(item)) return null;
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{`${item.price} €`}</td>
                    <td>
                      {new Date(item.expirationDate).toLocaleDateString()}
                    </td>
                    <td>{item.daysRemaining}</td>
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
