import { useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { useVirtualKeyboard } from '@/hooks/useVirtualKeyboard';
import { cn } from '@/lib/utils';

interface KeyboardAwareInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export function KeyboardAwareInput({
  className,
  onValueChange,
  onChange,
  onFocus,
  ...props
}: KeyboardAwareInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen } = useVirtualKeyboard();

  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Scroll element into view with some padding
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300); // Small delay to allow keyboard to appear

    // Call the original onFocus if provided
    if (onFocus) {
      onFocus(e);
    }
  };

  // Handle change events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  // Effect to handle keyboard visibility changes
  useEffect(() => {
    if (isOpen && document.activeElement === inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  }, [isOpen]);

  return (
    <Input
      ref={inputRef}
      className={cn(
        "transition-all",
        isOpen && "keyboard-focused",
        className
      )}
      onChange={handleChange}
      onFocus={handleFocus}
      {...props}
    />
  );
}
