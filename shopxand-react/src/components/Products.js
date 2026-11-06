import React from "react";
import ProductCard  from "./ProductCard";

function Products({ products, onAddCart }) {
    return (
         <section className="products">
      <div className="container">
        <h2>Популярные товары</h2>
        <div className="products__grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
    )
}

export default Products