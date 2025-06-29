import { useState, useEffect } from 'react';

interface KeyboardState {
  isOpen: boolean;
  viewportHeight: number;
  keyboardHeight: number;
}

/**
 * Hook to detect virtual keyboard visibility on mobile/tablet devices
 * @returns Object containing keyboard state information
 */
export function useVirtualKeyboard(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isOpen: false,
    viewportHeight: window.innerHeight,
    keyboardHeight: 0,
  });

  useEffect(() => {
    // Initial height on mount
    const initialHeight = window.innerHeight;
    
    const handleResize = () => {
      // If the window height is significantly smaller than the initial height,
      // we can assume the keyboard is open
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      const isKeyboardOpen = heightDifference > 150; // Threshold to detect keyboard
      
      setKeyboardState({
        isOpen: isKeyboardOpen,
        viewportHeight: currentHeight,
        keyboardHeight: isKeyboardOpen ? heightDifference : 0,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return keyboardState;
}
