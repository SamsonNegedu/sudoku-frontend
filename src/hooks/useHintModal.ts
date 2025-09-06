import { useEffect, useState, useRef } from 'react';

export const useHintModal = (isVisible: boolean, onClose: () => void) => {
  const [fadeOut, setFadeOut] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      setFadeOut(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setFadeOut(true);
        setTimeout(onClose, 200);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setFadeOut(true);
        setTimeout(onClose, 200);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, onClose]);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(onClose, 200); // Wait for animation
  };

  return {
    fadeOut,
    modalRef,
    handleClose,
  };
};
