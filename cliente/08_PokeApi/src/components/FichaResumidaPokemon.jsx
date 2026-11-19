function FichaResumidaPokemon({ pokemon, id, nombre, tipos, onSelect }) {
  if (!pokemon && !nombre) {
    return null
  }

  const numero = pokemon ? pokemon.id : id
  const nombrePokemon = pokemon ? pokemon.name : nombre
  const listaTipos = pokemon && pokemon.types
    ? pokemon.types.map((item) => item.type.name)
    : (Array.isArray(tipos) ? tipos : [tipos].filter(Boolean))

  return (
    <article
      className="card ficha-resumida"
      onClick={onSelect ? () => onSelect(pokemon) : undefined}
      style={onSelect ? { cursor: 'pointer' } : undefined}
    >
      <p className="pokemon-id"><strong>Numero (ID):</strong> #{numero}</p>
      <h3 className="pokemon-nombre">{nombrePokemon}</h3>
      <div className="pokemon-tipos">
        <strong>Tipo(s):</strong>{' '}
        {listaTipos.map((tipo, index) => (
          <span key={index} className="badge-tipo">
            {tipo}
          </span>
        ))}
      </div>
    </article>
  )
}

export default FichaResumidaPokemon
