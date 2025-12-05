import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  minSpeed?: number;
  maxSpeed?: number;
  className?: string;
  hideCursorOnComplete?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  minSpeed = 10, 
  maxSpeed = 40,
  className = "",
  hideCursorOnComplete = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const index = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsTyping(true);
    index.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const typeChar = () => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current++;
        
        // Randomize typing speed for "nervous" feel
        const randomDelay = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        
        // Add occasional longer pauses to simulate hesitation (comma or period)
        const char = text.charAt(index.current - 1);
        const hesitation = (char === '.' || char === ',') ? 300 : 0;

        timeoutRef.current = setTimeout(typeChar, randomDelay + hesitation);
      } else {
        setIsTyping(false);
      }
    };

    // Slight start delay
    timeoutRef.current = setTimeout(typeChar, 100);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, minSpeed, maxSpeed]);

  return (
    <span className={className}>
      {displayedText}
      {(isTyping || !hideCursorOnComplete) && (
        <span className="inline-block w-[0.12em] h-[0.8em] ml-[0.1em] bg-indigo-400 animate-pulse align-middle rounded-full opacity-70"></span>
      )}
    </span>
  );
};

export default TypewriterText;