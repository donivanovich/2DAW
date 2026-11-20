import "../styles/evolutions.css";

import { Link } from "react-router-dom";
import { useMemo } from "react";

import { typeColors } from "../constants/typeColours.js";
import { typeColorsDark } from "../constants/typeColoursDark.js";
import { translateType } from "../constants/types.js";
import jsonPokemon from "../mocks/pokemon.json";
import jsonDetails from "../mocks/details.json";

const parentEvolutionMap = new Map();
const detailByIdMap = new Map();
const pokemonByIdMap = new Map();

jsonPokemon.forEach((p) => {
  pokemonByIdMap.set(p.id, p);
});

jsonDetails.details.forEach((d) => {
  detailByIdMap.set(d.id, d);
  d.evolutions?.forEach((e) => {
    parentEvolutionMap.set(e.to, d);
  });
});

function findBasePokemon(currentDetail) {
  let base = currentDetail;
  const visited = new Set();

  while (parentEvolutionMap.has(base.id) && !visited.has(base.id)) {
    visited.add(base.id);
    base = parentEvolutionMap.get(base.id);
  }

  return base;
}

function getAllEvolutions(currentDetail, stage = 2) {
  if (!currentDetail.evolutions || currentDetail.evolutions.length === 0) {
    return [];
  }

  return currentDetail.evolutions.flatMap((evo) => {
    const nextPokemon = pokemonByIdMap.get(evo.to);
    const nextDetail = detailByIdMap.get(evo.to);

    if (!nextPokemon || !nextDetail) return [];

    return [
      { pokemon: nextPokemon, level: evo.level, stage },
      ...getAllEvolutions(nextDetail, stage + 1)
    ];
  });
}

function Evolutions({ detail, pokemon }) {
  const backgroundColor = typeColors[pokemon.types[0]] || "#8E97A0";
  const backgroundColorDark = typeColorsDark[pokemon.types[0]] || "#555";

  const evolutionsChain = useMemo(() => {
    if (!detail) return [];
    const baseDetail = findBasePokemon(detail);
    const basePokemon = pokemonByIdMap.get(baseDetail.id);
    if (!basePokemon) return [];

    return [
      {
        pokemon: basePokemon,
        level: null,
        stage: 1
      },
      ...getAllEvolutions(baseDetail, 2)
    ];
  }, [detail]);

  if (!detail) return <p>No hay datos disponibles.</p>;

  return (
    <section className="evolutions-section">
      <header className="evolutions-header">
        <div>
          <h2>Cadena Evolutiva</h2>
          <p className="evolutions-subtitle">
            {evolutionsChain.length > 1
              ? `Línea evolutiva de ${evolutionsChain.length} etapas, selecciona cualquier etapa para inspeccionarla`
              : `${pokemon.name} es un Pokémon de etapa única y no evoluciona`}
          </p>
        </div>
      </header>

      <div className="evolutions-container">
        {evolutionsChain.map((evo, index) => {
          const isCurrent = evo.pokemon.id === pokemon.id;
          const evoTypeColor = typeColors[evo.pokemon.types[0]] || backgroundColor;
          const evoTypeDark = typeColorsDark[evo.pokemon.types[0]] || backgroundColorDark;

          return (
            <div key={evo.pokemon.id} className="evolution-step-wrapper">
              {index > 0 && (
                <div className="evolution-connector" aria-hidden="true">
                  <span className="connector-level">
                    {evo.level ? `Nv. ${evo.level}` : "Evoluciona"}
                  </span>
                  <span className="connector-arrow">→</span>
                </div>
              )}

              <Link
                to={`/pokemon/${evo.pokemon.id}`}
                className="evolution-link"
              >
                <div
                  className={`evolution-card ${isCurrent ? "current-stage" : ""}`}
                  style={{
                    "--evo-color": evoTypeColor,
                    "--evo-dark": evoTypeDark
                  }}
                >
                  {isCurrent && (
                    <span
                      className="evolution-current-pill"
                      style={{ backgroundColor: evoTypeDark }}
                    >
                      Actual
                    </span>
                  )}

                  <div className="evolution-stage-box">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.pokemon.id}.png`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.pokemon.id}.png`;
                      }}
                      alt={evo.pokemon.name}
                      className="evolution-img"
                    />
                  </div>

                  <div className="evolution-info">
                    <p className="evolution-id">
                      #{String(evo.pokemon.id).padStart(4, "0")}
                    </p>
                    <h3>{evo.pokemon.name}</h3>

                    <div className="evolution-types">
                      {evo.pokemon.types.map((t) => (
                        <span
                          key={t}
                          className="evolution-type-tag"
                          style={{ backgroundColor: typeColorsDark[t] || "#475569" }}
                        >
                          {translateType(t)}
                        </span>
                      ))}
                    </div>

                    <div
                      className="evolution-level-badge"
                      style={{
                        backgroundColor: isCurrent ? evoTypeDark : "var(--bg-surface-muted)",
                        color: isCurrent ? "#ffffff" : "var(--text-secondary)"
                      }}
                    >
                      <p>{evo.level ? `Nivel: ${evo.level}` : "Base"}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Evolutions;
