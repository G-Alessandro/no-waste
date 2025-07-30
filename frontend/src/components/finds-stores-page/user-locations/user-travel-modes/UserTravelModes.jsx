export default function UserTravelModes({ travelMode, setTravelMode }) {
  const handleLocationChange = (event) => {
    const value = event.target.value;
    setTravelMode(value);
  };

  return (
    <>
      <label htmlFor="user-travel-modes">Travel Mode</label>
      <select
        id="user-travel-modes"
        name="user-travel-modes"
        defaultValue={travelMode}
        onChange={handleLocationChange}
      >
        <option value="walk">Walking</option>
        <option value="bicycle">Bicycle</option>
        <option value="drive">Car</option>
        <option value="transit">Public Transport</option>
      </select>
    </>
  );
}
