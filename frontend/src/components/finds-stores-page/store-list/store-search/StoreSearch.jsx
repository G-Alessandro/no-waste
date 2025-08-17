import { useState } from "react";
import SearchSvg from "/assets/images/svg/store-search/search.svg";
import style from "./StoreSearch.module.css";

export default function StoreSearch({ setSearchText }) {
  const [focused, setFocused] = useState(false);

  let searchHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  return (
    <div className={style.storeSearch}>
      <input
        type="text"
        onChange={searchHandler}
        name="store-search"
        id="store-search"
        className={style.searchInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label
        htmlFor="store-search"
        aria-label="search store"
        className={`${style.searchLabel} ${
          focused ? style.searchLabelFocus : ""
        }`}
      >
        <img src={SearchSvg} />
      </label>
    </div>
  );
}
