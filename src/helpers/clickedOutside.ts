import React, { useEffect } from 'react';

/**
 * Hook that handles clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref: React.MutableRefObject<null>,
  onClickOutside: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref?.current && !(ref.current as any).contains(event.target)) {
        onClickOutside();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

export default useOutsideAlerter;
