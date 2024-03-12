import React, {useContext} from 'react';
import Carousel from "react-multi-carousel";
import {ShopItemCardMemo} from "@/components/Card/ShopItemCard";
import {MenuDataContext} from "@/contexts/MenuDataContext";

interface CarouselSessionMenuProps {
    
};

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 768, min: 640 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 2,
    },
};

const customRightArrow = (
    <div className="absolute arrow-btn right-0 text-center p-3 cursor-pointer bg-orange-600 bg-opacity-60 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    </div>
);

const customLeftArrow = (
    <div className="absolute arrow-btn left-0 text-center p-3 cursor-pointer bg-orange-600 bg-opacity-60 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    </div>
);

function CarouselSessionMenu({}: CarouselSessionMenuProps) {
    const {menuData, getMenuData, updateMenuData} = useContext(MenuDataContext);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

    return (
        <Carousel
            ssr={true} // means to render carousel on server-side.
            deviceType={"desktop"} // deviceType={deviceType}
            additionalTransfrom={0} // allow custom transform
            arrows // allow arrow navigation
            autoPlaySpeed={3000} // autoplay interval
            centerMode={false} // enable center mode
            className=" w-full h-full" // additional className
            containerClass="container" // container className
            dotListClass="" // className for dots
            draggable // allow draggable
            focusOnSelect={false} // focusOnSelect={false}
            infinite // allow infinite loop
            itemClass="" // className for carousel items
            keyBoardControl // allow key board control
            minimumTouchDrag={80} // minimum touch drag to trigger the slide
            renderButtonGroupOutside={false} // render a custom outside button group
            renderDotsOutside={false} // render a custom outside dots
            responsive={responsive} // object containing responsive properties
            showDots={false} // show dots navigation
            sliderClass="outline-0" // className for the inner slider div
            slidesToSlide={1} // slidesToSlide={1}
            swipeable // allow swipeable
            transitionDuration={500} // duration of the transition
            // removeArrowOnDeviceType={['mobile']} // remove arrow on mobi
            customLeftArrow={customLeftArrow}
            customRightArrow={customRightArrow}
            rtl={false}
        >
            {isLoaded && menuData.map((item, index) => (
                <ShopItemCardMemo
                    title={item.name}
                    img={item.image}
                    location={item.address}
                    price={String(item.price)}
                    dishID={item._id as unknown as string}
                    totalSold={item.total_sold}
                    key={index}
                />
            ))}
        </Carousel>
    );
}

export default CarouselSessionMenu;