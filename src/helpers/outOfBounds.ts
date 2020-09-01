import { useRef, useState, useLayoutEffect } from "react";

export const useOutOfBounds = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);
  useLayoutEffect(() => {
    if (ref.current) {
      const bounds = ref.current.getBoundingClientRect();
      if (bounds.right) {
        setIsOutOfBounds(window.innerWidth - bounds.right < 0);
      }
    }
  }, []);
  return [ref, isOutOfBounds];
};
