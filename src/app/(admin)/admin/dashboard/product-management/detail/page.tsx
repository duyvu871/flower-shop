"use client"
import React from 'react';
import Table from "@/components/AdminPageComponent/Dashboard/ProductManagement/Table";
import {useSearchParams} from "next/navigation";

interface PageProps {

};

function Page({}: PageProps) {
    const params = useSearchParams();
    const type = params.get("type");
    if (!type) return null;
    if (type !== "morning" && type !== "afternoon" && type !== "evening" && type !== "other") return null;
    return (
        <div className={"flex flex-col justify-start items-start gap-8"}>
            <Table type={type} isRerender={true}/>
        </div>
    );
}

export default Page;