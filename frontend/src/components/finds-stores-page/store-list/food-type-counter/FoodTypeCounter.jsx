// import FreshFoodsSvg from "/assets/svg/fresh-foods.svg";
// import CannedFoodsSvg from "/assets/svg/canned-foods.svg";
// import BreadSvg from "/assets/svg/bread.svg";
// import MeatSvg from "/assets/svg/meat.svg";
// import FishSvg from "/assets/svg/fish.svg";
// import CheeseSvg from "/assets/svg/cheese.svg";
// import VegetablesSvg from "/assets/svg/vegetables.svg";
// import OtherFoodsSvg from "/assets/svg/other-foods.svg";

export default function FoodTypeCounter({ freshFoods, cannedFoods }) {
  // const foodTypeImage = (foodType) => {
  //   const newFoodType = foodType.replace("canned-", "");
  //   switch (newFoodType) {
  //     case "bread":
  //       return BreadSvg;
  //     case "meat":
  //       return MeatSvg;
  //     case "fish":
  //       return FishSvg;
  //     case "cheese":
  //       return CheeseSvg;
  //     case "vegetables":
  //       return VegetablesSvg;
  //     case "other":
  //       return OtherFoodsSvg;
  //   }
  // };

  const foodTypeImage = (foodType) => {
    const newFoodType = foodType.replace("canned-", "");
    switch (newFoodType) {
      case "bread":
        return console.log("bread");
      case "meat":
        return console.log("meat");
      case "fish":
        return console.log("fish");
      case "cheese":
        return console.log("cheese");
      case "vegetables":
        return console.log("vegetables");
      case "other":
        return console.log("other");
    }
  };

  return (
    <div>
      <div aria-label="fresh foods quantity">
        {/* <img src={FreshFoodsSvg} /> */}
        {freshFoods.map((food) => {
          return (
            <div key={food.type} aria-label={food.type}>
              {/* <img src={foodTypeImage(food.type)} /> */}
              <p>{food.quantity}</p>
            </div>
          );
        })}
      </div>
      <div aria-label="canned foods quantity">
        {/* <img src={CannedFoodsSvg} /> */}
        {cannedFoods.map((food) => {
          return (
            <div key={food.type} aria-label={food.type}>
              {/* <img src={foodTypeImage(food.type)} /> */}
              <p>{food.quantity}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
