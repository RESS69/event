import React from "react";
import Card from "./src/components/Card";

const App = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 24 }}>
      <h1 style={{ marginBottom: 16, fontWeight: 700 }}>ทดสอบ Card ภาษาคน</h1>

      <Card>
        <div className="company-contact-card">
          <div className="company-contact-main">
            <div className="company-contact-header">
              <span style={{ color: "#facc15", fontSize: 20 }}>⭐</span>
              <span>Bangkok Airways</span>
            </div>

            <div className="company-contact-person-row">
              <span>Nancy Drew</span>
              <span className="contact-badge-primary">Primary</span>
            </div>

            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Partnership Manager
            </div>

            <div className="company-contact-meta-row">
              <div>✉️ nancy.d@bangkokair.com</div>
              <div>📞 1771</div>
            </div>
          </div>

          <button className="company-contact-more-button">⋯</button>
        </div>
      </Card>
    </div>
  );
};

export default App;
