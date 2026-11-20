import "../styles/login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "../mocks/users.json";
import logo from "../assets/logo.png";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("mockUsers")) || usersData.users;
    } catch {
      return usersData.users;
    }
  };

  const completeLogin = (userObj) => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userObj));
    if (onLogin) onLogin();
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const allUsers = getStoredUsers();
    const cleanEmail = email.trim();

    if (!cleanEmail || !password.trim()) {
      setError("Por favor, introduce tu correo electrónico y contraseña.");
      return;
    }

    if (isSignup) {
      if (!fullName.trim()) {
        setError("Por favor, introduce tu nombre completo.");
        return;
      }

      const existingUser = allUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail.toLowerCase()
      );
      if (existingUser) {
        setError("Este correo electrónico ya está registrado.");
        return;
      }

      const newUser = {
        image: "https://randomuser.me/api/portraits/lego/1.jpg",
        fullName: fullName.trim(),
        username: cleanEmail.split("@")[0],
        email: cleanEmail,
        password
      };

      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
      completeLogin(newUser);
    } else {
      const user = allUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanEmail.toLowerCase() &&
          u.password === password
      );

      if (user) {
        completeLogin(user);
      } else {
        setError("Correo electrónico o contraseña incorrectos.");
      }
    }
  };

  const handleDemoLogin = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError("");
    completeLogin(demoUser);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand-header">
          <img src={logo} alt="Logo de Pokémon" className="login-logo" />
          <span className="login-badge">POKÉDEX NACIONAL</span>
          <h2>{isSignup ? "Crear Cuenta de Entrenador" : "Bienvenido de nuevo, Entrenador"}</h2>
          <p className="login-subtitle">
            {isSignup
              ? "Registrate como entrenador para crear tu equipo y guardar a tus Pokémon favoritos."
              : "Inicia sesión para descubrir los 1025 Pokémon de las 9 regiones y gestiona tu equipo."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {isSignup && (
            <div className="login-field">
              <label htmlFor="login-fullname">Nombre completo</label>
              <input
                id="login-fullname"
                type="text"
                placeholder="Nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-submit-btn">
            {isSignup ? "Registrarse" : "Iniciar sesión"}
          </button>

          <p
            className="toggle-signup"
            role="button"
            tabIndex={0}
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsSignup(!isSignup);
                setError("");
              }
            }}
          >
            {isSignup
              ? "¿Ya tienes una cuenta? Inicia sesión"
              : "¿No tienes una cuenta? Regístrate"}
          </p>
        </form>

        <div className="login-demo-section">
          <div className="demo-divider">
            <span>Acceso Rápido</span>
          </div>
          <div className="demo-trainers-grid">
            {usersData.users.slice(0, 2).map((demoUser) => (
              <button
                key={demoUser.email}
                type="button"
                className="demo-trainer-btn"
                onClick={() => handleDemoLogin(demoUser)}
              >
                <img
                  src={demoUser.image}
                  alt={demoUser.fullName}
                  className="demo-trainer-avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/favicon.svg";
                  }}
                />
                <div className="demo-trainer-info">
                  <span className="demo-trainer-name">{demoUser.fullName}</span>
                  <span className="demo-trainer-email">{demoUser.email}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
