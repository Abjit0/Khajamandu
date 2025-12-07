import React from "react";
import { Link } from "react-router-dom";

// === 1. SETUP IMAGES ===
const img1 = "/gurkha-kitchen.jpg"; 
const img2 = "/Pokhara-Pizza.jpg";
const img3 = "/Chitwan-Biryani.jpg";
const img4 = "/vegan.jpeg";


const styles = {
  body: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    color: "#222",
    margin: 0,
    padding: 0,
  },
  header: {
    background: "linear-gradient(90deg, #ff914d, #29ae60)",
    color: "#fff",
    padding: "40px 0 30px 0",
    textAlign: "center",
    position: "relative",
  },
  authLinks: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    display: 'flex',
    gap: '16px',
    zIndex: 10,
    alignItems: 'center',
  },
  authLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.05em',
    padding: '8px 16px',
    borderRadius: '6px',
    background: 'rgba(0, 0, 0, 0.15)',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  title: {
    margin: 0,
    fontSize: "3em",
    letterSpacing: "2px",
  },
  subtitle: {
    margin: "8px 0 22px 0",
    fontSize: "1.3em",
  },
  searchBar: {
    display: "flex",
    justifyContent: "center",
    maxWidth: 600,
    margin: "0 auto 32px auto",
    padding: "0 20px",
  },
  searchInput: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px 0 0 8px",
    fontSize: "1em",
  },
  searchButton: {
    padding: "12px 24px",
    border: "none",
    background: "#29ae60",
    color: "#fff",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
    fontSize: "1em",
  },
  categories: {
    display: "flex",
    justifyContent: "center",
    gap: 24,
    marginTop: 20,
    flexWrap: "wrap",
  },
  category: {
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    padding: "16px 28px",
    margin: "10px 0",
    fontSize: "1.1em",
    color: "#29ae60",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  steps: {
    maxWidth: 900,
    background: "#fff",
    borderRadius: 12,
    margin: "36px auto 0 auto",
    padding: "28px 22px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    display: "flex",
    gap: 24,
    justifyContent: "space-between",
    flexWrap: "wrap",
    textAlign: "center",
  },
  step: {
    flex: 1,
    minWidth: 180,
    margin: "8px 0",
  },
  stepIcon: {
    fontSize: "2em",
    background: "#ffe5d1",
    color: "#ff914d",
    borderRadius: "50%",
    padding: 12,
    marginBottom: 10,
    display: "inline-block",
  },
  featured: {
    maxWidth: 1000,
    margin: "40px auto",
    padding: "0 15px",
  },
  featuredTitle: {
    textAlign: "center",
    color: "#29ae60",
    marginBottom: 12,
  },
  restaurantGrid: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  restaurantCard: {
    background: "#fff",
    borderRadius: 12, 
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    width: 220, 
    textAlign: "center",
    overflow: "hidden", 
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  cardContent: {
    padding: "15px",
  },
  downloadApp: {
    textAlign: "center",
    margin: "48px 0 36px 0",
  },
  appImg: {
    height: 44,
    width: "auto",
    margin: "0 9px",
    verticalAlign: "middle",
  },
  whyChoose: {
    background: "#29ae60",
    color: "#fff",
    padding: "40px 5% 36px 5%",
    textAlign: "center",
  },
  whyTitle: {
    marginBottom: 18,
    letterSpacing: 1,
  },
  featuresList: {
    display: "flex",
    justifyContent: "center",
    gap: 34,
    flexWrap: "wrap",
  },
  feature: {
    background: "#fff",
    color: "#29ae60",
    padding: "18px 30px",
    margin: "7px 0",
    borderRadius: 8,
    fontSize: "1.05em",
    minWidth: 160,
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },
  footer: {
    background: "#333",
    color: "#fff",
    padding: "34px 0 12px 0",
    textAlign: "center",
    marginTop: 22,
  },
  footerLinks: {
    marginBottom: 10,
  },
  footerLink: {
    color: "#ffc795",
    textDecoration: "none",
    margin: "0 12px",
  },
  socialIcons: {
    marginTop: 8,
  },
  socialIconImg: {
    height: 30,
    margin: "0 7px",
    verticalAlign: "middle",
  },
};

// === 2. USE IMAGES IN DATA ===
const restaurants = [
  { name: "Gurkha Kitchen", img: img1 },
  { name: "Pokhara Pizzeria", img: img2 },
  { name: "Chitwan Biryani House", img: img3 },
  { name: "Lalitpur Vegan Bites", img: img4 }, 
];

export default function KhajamanduHome({ isAuthenticated, onLogout }) {
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <div style={styles.authLinks}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" style={styles.authLink}>Login</Link>
              <Link to="/signup" style={styles.authLink}>Sign Up</Link>
            </>
          ) : (
            <>
              <span style={{ color: '#fff', fontWeight: 'bold', marginRight: 10 }}>
                Welcome!
              </span>
              <button
                onClick={onLogout}
                style={{ ...styles.authLink, background: '#d63031', border: 'none' }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        <h1 style={styles.title}>Khajamandu</h1>
        <p style={styles.subtitle}>
          Bringing Your Favorite Food to Your Doorstep – Fast, Easy, and Reliable!
        </p>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Enter location or restaurant name..."
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>Search</button>
        </div>
        <div style={styles.categories}>
          <div style={styles.category}>🍛 Nepali</div>
          <div style={styles.category}>🍲 Indian</div>
          <div style={styles.category}>🥡 Chinese</div>
          <div style={styles.category}>🍔 Fast Food</div>
          <div style={styles.category}>🍰 Desserts</div>
          <div style={styles.category}>🥤 Beverages</div>
        </div>
      </header>
      
      <div style={styles.steps}>
        <div style={styles.step}>
          <div style={styles.stepIcon}>📍</div>
          <h4>1. Choose Your Location</h4>
          <p>Select your city & area to find restaurants that deliver to you.</p>
        </div>
        <div style={styles.step}>
          <div style={styles.stepIcon}>🍽️</div>
          <h4>2. Browse and Order</h4>
          <p>Pick delicious meals from the best local restaurants, right from your phone or computer.</p>
        </div>
        <div style={styles.step}>
          <div style={styles.stepIcon}>🚗</div>
          <h4>3. We Deliver Fast</h4>
          <p>Enjoy speedy delivery with real-time tracking, straight to your doorstep.</p>
        </div>
      </div>

      <div style={styles.featured}>
        <h2 style={styles.featuredTitle}>Featured Restaurants</h2>
        <div style={styles.restaurantGrid}>
          {/* === 3. UPDATED TO INCLUDE LINK === */}
          {restaurants.map((r, index) => (
            <Link 
              to={`/restaurant/${index}`} 
              key={index} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={styles.restaurantCard}>
                <img
                  src={r.img}
                  alt={r.name}
                  style={{ 
                    width: "100%",        
                    height: "140px",      
                    objectFit: "cover"    
                  }}
                />
                <div style={styles.cardContent}>
                  <h4 style={{margin: '0 0 5px 0', fontSize: '1.1em'}}>{r.name}</h4>
                  <div style={{fontSize: '0.9em', color: '#666'}}>⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.downloadApp}>
        <p><strong>Get Khajamandu App</strong></p>
        <a href="#">
           <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Get_it_on_Google_play.svg" alt="Google Play" style={styles.appImg} />
        </a>
        <a href="#">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" style={styles.appImg} />
        </a>
        <p>Or Order Easily by Phone: <a href="tel:+977123456789">+977 123 456789</a></p>
      </div>

      <div style={styles.whyChoose}>
        <h3 style={styles.whyTitle}>Why Khajamandu?</h3>
        <div style={styles.featuresList}>
          <div style={styles.feature}>⚡ Fast & Reliable Delivery</div>
          <div style={styles.feature}>🍕 Hundreds of Restaurants</div>
          <div style={styles.feature}>📱 Easy Online Ordering</div>
          <div style={styles.feature}>💸 Exclusive Discounts</div>
          <div style={styles.feature}>🔍 Real-time Tracking</div>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <Link to="/about" style={styles.footerLink}>About Us</Link> |
          <Link to="/careers" style={styles.footerLink}>Careers</Link> |
          <Link to="/contact" style={styles.footerLink}>Contact</Link> |
          <Link to="/faq" style={styles.footerLink}>FAQs</Link> |
          <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
        </div>
        <div style={styles.socialIcons}>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style={styles.socialIconImg} /></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733635.png" alt="Instagram" style={styles.socialIconImg} /></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Twitter" style={styles.socialIconImg} /></a>
        </div>
        <p style={{ marginTop: 12 }}>© 2025 Khajamandu. All rights reserved.</p>
      </footer>
    </div>
  );
}