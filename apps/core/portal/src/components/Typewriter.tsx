"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
}

export default function Typewriter({ words }: TypewriterProps) {
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const i = loopNum % words.length;
    const fullText = words[i];

    const handleType = () => {
      setCurrentWord(
        isDeleting
          ? fullText.substring(0, currentWord.length - 1)
          : fullText.substring(0, currentWord.length + 1)
      );

      // Velocidad: escribe a 100ms, borra a 50ms
      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && currentWord === fullText) {
        // Pausa cuando termina de escribir la palabra
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentWord === "") {
        // Pasa a la siguiente palabra cuando termina de borrar
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, loopNum, typingSpeed, words]);

  return (
    <span className="font-bold" style={{ color: 'var(--accent-text)' }}>
      {currentWord}
      <span className="ml-1 border-r-2 border-current animate-[pulse_1s_infinite]"></span>
    </span>
  );
}
