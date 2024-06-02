import { LiveChatWidgetProvider } from "@/contexts/liveChatWidgetContext"
import OrderModal from "@/components/Modal/OrderModal"
import CartModal from "@/components/Modal/CartModal"
import MenuBar from "@/components/Menu"
import HomePage from "@/containers/HomePage"

export default function Page() {
    return (
        <LiveChatWidgetProvider>
            <MenuBar/>
            <HomePage />
            <OrderModal/>
            <CartModal/>
        </LiveChatWidgetProvider>
    )
}