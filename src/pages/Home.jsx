import Navbar from "../components/Navbar";
import AiChatbot from "../components/AiChatbot";

function Home() {
  return (
    <>
      <Navbar />
                
      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-small">STYLE • AI • FASHION</p>

            <h1>
              Discover Your
              <span> Perfect Style</span>
            </h1>

            <p className="hero-text">
              Shop smarter with AI-powered fashion recommendations
              designed around your style, occasion and budget.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">
                Explore Collection
              </button>

              <button className="secondary-btn">
                ✨ Ask StyleAI
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="fashion-card">
              <span>STYLEAI</span>
              <h2>Wear Your<br />Confidence.</h2>
              <p>AI-powered fashion</p>
            </div>
          </div>
        </section>

        <section className="categories">
          <div className="section-heading">
            <p>SHOP BY CATEGORY</p>
            <h2>Find Your Style</h2>
          </div>

          <div className="category-grid">
            <div className="category-card">
              <span>👔</span>
              <h3>Men</h3>
              <p>Modern styles for men</p>
            </div>

            <div className="category-card">
              <span>👗</span>
              <h3>Women</h3>
              <p>Trending fashion for women</p>
            </div>

            <div className="category-card">
              <span>👟</span>
              <h3>Shoes</h3>
              <p>Step into your style</p>
            </div>

            <div className="category-card">
              <span>👜</span>
              <h3>Accessories</h3>
              <p>Complete your look</p>
            </div>
          </div>
        </section>

        <section className="ai-section">
          <div>
            <p className="ai-label">✨ YOUR PERSONAL STYLIST</p>

            <h2>
              Don't know what
              <span> to wear?</span>
            </h2>

            <p>
              Tell StyleAI your occasion, preferred style and budget.
              Our AI assistant will find fashion recommendations
              specifically for you.
            </p>

            <button className="primary-btn">
              Try StyleAI
            </button>
          </div>

          <div className="ai-box">
            <div className="ai-icon">✨</div>

            <h3>What are you looking for?</h3>

            <div className="ai-example">
              "Suggest me a party outfit under ₹3000"
            </div>

            <button className="ai-button">
              Ask AI →
            </button>
          </div>
        </section>
        <AiChatbot />
      </main>
    </>
  );
}

export default Home;