import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext = createContext();

/* =========================================================
   CART PROVIDER
========================================================= */

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState(() => {

    const savedCart =
      localStorage.getItem("styleai-cart");

    try {
      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch (error) {

      console.error(
        "Error loading cart:",
        error
      );

      return [];
    }
  });


  /* =======================================================
     SAVE CART
  ======================================================= */

  const saveCart = (updatedCart) => {

    setCartItems(updatedCart);

    localStorage.setItem(
      "styleai-cart",
      JSON.stringify(updatedCart)
    );
  };


  /* =======================================================
     CREATE ITEM KEY
  ======================================================= */

  const getItemKey = (
    product,
    selectedColor,
    selectedSize
  ) => {

    const customization =
      product.customization;

    const customizationKey =
      customization
        ? JSON.stringify({
            productType:
              customization.productType ||
              "",
            pattern:
              customization.pattern ||
              "",
            text:
              customization.text ||
              "",
            textColor:
              customization.textColor ||
              "",
          })
        : "";

    return [
      product.id,
      selectedColor,
      selectedSize,
      customizationKey,
    ].join("|");
  };


  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (
    product,
    selectedColor = "Default",
    selectedSize = "Standard",
    quantity = 1
  ) => {

    const newItemKey =
      getItemKey(
        product,
        selectedColor,
        selectedSize
      );


    const existingItem =
      cartItems.find(
        (item) =>
          getItemKey(
            item,
            item.selectedColor,
            item.selectedSize
          ) === newItemKey
      );


    let updatedCart;


    /* ================= EXISTING ITEM ================= */

    if (existingItem) {

      updatedCart =
        cartItems.map((item) => {

          const itemKey =
            getItemKey(
              item,
              item.selectedColor,
              item.selectedSize
            );


          if (itemKey === newItemKey) {

            return {
              ...item,

              quantity:
                Number(item.quantity || 0) +
                Number(quantity || 0),
            };
          }


          return item;
        });
    }


    /* ================= NEW ITEM ================= */

    else {

      updatedCart = [
        ...cartItems,

        {
          ...product,

          selectedColor,

          selectedSize,

          quantity:
            Number(quantity || 1),

          customization:
            product.customization
              ? {
                  ...product.customization,
                }
              : null,
        },
      ];
    }


    saveCart(updatedCart);
  };


  /* =======================================================
     REMOVE FROM CART
  ======================================================= */

  const removeFromCart = (
    id,
    selectedColor,
    selectedSize,
    customization = null
  ) => {

    const targetKey =
      getItemKey(
        {
          id,
          customization,
        },
        selectedColor,
        selectedSize
      );


    const updatedCart =
      cartItems.filter((item) => {

        const itemKey =
          getItemKey(
            item,
            item.selectedColor,
            item.selectedSize
          );

        return itemKey !== targetKey;
      });


    saveCart(updatedCart);
  };


  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (
    id,
    selectedColor,
    selectedSize,
    customization = null
  ) => {

    const targetKey =
      getItemKey(
        {
          id,
          customization,
        },
        selectedColor,
        selectedSize
      );


    const updatedCart =
      cartItems.map((item) => {

        const itemKey =
          getItemKey(
            item,
            item.selectedColor,
            item.selectedSize
          );


        if (itemKey === targetKey) {

          return {
            ...item,

            quantity:
              Number(item.quantity || 0) + 1,
          };
        }


        return item;
      });


    saveCart(updatedCart);
  };


  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (
    id,
    selectedColor,
    selectedSize,
    customization = null
  ) => {

    const targetKey =
      getItemKey(
        {
          id,
          customization,
        },
        selectedColor,
        selectedSize
      );


    const updatedCart =
      cartItems.map((item) => {

        const itemKey =
          getItemKey(
            item,
            item.selectedColor,
            item.selectedSize
          );


        if (
          itemKey === targetKey &&
          Number(item.quantity || 0) > 1
        ) {

          return {
            ...item,

            quantity:
              Number(item.quantity || 0) - 1,
          };
        }


        return item;
      });


    saveCart(updatedCart);
  };


  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );


  /* =======================================================
     CART TOTAL
  ======================================================= */

  const cartTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
        Number(item.quantity || 0),
      0
    );


  /* =======================================================
     PROVIDER
  ======================================================= */

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


/* =========================================================
   USE CART
========================================================= */

export function useCart() {
  return useContext(CartContext);
}