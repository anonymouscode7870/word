import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const Card = ({ id, title, description, price, image }) => {
    return (
      <div className="card">
        <h2>{title}</h2>
        {/* <p>{description}</p> */}
        <p>Price: {price}</p>
        <img className="card-image" src={image} alt={title} />
      </div>
    );
  };

  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    const res = await fetch("https://dummyjson.com/products?limit=500");
    const data = await res.json();
    console.log(data.products);
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const Page_Size = 10;
  const total_pages = Math.ceil(products.length / Page_Size);

  return (
    <div className="app">
      <h1>Pagiation : {currentPage}</h1>
      
      <div className="products-container">
        
        {products.slice(currentPage*Page_Size, currentPage*Page_Size + Page_Size).map((items) => {
          return products.length ? (
            <Card
              key={items.id}
              title={items.title}
              description={items.description}
              price={items.price}
              image={items.thumbnail}
            />
          ) : (
            <>No products found</>
          );
        })}{" "}
      </div>
      <div>
        <span onClick={()=> setCurrentPage((prev)=>( prev>0 ? prev - 1 : total_pages-1))} className="page-number">⏮</span>
         {/* Added () => to stop the infinite loop  */}
        {[...Array(total_pages)].map((_,n) => (
          <span onClick={() =>setCurrentPage(n)}  className={`page-number ${currentPage === n ? "active" : ""}`} key={n}>{n}</span>
        ))}
      <span className="page-number" onClick={()=> setCurrentPage((prev)=>( prev<total_pages-1 ? prev + 1 : 0))} >⏭</span>
      </div>
    </div>
  );
}

export default App;
