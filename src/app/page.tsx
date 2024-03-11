import HomePage from "@/containers/HomePage";
import {MenuDataProvider} from "@/contexts/MenuDataContext";

export default function Home() {
  return (
      <MenuDataProvider>
        <HomePage />
      </MenuDataProvider>
  );
}
