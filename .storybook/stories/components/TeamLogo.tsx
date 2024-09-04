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
];

export function TeamLogo({ team }: { team: string }) {
  const Logo = logos[parseInt(team)] || (() => "Error: no logo found");
  return <Logo className="h-40 w-40 m-0" />;
}
