import React from 'react';
import Table from "@/components/AdminPageComponent/Dashboard/ProductManagement/Table";

interface PageProps {
    
};

function Page({}: PageProps) {
    return (
        <div className={"flex flex-col justify-start items-start gap-8"}>
            <Table type={"other"}/>
        </div>
    );
}

export default Page;