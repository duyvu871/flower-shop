'use client';

import React, { useEffect } from 'react';
import { tw } from '@/ultis/tailwind.ultis';
// import { NormalFieldProps } from '@/components/InputField/InputType';

export default function NormalField({
	setFieldValue,
	placeholder,
	validate,
	customChildren,
	type,
	className,
	inputClassName,
	wrapperClassName,
}: {
	setFieldValue: (value: string) => void;
	type?: string;
	placeholder?: string;
	validate?: {
		status: string;
		message: string;
	};
	className?: string;
	inputClassName?: string;
	wrapperClassName?: string;
	customChildren?: React.ReactNode;
}) {
	const [value, setValue] = React.useState<string>('');
	const [isAlert, setIsAlert] = React.useState<boolean>(false);
	const [alertMessage, setAlertMessage] = React.useState<string>('');

	const mainWrapperRef = React.useRef<HTMLDivElement>(null);
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);

	useEffect(() => {
		const validateResult = validate;
		if (validateResult?.status === 'ALERT') {
			setIsAlert(true);
			setAlertMessage(validateResult.message);
		} else if (validateResult?.status === 'SUCCESS') {
			setIsAlert(false);
			setAlertMessage('');
		}
	}, [validate]);

	return (
		<>
			<div
				className={tw(
					'flex flex-col justify-center items-center  w-full text-black transition-all',
					className || '',
				)}
				ref={mainWrapperRef}>
				<div
					className={tw(
						'rounded-full bg-white p-3 px-6 w-full flex flex-row transition-all',
						wrapperClassName || '',
					)}
					ref={wrapperRef}>
					<input
						autoCorrect='off'
						autoCapitalize='none'
						spellCheck='false'
						autoComplete='off'
						aria-autocomplete={'none'}
						autoSave='off'
						autoFocus={false}
						onChange={e => {
							setValue(e.target.value);
							setFieldValue(e.target.value);
						}}
						onFocus={() => {
							mainWrapperRef.current?.classList.add('border-blue-500', 'border-[1px]');
							mainWrapperRef.current?.classList.add('bg-white');
							wrapperRef.current?.classList.add('bg-white');
							inputRef.current?.classList.add('bg-white');
						}}
						onBlur={() => {
							mainWrapperRef.current?.classList.remove('border-blue-500', 'border-[1px]');
							mainWrapperRef.current?.classList.remove('bg-white');
							wrapperRef.current?.classList.remove('bg-white');
							inputRef.current?.classList.remove('bg-white');
						}}
						placeholder={placeholder}
						className={tw(
							'w-full outline-none text-black transition-all',
							'text-md ',
							isAlert ? 'text-red-500' : '',
							inputClassName || '',
						)}
						type={type || 'text'}
						ref={inputRef}
					/>
					{customChildren}
				</div>
			</div>
			<span className={'text-red-500 text-xs italic'}>{alertMessage}</span>
		</>
	);
}
