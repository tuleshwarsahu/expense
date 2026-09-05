import React, { useState, useEffect } from 'react';

/**
 * Reusable Typewriter component for typewriter typing animations
 */
export default function Typewriter({
  texts = ['Manage Your Expense.'],
  speed = 80,
  deleteSpeed = 40,
  pause = 2200,
  loop = true,
  className = ''
}) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    const currentFullText = texts[textIndex % texts.length];

    let timer;
    if (!isDeleting) {
      if (charIndex < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, speed);
      } else {
        if (texts.length > 1 && loop) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, pause);
        }
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, texts, speed, deleteSpeed, pause, loop]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayText}</span>
      <span className="animate-pulse ml-0.5 font-normal text-indigo-600 dark:text-indigo-400">|</span>
    </span>
  );
}
