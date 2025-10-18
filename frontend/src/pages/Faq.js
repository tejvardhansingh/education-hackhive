import React, { useState } from 'react';
import '../App.css';

export default function Faq() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Subscribe request:', email);
    setSubmitted(true);
    setEmail('')
  }

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-content">
          <h2 className="faq-title">FAQ — Coming Soon</h2>
          <p className="faq-description">
            We're building a helpful FAQ to answer common questions. It'll include guides,
            troubleshooting steps and examples. Subscribe and we'll let you know when
            it's ready.
          </p>

          <div className="faq-form-wrapper">
            <form onSubmit={handleSubmit} className="faq-form">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="faq-input"
              />
              <button type="submit" className="faq-button">
                {submitted ? 'Thanks!' : 'Notify Me'}
              </button>
            </form>

            <div className="faq-subtext">
              <p className="faq-subtitle">Want a preview?</p>
              <p>Check back soon or reach out — we love feedback.</p>
            </div>
          </div>


          <p className="faq-privacy">
            By subscribing you agree to receive occasional updates. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
