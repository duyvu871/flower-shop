// "use client";
import React, { useEffect, useState } from 'react';
import { useAdminApi } from '@/hooks/useAdminApi';
import { Image } from '@nextui-org/react';

interface BestSellerProps {}

async function BestSeller({}: BestSellerProps) {
	const { getBestSellingProduct } = useAdminApi();
	const data = await getBestSellingProduct();
	// const [bestSellingProduct, setBestSellingProduct] = useState<MenuItemType[]>([]);
	// useEffect(() => {
	//     (async () => {
	//         const bestSellingProduct = await getBestSellingProduct();
	//         setBestSellingProduct(bestSellingProduct);
	//     })();
	// }, []);
	return (
		<>
			{/*// <div className={"flex flex-col justify-center items-start gap-4"}>*/}
			<div className={'w-full flex justify-between items-center'}>
				<h1 className={'font-bold text-xl'}>Bán chạy</h1>
				<div className={' text-blue-600 text-sm cursor-pointer font-semibold'}>Xem thêm</div>
			</div>
			<div
				className={'w-full grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7'}>
				{data.map((item, index) => (
					<div
						key={'best-seller-' + index}
						className={
							'w-full flex flex-col justify-center items-center gap-2 p-6 bg-gray-50 rounded-lg border hover:border-blue-600 transition-all'
						}>
						<div className={'overflow-visible p-0 w-full h-[140px]'}>
							<Image
								src={item.image}
								alt={item.name}
								width={1000}
								height={1000}
								className={
									'w-full h-[140px] object-cover rounded hover:scale-110 transition-transform duration-300 ease-in-out '
								}
							/>
						</div>
						<p className={'text-sm font-semibold line-clamp-2 h-[40px]'}>{item.name}</p>
						<p className={'text-md font-semibold '}>{item.price}.000đ</p>
						<p className={'text-sm font-semibold text-gray-500'}>Đã bán: {item.total_sold}</p>
					</div>
				))}
			</div>
			{/*// </div>*/}
		</>
	);
}

export default BestSeller;
