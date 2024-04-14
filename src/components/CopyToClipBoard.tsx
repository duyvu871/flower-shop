'use client';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, ButtonProps, Tooltip } from '@nextui-org/react';
import { MdContentCopy } from 'react-icons/md';
import { tw } from '@/ultis/tailwind.ultis';

type CopyValue = string | null;

interface CopyToClipBoardProps {
	childrenProps?: ButtonProps;
	customIcon?: React.ReactNode;
	text: string;
}

function Copy({ childrenProps, customIcon, text }: CopyToClipBoardProps) {
	const [textToCopy, setTextToCopy] = useState<CopyValue>(text);
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const onCopyText = () => {
		setIsCopied(true);
		setIsOpen(true);
		setTimeout(() => {
			setIsCopied(false);
			setIsOpen(false);
		}, 2000); // Reset status after 2 seconds
	};
	return (
		<div className={'relative'}>
			<div
				className={tw(
					'absolute px-2 py-1 bg-white shadow rounded text-md font-semibold top-[-36px] transition-all',
					isOpen ? '' : 'hidden',
				)}>
				Copied!
			</div>
			<CopyToClipboard
				text={textToCopy}
				onCopy={() => {
					setIsCopied(true);
					setIsOpen(true);
				}}>
				{/*<input ref={inputRef} value={text}/>*/}
				<Button
					className={
						'px-1 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8 w-8 min-w-[10px]'
					}
					onClick={onCopyText}
					disabled={isCopied}
					{...childrenProps}>
					{customIcon ? customIcon : <MdContentCopy />}
				</Button>
				{/*</Tooltip>*/}
			</CopyToClipboard>
		</div>
	);
}

export default Copy;
