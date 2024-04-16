import React from 'react';

interface PageProps {}

function Page({}: PageProps) {
	return (
		<div className={'w-full h-full flex justify-center items-center'}>
			<p className={'text-2xl font-semibold'}>
				Hiện tại chức năng này đang được phát triển, vui lòng quay lại sau
			</p>
		</div>
	);
}

export default Page;
