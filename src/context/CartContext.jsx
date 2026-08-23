import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("styleai-cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);

    localStorage.setItem(
      "styleai-cart",
      JSON.stringify(updatedCart)
    );
  };

  const addToCart = (product, selectedColor, selectedSize, quantity) => {
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

  const removeFromCart = (id, selectedColor, selectedSize) => {
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

  const increaseQuantity = (id, selectedColor, selectedSize) => {
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

  const decreaseQuantity = (id, selectedColor, selectedSize) => {
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

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

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

export function useCart() {
  return useContext(CartContext);
}