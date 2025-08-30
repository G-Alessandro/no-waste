import { Link } from "react-router-dom";
import style from "./HowAppWork.module.css";

const appSteps = [
  {
    img: "/assets/images/home-page/find-your-location.png",
    imgAlt:
      "type your location in the input bar and select your chosen location from the drop-down menu",
    stepDescription: "Find your location",
  },
  {
    img: "/assets/images/home-page/store-list.png",
    imgAlt: "scroll through the list of stores to select the one you prefer",
    stepDescription: "See stores near you",
  },
  {
    img: "/assets/images/home-page/food-list.png",
    imgAlt: "click on the food list button to see the list of foods for sale",
    stepDescription: "See what foods are on sale",
  },
];

const addSteps = [
  {
    img: "/assets/images/home-page/add-store.png",
    imgAlt: "click the add store button to add a new store",
    stepDescription: "Add a store",
  },
  {
    img: "/assets/images/home-page/add-item.png",
    imgAlt: "click the add food button to add a new store",
    stepDescription: "Add food",
  },
];

export default function HowAppWork() {
  return (
    <section className={style.HowAppWorkSection}>
      <h2>How does it work?</h2>
      <div>
        {appSteps.map((step, index) => {
          return (
            <div key={index} className={index % 2 === 0 ? "" : style.imgRight}>
              <img src={step.img} alt={step.imgAlt} />
              <p aria-hidden="true">{step.stepDescription}</p>
            </div>
          );
        })}
      </div>
      <h2>
        Don't see your favorite store or food?
        <Link to="/login"> Log-in </Link>
        to Add it!
      </h2>
      <div>
        {addSteps.map((step, index) => {
          return (
            <div key={index} className={index % 2 === 0 ? "" : style.imgRight}>
              <img src={step.img} alt={step.imgAlt} />
              <p aria-hidden="true">{step.stepDescription}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
