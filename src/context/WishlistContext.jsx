import {
  createContext,
  useContext,
  useState,
} from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist =
        localStorage.getItem("styleai-wishlist");

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    } catch (error) {
      console.error(
        "Unable to load wishlist:",
        error
      );

      return [];
    }
  });

  const saveWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist);

    localStorage.setItem(
      "styleai-wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const addToWishlist = (product) => {
    const exists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (exists) {
      return;
    }

    saveWishlist([
      ...wishlistItems,
      product,
    ]);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist =
      wishlistItems.filter(
        (item) => item.id !== productId
      );

    saveWishlist(updatedWishlist);
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.id === productId
    );
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}