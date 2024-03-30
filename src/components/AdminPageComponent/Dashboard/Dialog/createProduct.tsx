import React, {useEffect, useState} from 'react';
;
import { storage } from '@/firebase/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {Input, Image, CircularProgress} from "@nextui-org/react";
import {Textarea} from "@nextui-org/input";
import {tw} from "@/ultis/tailwind.ultis";
import {useToast} from "@/hooks/useToast";

interface ProductManagementProps {
    _id: string;
};

function ProductManagement({_id}: ProductManagementProps) {
    console.log(_id);
    const {error, success, info} = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [processPercent, setProcessPercent] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isShowImage, setIsShowImage] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | undefined>(undefined)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        setSelectedFile(e.target.files[0])
    }

    const validateInput = () => {
        return !(!productName || !price || !discount || !description);
    }

    const updateOrCreateProduct = () => {
        if (!validateInput()) {
            return error("Vui lòng điền đầy đủ thông tin");
        }
        if (!selectedFile) {
            return error("Vui lòng chọn ảnh");
        }
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProcessPercent(progress);
                setIsUploading(true);
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    fetch('/api/v1/admin/product/create-product', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            // productId: _id,
                            data: {
                                name: productName,
                                price: price,
                                discount: discount,
                                description: description,
                                image: downloadURL,
                                type: _id
                            }
                        })
                    }).then(async (res) => {
                        const data = await res.json();
                        if (res.status !== 200) {
                            return;
                        }
                        setIsUploading(false);
                        success(data.message);
                    });
                });
            }
        );
    }

    useEffect(() => {
        if (!selectedFile) {
            setIsShowImage(false)
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        setIsShowImage(true);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])


    return (
        <div className={"flex flex-col justify-center items-center gap-4"}>
            <div className={tw("w-full flex justify-center items-center", isUploading ? "" : "hidden")}>
                <CircularProgress
                    aria-label="Loading..."
                    size="lg"
                    value={Number(processPercent.toFixed(0))}
                    color="success"
                    showValueLabel={true}
                />
            </div>
            <div className={tw("w-[400px] h-[200px] bg-gray-200 overflow-hidden flex justify-center items-center", isShowImage ? "" : "hidden")} onClick={() => {}}>
                <Image
                    src={preview}
                    width={200}
                    height={200}
                    alt={"preview"}
                    className={"object-cover"}
                    classNames={{
                        wrapper: "flex justify-center items-center",
                    }}
                />
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload
                    file</label>
                {/*<input*/}
                {/*    className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[2.15] text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"*/}
                {/*    aria-describedby="file_input_help" id="file_input" type="file"/>*/}
                <input
                    type={"file"}
                    className={"hover:bg-gray-100 relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[2.15] text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white border-gray-200"}
                    onChange={handleImageChange}
                    accept={"image/*"}
                />
                {/*<p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF*/}
                {/*    (MAX. 800x400px).</p>*/}
            </div>
            <Input placeholder={"Tên món"} onChange={e => setProductName(e.target.value)}/>
            <Input placeholder={"Giá"} type={"number"} endContent={<div>.000đ</div>} onChange={e => setPrice(Number(e.target.value))}/>
            <Input placeholder={"Giảm giá"} type={"number"} endContent={<div>%</div>} onChange={e => setDiscount(Number(e.target.value))}/>
            <Textarea placeholder={"Mô tả"} onChange={e => setDescription(e.target.value)}/>
            <button className={"bg-primary text-white rounded-md px-4 py-2"} onClick={updateOrCreateProduct}>Cập nhật
            </button>
        </div>
    );
}

export default ProductManagement;