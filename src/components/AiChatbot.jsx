import { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";

function AiChatbot() {
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [chatMessage, setChatMessage] = useState(
    "Hi! 👋 Tell me your budget, occasion, colour or style."
  );

  const findBudget = (text) => {
    const match = text.match(
      /(?:₹|rs\.?|inr)?\s*(\d{3,6})/
    );

    return match ? Number(match[1]) : null;
  };

  const findGender = (text) => {
    if (
      text.includes("men") ||
      text.includes("man") ||
      text.includes("boy") ||
      text.includes("male")
    ) {
      return "Men";
    }

    if (
      text.includes("women") ||
      text.includes("woman") ||
      text.includes("girl") ||
      text.includes("female")
    ) {
      return "Women";
    }

    return null;
  };

  const findOccasion = (text) => {
    const occasions = [
      "college",
      "party",
      "formal",
      "office",
      "casual",
      "vacation",
      "sports",
      "travel",
    ];

    return (
      occasions.find((occasion) =>
        text.includes(occasion)
      ) || null
    );
  };

  const findColor = (text) => {
    const colors = [
      "black",
      "white",
      "blue",
      "grey",
      "gray",
      "red",
      "pink",
      "beige",
      "brown",
      "green",
      "yellow",
      "wine",
      "gold",
      "silver",
      "navy",
    ];

    return (
      colors.find((color) =>
        text.includes(color)
      ) || null
    );
  };

  const findCategory = (text) => {
    if (
      text.includes("shirt") ||
      text.includes("t-shirt") ||
      text.includes("tshirt") ||
      text.includes("top")
    ) {
      return "top";
    }

    if (
      text.includes("jeans") ||
      text.includes("trouser") ||
      text.includes("pants")
    ) {
      return "bottom";
    }

    if (
      text.includes("shoe") ||
      text.includes("sneaker") ||
      text.includes("heel") ||
      text.includes("sandals")
    ) {
      return "shoes";
    }

    if (
      text.includes("bag") ||
      text.includes("watch") ||
      text.includes("wallet") ||
      text.includes("cap") ||
      text.includes("belt") ||
      text.includes("accessor")
    ) {
      return "accessories";
    }

    if (
      text.includes("dress") ||
      text.includes("skirt")
    ) {
      return "dress";
    }

    return null;
  };

  const matchesProduct = (
    product,
    gender,
    occasion,
    color,
    category
  ) => {
    const genderMatch =
      !gender ||
      !product.gender ||
      product.gender === gender;

    const occasionMatch =
      !occasion ||
      !product.occasions ||
      product.occasions.some(
        (item) =>
          item.toLowerCase() ===
          occasion.toLowerCase()
      );

    const colorMatch =
      !color ||
      product.colors.some(
        (item) =>
          item.toLowerCase() ===
          color.toLowerCase()
      );

    let categoryMatch = true;

    if (category === "shoes") {
      categoryMatch =
        product.category === "Shoes";
    }

    if (category === "accessories") {
      categoryMatch =
        product.category === "Accessories";
    }

    if (category === "dress") {
      categoryMatch =
        product.name
          .toLowerCase()
          .includes("dress");
    }

    if (category === "top") {
      categoryMatch =
        product.name
          .toLowerCase()
          .includes("shirt") ||
        product.name
          .toLowerCase()
          .includes("top");
    }

    if (category === "bottom") {
      categoryMatch =
        product.name
          .toLowerCase()
          .includes("jeans") ||
        product.name
          .toLowerCase()
          .includes("trouser");
    }

    return (
      genderMatch &&
      occasionMatch &&
      colorMatch &&
      categoryMatch
    );
  };

  const createOutfit = (
    availableProducts,
    budget
  ) => {
    if (!budget) {
      return availableProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    }

    const sorted = [...availableProducts].sort(
      (a, b) => b.rating - a.rating
    );

    const outfit = [];
    let total = 0;

    const hasTop = (product) =>
      product.name
        .toLowerCase()
        .includes("shirt") ||
      product.name
        .toLowerCase()
        .includes("top");

    const hasBottom = (product) =>
      product.name
        .toLowerCase()
        .includes("jeans") ||
      product.name
        .toLowerCase()
        .includes("trouser");

    const hasShoes = (product) =>
      product.category === "Shoes";

    const hasAccessory = (product) =>
      product.category === "Accessories";

    const categories = [
      hasTop,
      hasBottom,
      hasShoes,
      hasAccessory,
    ];

    for (const categoryCheck of categories) {
      const product = sorted.find(
        (item) =>
          categoryCheck(item) &&
          !outfit.some(
            (selected) =>
              selected.id === item.id
          ) &&
          total + item.price <= budget
      );

      if (product) {
        outfit.push(product);
        total += product.price;
      }
    }

    // If we couldn't create a full outfit,
    // show the best products within budget.
    if (outfit.length < 2) {
      return sorted
        .filter(
          (product) =>
            product.price <= budget
        )
        .slice(0, 4);
    }

    return outfit;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const text = message.toLowerCase();

    const budget = findBudget(text);
    const gender = findGender(text);
    const occasion = findOccasion(text);
    const color = findColor(text);
    const category = findCategory(text);

    let filteredProducts = products.filter(
      (product) => {
        const budgetMatch =
          !budget ||
          product.price <= budget;

        return (
          budgetMatch &&
          matchesProduct(
            product,
            gender,
            occasion,
            color,
            category
          )
        );
      }
    );

    // If colour filtering gives no result,
    // relax colour requirement.
    if (
      filteredProducts.length === 0 &&
      color
    ) {
      filteredProducts = products.filter(
        (product) => {
          const budgetMatch =
            !budget ||
            product.price <= budget;

          return (
            budgetMatch &&
            matchesProduct(
              product,
              gender,
              occasion,
              null,
              category
            )
          );
        }
      );
    }

    // If still no result, relax occasion.
    if (
      filteredProducts.length === 0 &&
      occasion
    ) {
      filteredProducts = products.filter(
        (product) => {
          const budgetMatch =
            !budget ||
            product.price <= budget;

          return (
            budgetMatch &&
            matchesProduct(
              product,
              gender,
              null,
              color,
              category
            )
          );
        }
      );
    }

    const outfit = createOutfit(
      filteredProducts,
      budget
    );

    if (outfit.length === 0) {
      setChatMessage(
        "Sorry 😔 I couldn't find a suitable outfit. Try increasing your budget or changing your requirements."
      );
    } else {
      const total = outfit.reduce(
        (sum, product) =>
          sum + product.price,
        0
      );

      let details = [];

      if (gender) details.push(gender);
      if (occasion) details.push(occasion);
      if (color) details.push(color);

      const description =
        details.length > 0
          ? details.join(" • ")
          : "Personalized Style";

      if (budget) {
        setChatMessage(
          `✨ I created a ${description} outfit for you. Total: ₹${total} / ₹${budget}.`
        );
      } else {
        setChatMessage(
          `✨ Here is a ${description} outfit selected from StyleAI.`
        );
      }
    }

    setRecommendations(outfit);
    setMessage("");
  };

  const addToCart = (product) => {
    const existingCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existingProduct =
      existingCart.find(
        (item) => item.id === product.id
      );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    alert(
      `${product.name} added to cart! 🛒`
    );
  };

  return (
    <section className="ai-chatbot-section">

      <div className="ai-chatbot-container">

        {/* INTRO */}

        <div className="ai-chatbot-intro">

          <p className="ai-label">
            ✨ STYLEAI ASSISTANT
          </p>

          <h2>
            Your Personal
            <span> AI Stylist</span>
          </h2>

          <p>
            Tell me your budget, gender,
            occasion, colour or clothing
            preference and I'll create a
            personalized outfit.
          </p>

          <div className="ai-example">

            Try:

            <br />

            <strong>
              "Men's college outfit under ₹2500 in black"
            </strong>

          </div>

        </div>

        {/* CHAT */}

        <div className="ai-chatbot-box">

          <div className="ai-chat-header">

            <div className="ai-avatar">
              AI
            </div>

            <div>
              <strong>StyleAI</strong>

              <small>
                Personal Fashion Assistant
              </small>
            </div>

          </div>

          <div className="ai-chat-body">

            <div className="ai-message bot">
              {chatMessage}
            </div>

            {recommendations.length > 0 && (

              <div className="ai-recommendations">

                {recommendations.map(
                  (product) => (

                    <div
                      className="ai-product"
                      key={product.id}
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      <div className="ai-product-info">

                        <h3>
                          {product.name}
                        </h3>

                        <p>
                          ₹{product.price}
                        </p>

                        <div className="ai-product-actions">

                          <Link
                            to={`/product/${product.id}`}
                            className="ai-view-btn"
                          >
                            View Product
                          </Link>

                          <button
                            className="ai-cart-btn"
                            onClick={() =>
                              addToCart(product)
                            }
                          >
                            Add to Cart
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          <form
            className="ai-chat-input"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              placeholder="e.g. Women's party outfit under ₹3000"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button type="submit">
              Ask AI
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default AiChatbot;