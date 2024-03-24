import React from 'react';
import Image from 'next/image';
import MenuBar from "@/components/Menu";

interface AppProps {
    
};

function Page({}: AppProps) {
    return (
        <>
            <MenuBar/>
            <div className={"flex flex-col justify-center items-center gap-4 p-6"}>
                <div className={""}>
                    <h1>Về chúng tôi</h1>
                </div>
                <div className={""}>
                    <p>Chúng tôi là nhà ăn cung cấp dịch vụ thực phẩm cho người dùng</p>
                    <Image src="/example-assets/banners/banner_1.png" alt="food" width={500} height={500}/>
                </div>
            </div>
        </>
    );
}

export default Page;