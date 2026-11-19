function FichaMovimiento({ movimiento }) {
  if (!movimiento) {
    return <p>No hay datos del movimiento</p>
  }

  let descripcion = 'Sin descripcion disponible'
  if (movimiento.flavor_text_entries && movimiento.flavor_text_entries.length > 0) {
    const entradaEs = movimiento.flavor_text_entries.find(
      (entry) => entry.language.name === 'es'
    )
    const entradaEn = movimiento.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    )
    if (entradaEs) {
      descripcion = entradaEs.flavor_text
    } else if (entradaEn) {
      descripcion = entradaEn.flavor_text
    } else {
      descripcion = movimiento.flavor_text_entries[0].flavor_text
    }
  } else if (movimiento.effect_entries && movimiento.effect_entries.length > 0) {
    descripcion = movimiento.effect_entries[0].short_effect || movimiento.effect_entries[0].effect
  }

  const nombre = movimiento.name || movimiento.nombre
  const tipo = movimiento.type ? movimiento.type.name : movimiento.tipo
  const potencia = movimiento.power !== undefined ? movimiento.power : movimiento.potencia
  const precision = movimiento.accuracy !== undefined ? movimiento.accuracy : movimiento.precision
  const pp = movimiento.pp
  const categoria = movimiento.damage_class ? movimiento.damage_class.name : movimiento.categoria
  const textoDescripcion = movimiento.descripcion || descripcion

  return (
    <article className="card ficha-movimiento">
      <h3>Movimiento: {nombre}</h3>
      <ul>
        <li><strong>Nombre:</strong> {nombre}</li>
        <li><strong>Tipo:</strong> {tipo}</li>
        <li><strong>Potencia:</strong> {potencia ?? 'N/A'}</li>
        <li><strong>Precision:</strong> {precision ?? 'N/A'}</li>
        <li><strong>PP:</strong> {pp ?? 'N/A'}</li>
        <li><strong>Categoria:</strong> {categoria}</li>
        <li><strong>Descripcion:</strong> {textoDescripcion}</li>
      </ul>
    </article>
  )
}

export default FichaMovimiento
