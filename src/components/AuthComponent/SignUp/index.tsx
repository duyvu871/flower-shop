'use client';
import React, { useMemo, useState } from 'react';
import { Spacer, Button, Input, Checkbox, Link } from '@nextui-org/react';
// import { IoMail } from "react-icons/io5";
// import { FaLock } from "react-icons/fa";
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import NormalField from '@/components/InputField/NormalField';

interface FormState {
	fullName: string;
	phoneNumber: string;
	email: string;
	password: string;
	retypePassword: string;
	isRemember: boolean;
	preventButton: boolean;
	fullNameError: string;
	phoneNumberError: string;
	emailError: string;
	passwordError: string;
	retypePasswordError: string;
}

const initialFormState: FormState = {
	fullName: '',
	phoneNumber: '',
	email: '',
	password: '',
	retypePassword: '',
	isRemember: false,
	preventButton: false,
	fullNameError: '',
	phoneNumberError: '',
	emailError: '',
	passwordError: '',
	retypePasswordError: '',
};

export default function SignInForm() {
	const [formState, setFormState] = useState<FormState>(initialFormState);
	const forceFormState = (key: keyof FormState, value: any) =>
		setFormState(prev => ({ ...prev, [key]: value }));
	const { error, success } = useToast();
	const { push } = useRouter();

	const validateEmail = (value: string): boolean =>
		/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
	const validatePhone = (value: string): boolean => /^[0-9]{10,11}$/i.test(value);

	const [isVisible, setIsVisible] = useState(false);
	const [isRetypeVisible, setIsRetypeVisible] = useState<boolean>(false);

	const sendSignUpRequest = async function () {
		const { fullName, phoneNumber, email, password, retypePassword } = formState;
		const requestBody = {
			email,
			password,
			phone: phoneNumber,
			fullName,
		};

		const res = await fetch('/api/v1/auth/sign-up', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		const data = await res.json();
		if (res.status === 200) {
			success('Đăng kí thành công');
			push('/auth/signin');
		} else {
			error(data.error);
		}
	};

	const register = async (type: 'submit' | 'check') => {
		const { fullName, phoneNumber, email, password, retypePassword } = formState;

		if (!fullName) {
			setFormState({ ...formState, fullNameError: 'Tên đầy đủ không được bỏ trống' });
			return error('Tên đầy đủ không được bỏ trống');
		} else {
			setFormState({ ...formState, fullNameError: '' });
		}

		if (!validatePhone(phoneNumber)) {
			setFormState({ ...formState, phoneNumberError: 'Vui lòng nhập đúng số điện thoại' });
			return error('Vui lòng nhập đúng số điện thoại');
		} else {
			setFormState({ ...formState, phoneNumberError: '' });
		}

		if (!email) {
			setFormState({ ...formState, emailError: 'Vui lòng nhập tên đăng nhập' });
			return error('Vui lòng nhập tên đăng nhập');
		} else {
			setFormState({ ...formState, emailError: '' });
		}

		if (password.length < 6) {
			setFormState({ ...formState, passwordError: 'Mật khẩu phải có độ dài lớn hơn 6 ký tự' });
			return error('Mật khẩu phải có độ dài lớn hơn 6 ký tự');
		} else {
			setFormState({ ...formState, passwordError: '' });
		}

		if (retypePassword !== password) {
			setFormState({ ...formState, retypePasswordError: 'Mật khẩu không trùng khớp' });
			return error('Mật khẩu không trùng khớp');
		} else {
			setFormState({ ...formState, retypePasswordError: '' });
		}

		if (type === 'submit') {
			await sendSignUpRequest();
		}
	};

	const toggleVisibility = () => setIsVisible(!isVisible);
	const toggleRetypeVisibility = () => setIsRetypeVisible(!isRetypeVisible);

	return (
		<div className={'flex justify-center items-start h-full bg-gray-100 p-5 mobile:p-10'}>
			<div className={'w-[600px] bg-white p-2 mobile:p-5 py-10 rounded-xl'}>
				<p className={'text-[24px] font-bold text-center mb-8 text-gray-800'}>Đăng Ký</p>
				<div className={'px-4'}>
					<div className={'flex w-full flex-col justify-between items-center gap-2'}>
						<NormalField
							type='text'
							placeholder='Tên đăng nhập'
							// isInvalid={!!formState.fullNameError}
							// color={!!formState.fullNameError ? 'danger' : 'primary'}
							// errorMessage={formState.fullNameError}
							validate={{
								status: !!formState.fullNameError ? 'ALERT' : 'SUCCESS',
								message: formState.fullNameError,
							}}
							setFieldValue={value => {
								if (value === '') {
									forceFormState('fullNameError', 'Tên đầy đủ không được bỏ trống');
									return;
								} else forceFormState('fullNameError', '');
								forceFormState('fullName', value);
							}}
							className='max-w-xl w-full border border-gray-500/50 rounded-xl bg-gray-0'
							wrapperClassName='bg-gray-0'
							inputClassName='bg-gray-0 block'
						/>
						<NormalField
							type='text'
							placeholder='Số điện thoại'
							// isInvalid={!!formState.phoneNumberError}
							// color={!!formState.phoneNumberError ? 'danger' : 'primary'}
							// errorMessage={formState.phoneNumberError}
							validate={{
								status: !!formState.phoneNumberError ? 'ALERT' : 'SUCCESS',
								message: formState.phoneNumberError,
							}}
							setFieldValue={value => {
								if (value === '') {
									forceFormState('phoneNumberError', 'Vui lòng nhập số điện thoại');
									return;
								} else if (!validatePhone(value)) {
									forceFormState('phoneNumberError', 'Vui lòng nhập đúng số điện thoại');
									return;
								}
								forceFormState('phoneNumberError', '');
								forceFormState('phoneNumber', value);
							}}
							className='max-w-xl w-full border border-gray-500/50 rounded-xl bg-gray-0'
							wrapperClassName='bg-gray-0'
							inputClassName='bg-gray-0 block'
						/>
					</div>
					<Spacer y={3} />
					<NormalField
						type={'text'}
						placeholder='email'
						// isInvalid={!!formState.emailError}
						// color={!!formState.emailError ? 'danger' : 'primary'}
						// errorMessage={formState.emailError}
						validate={{
							status: !!formState.emailError ? 'ALERT' : 'SUCCESS',
							message: formState.emailError,
						}}
						setFieldValue={value => {
							if (value === '') {
								forceFormState('emailError', 'vui lòng nhập email');
								return;
							} else if (!validateEmail(value)) {
								forceFormState('emailError', 'vui lòng nhập đúng định dạng email');
								return;
							}
							forceFormState('emailError', '');
							forceFormState('email', value);
						}}
						className='max-w-xl border border-gray-500/50 rounded-xl bg-gray-0'
						wrapperClassName='bg-gray-0'
						inputClassName='bg-gray-0 block'
					/>
					<Spacer y={4} />
					<NormalField
						placeholder='Nhập mật khẩu'
						// value={formState.password}
						// isInvalid={!!formState.passwordError}
						// color={!!formState.passwordError ? 'danger' : 'primary'}
						// errorMessage={formState.passwordError}
						validate={{
							status: !!formState.passwordError ? 'ALERT' : 'SUCCESS',
							message: formState.passwordError,
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
						setFieldValue={value => {
							if (value === '') {
								forceFormState('passwordError', 'Vui lòng nhập mật khẩu');
								return;
							} else if (value.length < 6) {
								forceFormState('passwordError', 'Mật khẩu không được dưới 6 kí tự');
								return;
							}
							forceFormState('passwordError', '');
							forceFormState('password', value);
						}}
						className='max-w-xl border border-gray-500/50 rounded-xl bg-gray-0'
						wrapperClassName='bg-gray-0'
						inputClassName='bg-gray-0 block'
					/>
					<Spacer y={4} />
					<NormalField
						placeholder='Nhập lại mật khẩu'
						// value={formState.retypePassword}
						validate={{
							status: !!formState.retypePasswordError ? 'ALERT' : 'SUCCESS',
							message: formState.retypePasswordError,
						}}
						// color={!!formState.retypePasswordError ? 'danger' : 'primary'}
						// errorMessage={formState.retypePasswordError}
						customChildren={
							<button className='focus:outline-none' type='button' onClick={toggleRetypeVisibility}>
								{isRetypeVisible ? (
									<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
								) : (
									<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
								)}
							</button>
						}
						type={isRetypeVisible ? 'text' : 'password'}
						setFieldValue={value => {
							// console.log(formState.retypePassword, formState.password)
							if (value === '') {
								forceFormState('retypePasswordError', 'Vui lòng nhập mật khẩu');
								return;
							} else if (value.length < 6) {
								forceFormState('retypePasswordError', 'Mật khẩu không được dưới 6 kí tự');
								return;
							} else if (value !== formState.password) {
								forceFormState('retypePasswordError', 'Mật khẩu không trùng khớp');
								return;
							}
							forceFormState('retypePasswordError', '');
							forceFormState('retypePassword', value);
						}}
						className='max-w-xl border border-gray-500/50 rounded-xl bg-gray-0'
						wrapperClassName='bg-gray-0'
						inputClassName='bg-gray-0 block'
					/>
					<Spacer y={4} />
					<div className={'flex justify-between items-start'}>
						<div className={'flex flex-row justify-center text-[14px]'}>
							<div className={'inline-flex items-center leading-[24px]'}>
								<p>Đã đăng kí tài khoản? Đăng nhập&nbsp;</p>
							</div>
							<Link href={'/auth/signin'}>
								<p className={'text-[14px] text-orange-600'}> tại đây</p>
							</Link>
						</div>
					</div>
					<Spacer y={3} />
					<Button
						disabled={formState.preventButton}
						onClick={() => register('submit')}
						className={'w-full bg-orange-600 text-white'}
						color='primary'
						variant='flat'>
						Đăng Ký
					</Button>
					<Spacer y={3} />
					<div className={'flex justify-start h-[2px] w-full bg-gray-200'}></div>
					<Spacer y={3} />

					<Button
						onClick={() => push('/auth/signin')}
						className={'w-full bg-orange-600 text-white'}
						color='primary'
						variant='flat'>
						Đăng Nhập
					</Button>
					<div>
						Bằng việc đăng nhập, đăng ký, bạn đã đồng ý với các{' '}
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
