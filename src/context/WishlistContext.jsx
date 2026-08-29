import {
  createContext,
  useContext,
  useState,
} from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] =
    useState(() => {
      const savedWishlist =
        localStorage.getItem("styleai-wishlist");

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    });

  const saveWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist);

    localStorage.setItem(
      "styleai-wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const addToWishlist = (product) => {
    const alreadyExists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (alreadyExists) {
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
    const alreadyExists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (alreadyExists) {
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

  const wishlistCount =
    wishlistItems.length;

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
  return useContext(WishlistContext);
}