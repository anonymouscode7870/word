import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [product, setProduct] = useState([]);
  const [skip, setSkip] = useState(0);

  const fetchData = async () => {
    const response = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${skip}`,
    );
    const data = await response.json();
    console.log(data.products);
    setProduct((prev) => [...prev, ...data.products]);
  };

  useEffect(() => {
    fetchData();
  }, [skip]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      //  console.log(document.documentElement.scrollHeight)
      //  console.log(document.documentElement.scrollTop)
      //  console.log(window.innerHeight)

      // scrollTop:	The Distance Scrolled.
      //            How many pixels have disappeared off the top of the screen.

      // innerHeight	:
      //             The Window Height.
      //             The height of the part of the page you can actually see right now.

      // scrollHeight	:
      //             The Total Height.
      //             The height of the entire page from the very top to the very bottom.


      // infinite Scrolling Logic:
      if (
        document.documentElement.scrollTop + window.innerHeight + 1 >=
        document.documentElement.scrollHeight
      ) {
        console.log("bottom reached");
        setSkip((prev) => prev + 10);
      }
    });
  }, []);

  
  return (
    <>
      <h1>Infinite scrolling</h1>
      {product.map((items, index) => {
        return (
          <div key={index}>
            {items.title}
            <img src={items.thumbnail} alt="" />
          </div>
        );
      })}
    </>
  );
}

export default App;
