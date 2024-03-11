import React from 'react';
import {Button} from "@nextui-org/react";
import {getCurrentTimeOfDay, responseTimeOfDay} from "@/ultis/check-date.ultis";
import {tw} from "@/ultis/tailwind.ultis";

interface MenuOrderListProps {

};

function MenuOrderList({}: MenuOrderListProps) {
    const [currentMenu, setCurrentMenu] = React.useState<"morning"|"afternoon"|"evening"|"night">(getCurrentTimeOfDay().type as "morning"|"afternoon"|"evening"|"night");
    const handleMenuChange = (menu: "morning"|"afternoon"|"evening"|"night") => {
        setCurrentMenu(menu);
    }
    const MenuList = [ "morning", "afternoon", "evening", "night" ];
    return (
        <div className={"p-5  w-full h-40 flex flex-row flex-wrap justify-center sm:justify-end items-end gap-2 min-h-[190px]"}>
            <Button
                size="sm"
                variant="bordered"
                className={tw(
                    "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white capitalize font-bold" ,
                    (currentMenu === "morning" ? "bg-orange-600 text-white" : "")
                )}
            >
                menu sáng
            </Button>
            <Button
                size="sm"
                variant="bordered"
                className={tw(
                    "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white capitalize font-bold" ,
                    (currentMenu === "afternoon" ? "bg-orange-600 text-white" : "")
                )}
            >
                menu chiều
            </Button>
            <Button
                size="sm"
                variant="bordered"
                className={tw(
                    "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white capitalize font-bold" ,
                    (currentMenu === "evening" ? "bg-orange-600 text-white" : "")
                )}
            >
                menu tối
            </Button>
        </div>
    );
}

export default MenuOrderList;