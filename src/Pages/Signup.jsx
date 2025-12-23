import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

const styles = {
  container: {
    maxWidth: 550,
    margin: "40px auto",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
    padding: "32px 40px",
    fontFamily: "Segoe UI, Arial, sans-serif",
    position: "relative",
    borderTop: "6px solid #29ae60",
  },
  close: {
    position: "absolute",
    right: 28,
    top: 24,
    fontSize: 24,
    color: "#bfbfbf",
    cursor: "pointer",
    textDecoration: 'none',
  },
  heading: {
    fontSize: 28,
    fontWeight: 600,
    color: "#29ae60",
    marginBottom: 30,
    marginTop: 0,
    textAlign: 'center',
  },
  row: {
    display: "flex",
    gap: 15,
    marginBottom: 18
  },
  col: {
    flex: 1
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
    display: "block"
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #e2e2e2",
    borderRadius: 4,
    background: "#fafafb",
    boxSizing: 'border-box',
  },
  terms: {
    fontSize: 15,
    color: "#595959",
    margin: "30px 0 10px",
    textAlign: 'center',
  },
  signupBtn: {
    width: "100%",
    background: "#29ae60",
    color: "#fff",
    padding: "14px 0",
    border: "none",
    borderRadius: 4,
    fontWeight: 600,
    fontSize: 17,
    marginBottom: 22,
    cursor: "pointer",
    transition: 'background 0.3s',
  },
  signupBtnHover: {
    background: "#228b4b",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #eeeeee",
    margin: "30px 0 12px"
  },
  or: {
    textAlign: "center",
    color: "#565656",
    fontWeight: 600,
    fontSize: 13,
    marginBottom: 16
  },
  socialRow: {
    display: "flex",
    gap: 16,
    marginTop: 10,
    marginBottom: 18
  },
  fb: {
    flex: 1,
    background: "#ff914d",
    color: "#fff",
    border: "none",
    padding: "12px 0",
    borderRadius: 4,
    fontWeight: 500,
    fontSize: 15,
    cursor: "pointer"
  },
  google: {
    flex: 1,
    background: "#29ae60",
    color: "#fff",
    border: "none",
    padding: "12px 0",
    borderRadius: 4,
    fontWeight: 500,
    fontSize: 15,
    cursor: "pointer"
  },
  signIn: {
    textAlign: "center",
    marginTop: 9,
    fontSize: 15,
    color: "#4a4a4a",
  },
  signInLink: {
    color: "#29ae60",
    marginLeft: 4,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer"
  },
  termsLink: {
    color: "#29ae60",
    fontWeight: 600,
    textDecoration: "none",
  }
};

// 1. Accept onLogin prop
function Signup({ onLogin }) {
  const navigate = useNavigate(); // 2. Init hook
  const [isHovered, setIsHovered] = useState(false);

  // 3. Handle Submit Logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(); // Update global state
    navigate("/"); // Redirect to Home
  };

  return (
    <div style={{...styles.container, background: '#f9f9f9', borderTop: 'none', padding: 0}}> 
      <div style={styles.container}>
        <Link to="/" style={styles.close}>&times;</Link>
        <h2 style={styles.heading}>Signup for KhajaMandu</h2>

        {/* 4. Attach handleSubmit */}
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>FIRST NAME</label>
              <input style={styles.input} placeholder="Your Name" required />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>LAST NAME</label>
              <input style={styles.input} placeholder="Your Name" required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input style={styles.input} type="email" placeholder="you@yourname.com" required />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>MOBILE NUMBER</label>
              <input style={styles.input} type="tel" placeholder="98XXXXXXXX" />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>CHOOSE A PASSWORD</label>
              <input style={styles.input} type="password" required />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <input style={styles.input} type="password" required />
            </div>
          </div>

          <div style={styles.terms}>
            By Signing Up, I agree to KhajaMandu’s{" "}
            <Link to="/terms" style={styles.termsLink}>Terms of Use</Link> and{" "}
            <Link to="/privacy" style={styles.termsLink}>Privacy Policy</Link>.
          </div>

          <button 
            type="submit"
            style={isHovered ? {...styles.signupBtn, ...styles.signupBtnHover} : styles.signupBtn}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Sign Up
          </button>
        </form>

        <hr style={styles.divider} />

        <div style={styles.or}>OR SIGNUP USING</div>

        <div style={styles.socialRow}>
          <button style={styles.fb}>Facebook</button>
          <button style={styles.google}>Google</button>
        </div>

        <div style={styles.signIn}>
          Already have an account?
          <Link to="/login" style={styles.signInLink}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;