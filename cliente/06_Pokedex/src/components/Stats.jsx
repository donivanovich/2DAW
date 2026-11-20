import "../styles/stats.css";

import { typeColors } from "../constants/typeColours.js";
import { typeColorsDark } from "../constants/typeColoursDark.js";
import { translateAbility } from "../constants/types.js";

const STAT_LABELS = {
  hp: "PS",
  attack: "ATAQUE",
  defense: "DEFENSA",
  special_attack: "AT. ESP.",
  special_defense: "DEF. ESP.",
  speed: "VELOCIDAD"
};

function Stats({ detail, pokemon }) {
  const backgroundColor = typeColors[pokemon.types[0]] || "#8E97A0";
  const backgroundColorDark = typeColorsDark[pokemon.types[0]] || "#555";

  return (
    <section className="stats-section">
      <header className="stats-header">
        <div>
          <h2>Estadísticas Base</h2>
          <p className="stats-subtitle">
            Atributos base de combate
          </p>
        </div>
        <div
          className="stats-total-badge"
          style={{
            backgroundColor: backgroundColorDark,
            color: "#ffffff"
          }}
        >
          <span className="total-badge-label">TOTAL</span>
          <strong className="total-badge-value">{detail.stats.total}</strong>
        </div>
      </header>

      <div className="stats-info">
        {Object.entries(detail.stats).map(([key, value]) =>
          key !== "total" ? (
            <div key={key} className="stat-row">
              <div className="stat-container">
                <span className="stat-name">
                  {STAT_LABELS[key] || key.replace("_", " ").toUpperCase()}
                </span>
                <span className="stat-value">{value}</span>
              </div>
              <div className="stat-bar-background">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${Math.min(100, (value / 255) * 100)}%`,
                    backgroundColor: backgroundColorDark
                  }}
                />
              </div>
              <span className="stat-max-cap">255</span>
            </div>
          ) : null
        )}

        <div className="stat-row total">
          <span className="stat-name">TOTAL</span>
          <span className="stat-value">{detail.stats.total}</span>
        </div>
      </div>

      <footer className="stats-footer">
        <h3 className="abilities-heading">Habilidades</h3>
        <div className="abilities">
          {detail.abilities.map((ability, idx) => (
            <div
              key={ability}
              className="ability"
              style={{
                borderColor: backgroundColor,
                backgroundColor: `color-mix(in srgb, ${backgroundColor} 16%, #ffffff)`
              }}
            >
              <span
                className="ability-slot-tag"
                style={{ backgroundColor: backgroundColorDark }}
              >
                {idx === 0 ? "Principal" : "Secundaria"}
              </span>
              <span className="ability-name">{translateAbility(ability)}</span>
            </div>
          ))}
        </div>
      </footer>
    </section>
  );
}

export default Stats;
