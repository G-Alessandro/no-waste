import style from "./UserTravelModes.module.css";

const modes = [
  {
    name: "Walking",
    value: "walk",
  },
  {
    name: "Bicycle",
    value: "bicycle",
  },
  {
    name: "Car",
    value: "drive",
  },
  {
    name: "Public Transport",
    value: "transit",
  },
];

export default function UserTravelModes({ travelMode, setTravelMode }) {
  const handleLocationChange = (event) => {
    const value = event.target.value;
    setTravelMode(value);
  };

  return (
    <div className={style.userLocationsSelect}>
      <label htmlFor="user-travel-modes">Travel Mode</label>
      <select
        id="user-travel-modes"
        name="user-travel-modes"
        defaultValue={travelMode}
        onChange={handleLocationChange}
      >
        {modes.map((mode) => {
          return <option value={mode.value}>{mode.name}</option>;
        })}
      </select>
    </div>
  );
}
