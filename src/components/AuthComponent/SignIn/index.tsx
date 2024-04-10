'use client';

import React, { useLayoutEffect } from 'react';
import { Spacer, Button, Input, Checkbox, Link } from '@nextui-org/react';
// import { IoMail } from "react-icons/io5";
// import { FaLock } from "react-icons/fa";
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import NormalField from '@/components/InputField/NormalField';

export default function SignInForm() {
	// const {isLogin, user} = useAuth();
	const [email, setEmail] = React.useState<string>('');
	const [fullName, setFullName] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [isRemember, setIsRemember] = React.useState<boolean>(false);
	const [preventButton, setPreventButton] = React.useState<boolean>(false);

	const { error, success } = useToast();
	const { push } = useRouter();

	const [value, setValue] = React.useState<string>('');
	const validateEmail = (value: string): RegExpMatchArray | null =>
		value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

	const isInvalid = React.useMemo(() => {
		if (value === '') return false;
		const isValidMail = Boolean(value); //validateEmail(value);
		setPreventButton(!isValidMail);
		return !isValidMail;
	}, [value]);

	const isInvalidPassword = React.useMemo(() => {
		if (password === '') return false;
		setPreventButton(password.length < 6);
		return password.length < 6;
	}, [password]);

	const [isVisible, setIsVisible] = React.useState(false);
	const login = async () => {
		if (fullName === '' || password === '') {
			error('Vui lòng nhập thông tin tài khoản');
			return;
		}
		const res = await signIn('credentials', {
			username: fullName,
			role: 'user',
			password,
			redirect: false,
		});

		if (res?.error) {
			console.log(res.error);
			if (res.error === 'Email is not verified') {
				error('Email chưa được xác thực');
				return;
			}
			error(res.error);
		} else {
			push('/');
		}
	};
	const toggleVisibility = () => setIsVisible(!isVisible);

	// useLayoutEffect(() => {
	//     if (isLogin) {
	//         push("/");
	//     }
	// }, [isLogin]);

	return (
		<div className={'flex justify-center items-start h-full bg-gray-100 p-5 mobile:p-10'}>
			<div className={'w-[600px] bg-white p-2 mobile:p-5 py-10 rounded-xl'}>
				<p className={'text-[24px] font-bold text-center mb-6 text-gray-800'}>Đăng nhập</p>
				<div className={'px-4'}>
					<p className={'text-[18px] font-semibold text-gray-800 p-2'}>Tên đăng nhập</p>
					<NormalField
						setFieldValue={value => {
							setFullName(value);
							setValue(value);
						}}
						type='text'
						placeholder='Tên đăng nhập'
						className='max-w-xl border border-gray-500/50 rounded-xl bg-gray-50'
						wrapperClassName='bg-gray-50'
						inputClassName='bg-gray-50'
					/>
					{/*<Spacer y={6} />*/}
					<p className={'text-[18px] font-semibold  text-gray-800 p-2'}>Mật khẩu</p>
					<NormalField
						placeholder='Nhập mật khẩu'
						setFieldValue={value => setPassword(value)}
						validate={{
							status: 'SUCCESS',
							message: '',
						}}
						customChildren={
							<button className='focus:outline-none' type='button' onClick={toggleVisibility}>
								{isVisible ? (
									<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
								) : (
									<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
								)}
							</button>
						}
						type={isVisible ? 'text' : 'password'}
						className='max-w-xl border border-gray-500/50 rounded-xl bg-gray-50'
						wrapperClassName='bg-gray-50'
						inputClassName='bg-gray-50'
					/>
					<Spacer y={6} />
					<div className={'flex justify-between items-start gap-2'}>
						<Checkbox onValueChange={value => setIsRemember(value)}>
							<p className={'text-[13px] text-gray-800'}>Lưu thông tin đăng nhập</p>
						</Checkbox>
						<div className={'flex flex-col '}>
							<p className={'text-[13px] text-gray-800 cursor-pointer'}>Quên mật khẩu?</p>
							<Link href={'/auth/signup'}>
								<p className={'text-[13px] text-orange-600'}>Chưa có tài khoản?</p>
							</Link>
						</div>
					</div>
					<Spacer y={3} />
					<Button
						disabled={preventButton}
						onClick={login}
						className={'w-full bg-orange-600 text-white cursor-pointer'}
						color='primary'
						variant='flat'>
						Đăng Nhập
					</Button>
					<Spacer y={3} />
					<div className={'flex justify-start h-[2px] w-full bg-gray-200'}></div>
					<Spacer y={3} />

					<Button
						onClick={() => push('/auth/signup')}
						className={'w-full bg-orange-600 text-white'}
						color='primary'
						variant='flat'>
						Đăng Ký
					</Button>
					<div>
						Bằng việc đăng nhập, bạn đã đồng ý với các{' '}
						<a href='#' className={'text-orange-600'}>
							điều khoản sử dụng
						</a>{' '}
						của chúng tôi
					</div>
				</div>
			</div>
		</div>
	);
}
