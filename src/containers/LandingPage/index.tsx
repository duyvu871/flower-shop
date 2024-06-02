'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import './landing.css';
import { tw } from '@/ultis/tailwind.ultis';
import TextTyping from '@/containers/LandingPage/TextTyping';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const card1 = ['/img_3.png', '/img_1.png', '/img_2.png'].map(item => '/landing' + item);
const style1 = [
	{
		src: card1[0],
		rotate: 'rotate-[-15deg]',
		scale: 'scale-[80%]',
		opacity: 'opacity-50',
		classname: 'z-10 translate-x-[90%] ',
		zIndex: 'z-10',
		index: 0,
	},
	{
		src: card1[1],
		rotate: '',
		scale: '',
		opacity: '',
		classname: 'z-20',
		zIndex: 'z-20',
		index: 1,
	},
	{
		src: card1[2],
		rotate: 'rotate-[15deg]',
		opacity: 'opacity-50',
		scale: 'scale-[80%]',
		classname: 'z-10 translate-x-[-90%]',
		zIndex: 'z-10',
		index: 2,
	},
];

const card2 = ['/img_2.png', '/img_3.png', '/img_1.png'].map(item => '/landing' + item);
const style2 = [
	{
		src: card2[0],
		active: false,
		style: 'z-10 translate-x-[70%] top-[-20px] opacity-50',
	},
	{
		src: card2[1],
		active: true,
		style: 'z-[15] translate-x-0 top-0',
		index: 1,
	},
	{
		src: card2[2],
		active: false,
		style: 'z-10 translate-x-[-70%] top-[-20px] opacity-50',
		index: 2,
	},
];

export default function LandingPage() {
	const [card1Pos, setCard1Pos] = useState<
		{
			src: string;
			rotate: string;
			scale: string;
			opacity: string;
			classname?: string;
			zIndex: string;
			index: number;
		}[]
	>(style1);

	const [card2Pos, setCard2Pos] = useState<
		{
			src: string;
			active: boolean;
			style: string;
		}[]
	>(style2);

	const click1 = (cardIndex: number) => {
		const newCardPos = card1Pos.map((item, index) => {
			const newIndex = item.index + 1 > 2 ? 0 : item.index + 1;
			return {
				...card1Pos[newIndex],
				index,
				src: card1[newIndex],
			};
		});
		console.log(newCardPos.map(item => item.src));
		setCard1Pos(newCardPos);
	};

	const click2 = (cardIndex: number) => {
		const newCardPos = card2Pos.map((item, index) => {
			return {
				...item,
				active: index === cardIndex,
			};
		});
		setCard2Pos(newCardPos);
	};

	return (
		<div className='bg-background-main w-full h-full '>
			<div className='flex justify-around items-center gap-10 w-full h-full py-40 px-10'>
				<div className='relative w-full h-fit flex justify-center items-center'>
					{card1Pos.map((image, index) => (
						<div
							key={'image-landing-' + index}
							className={' transition-all duration-[600] ease-in-out absolute w-72 h-96'}
							onClick={() => click1(index)}>
							<Image
								src={image.src}
								alt={'img'}
								width={310}
								height={520}
								className={tw(
									'object-cover rounded-[2rem] aspect-[6/9] aspect-[9/13] transition-all duration-[1s_!important] rotate-0 scale-100 opacity-100 absolute',
									image.rotate,
									image.scale,
									image.opacity,
									image.classname,
								)}
							/>
						</div>
					))}
				</div>
				<div className={'flex flex-col justify-center items-center gap-10 w-full'}>
					<div className={'flex justify-between items-center w-full'}>
						<div className={'  w-[50px] relative'}>
							<Image
								src={'/admin-assets/img1.png'}
								alt={'logo'}
								width={200}
								height={400}
								style={{
									scale: '4',
								}}
								className={'shake-image top-[-90px] absolute'}
							/>
						</div>
						<div
							className={
								'flex flex-col justify-center items-center text-white dancing-script text-5xl gap-5'
							}>
							<span className={''}>Tâm hồn hoa cỏ</span>
							<span>
								Hơn cả hoa - là những câu <TextTyping text={'chuyện'} />
							</span>
						</div>
						<div className={'w-[50px] relative'}>
							<Image
								src={'/admin-assets/img3.png'}
								className={'shake-image top-[-90px] absolute'}
								alt={'logo'}
								width={200}
								height={400}
								style={{
									scale: '4',
								}}
							/>
						</div>
					</div>
					<div>
						<span className={'text-white text-xl'}>
							Tại Tiệm nhà Sắn, mỗi bông hoa không chỉ là một món quà, mà còn là một câu chuyện được
							kể. Bằng đôi tay khéo léo và trái tim đầy nhiệt huyết, chúng tôi thổi hồn vào từng
							bông hoa, biến chúng thành những tác phẩm nghệ thuật độc đáo, mang theo thông điệp và
							cảm xúc riêng. Mỗi bó hoa handmade được thiết kế riêng, tỉ mỉ đến từng chi tiết, phù
							hợp với mọi dịp đặc biệt: sinh nhật, kỷ niệm, hay đơn giản là để mang niềm vui đến cho
							chính mình và những người thân yêu.
						</span>
					</div>
					<div className={'w-full flex justify-center items-center py-5 gap-16'}>
						<Button
							className={'bg-[#EAA0A2] text-white text-xl hover:bg-opacity-90 h-unit-17 w-unit-40'}
							size={'lg'}>
							Mua ngay
						</Button>
						<Button
							className={' text-white text-xl hover:bg-opacity-90 h-unit-17 w-unit-40'}
							size={'lg'}
							variant={'bordered'}>
							Khám phá
						</Button>
					</div>
				</div>
			</div>
			<div
				style={{
					backgroundImage: 'url(/landing/separate.png)',
					backgroundSize: 'contain',
					backgroundPosition: 'center',
					backgroundRepeat: 'repeat',
					height: '40px',
					width: '100%',
				}}
			/>
			<div className={'flex justify-around items-center gap-10 w-full h-full py-40 px-20 '}>
				<div className={'flex flex-col justify-start items-center gap-10 max-w-2xl'}>
					<div className={'flex flex-col justify-start items-start gap-5'}>
						<span className={'text-white text-4xl font-bold'}>About us</span>
						<span className={'text-white text-xl'}>
							[Tên nhãn hàng] - cái tên ẩn chứa niềm đam mê sáng tạo và khát khao mang đến những sản
							phẩm thủ công độc đáo, chất lượng đến tay khách hàng. Được thành lập bởi những sinh
							viên Đại học Bách khoa Hà Nội, chúng tôi không chỉ đơn thuần là một thương hiệu, mà
							còn là nơi nuôi dưỡng đam mê, khơi nguồn sáng tạo và lan tỏa tình yêu với những món đồ
							handmade tinh tế.
						</span>
					</div>
					<div className={'flex flex-col justify-start items-start gap-5'}>
						<span className={'text-white text-4xl font-bold'}>Hành trình khởi nguồn từ đam mê</span>
						<span className={'text-white text-xl'}>
							Câu chuyện [Tên nhãn hàng] bắt đầu từ những chia sẻ nhỏ nhoi về niềm đam mê sáng tạo
							thủ công giữa các thành viên. Từ những ý tưởng mộc mạc, những đôi bàn tay khéo léo đã
							nhào nặn, thổi hồn vào từng sản phẩm, biến những nguyên liệu thô sơ thành những món đồ
							độc đáo, mang đậm dấu ấn cá nhân.
						</span>
					</div>
				</div>
				<div className='relative w-full h-fit flex justify-center items-center'>
					<div className={'w-64 h-96'}>
						{card2Pos.map((image, index) => (
							<div className={'w-64 absolute top-32'} key={'image-landing-section2-' + index}>
								<div
									key={'image-landing-' + index}
									className={tw(
										' overflow-hidden absolute w-64 h-96 scale-125 bg-white transition-all duration-[600ms_!important] rounded-[2rem]',
										image.style,
										image.active ? 'top-[-80px] opacity-100 z-20' : '',
									)}
									onMouseEnter={() => click2(index)}>
									<Image
										src={image.src}
										alt={'img'}
										width={310}
										height={600}
										className={tw('w-full h-full object-cover')}
									/>
									<div
										className={tw(
											'absolute w-72 h-96 top-0 bg-black transition-all duration-[200]',
											image.active ? 'opacity-0' : 'opacity-70',
										)}></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<footer className='dark:bg-gray-900 text-white bg-navbar'>
				<div className='mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8'>
					<div className='md:flex md:justify-between md:items-start gap-2'>
						<div className='mb-6 md:mb-0 h-full py-5'>
							<Link href='/' className='flex items-center justify-center' passHref>
								<div className={'flex flex-row justify-center items-center gap-2'}>
									<Logo size={50} />
									<p className={'text-xl font-bold text-inherit sm:block'}>
										<Image src='/Tiệm nhà Sắn.svg' alt='logo text' width={'170'} height={'50'} />
									</p>
								</div>
								<span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'></span>
							</Link>
						</div>
						<div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
							<div>
								<h2 className='mb-6 text-sm font-semibold text-white uppercase dark:text-white'>
									Resources
								</h2>
								<ul className='text-white dark:text-gray-400 font-medium'>
									<li className='mb-4'>
										<a href='/' className='hover:underline'>
											Connected Brain
										</a>
									</li>
									{/*<li>*/}
									{/*	<a href="https://tailwindcss.com/" className="hover:underline">Server </a>*/}
									{/*</li>*/}
								</ul>
							</div>
							<div>
								<h2 className='mb-6 text-sm font-semibold text-white uppercase dark:text-white'>
									Follow us
								</h2>
								<ul className='text-white dark:text-gray-400 font-medium'>
									<li>
										<a href='#' className='hover:underline'>
											Facebook
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h2 className='mb-6 text-sm font-semibold text-white uppercase dark:text-white'>
									Legal
								</h2>
								<ul className='text-white dark:text-gray-400 font-medium'>
									<li className='mb-4'>
										<a href='#' className='hover:underline'>
											Privacy Policy
										</a>
									</li>
									<li>
										<a href='#' className='hover:underline'>
											Terms &amp; Conditions
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div className={'md:hidden border-b-[1px] border-white w-full  my-3 mb-0'} />
						<div className={'w-full flex flex-col justify-center items-start md:max-w-xs'}>
							<span className={'text-md text-white mb-5 mt-4 md:mt-0'}>
								Subscribe to our newsletter
							</span>
							<span className={'text-xs text-white dark:text-gray-400 mb-2'}>
								Stay updated on new releases and features, guides, and case studies
							</span>
							<div
								className={tw(
									'w-full flex justify-between items-center gap-2 rounded-lg p-1 border-[1px] border-white bg-white dark:bg-gray-600',
								)}>
								<input
									type='email'
									placeholder='Your email'
									className={tw('w-full px-1 outline-none bg-opacity-0', `bg-white`)}
								/>
								<button className='w-fit px-2 p-1 bg-[#EAA0A2] transition-all rounded-md text-white font-semibold hover:bg-gray-500 dark:bg-blue-500'>
									Subscribe
								</button>
							</div>
						</div>
					</div>
					<hr className='my-6 border-0 border-b-[1px] border-white sm:mx-auto dark:border-gray-700 lg:my-8' />
					<div className='sm:flex sm:items-center sm:justify-between'>
						<span className='text-sm text-white sm:text-center dark:text-gray-400'>
							© 2024{' '}
							<a href='/' className='hover:underline'>
								TiemNhaSan™
							</a>
							. All Rights Reserved.
						</span>
						<div className='flex mt-4 sm:justify-center sm:mt-0'>
							<a href='#' className='text-white hover:text-gray-900 dark:hover:text-white'>
								<svg
									className='w-4 h-4'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 8 19'>
									<path
										fillRule='evenodd'
										d='M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z'
										clipRule='evenodd'
									/>
								</svg>
								<span className='sr-only'>Facebook page</span>
							</a>
							<a href='#' className='text-white hover:text-gray-900 dark:hover:text-white ms-5'>
								<svg
									className='w-4 h-4'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 21 16'>
									<path d='M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z' />
								</svg>
								<span className='sr-only'>Discord community</span>
							</a>
							<a href='#' className='text-white hover:text-gray-900 dark:hover:text-white ms-5'>
								<svg
									className='w-4 h-4'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 20 17'>
									<path
										fillRule='evenodd'
										d='M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z'
										clipRule='evenodd'
									/>
								</svg>
								<span className='sr-only'>Twitter page</span>
							</a>
							<a href='#' className='text-white hover:text-gray-900 dark:hover:text-white ms-5'>
								<svg
									className='w-4 h-4'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z'
										clipRule='evenodd'
									/>
								</svg>
								<span className='sr-only'>Dribble account</span>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
