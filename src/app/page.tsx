import HomePage from "@/containers/HomePage";
import {MenuDataProvider} from "@/contexts/MenuDataContext";
import MenuBar from "@/components/Menu";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";
import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";

export default function Home() {
  return (
       <>
           <LiveChatWidgetProvider>
             <MenuBar/>
             <HomePage />
             <OrderModal/>
             <CartModal/>
           </LiveChatWidgetProvider>
       </>
  );
}
