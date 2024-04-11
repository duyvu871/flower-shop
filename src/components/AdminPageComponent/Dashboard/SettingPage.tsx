'use client';
import React from 'react';
import { Button, Input, Spinner } from '@nextui-org/react';
// import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import { useToast } from '@/hooks/useToast';
interface SettingPageProps {}

function SettingPage({}: SettingPageProps) {
	const { success, error } = useToast();
	const [confirmPassword, setConfirmPassword] = React.useState<string>('');
	const [newPassword, setNewPassword] = React.useState<string>('');
	const [oldPassword, setOldPassword] = React.useState<string>('');
	const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
	const [isVisible, setIsVisible] = React.useState<boolean>(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	const handleUpdate = async () => {
		setIsUpdating(true);
		const response = await fetch('/api/v1/admin/profile/update-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				newPassword,
				oldPassword,
				confirmPassword,
			}),
		});
		setIsUpdating(false);
		// @ts-ignore
		if (response.status !== 200) {
			// @ts-ignore
			return error(response?.message);
		}
		success('Cập nhật thông tin thành công');
		// alert('Cập nhật thông tin thành công');
	};

	return (
		<div className={'flex flex-col gap-2 p-5'}>
			<div className={'font-semibold text-xl'}>Cập nhật thông tin admin</div>
			<div className={'flex flex-col justify-start items-start gap-2'}>
				<Input
					type='password'
					label={
						'Mật khẩu                                                                                                                                 cũ'
					}
					id={'oldPassword'}
					value={oldPassword}
					onChange={e => setOldPassword(e.target.value)}
					className='max-w-xl text-gray-800'
					variant='bordered'
					color={'primary'}
				/>
				<Input
					autoComplete={'off'}
					spellCheck={false}
					label='Nhập mật khẩu'
					placeholder=''
					value={newPassword}
					type='password'
					// endContent={
					// 	<button className='focus:outline-none' type='button' onClick={toggleVisibility}>
					// 		{isVisible ? (
					// 			<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
					// 		) : (
					// 			<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
					// 		)}
					// 	</button>
					// }
					// type={isVisible ? 'text' : 'password'}
					onValueChange={value => setNewPassword(value)}
					className='max-w-xl text-gray-800'
					variant='bordered'
					color={'primary'}
				/>
				<Input
					label={'Nhập lại mật khẩu'}
					id={'confirmPassword'}
					value={confirmPassword}
					type='password'
					// endContent={
					// 	<button className='focus:outline-none' type='button' onClick={toggleVisibility}>
					// 		{isVisible ? (
					// 			<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
					// 		) : (
					// 			<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
					// 		)}
					// 	</button>
					// }
					// type={isVisible ? 'text' : 'password'}
					onChange={e => setConfirmPassword(e.target.value)}
					className='max-w-xl text-gray-800'
					variant='bordered'
					color={'primary'}
				/>
			</div>
			<div className={'w-full flex justify-center items-center p-5'}>
				<Button color={'success'} className={'text-white'} disabled={isUpdating} onClick={handleUpdate}>
					{isUpdating ? (
						<span className={'flex justify-center items-center gap-1'}>
							<Spinner size={'sm'} color={'white'} />
							<p>Đang cập nhật</p>
						</span>
					) : (
						'Lưu thay đổi'
					)}
				</Button>
			</div>
		</div>
	);
}

export default SettingPage;
