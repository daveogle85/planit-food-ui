import { useRef, useEffect } from "react";

const usePrevious = <T>(value: T) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as T;
};

export default usePrevious;
