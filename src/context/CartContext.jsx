import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
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
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("styleai-user-token")
  );
  const cartHydrating = useRef(Boolean(authToken));


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

  const getItemKey = useCallback((
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
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      cartHydrating.current = true;
      setAuthToken(localStorage.getItem("styleai-user-token"));
    };
    window.addEventListener("styleai-auth-changed", handleAuthChange);
    return () => window.removeEventListener("styleai-auth-changed", handleAuthChange);
  }, []);

  useEffect(() => {
    if (!authToken) {
      cartHydrating.current = false;
      return undefined;
    }

    let cancelled = false;
    cartHydrating.current = true;

    const hydrateCart = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/cart", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const result = await response.json();
        if (!response.ok || !result.success || cancelled) return;

        let localCart = [];
        try {
          localCart = JSON.parse(localStorage.getItem("styleai-cart") || "[]");
        } catch {
          localCart = [];
        }

        const mergedCart = Array.isArray(result.items) ? [...result.items] : [];
        for (const localItem of Array.isArray(localCart) ? localCart : []) {
          const existingIndex = mergedCart.findIndex((item) =>
            getItemKey(item, item.selectedColor, item.selectedSize) ===
            getItemKey(localItem, localItem.selectedColor, localItem.selectedSize)
          );
          if (existingIndex >= 0) {
            mergedCart[existingIndex] = {
              ...mergedCart[existingIndex],
              quantity: Number(mergedCart[existingIndex].quantity || 0) + Number(localItem.quantity || 0),
            };
          } else {
            mergedCart.push(localItem);
          }
        }

        if (cancelled) return;
        setCartItems(mergedCart);
        localStorage.setItem("styleai-cart", JSON.stringify(mergedCart));
        await fetch("http://localhost:5000/auth/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ items: mergedCart }),
        });
      } catch (error) {
        console.error("Unable to sync the cart with StyleAI:", error);
      } finally {
        if (!cancelled) cartHydrating.current = false;
      }
    };

    hydrateCart();
    return () => {
      cancelled = true;
    };
  }, [authToken, getItemKey]);

  useEffect(() => {
    if (!authToken || cartHydrating.current) return undefined;
    const timeout = window.setTimeout(async () => {
      try {
        await fetch("http://localhost:5000/auth/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ items: cartItems }),
        });
      } catch (error) {
        console.error("Unable to save the cart to StyleAI:", error);
      }
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [cartItems, authToken]);


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

// The hook intentionally shares its context module with the provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
