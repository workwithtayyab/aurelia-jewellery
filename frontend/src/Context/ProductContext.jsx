
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import initialProducts from "../data/products";

const ProductContext = createContext(null);

const STORAGE_KEY = "aurelia-products";

// Fingerprint of the catalogue that shipped with this build. Saved copies are
// only reused while it matches, so when you change prices, names or images in
// data/products.js and redeploy, returning visitors get the new catalogue
// instead of a stale copy frozen in their browser (the backend always charges
// the current prices, so stale prices would not match at checkout).
const CATALOG_SIGNATURE = initialProducts
  .map(
    (product) =>
      `${product.id}|${product.name}|${product.price}|${product.oldPrice}|${product.image}`
  )
  .join(";");

const getInitialProducts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (
      saved &&
      !Array.isArray(saved) &&
      saved.signature === CATALOG_SIGNATURE &&
      Array.isArray(saved.products)
    ) {
      return saved.products;
    }
  } catch (error) {
    console.error("Unable to load saved products:", error);
  }

  return initialProducts;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(getInitialProducts);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          signature: CATALOG_SIGNATURE,
          products,
        })
      );
    } catch (error) {
      console.error("Unable to save products:", error);
    }
  }, [products]);

  const addProduct = (product) => {
    setProducts((currentProducts) => {
      const nextId =
        currentProducts.length > 0
          ? Math.max(
              ...currentProducts.map((item) => Number(item.id) || 0)
            ) + 1
          : 1;

      return [
        ...currentProducts,
        {
          ...product,
          id: nextId,
          price: Number(product.price),
          oldPrice: Number(product.oldPrice || product.price),
          featured: Boolean(product.featured),
          newArrival: Boolean(product.newArrival),
        },
      ];
    });
  };

  const updateProduct = (productId, updatedData) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        Number(product.id) === Number(productId)
          ? {
              ...product,
              ...updatedData,
              id: product.id,
              price: Number(updatedData.price ?? product.price),
              oldPrice: Number(
                updatedData.oldPrice ?? product.oldPrice ?? product.price
              ),
            }
          : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => Number(product.id) !== Number(productId)
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
};
