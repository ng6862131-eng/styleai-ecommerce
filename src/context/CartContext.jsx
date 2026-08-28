import { createContext, useContext, useState } from "react";


const CartContext = createContext();

// ================= CART PROVIDER =================

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("styleai-cart");

    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // ================= SAVE CART =================

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);

    localStorage.setItem(
      "styleai-cart",
      JSON.stringify(updatedCart)
    );
  };

  // ================= ADD TO CART =================

  const addToCart = (
    product,
    selectedColor = "Default",
    selectedSize = "Standard",
    quantity = 1
  ) => {
    const existingItem = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          ...product,
          selectedColor,
          selectedSize,
          quantity,
        },
      ];
    }

    saveCart(updatedCart);
  };

  // ================= REMOVE FROM CART =================

  const removeFromCart = (
    id,
    selectedColor,
    selectedSize
  ) => {
    const updatedCart = cartItems.filter(
      (item) =>
        !(
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        )
    );

    saveCart(updatedCart);
  };

  // ================= INCREASE QUANTITY =================

  const increaseQuantity = (
    id,
    selectedColor,
    selectedSize
  ) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  // ================= DECREASE QUANTITY =================

  const decreaseQuantity = (
    id,
    selectedColor,
    selectedSize
  ) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize &&
      item.quantity > 1
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  // ================= CART COUNT =================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ================= CART TOTAL =================

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ================= PROVIDER =================

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ================= USE CART =================

export function useCart() {
  return useContext(CartContext);
}