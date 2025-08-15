import BreadSvg from "/assets/images/svg/food-type-counter/bread.svg";
import MeatSvg from "/assets/images/svg/food-type-counter/meat.svg";
import FishSvg from "/assets/images/svg/food-type-counter/fish.svg";
import CheeseSvg from "/assets/images/svg/food-type-counter/cheese.svg";
import VegetablesSvg from "/assets/images/svg/food-type-counter/vegetables.svg";
import OtherFoodsSvg from "/assets/images/svg/food-type-counter/other-foods.svg";
import style from "./FoodTypeCounter.module.css";

export default function FoodTypeCounter({ freshFoods, cannedFoods }) {
  const typesOfFood = [
    { type: "bread", svgImage: BreadSvg },
    { type: "meat", svgImage: MeatSvg },
    { type: "fish", svgImage: FishSvg },
    { type: "cheese", svgImage: CheeseSvg },
    { type: "vegetables", svgImage: VegetablesSvg },
    { type: "other", svgImage: OtherFoodsSvg },
  ];

  const findQuantity = (foods, foodType) => {
    let result = 0;
    const findFood = foods.find((item) => item.type === foodType);
    if (findFood) {
      result = findFood.quantity;
    }
    return result;
  };

  const foodCategory = (foods, category) => {
    const isFresh = category === "fresh";

    return (
      <div className={style.foodCategory}>
        <p>{isFresh ? "Fresh Food" : "Canned Food"}</p>
        <div
          aria-label={`${isFresh ? "fresh" : "canned"} foods quantity`}
          className={style.foodsTypeContainer}
        >
          {typesOfFood.map((food) => {
            return (
              <div key={food.type} className={style.foodsCounter}>
                <img src={food.svgImage} className={style.foodTypeImage} />
                <p aria-label={food.type}>
                  {findQuantity(
                    foods,
                    isFresh ? food.type : `canned-${food.type}`
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={style.foodTypeCounter}>
      {freshFoods && foodCategory(freshFoods, "fresh")}
      {cannedFoods && foodCategory(cannedFoods, "canned")}
    </div>
  );
}
