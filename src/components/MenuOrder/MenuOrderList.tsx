import React from 'react';
import {Button} from "@nextui-org/react";
import {getCurrentTimeOfDay, responseTimeOfDay} from "@/ultis/check-date.ultis";
import {tw} from "@/ultis/tailwind.ultis";
import {IoMdSearch} from "react-icons/io";

interface MenuOrderListProps {

};

function MenuOrderList({}: MenuOrderListProps) {
    const [currentMenu, setCurrentMenu] = React.useState<"morning"|"afternoon"|"evening"|"night">(getCurrentTimeOfDay().type as "morning"|"afternoon"|"evening"|"night");
    const handleMenuChange = (menu: "morning"|"afternoon"|"evening"|"night") => {
        setCurrentMenu(menu);
    }
    const MenuList = [ "morning", "afternoon", "evening", "night" ];
    return (
        <div className={"py-5 w-full h-fit flex flex-row flex-wrap justify-start sm:justify-end items-end gap-2 "}>
            <Button
                size="sm"
                variant="bordered"
                className={tw(
                    "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white capitalize font-bold" ,
                    // (currentMenu === "morning" ? "bg-orange-600 text-white" : "")
                )}
            >
                <IoMdSearch />
                menu sáng
            </Button>
            <Button
                size="sm"
                variant="bordered"
                className={tw(
                    "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white capitalize font-bold" ,
                    // (currentMenu === "afternoon" ? "bg-orange-600 text-white" : "")
                )}
            >
                <IoMdSearch />
                menu chiều
            </Button>
            <Button
                size="sm"
                variant="bordered"
                className={tw(
                    "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white capitalize font-bold" ,
                  //  (currentMenu === "evening" ? "bg-orange-600 text-white" : "")
                )}
            >
                <IoMdSearch />
                menu tối
            </Button>
        </div>
    );
}

export default MenuOrderList;