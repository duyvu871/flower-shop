import LandingPage from "@/containers/LandingPage";
import MenuBar from "@/components/Menu";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";
import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";


export default function Home() {
  return (
       <>
           <LiveChatWidgetProvider>
             <MenuBar/>
             <LandingPage />
             <OrderModal/>
             <CartModal/>
           </LiveChatWidgetProvider>
       </>
  );
}
