import { useEffect, useState } from "react";
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    addEventListener("resize", () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }, []);
  return windowSize;
};

export default useWindowSize;

// note
// print again and again when we resize the window, because we are adding event listener on every render, so we need to add event listener only once when the component mounts, so we need to add empty dependency array to useEffect, and also we need to remove the event listener when the component unmounts, so we need to return a cleanup function from useEffect, and also we need to use useCallback to memoize the event handler function, so that it doesn't get recreated on every render, and also we need to use useRef to store the event handler function, so that it doesn't get recreated on every render, and also we need to use useLayoutEffect instead of useEffect, because we want to update the state before the browser paints the screen, so that we don't see any flickering effect when resizing the window.
//  addEventListener("resize", () => {
//       console.log("resized");
//     });