import {useContext} from "react";
import {LivechatWidgetContext} from "@/contexts/liveChatWidgetContext";

export function useLiveChatWidget() {
    const context = useContext(LivechatWidgetContext);
    if (!context) {
        throw new Error('useLiveChatWidget must be used within a LiveChatProvider');
    }
    return context;
}