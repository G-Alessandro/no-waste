export default function AddStoreItem({
  userId,
  storesData,
  setMessage,
  setError,
}) {
  const typesOfFood = [
    "bread",
    "meat",
    "fish",
    "cheese",
    "vegetables",
    "other",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      userId: userId,
      storeId: event.target["stores"].value,
      itemName: event.target["item-name"].value,
      itemType: event.target["item-type"].value,
      productionDate: event.target["production-date"].value,
      expirationDate: event.target["expiration-date"].value,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/new-store-inventory-items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="stores">Stores</label>
      <select name="stores" id="stores" required>
        {storesData.map((store) => {
          return (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          );
        })}
      </select>

      <label htmlFor="item-name">Item Name</label>
      <input
        type="text"
        id="item-name"
        name="item-name"
        minLength={1}
        maxLength={30}
        required
      />

      <label htmlFor="item-type">Item Type</label>
      <select name="item-type" id="item-type" required>
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

      <label htmlFor="production-date">Production Date</label>
      <input type="date" id="production-date" name="production-date" required />

      <label htmlFor="expiration-date">Expiration Date</label>
      <input type="date" id="expiration-date" name="expiration-date" required />

      <button type="submit">Add Item</button>
    </form>
  );
}
