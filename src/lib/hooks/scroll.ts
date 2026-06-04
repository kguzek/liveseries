import { useEffect, useState } from "react";

export function useScroll() {
  const [scroll, setScroll] = useState({ scrollY: 0 });

  useEffect(() => {
    function handleScroll() {
      setScroll({ scrollY: window.scrollY });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scroll;
}
