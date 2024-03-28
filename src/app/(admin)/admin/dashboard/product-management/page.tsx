import React from 'react';
import Table from "@/components/AdminPageComponent/Dashboard/ProductManagement/Table";

interface PageProps {
    
};

function Page({}: PageProps) {
    return (
        <div className={"flex flex-col justify-start items-start gap-8"}>
            <Table type={"morning"} isRerender={true}/>
            <Table type={"afternoon"} isRerender={true}/>
            <Table type={"evening"} isRerender={true}/>
            <Table type={"other"} isRerender={true}/>
        </div>
    );
}

export default Page;