import React from 'react';
import Table from "@/components/AdminPageComponent/Dashboard/ProductManagement/Table";

interface PageProps {
    
};

function Page({}: PageProps) {
    return (
        <div className={"flex flex-col justify-start items-start gap-8"}>
            <Table type={"morning"} isRerender={false}/>
            <Table type={"afternoon"} isRerender={false}/>
            <Table type={"evening"} isRerender={false}/>
            <Table type={"other"} isRerender={true}/>
        </div>
    );
}

export default Page;