import { useState } from "react";
import style from "./AddStoreItem.module.css";

export default function AddStoreItem({
  storesList,
  statusChanged,
  setStatusChanged,
  setMessage,
  setError,
  parentComponent,
}) {
  const typesOfFood = [
    "bread",
    "meat",
    "fish",
    "cheese",
    "vegetables",
    "other",
  ];
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);

    const formData = {
      storeId: event.target["stores"].value,
      itemName: event.target["item-name"].value,
      itemType: event.target["item-type"].value,
      itemPrice: event.target["item-price"].value,
      productionDate: event.target["production-date"].value,
      expirationDate: event.target["expiration-date"].value,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stores/new-store-inventory-items`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const newToken = response.headers.get("Authorization");
      const data = await response.json();

      if (response.ok) {
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        }
        setMessage(data.message);
        setTimeout(() => setMessage(null), 2000);
        setStatusChanged(!statusChanged);
      }
    } catch (error) {
      setError(error);
      setTimeout(() => setError(null), 3000);
    } finally {
      setShowLoader(false);
      event.target.reset();
    }
  };

  return (
    <>
      {storesList && (
        <form
          onSubmit={handleSubmit}
          className={`${style.addStoreItemFrom} ${
            parentComponent === "items-list"
              ? style.parentComponentItemsList
              : ""
          }`}
        >
          <div>
            <label htmlFor="stores">Store</label>
            <select
              name="stores"
              id="stores"
              defaultValue={storesList.length === 1 ? storesList[0].name : ""}
              disabled={storesList.length === 1 ? true : false}
              required
            >
              <option value="" disabled hidden>
                Choose a store
              </option>
              {storesList.map((store) => {
                return (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                );
              })}
            </select>

            <label htmlFor="item-name">Food Name</label>
            <input
              type="text"
              id="item-name"
              name="item-name"
              minLength={1}
              maxLength={30}
              placeholder="Enter the item name"
              required
            />

            <label htmlFor="item-type">Food Type</label>
            <select name="item-type" id="item-type" defaultValue="" required>
              <option value="" disabled hidden>
                Choose a type
              </option>
              <optgroup label="Fresh Food">
                {typesOfFood.map((type) => {
                  return (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  );
                })}
              </optgroup>
              <optgroup label="Canned Food">
                {typesOfFood.map((type) => {
                  return (
                    <option key={`canned-${type}`} value={`canned-${type}`}>
                      {type}
                    </option>
                  );
                })}
              </optgroup>
            </select>

            <label htmlFor="item-price">Price</label>
            <input
              type="number"
              name="item-price"
              id="item-price"
              min={0.01}
              step={0.01}
              placeholder="Enter the item price"
              required
            />

            <label htmlFor="production-date">Production Date</label>
            <input
              type="date"
              id="production-date"
              name="production-date"
              required
            />

            <label htmlFor="expiration-date">Expiration Date</label>
            <input
              type="date"
              id="expiration-date"
              name="expiration-date"
              required
            />
            {!showLoader && <button type="submit">Add Food</button>}
            {showLoader && (
              <div className={style.loader} role="status">
                <span className="sr-only">Adding new item, please wait</span>
              </div>
            )}
          </div>
        </form>
      )}
    </>
  );
}
