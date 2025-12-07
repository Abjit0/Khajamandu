import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

// === 1. DATA ===

// (A) Restaurant List
const restaurantsList = [
  { name: "Gurkha Kitchen", img: "/gurkha-kitchen.jpg", minOrder: 500 },
  { name: "Pokhara Pizzeria", img: "/Pokhara-Pizza.jpg", minOrder: 400 },
  { name: "Chitwan Biryani House", img: "/Chitwan-Biryani.jpg", minOrder: 350 },
  { name: "Lalitpur Vegan Bites", img: "/vegan.jpeg", minOrder: 300 }, 
];

// (B) Menu Categories
const menuCategories = [
  { id: "popular", name: "🔥 Popular" },
  { id: "momo", name: "🥟 Momo & Dumplings" },
  { id: "noodles", name: "🍜 Noodles / Chowmein" },
  { id: "pizza", name: "🍕 Pizza" },
  { id: "drinks", name: "🥤 Beverages" },
];

// (C) Menu Items (UPDATED WITH PIZZAS)
const menuItems = [
  // --- POPULAR ---
  { id: 1, category: "popular", name: "Chicken Steam Momo", price: 200, desc: "Juicy minced chicken served with spicy achar.", img: "/momo.jpg" },
  { id: 2, category: "popular", name: "Mixed Pizza", price: 550, desc: "Topped with chicken, salami, mushrooms and extra cheese.", img: "/pizza.jpg" },
  
  // --- MOMO ---
  { id: 3, category: "momo", name: "Veg Jhol Momo", price: 180, desc: "Served in a bowl of spicy, tangy sesame soup.", img: null },
  { id: 4, category: "momo", name: "C. Fried Momo", price: 220, desc: "Deep fried crispy momo with tomato ketchup.", img: null },
  
  // --- NOODLES ---
  { id: 5, category: "noodles", name: "Chicken Chowmein", price: 190, desc: "Stir-fried noodles with chicken and fresh veggies.", img: null },
  { id: 6, category: "noodles", name: "Egg Thukpa", price: 170, desc: "Hot noodle soup with boiled egg and greens.", img: null },
  
  // --- PIZZA (NEW ITEMS ADDED HERE) ---
  { id: 9, category: "pizza", name: "Classic Margherita", price: 350, desc: "Classic cheese pizza with rich tomato sauce and basil.", img: null },
  { id: 10, category: "pizza", name: "Chicken BBQ Pizza", price: 550, desc: "Topped with grilled chicken bits, onions, and smoky BBQ sauce.", img: null },
  { id: 11, category: "pizza", name: "Mushroom & Paneer", price: 480, desc: "Fresh mushrooms and soft paneer cubes with mozzarella cheese.", img: null },
  { id: 12, category: "pizza", name: "Spicy Salami", price: 600, desc: "Loaded with spicy salami slices, chili flakes, and extra cheese.", img: null },

  // --- DRINKS ---
  { id: 7, category: "drinks", name: "Coke (500ml)", price: 100, desc: "Chilled carbonated soft drink.", img: null },
  { id: 8, category: "drinks", name: "Mango Lassi", price: 150, desc: "Thick creamy yogurt drink with mango pulp.", img: null },
];

// === 2. STYLES ===
const styles = {
  container: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    color: "#333",
  },
  headerBanner: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
    padding: "60px 20px 40px 20px",
    textAlign: "center",
    position: "relative"
  },
  overlay: { 
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)", zIndex: 1
  },
  headerContent: { position: "relative", zIndex: 2 }, 

  restName: { margin: "0 0 10px 0", fontSize: "2.5em" },
  restMeta: { display: "flex", justifyContent: "center", gap: "20px", fontSize: "0.95em", opacity: 0.9 },
  mainContent: {
    maxWidth: "1100px",
    margin: "20px auto",
    display: "flex",
    gap: "30px",
    padding: "0 15px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  sidebar: {
    flex: "0 0 250px",
    background: "#fff",
    position: "sticky",
    top: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    padding: "10px 0",
    display: "block", 
  },
  sidebarTitle: {
    padding: "10px 20px",
    borderBottom: "1px solid #eee",
    margin: 0,
    color: "#29ae60",
    fontSize: "1.1em",
  },
  navItem: {
    display: "block",
    padding: "12px 20px",
    color: "#555",
    textDecoration: "none",
    fontSize: "0.95em",
    borderLeft: "3px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeNav: {
    background: "#f0fdf4",
    color: "#29ae60",
    borderLeft: "3px solid #29ae60",
    fontWeight: "600",
  },
  menuSection: {
    flex: 1,
    minWidth: "300px",
  },
  categoryTitle: {
    fontSize: "1.5em",
    color: "#333",
    margin: "0 0 15px 0",
    paddingBottom: "10px",
    borderBottom: "2px solid #e0e0e0",
  },
  itemCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: { flex: 1, paddingRight: "20px" },
  itemName: { margin: "0 0 5px 0", fontSize: "1.1em", fontWeight: "600" },
  itemDesc: { margin: "0 0 8px 0", fontSize: "0.9em", color: "#777" },
  itemPrice: { fontWeight: "bold", color: "#333" },
  addButton: {
    padding: "8px 25px",
    border: "1px solid #29ae60",
    color: "#29ae60",
    background: "transparent",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
  cartBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#29ae60",
    color: "#fff",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
    zIndex: 100,
  },
  viewCartBtn: {
    color: "#29ae60",
    background: "#fff",
    border: "none",
    padding: "8px 20px",
    fontWeight: "bold",
    borderRadius: "4px",
    cursor: "pointer",
  }
};

// === 3. COMPONENT LOGIC ===
export default function RestaurantMenu() {
  const { id } = useParams();
  
  // Find restaurant or fallback to first one
  const currentRestaurant = restaurantsList[id] || restaurantsList[0];

  const [activeCategory, setActiveCategory] = useState("popular");
  const [cart, setCart] = useState({}); 

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updateCart = (itemId, increment) => {
    setCart((prev) => {
      const currentQty = prev[itemId] || 0;
      const newQty = currentQty + increment;
      if (newQty <= 0) {
        const { [itemId]: _, ...rest } = prev; 
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((total, [itemId, qty]) => {
    const item = menuItems.find((i) => i.id === parseInt(itemId));
    return total + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div style={styles.container}>
      {/* 1. HEADER */}
      <div style={{
        ...styles.headerBanner,
        backgroundImage: `url('${currentRestaurant.img}')`
      }}>
        <div style={styles.overlay}></div> 
        
        <div style={styles.headerContent}>
            <h1 style={styles.restName}>{currentRestaurant.name}</h1>
            
            <div style={styles.restMeta}>
              <span>⭐ 4.5 (500+ ratings)</span>
              <span>•</span>
              <span>🚚 30-45 mins</span>
              <span>•</span>
              <span>Min Order: Rs. {currentRestaurant.minOrder}</span>
            </div>
            <div style={{marginTop: 20}}>
               <Link to="/" style={{color: '#fff', textDecoration: 'underline'}}>← Back to Home</Link>
            </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Menu</h3>
          {menuCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              style={{
                ...styles.navItem,
                ...(activeCategory === cat.id ? styles.activeNav : {}),
              }}
            >
              {cat.name}
            </div>
          ))}
        </aside>

        {/* MENU ITEMS */}
        <div style={styles.menuSection}>
          {menuCategories.map((cat) => (
            <div key={cat.id} id={cat.id} style={{ marginBottom: "40px" }}>
              <h2 style={styles.categoryTitle}>{cat.name}</h2>
              {menuItems
                .filter((item) => item.category === cat.id)
                .map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div key={item.id} style={styles.itemCard}>
                      <div style={styles.itemInfo}>
                        <h4 style={styles.itemName}>{item.name}</h4>
                        <p style={styles.itemDesc}>{item.desc}</p>
                        <div style={styles.itemPrice}>Rs. {item.price}</div>
                      </div>
                      
                      {qty === 0 ? (
                        <button
                          style={styles.addButton}
                          onClick={() => updateCart(item.id, 1)}
                        >
                          ADD
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                           <button 
                             onClick={() => updateCart(item.id, -1)}
                             style={{...styles.addButton, padding: '5px 12px'}}
                           >-</button>
                           <span style={{fontWeight: 'bold'}}>{qty}</span>
                           <button 
                             onClick={() => updateCart(item.id, 1)}
                             style={{...styles.addButton, padding: '5px 12px'}}
                           >+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* CART BAR */}
      {totalItems > 0 && (
        <div style={styles.cartBar}>
          <div>
            <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>{totalItems} Items</span>
            <span style={{ margin: "0 10px" }}>|</span>
            <span>Rs. {totalPrice}</span>
          </div>
          <button style={styles.viewCartBtn}>View Cart &rarr;</button>
        </div>
      )}
    </div>
  );
}