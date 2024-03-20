import React from 'react';
import {Image} from "@nextui-org/react"

interface PurchaseGuideProps {

};

function PurchaseGuide({}: PurchaseGuideProps) {
    return (
        <div className={"flex flex-col justify-center items-center p-5"}>
            <p className={"text-xl font-semibold text-center"}>
                chuyển khoản qua ngân hàng
            </p>
            <div>
                <Image
                    src={"example-assets/bankimage/bank-qr.png"}
                />
            </div>
            <div className={"flex flex-col justify-center items-center"}>
                <p className={"text-md font-normal text-center"}>
                    Vui lòng chuyển khoản đến số tài khoản trên hình.
                </p>
                <span className={"text-md font-normal text-center flex flex-col "}>
                    Nội dung chuyển khoản:
                    <p>
                        &quot<strong>nap tien ngonngon + SO_TIEN_NAP + TEN_NGUOI_NAP</strong>&quot
                    </p>
                </span>
            </div>
        </div>
    );
}

export default PurchaseGuide;