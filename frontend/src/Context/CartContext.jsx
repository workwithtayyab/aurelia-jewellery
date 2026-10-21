
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import catalogProducts from "../data/products";

const CartContext = createContext();

const CART_KEY = "aurelia-cart";
const WISHLIST_KEY = "aurelia-wishlist";
const ORDERS_KEY = "aurelia-orders";

// =========================================
// SAFE LOCAL STORAGE READER
// =========================================

const readStorage = (key, fallback = []) => {
  try {
    if (typeof window === "undefined") {
      return fallback;
    }

    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return fallback;
  }
};

// Saved carts/wishlists can hold old prices or image URLs from a previous
// deployment. Refresh known products from the current catalogue on load,
// keeping things like quantity. Unknown items are left untouched.
const catalogById = new Map(
  catalogProducts.map((product) => [String(product.id), product])
);

const syncWithCatalog = (items) =>
  Array.isArray(items)
    ? items.map((item) => {
        const current = catalogById.get(String(item?.id));
        return current ? { ...item, ...current } : item;
      })
    : [];

export const CartProvider = ({ children }) => {
  // =========================================
  // CART
  // =========================================

  const [cart, setCart] = useState(() =>
    syncWithCatalog(readStorage(CART_KEY))
  );

  // =========================================
  // WISHLIST
  // =========================================

  const [wishlist, setWishlist] = useState(() =>
    syncWithCatalog(readStorage(WISHLIST_KEY))
  );

  // =========================================
  // ORDERS
  // =========================================

  const [orders, setOrders] = useState(() =>
    readStorage(ORDERS_KEY)
  );

  // =========================================
  // SAVE CART
  // =========================================

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);

  // =========================================
  // SAVE WISHLIST
  // =========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlist]);

  // =========================================
  // SAVE ORDERS
  // =========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  }, [orders]);

  // =========================================
  // SYNC ORDERS BETWEEN BROWSER TABS
  // =========================================

  useEffect(() => {
    const syncOrders = (event) => {
      if (event.key !== ORDERS_KEY) {
        return;
      }

      try {
        const updatedOrders = event.newValue
          ? JSON.parse(event.newValue)
          : [];

        if (Array.isArray(updatedOrders)) {
          setOrders(updatedOrders);
        }
      } catch (error) {
        console.error("Failed to sync orders:", error);
      }
    };

    window.addEventListener("storage", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
    };
  }, []);

  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =========================================
  // REMOVE FROM CART
  // =========================================

  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== productId
      )
    );
  };

  // =========================================
  // INCREASE QUANTITY
  // =========================================

  const increaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================================
  // DECREASE QUANTITY
  // =========================================

  const decreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================================
  // CLEAR CART
  // =========================================

  const clearCart = () => {
    setCart([]);
  };

  // =========================================
  // CART COUNT
  // =========================================

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // =========================================
  // CART TOTAL
  // =========================================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // =========================================
  // TOGGLE WISHLIST
  // =========================================

  const toggleWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const alreadyExists = previousWishlist.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return previousWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [...previousWishlist, product];
    });
  };

  // =========================================
  // CHECK WISHLIST
  // =========================================

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  // =========================================
  // WISHLIST COUNT
  // =========================================

  const wishlistCount = wishlist.length;

  // =========================================
  // ADD ORDER
  // =========================================

  const addOrder = (order) => {
    setOrders((previousOrders) => [
      order,
      ...previousOrders.filter(
        (existingOrder) =>
          existingOrder.orderNumber !== order.orderNumber
      ),
    ]);
  };

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================

  const updateOrderStatus = (orderNumber, orderStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.orderNumber === orderNumber
          ? {
              ...order,
              orderStatus,
              status: orderStatus,
            }
          : order
      )
    );
  };

  // =========================================
  // REMOVE ORDER
  // =========================================

  const removeOrder = (orderNumber) => {
    setOrders((previousOrders) =>
      previousOrders.filter(
        (order) => order.orderNumber !== orderNumber
      )
    );
  };

  // =========================================
  // CLEAR ALL ORDERS
  // =========================================

  const clearOrders = () => {
    setOrders([]);
  };

  // =========================================
  // PROVIDER
  // =========================================

  return (
    <CartContext.Provider
      value={{
        // Cart
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,

        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,

        // Orders
        orders,
        addOrder,
        updateOrderStatus,
        removeOrder,
        clearOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =========================================
// CUSTOM HOOK
// =========================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};
