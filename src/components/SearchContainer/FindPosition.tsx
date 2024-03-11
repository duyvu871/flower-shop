import React from 'react';
import {Input} from "@nextui-org/react";
import {FaLocationDot} from "react-icons/fa6";
import {FaLocationArrow} from "react-icons/fa";
import {getCurrentTimeOfDay} from "@/ultis/check-date.ultis";

interface FindPositionProps {
    
};

function FindPosition({}: FindPositionProps) {
    const [timeOfDay, setTimeOfDay] = React.useState<string>(getCurrentTimeOfDay().message);
    React.useEffect(() => {
        setTimeOfDay(getCurrentTimeOfDay().message);
    }, []);
    return (
        <div className={"absolute sm:left-0 m-8 w-[300px] h-auto bg-white p-5 border-gray-400 border-[1px] rounded-xl"}>
            <h2 className={"font-bold"}>Chào {timeOfDay.toLowerCase()}</h2>
            <h1 className={"font-bold text-3xl"}>Chúng tôi có thể giao đồ ăn của bạn đến đâu?</h1>
            <div className={"flex justify-between items-center my-4"}>
                <Input
                    type="text"
                    // label="Vị trí"
                    placeholder="1 Hùng Vương, Điện Biên, Ba Đình, Hà Nội"
                    labelPlacement="outside"
                    startContent={
                        <FaLocationDot className="text-xl text-orange-600 pointer-events-none flex-shrink-0"/>
                    }
                />
            </div>
            <button
                className={"w-full bg-orange-600 text-white p-2 rounded-md flex flex-row justify-center items-center gap-2"}>
                <span>Xác nhận</span>
                <FaLocationArrow/>
            </button>
        </div>
    );
}

export default FindPosition;