"use client";
import React from 'react';
import {TranslateMenuType} from "types/order";
import {PiBowlFood} from "react-icons/pi";
import {useRouter} from "next/navigation";

interface CategoriesProps {

};

function Categories({}: CategoriesProps) {
    const menuCategories = ["morning", "afternoon", "evening", "other"].map((item) => item+"-menu");
    const router = useRouter();
    return (
        <>
            {/*// <div className={"flex flex-col justify-center items-start gap-2"}>*/}
            <h1 className={"font-bold text-xl"}>Danh mục</h1>
            <div className={"w-full grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7"}>
                {menuCategories.map((item, index) => (
                    <div
                        key={"category-"+ index}
                        className={"w-full flex flex-col justify-center items-center gap-2 p-6 bg-gray-50 rounded-lg border hover:border-blue-600 transition-all"}
                        onClick={() => {
                            router.push("/admin/product-management?category="+item);
                        }}
                    >
                        <PiBowlFood size={40} className={"text-blue-600 opacity-80"}/>
                        <p>{TranslateMenuType[item]}</p>
                    </div>
                ))}
            </div>
            {/*// </div>*/}
        </>
    );
}

export default Categories;