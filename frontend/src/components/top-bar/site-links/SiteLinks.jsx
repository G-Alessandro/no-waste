import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoWasteLogo from "/assets/images/top-bar/site-links/no-waste-logo.png";
import DropDownMenu from "/assets/images/svg/top-bar/site-links/dropdown-menu.svg";
import UserDataLogout from "./user-data-logout/UserDataLogout";
import TryDemoAccount from "./try-demo-account/TryDemoAccount";
import style from "./SiteLinks.module.css";

export default function SiteLinks({
  userData,
  setUserData,
  setUserId,
  topBarLocation,
  loginSuccessful,
  setDemoLoginSuccessful,
  setLoginSuccessful,
  setFetchError,
  setLogoutMessage,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const [showNav, setShowNav] = useState(isMobile ? false : true);
  const [rotateDropdownMenu, setRotateDropdownMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
      window.innerWidth > 750 ? setShowNav(true) : setShowNav(false);
      if (window.innerWidth <= 750) {
        setRotateDropdownMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDropDownMenuClick = () => {
    setShowNav(!showNav);
    setRotateDropdownMenu(!rotateDropdownMenu);
  };

  const handleMobileLinkClick = () => {
    if (isMobile) {
      setShowNav(false);
      setRotateDropdownMenu(false);
    }
  };

  return (
    <header>
      <Link
        to="/"
        className={style.noWasteLogoLink}
        aria-disabled={isMobile ? "true" : "false"}
        aria-label="link to home"
        onClick={(e) => isMobile && e.preventDefault()}
      >
        <img src={NoWasteLogo} />
        <h1>
          <span className={style.noWastePart1}>N</span>
          <span className={style.noWastePart2}>o</span>
          <span className={style.noWastePart3}>W</span>
          <span className={style.noWastePart4}>aste</span>
        </h1>
      </Link>
      {isMobile && (
        <button
          aria-label="Click to show site navigation links"
          className={`${style.dropDownMenuBtn} ${
            rotateDropdownMenu ? style.rotated : ""
          }`}
          onClick={() => handleDropDownMenuClick()}
        >
          <img src={DropDownMenu} />
        </button>
      )}
      {showNav && (
        <nav>
          <ul>
            <li>
              <Link
                to="/"
                className={
                  topBarLocation === "home" ? style.highlightedLink : ""
                }
                onClick={() => handleMobileLinkClick()}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/finds-stores"
                className={
                  topBarLocation === "finds-stores" ? style.highlightedLink : ""
                }
                onClick={() => handleMobileLinkClick()}
              >
                FINDS STORES
              </Link>
            </li>
            {!userData && (
              <>
                <li>
                  <Link
                    to="/login"
                    className={
                      topBarLocation === "login" ? style.highlightedLink : ""
                    }
                    onClick={() => handleMobileLinkClick()}
                  >
                    SIGN-IN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/registration"
                    className={
                      topBarLocation === "registration"
                        ? style.highlightedLink
                        : ""
                    }
                    onClick={() => handleMobileLinkClick()}
                  >
                    SIGN-UP
                  </Link>
                </li>
                <li>
                  <TryDemoAccount
                    setLogoutMessage={setLogoutMessage}
                    topBarLocation={topBarLocation}
                    loginSuccessful={loginSuccessful}
                    setDemoLoginSuccessful={setDemoLoginSuccessful}
                    setLoginSuccessful={setLoginSuccessful}
                    setFetchError={setFetchError}
                    handleMobileLinkClick={handleMobileLinkClick}
                  />
                </li>
              </>
            )}
            <UserDataLogout
              userData={userData}
              setUserData={setUserData}
              setUserId={setUserId}
              setLogoutMessage={setLogoutMessage}
              handleMobileLinkClick={handleMobileLinkClick}
              topBarLocation={topBarLocation}
            />
          </ul>
        </nav>
      )}
    </header>
  );
}
