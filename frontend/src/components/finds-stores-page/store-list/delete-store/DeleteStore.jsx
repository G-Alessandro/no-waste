import { Link } from "react-router-dom";
import DeleteStoreSvg from "/assets/images/svg/store-list/delete-store.svg";
import style from "./DeleteStore.module.css";

export default function DeleteStore({
  userId,
  store,
  index,
  showDeleteLoader,
  setShowDeleteLoader,
  setMessage,
  setErrorMessage,
  setStatusChanged,
  statusChanged,
}) {
  const handleShowLoader = (index) => {
    setShowDeleteLoader((prevLoader) =>
      prevLoader.map((loader, i) => (i === index ? !loader : loader))
    );
  };

  const handleDeleteStore = async (storeId, index) => {
    handleShowLoader(index);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stores/delete-store`,
        {
          method: "DELETE",
          credentials: "include",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storeId }),
        }
      );

      const newToken = response.headers.get("Authorization");
      const data = await response.json();

      if (!data) {
        setErrorMessage("Store not found!");
      } else {
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        }
        setMessage(data.message);
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      setErrorMessage(error);
      console.log("Error while deleting the store:", error);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      handleShowLoader(index);
      setStatusChanged(!statusChanged);
    }
  };

  return (
    <div className={style.itemsLinkDeleteStoreContainer}>
      {userId !== store.createdByUserId &&
        showDeleteLoader[index] === false && (
          <dic className={style.emptyDiv}></dic>
        )}

      {userId === store.createdByUserId &&
        localStorage.getItem("accessToken") &&
        showDeleteLoader[index] === false && (
          <button
            onClick={() => handleDeleteStore(store.id, index)}
            className={style.deleteStoreBtn}
            aria-label="click to delete the store"
          >
            <img src={DeleteStoreSvg} className={style.deleteStoreImg} />
          </button>
        )}
      {showDeleteLoader[index] && <div className={style.loader}></div>}

      <Link to="/items-list" state={{ store }} className={style.foodListLink}>
        Food list
      </Link>
    </div>
  );
}
