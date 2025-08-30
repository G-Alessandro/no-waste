import TopBar from "../top-bar/TopBar";
import AppDescription from "./app-description/AppDescription.jsx";
import HowAppWork from "./how-app-work/HowAppWork.jsx";
import Footer from "../footer/Footer";
import style from "./HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <main className={style.homePageMain}>
        <TopBar topBarLocation={"home"} />
        <AppDescription />
        <HowAppWork />
      </main>
      <Footer />
    </>
  );
}
