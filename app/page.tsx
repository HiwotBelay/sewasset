import { Playfair_Display, Syne } from "next/font/google";
import { HomePageClient } from "./home-page-client";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"] });
const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Home() {
  return (
    <HomePageClient playfairClassName={playfair.className} syneClassName={syne.className} />
  );
}
