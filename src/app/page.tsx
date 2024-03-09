
import HomePage from "@/containers/HomePage";
import MenuBar from "@/components/Menu";
import {UserDataProvider} from "@/contexts/UserDataContext";
import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";
import ReduxProviders from "@/app/ReduxProviders";

export default function Home() {
  return (
      <HomePage />
  );
}
