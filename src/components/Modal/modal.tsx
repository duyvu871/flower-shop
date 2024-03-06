"use client";
import "./modal.css";
import {ReactNode, useContext, useState} from "react";

export default function PopupLayout({
children, popupTitle, onClose, isShowPopup, disableCloseButton = false
}: {
    children: ReactNode;
    popupTitle: string;
    onClose: (status: boolean) => void;
    isShowPopup: boolean;
    disableCloseButton?: boolean;
}) {
    const closeHandler = () => {
       onClose(false);
    }
    return (
        <div className="overlay" style={{
            visibility: isShowPopup ? "visible" : "hidden",
            opacity: isShowPopup ? 1 : 0,
        }}>
            <div className="popup m-0 z-[21] max-w-[350px] fixed translate-x-[-50%] translate-y-[-50%] top-[40%] left-[50%]">
                {/*<h2 className={"font-bold text-gray-800 text-xl px-2 py-3"}>{popupTitle}</h2>*/}
                {
                    disableCloseButton ? null : <span className="close" onClick={closeHandler}>&times;</span>
                }
                <div className="content">{children}</div>
            </div>
            <div className={"absolute w-full h-full z-20"} onClick={closeHandler}>

            </div>
        </div>
    );
}