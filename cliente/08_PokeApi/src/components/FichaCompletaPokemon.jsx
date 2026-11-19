function FichaCompletaPokemon({ pokemon }) {
  if (!pokemon) {
    return <p>No hay datos del Pokemon para mostrar</p>
  }

  return (
    <article className="card ficha-completa">
      <h3>
        #{pokemon.id} - {pokemon.name}
      </h3>

      {pokemon.sprites && (
        <div className="sprites-list">
          {pokemon.sprites.front_default && (
            <img src={pokemon.sprites.front_default} alt={`${pokemon.name} frontal`} />
          )}
          {pokemon.sprites.back_default && (
            <img src={pokemon.sprites.back_default} alt={`${pokemon.name} espalda`} />
          )}
          {pokemon.sprites.front_shiny && (
            <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny frontal`} />
          )}
          {pokemon.sprites.back_shiny && (
            <img src={pokemon.sprites.back_shiny} alt={`${pokemon.name} shiny espalda`} />
          )}
        </div>
      )}

      <div className="seccion-datos">
        <h4>Datos generales</h4>
        <ul>
          <li><strong>ID:</strong> {pokemon.id}</li>
          <li><strong>Nombre:</strong> {pokemon.name}</li>
          <li><strong>Altura:</strong> {pokemon.height}</li>
          <li><strong>Peso:</strong> {pokemon.weight}</li>
          <li><strong>Experiencia base:</strong> {pokemon.base_experience}</li>
          <li><strong>Orden:</strong> {pokemon.order}</li>
          <li><strong>Es por defecto:</strong> {pokemon.is_default ? 'Sí' : 'No'}</li>
          {pokemon.species && (
            <li><strong>Especie:</strong> {pokemon.species.name}</li>
          )}
        </ul>
      </div>

      {pokemon.types && (
        <div className="seccion-datos">
          <h4>Tipos</h4>
          <ul>
            {pokemon.types.map((item) => (
              <li key={item.slot}>
                Slot {item.slot}: {item.type.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pokemon.abilities && (
        <div className="seccion-datos">
          <h4>Habilidades</h4>
          <ul>
            {pokemon.abilities.map((item, index) => (
              <li key={index}>
                {item.ability.name} {item.is_hidden ? '(Oculta)' : ''} - Slot {item.slot}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pokemon.stats && (
        <div className="seccion-datos">
          <h4>Estadisticas base</h4>
          <ul>
            {pokemon.stats.map((item) => (
              <li key={item.stat.name}>
                <strong>{item.stat.name}:</strong> {item.base_stat} (Esfuerzo / EV: {item.effort})
              </li>
            ))}
          </ul>
        </div>
      )}

      {pokemon.forms && (
        <div className="seccion-datos">
          <h4>Formas</h4>
          <ul>
            {pokemon.forms.map((forma) => (
              <li key={forma.name}>{forma.name}</li>
            ))}
          </ul>
        </div>
      )}

      {pokemon.held_items && (
        <div className="seccion-datos">
          <h4>Objetos equipados</h4>
          {pokemon.held_items.length > 0 ? (
            <ul>
              {pokemon.held_items.map((item) => (
                <li key={item.item.name}>{item.item.name}</li>
              ))}
            </ul>
          ) : (
            <p>Ninguno</p>
          )}
        </div>
      )}

      {pokemon.cries && (
        <div className="seccion-datos">
          <h4>Sonidos</h4>
          {pokemon.cries.latest && (
            <div>
              <audio controls src={pokemon.cries.latest}></audio>
            </div>
          )}
        </div>
      )}

      {pokemon.moves && (
        <div className="seccion-datos">
          <h4>Movimientos ({pokemon.moves.length})</h4>
          <div className="lista-etiquetas">
            {pokemon.moves.map((item) => (
              <span key={item.move.name} className="etiqueta">
                {item.move.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {pokemon.game_indices && (
        <div className="seccion-datos">
          <h4>Juegos en los que aparece ({pokemon.game_indices.length})</h4>
          <div className="lista-etiquetas">
            {pokemon.game_indices.map((item) => (
              <span key={item.version.name} className="etiqueta">
                {item.version.name} (indice: {item.game_index})
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

export default FichaCompletaPokemon
