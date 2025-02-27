import { useRef, useEffect, RefObject } from "react";

interface UseAutoResizeTextareaProps {
  minHeight?: number;
  maxHeight?: number;
}

export function useAutoResizeTextarea({
  minHeight = 56,
  maxHeight = 200,
}: UseAutoResizeTextareaProps = {}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    
    // Calculate the new height
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    );
    
    // Set the new height
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    // Adjust height on initial render
    adjustHeight();
    
    // Add resize event listener to handle window resizing
    window.addEventListener("resize", adjustHeight);
    
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);

  return { textareaRef, adjustHeight };
}
