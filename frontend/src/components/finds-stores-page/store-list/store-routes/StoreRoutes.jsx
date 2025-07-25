import walkSvg from "/assets/svg/walk.svg";
import bicycleSvg from "/assets/svg/bicycle.svg";
import driveSvg from "/assets/svg/drive.svg";
import transitSvg from "/assets/svg/transit.svg";
import style from "./StoreRoutes.module.css";

export default function StoreRoutes({ routes }) {
  const routeDistanceUnitFormatted = (routeTimeUnit) => {
    let timeName;

    switch (routeTimeUnit) {
      case "years":
        timeName = "y";
        break;
      case "days":
        timeName = "d";
        break;
      case "hours":
        timeName = "h";
        break;
      case "minutes":
        timeName = "m";
        break;
      case "seconds":
        timeName = "s";
        break;
    }

    return timeName;
  };

  const routeSvg = (routeType) => {
    let svg;
    switch (routeType) {
      case "walk":
        svg = walkSvg;
        break;
      case "bicycle":
        svg = bicycleSvg;
        break;
      case "drive":
        svg = driveSvg;
        break;
      case "transit":
        svg = transitSvg;
        break;
    }
    return svg;
  };

  return (
    <div
      className={style.storeRoutesContainer}
      aria-label={`list of routes to get to the store`}
    >
      {routes &&
        Object.entries(routes).map(([mode, data], index) => (
          <div
            key={index}
            className={style.routeContainer}
            role="group"
            aria-label={`type of route ${mode}`}
          >
            <div className={style.routeDistanceContainer}>
              <img src={routeSvg(mode)} className={style.routeTypeSvg} />
              <div
                className={style.routeDistance}
                aria-label={`distance ${data.distanceMeters.distance} ${data.distanceMeters.distanceUnit}`}
              >
                <p aria-hidden="true">{data.distanceMeters.distance}</p>
                <p className={style.routeDistanceUnit} aria-hidden="true">
                  {data.distanceMeters.distanceUnit}
                </p>
              </div>
            </div>

            <div
              className={style.routeDurationContainer}
              aria-label={`travel time`}
            >
              {data.duration &&
                Object.entries(data.duration).map(([mode, data], index) => (
                  <div
                    key={index}
                    className={style.routeDuration}
                    aria-label={`${data} ${mode}`}
                  >
                    <p aria-hidden="true">{data}</p>
                    <p className={style.routeDurationUnit} aria-hidden="true">
                      {routeDistanceUnitFormatted(mode)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
