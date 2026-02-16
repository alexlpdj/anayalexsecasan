import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TypewriterText({
    text,
    delay = 0,
    speed = 100,
    className = '',
    showCursor = false,
    onComplete
}) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay + speed);

            return () => clearTimeout(timeout);
        } else if (!isComplete) {
            setIsComplete(true);
            if (onComplete) onComplete();
        }
    }, [currentIndex, text, delay, speed, isComplete, onComplete]);

    return (
        <span className={`inline-block ${className}`}>
            {displayedText}
            {showCursor && !isComplete && (
                <motion.span
                    className="ml-1 inline-block"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    |
                </motion.span>
            )}
        </span>
    );
}
