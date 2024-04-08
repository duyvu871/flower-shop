import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
	Input,
	Spacer,
	Textarea,
	Image,
	CircularProgress,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Modal,
} from '@nextui-org/react';
import { useToast } from '@/hooks/useToast';
import { deleteFileByDownloadUrl } from '@/helpers/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/firebase';
import { tw } from '@/ultis/tailwind.ultis';
import store from '@/adminRedux/store';
import { closeModal } from '@/adminRedux/action/OpenModal';

interface ProductManagementProps {
	_id: string;
}

function ProductManagement({ _id }: ProductManagementProps) {
	const { error, success } = useToast();
	const [productType, setProductType] = useState<string>('morning'); // ["morning", "afternoon", "evening", "other"
	const [productName, setProductName] = useState<string>('');
	const [price, setPrice] = useState<number>(0);
	const [discount, setDiscount] = useState<number>(0);
	const [description, setDescription] = useState<string>('');
	const [image, setImage] = useState<string>('');
	const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
	const [isShowImage, setIsShowImage] = useState<boolean>(false);
	const [preview, setPreview] = useState<string | undefined>(undefined);
	const [processPercent, setProcessPercent] = useState<number>(0);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [isPreviewImage, setIsPreviewImage] = useState<boolean>(false);

	useLayoutEffect(() => {
		fetch('/api/v1/info/search-by-id?ids=' + _id).then(async res => {
			const data = await res.json();
			if (res.status !== 200) {
				return;
			}
			setProductName(data[0].name);
			setPrice(data[0].price);
			setDiscount(data[0].discount);
			setDescription(data[0].description);
			setImage(data[0].image);
			setProductType(data[0].type);
		});
	}, [_id]);

	const update = async ({ productName, price, discount, description, image, productType }) => {
		fetch('/api/v1/admin/product/update-product', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				productId: _id,
				productType: productType,
				data: {
					name: productName,
					price: price,
					discount: discount,
					description: description,
					image: image,
					type: productType,
				},
			}),
		}).then(async res => {
			const data = await res.json();
			if (res.status !== 200) {
				return;
			}
			setIsUploading(false);
			success(data.message);
		});
	};

	const updateAfterDelete = () => {
		if (!selectedFile) {
			// setImage("");
			console.log('no file');
			update({
				productName,
				price,
				discount,
				description,
				image,
				productType,
			});
			return;
		}
		console.log(selectedFile.name.split('.').pop());
		const storageRef = ref(storage, `images/${_id}.${selectedFile.name.split('.').pop()}`);
		const uploadTask = uploadBytesResumable(storageRef, selectedFile);
		uploadTask.on(
			'state_changed',
			snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setProcessPercent(progress);
				setIsUploading(true);
			},
			error => {
				console.log(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
					setImage(downloadURL);
					update({
						productName,
						price,
						discount,
						description,
						image: downloadURL,
						productType,
					});
				});
			},
		);
	};

	const updateOrCreateProduct = () => {
		if (!selectedFile) {
			updateAfterDelete();
			return;
		}
		deleteFileByDownloadUrl(image)
			.then(e => {
				updateAfterDelete();
			})
			.catch(() => {
				updateAfterDelete();
			});
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedFile(undefined);
			return;
		}

		setSelectedFile(e.target.files[0]);
	};

	const deleteProduct = () => {
		fetch('/api/v1/admin/product/delete-product', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				productId: _id,
				productType: productType,
			}),
		}).then(async res => {
			const data = await res.json();
			if (res.status !== 200) {
				return;
			}
			success(data.message);
		});
	};

	useEffect(() => {
		if (!selectedFile) {
			setIsShowImage(false);
			setPreview(undefined);
			return;
		}

		const objectUrl = URL.createObjectURL(selectedFile);
		setPreview(objectUrl);
		setIsShowImage(true);

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedFile]);

	return (
		<>
			<div className={'flex flex-col justify-center items-center gap-4'}>
				<div className={tw('w-full flex justify-center items-center', isUploading ? '' : 'hidden')}>
					<CircularProgress
						aria-label='Loading...'
						size='lg'
						value={Number(processPercent.toFixed(0))}
						color='success'
						showValueLabel={true}
					/>
				</div>
				<div className={'w-full flex justify-center items-center'}>
					{isShowImage && preview ? (
						<Image
							src={preview}
							width={200}
							height={200}
							className={'cursor-pointer'}
							onClick={() => setIsPreviewImage(true)}
						/>
					) : (
						<Image
							src={image}
							width={200}
							height={200}
							className={'cursor-pointer'}
							onClick={() => setIsPreviewImage(true)}
						/>
					)}
				</div>
				<div className='flex flex-col items-center justify-center w-full'>
					<label
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
						htmlFor='file_input'>
						Upload file
					</label>
					{/*<input*/}
					{/*    className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[2.15] text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"*/}
					{/*    aria-describedby="file_input_help" id="file_input" type="file"/>*/}
					<input
						type={'file'}
						className={
							'hover:bg-gray-100 relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[2.15] text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white border-gray-200'
						}
						onChange={handleImageChange}
						accept={'image/*'}
					/>
					{/*<p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF*/}
					{/*    (MAX. 800x400px).</p>*/}
				</div>
				<Input
					placeholder={'Tên món'}
					type={'text'}
					value={productName}
					onChange={e => setProductName(e.target.value)}
				/>
				<Input
					placeholder={'Giá'}
					type={'number'}
					endContent={<div>.000đ</div>}
					value={price.toString()}
					onChange={e => setPrice(Number(e.target.value))}
				/>
				<Input
					placeholder={'Giảm giá'}
					type={'number'}
					endContent={<div>%</div>}
					value={discount.toString()}
					onChange={e => setDiscount(Number(e.target.value))}
				/>
				<Textarea
					placeholder={'Mô tả'}
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<Spacer y={1} />
				<div className={'flex justify-center items-center gap-2'}>
					<button
						className={'bg-primary text-white rounded-md px-4 py-2'}
						onClick={updateOrCreateProduct}>
						Cập nhật
					</button>
					<button className={'bg-red-500 text-white rounded-md px-4 py-2'} onClick={deleteProduct}>
						Xóa
					</button>
				</div>
			</div>
			<Modal
				isOpen={isPreviewImage}
				onClose={() => setIsPreviewImage(false)}
				placement={'auto'}
				onOpenChange={() => {}}
				className={'z-[999] '}
				size={'5xl'}>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className={'flex flex-col gap-1'}></ModalHeader>
							<ModalBody className={'flex flex-col gap-1 justify-center items-center'}>
								{isShowImage && preview ? (
									<Image src={preview} width={1000} height={1000} />
								) : (
									<Image src={image} width={1000} height={1000} />
								)}
							</ModalBody>
							<ModalFooter></ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default ProductManagement;
