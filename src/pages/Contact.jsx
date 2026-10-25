import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaShoppingBag,
  FaStore,
  FaUser,
} from "react-icons/fa";
import Footer from "../components/Footer";

const initialForm = {
  name: "",
  email: "",
  topic: "General question",
  orderId: "",
  message: "",
};

const topics = [
  "General question",
  "Order support",
  "Account help",
  "Seller support",
  "Website feedback",
];

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "We couldn't send your message. Please try again.");
      }

      setStatus({
        type: "success",
        message: "Your message has been sent. We’ll reply to the email address you provided.",
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "We couldn't reach the contact service. Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <main className="contact-page">
        <Link to="/" className="contact-back-home">
          <FaArrowLeft />
          Back to Home
        </Link>

        <section className="contact-hero">
          <span className="contact-eyebrow">CONTACT STYLEAI</span>
          <h1>
            How can we
            <span> help you?</span>
          </h1>
          <p>
            Send a question about shopping, an order, your account or the
            seller portal. Add an order number if it will help us understand
            your message.
          </p>
        </section>

        <section className="contact-layout">
          <aside className="contact-side">
            <div className="contact-side-heading">
              <span className="contact-eyebrow">A GOOD PLACE TO START</span>
              <h2>Tell us what you need.</h2>
              <p>
                Choose a topic in the form and include the details that
                matter. Please never include your password or payment
                card information.
              </p>
            </div>

            <article className="contact-help-card">
              <div className="contact-help-icon"><FaShoppingBag /></div>
              <div>
                <h3>Orders and shopping</h3>
                <p>Include your order number if your message is about an order.</p>
              </div>
            </article>

            <article className="contact-help-card">
              <div className="contact-help-icon"><FaUser /></div>
              <div>
                <h3>Account help</h3>
                <p>Tell us which part of your StyleAI account needs attention.</p>
              </div>
            </article>

            <article className="contact-help-card">
              <div className="contact-help-icon"><FaStore /></div>
              <div>
                <h3>Seller support</h3>
                <p>Include your store name when asking about seller tools.</p>
              </div>
            </article>

            <Link to="/shop" className="contact-shop-link">
              <FaEnvelope />
              You can also explore the collection while you’re here.
            </Link>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-heading">
              <span className="contact-eyebrow">SEND A MESSAGE</span>
              <h2>We’ll read every detail.</h2>
            </div>

            <div className="contact-fields">
              <label className="contact-field">
                <span>Your name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label className="contact-field">
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={150}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="contact-field">
                <span>What is this about?</span>
                <select name="topic" value={form.topic} onChange={handleChange}>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </label>

              <label className="contact-field">
                <span>Order number <small>(optional)</small></span>
                <input
                  name="orderId"
                  type="text"
                  maxLength={100}
                  value={form.orderId}
                  onChange={handleChange}
                  placeholder="For order questions"
                />
              </label>

              <label className="contact-field contact-field-wide">
                <span>Your message</span>
                <textarea
                  name="message"
                  rows={6}
                  maxLength={3000}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your question or feedback here"
                  required
                />
                <small>{form.message.length}/3000 characters</small>
              </label>
            </div>

            {status && (
              <p className={"contact-status contact-status-" + status.type} role="status">
                {status.message}
              </p>
            )}

            <button className="contact-submit" type="submit" disabled={isSending}>
              {isSending ? "Sending…" : "Send message"}
            </button>

            <p className="contact-form-note">
              Your message is sent to the StyleAI support inbox configured for this website.
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Contact;