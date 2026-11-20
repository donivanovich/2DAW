import "../styles/physical.css";

import { typeColors } from "../constants/typeColours.js";
import { typeColorsDark } from "../constants/typeColoursDark.js";
import { translateHabitat } from "../constants/types.js";

function Physical({ detail, pokemon }) {
  const backgroundColor = typeColors[pokemon.types[0]] || "#8E97A0";
  const backgroundColorDark = typeColorsDark[pokemon.types[0]] || "#555";

  const heightMeters = detail.physical.height_m;
  const heightCm = Math.round(heightMeters * 100);

  const weightKg = detail.physical.weight_kg;
  const weightLbs = (weightKg * 2.20462).toFixed(1);

  const maleRatio = Number(detail.gender_ratio.male) || 0;
  const femaleRatio = Number(detail.gender_ratio.female) || 0;

  return (
    <section className="physical-section">
      <header className="physical-header">
        <div>
          <h2>Físico</h2>
          <p className="physical-subtitle">
            Medidas, hábitat natural y género
          </p>
        </div>
      </header>

      <div className="physical-info">
        <div className="physical-metrics-grid">
          <div className="physical-row">
            <span className="physical-name">Altura:</span>
            <div className="physical-value-group">
              <span className="physical-value">{heightMeters}m</span>
              <span className="physical-subvalue">({heightCm}cm)</span>
            </div>
          </div>

          <div className="physical-row">
            <span className="physical-name">Peso:</span>
            <div className="physical-value-group">
              <span className="physical-value">{weightKg}kg</span>
              <span className="physical-subvalue">({weightLbs}lb)</span>
            </div>
          </div>

          <div
            className="physical-row habitat-card"
            style={{
              borderColor: backgroundColor,
              backgroundColor: `color-mix(in srgb, ${backgroundColor} 15%, #ffffff)`
            }}
          >
            <span className="physical-name">Hábitat:</span>
            <span
              className="physical-value habitat-badge"
              style={{ backgroundColor: backgroundColorDark }}
            >
              {translateHabitat(detail.physical.habitat)}
            </span>
          </div>
        </div>

        <div className="gender-distribution-card">
          <div className="gender-header">
            <span className="gender-title">Proporción de Género</span>
            <div className="gender-bar" aria-hidden="true">
              <div
                className="gender-bar-male"
                style={{ width: `${maleRatio}%` }}
              />
              <div
                className="gender-bar-female"
                style={{ width: `${femaleRatio}%` }}
              />
            </div>
          </div>

          <div className="gender-rows">
            <div className="physical-row gender-item male">
              <span className="physical-name">♂ Macho:</span>
              <span className="physical-value">{detail.gender_ratio.male} %</span>
            </div>

            <div className="physical-row gender-item female">
              <span className="physical-name">♀ Hembra:</span>
              <span className="physical-value">{detail.gender_ratio.female} %</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Physical;
