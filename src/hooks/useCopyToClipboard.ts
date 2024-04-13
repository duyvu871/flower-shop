import { useCallback, useState } from 'react';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
	const [textToCopy, setTextToCopy] = useState<CopiedValue>('');
	const [isCopied, setIsCopied] = useState<Boolean>(false);
	const copy: CopyFn = useCallback(async text => {
		if (!navigator?.clipboard) {
			console.warn('Clipboard not supported');
			return false;
		}

		// Try to save to clipboard then save it in the state if worked
		try {
			await navigator.clipboard.writeText(text);
			setTextToCopy(text);
			return true;
		} catch (error) {
			console.warn('Copy failed', error);
			setTextToCopy(null);
			return false;
		}
	}, []);

	return [textToCopy, copy];
}
