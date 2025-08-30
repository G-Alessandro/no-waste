import { Link } from "react-router-dom";
import CountUp from "react-countup";
import ArrowSvg from "/assets/images/svg/home-page/app-description/arrow.svg";
import style from "./AppDescription.module.css";

const statistics = [
  {
    img: "/assets/images/svg/home-page/app-description/co2.svg",
    statisticName: "CO2 AVOIDED",
    statisticValue: 40,
    statisticUnit: "BILLION TONS",
  },
  {
    img: "/assets/images/svg/home-page/app-description/money-saved.svg",
    statisticName: "MONEY SAVED",
    statisticValue: 978,
    statisticUnit: "MILLIONS €",
  },
  {
    img: "/assets/images/svg/home-page/app-description/recycle.svg",
    statisticName: "FOOD NOT WASTED",
    statisticValue: 1452,
    statisticUnit: "TONS",
  },
];

export default function AppDescription() {
  return (
    <section className={style.appDescriptionSection}>
      <div className={style.container1}>
        <div>
          <h2>
            Help the environment <br></br> while saving money
          </h2>
          <h4>
            Discover stores near you that offer discounts on products<br></br>
            that are still good but close to expiration
          </h4>
          <Link to="/finds-stores" className={style.appDescriptionBtn}>
            See stores near you <img src={ArrowSvg} />
          </Link>
        </div>
      </div>
      <div
        className={style.container2}
        aria-label="list of environmental and economic statistics of the application"
      >
        {statistics.map((statistic) => {
          return (
            <div key={statistic.statisticName}>
              <img src={statistic.img} />
              <div>
                <h5>{statistic.statisticName}</h5>
                <div>
                  <CountUp
                    aria-label={statistic.statisticValue}
                    className={style.numberCount}
                    end={statistic.statisticValue}
                    separator={"."}
                  />
                  <p>{statistic.statisticUnit}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
