export default function StoreSearch({ setSearchText }) {
    
  let searchHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  return (
    <>
      <label htmlFor="store-search">Search</label>
      <input
        type="text"
        onChange={searchHandler}
        name="store-search"
        id="store-search"
      />
    </>
  );
}
