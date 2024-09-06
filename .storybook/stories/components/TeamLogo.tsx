import Atlanta from "./logos/AtlantaDream.svg?react";
import Chicago from "./logos/ChicagoSky.svg?react";
import Connecticut from "./logos/ConnecticutSun.svg?react";
import Dallas from "./logos/DallasWings.svg?react";
import Indiana from "./logos/IndianaFever.svg?react";
import LasVegas from "./logos/LasVegasAces.svg?react";
import LosAngeles from "./logos/LosAngelesSparks.svg?react";
import Minnesota from "./logos/MinnesotaLynx.svg?react";
import NewYork from "./logos/NewYorkLiberty.svg?react";
import Phoenix from "./logos/PhoenixMercury.svg?react";
import Seattle from "./logos/SeattleStorm.svg?react";
import Washington from "./logos/WashingtonMystics.svg?react";
import GoldenState from "./logos/GoldenStateValkyries.png";

// indexed by team ID
const logos = [
  ,
  NewYork,
  LasVegas,
  LosAngeles,
  Atlanta,
  Chicago,
  Connecticut,
  Indiana,
  Washington,
  Dallas,
  Minnesota,
  Phoenix,
  Seattle,
  GoldenState,
];

export function TeamLogo({
  team,
  className = "h-40 w-40 m-0",
}: {
  team: string;
  className?: string;
}) {
  const Logo = logos[parseInt(team)] || (() => "Error: no logo found");

  if (typeof Logo === "string")
    return <img className={`${className} bg-white`} src={GoldenState} />;

  return <Logo className={className} />;
}
