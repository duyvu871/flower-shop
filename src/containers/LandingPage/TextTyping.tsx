import React, { useState, useEffect } from 'react';

function TypingWriter({ text, speed = 150 }) {
	const [currentText, setCurrentText] = useState('');
	const [isTyping, setIsTyping] = useState(true);

	useEffect(() => {
		let i = 0;
		const intervalId = setInterval(() => {
			if (i <= text.length) {
				setCurrentText(text.substring(0, Math.abs(i)));
				i++;
			} else if (i < 2 * text.length) {
				i++;
			} else if (i < 4 * text.length) {
				setCurrentText(prev => prev.substring(0, text.length - (i % text.length) - 1));
				i++;
			} else {
				i = 0;
			}
		}, speed);

		return () => clearInterval(intervalId);
	}, [text, speed]);

	return (
		<span className='typing-writer'>
			{currentText}
			{isTyping && <span className='cursor'>|</span>}
		</span>
	);
}

export default TypingWriter;
