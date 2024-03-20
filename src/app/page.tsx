import HomePage from "@/containers/HomePage";
import {MenuDataProvider} from "@/contexts/MenuDataContext";
import MenuBar from "@/components/Menu";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";

export default function Home() {
  return (
       <>
         <MenuBar/>
         <HomePage />
         <OrderModal/>
         <CartModal/>
       </>
  );
}
