import { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";

function AiChatbot() {
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [budget, setBudget] = useState(null);
  const [chatMessage, setChatMessage] = useState(
    "Hi! 👋 I'm StyleAI. Tell me your budget and what you're looking for."
  );

  const getRecommendations = () => {
    const text = message.toLowerCase();

    // Find budget from user message
    const budgetMatch = text.match(
      /(?:₹|rs\.?|inr)?\s*(\d{3,6})/
    );

    const userBudget = budgetMatch
      ? Number(budgetMatch[1])
      : null;

    // Detect category
    let category = null;

    if (
      text.includes("men") ||
      text.includes("boy") ||
      text.includes("male")
    ) {
      category = "Men";
    } else if (
      text.includes("women") ||
      text.includes("woman") ||
      text.includes("girl") ||
      text.includes("female")
    ) {
      category = "Women";
    } else if (text.includes("shoe")) {
      category = "Shoes";
    } else if (
      text.includes("accessor") ||
      text.includes("watch") ||
      text.includes("bag")
    ) {
      category = "Accessories";
    }

    // Filter products
    let filteredProducts = products.filter((product) => {
      const matchesBudget =
        !userBudget || product.price <= userBudget;

      const matchesCategory =
        !category ||
        product.category.toLowerCase() ===
          category.toLowerCase();

      return matchesBudget && matchesCategory;
    });

    // If category gives no result, search budget only
    if (filteredProducts.length === 0 && userBudget) {
      filteredProducts = products.filter(
        (product) => product.price <= userBudget
      );
    }

    // Sort cheaper products first
    filteredProducts.sort(
      (a, b) => a.price - b.price
    );

    // Show maximum 4 products
    filteredProducts = filteredProducts.slice(0, 4);

    setBudget(userBudget);

    if (filteredProducts.length === 0) {
      setChatMessage(
        "Sorry 😔 I couldn't find products matching your requirements. Try increasing your budget."
      );
    } else if (userBudget) {
      setChatMessage(
        `Great! 💜 I found ${filteredProducts.length} product(s) within your ₹${userBudget} budget.`
      );
    } else {
      setChatMessage(
        `Here are some recommendations based on your request. ✨`
      );
    }

    setRecommendations(filteredProducts);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    getRecommendations();
  };

  return (
    <section className="ai-chatbot-section">

      <div className="ai-chatbot-container">

        {/* LEFT SIDE */}

        <div className="ai-chatbot-intro">

          <p className="ai-label">
            ✨ STYLEAI ASSISTANT
          </p>

          <h2>
            Find Your Perfect
            <span> Style with AI</span>
          </h2>

          <p>
            Tell me your budget, occasion, category
            or preferred style. I'll find matching
            products from our collection.
          </p>

          <div className="ai-example">
            Try:
            <br />
            <strong>
              "Suggest college clothes under ₹2000"
            </strong>
          </div>

        </div>

        {/* CHAT BOX */}

        <div className="ai-chatbot-box">

          <div className="ai-chat-header">
            <div className="ai-avatar">
              AI
            </div>

            <div>
              <strong>StyleAI</strong>
              <small>AI Fashion Assistant</small>
            </div>
          </div>

          <div className="ai-chat-body">

            <div className="ai-message bot">
              {chatMessage}
            </div>

            {budget && (
              <div className="ai-budget">
                Budget: ₹{budget}
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="ai-recommendations">

                {recommendations.map((product) => (

                  <div
                    className="ai-product"
                    key={product.id}
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="ai-product-info">

                      <h3>{product.name}</h3>

                      <p>
                        ₹{product.price}
                      </p>

                      <Link
                        to={`/product/${product.id}`}
                        className="ai-view-btn"
                      >
                        View Product →
                      </Link>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

          <form
            className="ai-chat-input"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              placeholder="Example: college outfit under ₹2000"
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