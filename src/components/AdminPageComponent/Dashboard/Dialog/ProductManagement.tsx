import React, {useLayoutEffect, useState} from 'react';
import {Input, Spacer, Textarea, Image} from "@nextui-org/react";
import {useToast} from "@/hooks/useToast";

interface ProductManagementProps {
_id: string;
};

function ProductManagement({_id}: ProductManagementProps) {
    const {error, success} = useToast();
    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");

    useLayoutEffect(()=> {
        fetch('/api/v1/info/search-by-id?ids=' + _id).then(async (res) => {
            const data = await res.json();
            if (res.status !== 200) {
                return;
            }
            setProductName(data[0].name);
            setPrice(data[0].price);
            setDiscount(data[0].discount);
            setDescription(data[0].description);
            setImage(data[0].image);
        });
    }, [_id])
    const updateOrCreateProduct = () => {
        fetch('/api/v1/admin/product/update', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: _id,
                name: productName,
                price: price,
                discount: discount,
                description: description
            })
        }).then(async (res) => {
            const data = await res.json();
            if (res.status !== 200) {
                return;
            }
        });
    }
    return (
        <div className={"flex flex-col justify-center items-center gap-4"}>
            <Image
                src={image}
                width={400}
                height={400}
                alt={productName}
                className={"object-cover w-full"}
                // radius={"none"}
            />
            <Input
                placeholder={"Tên món"}
                type={"text"}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}/>
            <Input
                placeholder={"Giá"}
                type={"number"}
                endContent={<div>.000đ</div>}
                value={price.toString()}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Input
                placeholder={"Giảm giá"}
                type={"number"}
                endContent={<div>%</div>}
                value={discount.toString()}
                onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <Textarea
                placeholder={"Mô tả"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Spacer y={1}/>
            <div className={"flex justify-center items-center gap-2"}>
                <button className={"bg-primary text-white rounded-md px-4 py-2"} onClick={updateOrCreateProduct}>Cập
                    nhật
                </button>
                <button className={"bg-red-500 text-white rounded-md px-4 py-2"}>Xóa</button>
            </div>
        </div>
    );
}

export default ProductManagement;