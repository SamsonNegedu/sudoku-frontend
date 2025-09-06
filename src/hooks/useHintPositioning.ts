import { useEffect, useState } from 'react';

interface Position {
  top: number | string;
  left: number | string;
  transform: string;
}

export const useHintPositioning = (isVisible: boolean) => {
  const [position, setPosition] = useState<Position>({
    top: 80,
    left: '50%',
    transform: 'translateX(-50%)',
  });

  useEffect(() => {
    if (isVisible) {
      const calculatePosition = () => {
        // Find the hint button DOM element
        const hintButton = document.querySelector(
          '[data-hint-button="true"]'
        ) as HTMLElement;

        if (!hintButton) {
          // Fallback to center position
          setPosition({ top: 80, left: '50%', transform: 'translateX(-50%)' });
          return;
        }

        const buttonRect = hintButton.getBoundingClientRect();
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        // Hint modal dimensions (approximate)
        const hintWidth = 384; // max-w-md = 24rem = 384px
        const hintHeight = 200; // estimated height

        // Calculate optimal position
        let newPosition: Position = {
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
        };

        // Check if we're on mobile (screen width < 768px)
        const isMobile = viewport.width < 768;

        if (isMobile) {
          // Mobile: Position above the button
          if (buttonRect.top > hintHeight + 20) {
            newPosition = {
              top: buttonRect.top - hintHeight - 10,
              left: Math.max(
                20,
                Math.min(
                  viewport.width - hintWidth - 20,
                  buttonRect.left + buttonRect.width / 2 - hintWidth / 2
                )
              ),
              transform: 'none',
            };
          }
          // Fallback for mobile: center at top if not enough space above
          else {
            newPosition = {
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
            };
          }
        } else {
          // Desktop: Position to the right of the button
          if (buttonRect.right + hintWidth + 20 < viewport.width) {
            newPosition = {
              top: Math.max(
                20,
                Math.min(
                  viewport.height - hintHeight - 20,
                  buttonRect.top + buttonRect.height / 2 - hintHeight / 2
                )
              ),
              left: buttonRect.right + 10,
              transform: 'none',
            };
          }
          // Fallback for desktop: try left if not enough space on right
          else if (buttonRect.left > hintWidth + 20) {
            newPosition = {
              top: Math.max(
                20,
                Math.min(
                  viewport.height - hintHeight - 20,
                  buttonRect.top + buttonRect.height / 2 - hintHeight / 2
                )
              ),
              left: buttonRect.left - hintWidth - 10,
              transform: 'none',
            };
          }
          // Final fallback for desktop: above the button
          else {
            newPosition = {
              top: buttonRect.top - hintHeight - 10,
              left: Math.max(
                20,
                Math.min(
                  viewport.width - hintWidth - 20,
                  buttonRect.left + buttonRect.width / 2 - hintWidth / 2
                )
              ),
              transform: 'none',
            };
          }
        }

        setPosition(newPosition);
      };

      // Calculate position immediately
      calculatePosition();

      // Recalculate on window resize
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    } else {
      // Default centered position when not visible
      setPosition({ top: 80, left: '50%', transform: 'translateX(-50%)' });
    }
  }, [isVisible]);

  return position;
};
