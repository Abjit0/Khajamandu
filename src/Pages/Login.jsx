import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f9f9f9",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  card: {
    display: "flex",
    width: "900px",
    maxWidth: "90%",
    minHeight: "520px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
    overflow: "hidden",
    background: "#fff",
  },
  left: {
    flex: 1,
    background: "linear-gradient(135deg, #ff914d, #29ae60)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    color: "#fff",
    textAlign: "center",
  },
  logo: {
    width: 100,
    marginBottom: 20,
    borderRadius: '50%',
  },
  pizza: {
    width: "90%",
    maxWidth: 250,
    borderRadius: 12,
    marginTop: 20,
  },
  right: {
    flex: 1.2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px 50px",
    background: "#fff",
  },
  heading: {
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 24,
    textAlign: "center",
    color: "#29ae60",
  },
  form: {
    width: "100%",
  },
  label: {
    fontWeight: 600,
    color: "#5b5b5b",
    fontSize: 13,
    marginTop: 16,
    marginBottom: 5,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    border: "1px solid #e1e1e1",
    borderRadius: 4,
    marginBottom: 10,
    boxSizing: "border-box",
    color: "#222",
    background: "#fafbfc",
  },
  loginBtn: {
    width: "100%",
    background: "#29ae60",
    color: "#fff",
    padding: 14,
    border: "none",
    borderRadius: 4,
    margin: "20px 0 12px 0",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.3s",
  },
  loginBtnHover: {
    background: "#228b4b",
  },
  remember: {
    display: "flex",
    alignItems: "center",
    margin: "12px 0",
    fontSize: 14,
    color: "#4f4f4f",
  },
  rememberCheck: {
    marginRight: 8,
  },
  or: {
    color: "#888",
    textAlign: "center",
    margin: "20px 0 15px",
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  socialRow: {
    display: "flex",
    gap: 15,
    justifyContent: "center",
    marginBottom: 25,
  },
  fb: {
    background: "#ff914d",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 0",
    width: 130,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  google: {
    background: "#29ae60",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 0",
    width: 130,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  note: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
    color: "#4a4a4a",
  },
  signup: {
    color: "#29ae60",
    marginLeft: 5,
    textDecoration: "none",
    fontWeight: 600,
  },
  forgot: {
    color: "#ff914d",
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    cursor: "pointer",
    textDecoration: 'none',
  },
};

// 1. Accept onLogin prop
function Login({ onLogin }) {
  const navigate = useNavigate(); // 2. Init hook
  const [isHovered, setIsHovered] = useState(false);

  // 3. Handle Submit logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(); // Update global state
    navigate("/"); // Redirect to Home
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Left Side */}
        <div style={styles.left}>
         
          <img
            src="logo.JPG"
            alt="Khajamandu Logo"
            style={styles.logo}
          />
          <h2>Welcome Back!</h2>
          <p>Your favorite food is just a click away.</p>
          
          
        </div>

        {/* Right Side */}
        <div style={styles.right}>
          <h1 style={styles.heading}>Login to KhajaMandu</h1>

          {/* 4. Attach handleSubmit */}
          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input style={styles.input} type="email" placeholder="you@yourname.com" required />

            <label style={styles.label}>ENTER PASSWORD</label>
            <input style={styles.input} type="password" placeholder="********" required />

            <div style={styles.remember}>
              <input type="checkbox" style={styles.rememberCheck} />
              <label>Remember Me</label>
            </div>

            <button 
              type="submit" 
              style={isHovered ? {...styles.loginBtn, ...styles.loginBtnHover} : styles.loginBtn}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Login
            </button>

            <div style={styles.or}>OR LOGIN USING</div>

            <div style={styles.socialRow}>
              <button type="button" style={styles.fb}>Facebook</button>
              <button type="button" style={styles.google}>Google</button>
            </div>

            <div style={styles.note}>
              Don't have an account?
              <Link to="/signup" style={styles.signup}>Signup</Link>
            </div>

            <div style={styles.forgot}>Forgot Password?</div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;