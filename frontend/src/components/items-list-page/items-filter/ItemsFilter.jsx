import { useRef } from "react";

const numericFilters = [
  { label: "Price", attribute: "price", parameter: "price" },
  {
    label: "Expiration Date",
    attribute: "expiration-date",
    parameter: "expirationDate",
  },
  {
    label: "Days Remaining",
    attribute: "days-remaining",
    parameter: "daysRemaining",
  },
];

export default function ItemsFilter({
  itemsList,
  setItemsList,
  setSearchText,
  typesFilter,
  setSelectedType,
}) {
  const selectRefs = useRef({});

  let searchHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  const handleNumericFilters = (filterName, selectedValue) => {
    Object.entries(selectRefs.current).forEach(([key, ref]) => {
      if (key !== filterName && ref) {
        ref.value = "none";
      }
    });
    const sortedItems = [...itemsList];
    switch (selectedValue) {
      case "ascending":
        sortedItems.sort((a, b) => a[filterName] - b[filterName]);
        break;
      case "descending":
        sortedItems.sort((a, b) => b[filterName] - a[filterName]);
        break;
      default:
        sortedItems.sort((a, b) => a.id - b.id);
    }
    setItemsList(sortedItems);
  };

  return (
    <div>
      <label htmlFor="items-search">Search</label>
      <input
        type="text"
        onChange={searchHandler}
        name="items-search"
        id="items-search"
      />

      <label htmlFor="select-type">Type</label>
      <select
        name="select-type"
        id="select-type"
        defaultValue="none"
        onChange={(e) => setSelectedType(e.target.value)}
      >
        {typesFilter.map((type) => {
          return (
            <option value={type} key={type}>
              {type}
            </option>
          );
        })}
      </select>

      {numericFilters.map((filter) => {
        return (
          <>
            <label htmlFor={`items-${filter.attribute}`}>{filter.label}</label>
            <select
              name={`items-${filter.attribute}`}
              id={`items-${filter.attribute}`}
              onChange={(e) =>
                handleNumericFilters(filter.parameter, e.target.value)
              }
              ref={(el) => (selectRefs.current[filter.parameter] = el)}
              defaultValue="none"
            >
              <option value="none">none</option>
              <option value="ascending">ascending</option>
              <option value="descending">descending</option>
            </select>
          </>
        );
      })}
    </div>
  );
}
