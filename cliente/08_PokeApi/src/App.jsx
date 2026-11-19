import { useState, useEffect } from 'react'
import Menu from './components/Menu'
import Footer from './components/Footer'
import FichaResumidaPokemon from './components/FichaResumidaPokemon'
import FichaCompletaPokemon from './components/FichaCompletaPokemon'
import FichaMovimiento from './components/FichaMovimiento'
import './App.css'

function App() {
  const [listaPokemon, setListaPokemon] = useState([])
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null)
  const [listaMovimientos, setListaMovimientos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const idsPokemon = [1, 4, 7, 25]
        const promesasPokemon = idsPokemon.map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
        )
        const datosPokemon = await Promise.all(promesasPokemon)
        setListaPokemon(datosPokemon)
        setPokemonSeleccionado(datosPokemon[0])

        const idsMovimientos = [85, 53, 56]
        const promesasMovimientos = idsMovimientos.map((id) =>
          fetch(`https://pokeapi.co/api/v2/move/${id}`).then((res) => res.json())
        )
        const datosMovimientos = await Promise.all(promesasMovimientos)
        setListaMovimientos(datosMovimientos)
      } catch (error) {
        console.error('Error al obtener datos de PokeAPI:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  return (
    <div className="app-layout">
      <Menu />

      <main className="main-content">
        <h1>Pokédex con PokeApi</h1>

        {cargando ? (
          <p>Cargando datos desde PokeApi...</p>
        ) : (
          <>
            <section id="fichas-resumidas" className="seccion">
              <h2>Fichas Resumidas de Pokemon</h2>
              <p className="subtitulo-seccion">
                Haz clic en una ficha para ver su ficha completa debajo
              </p>
              <div className="grid-tarjetas">
                {listaPokemon.map((pokemon) => (
                  <FichaResumidaPokemon
                    key={pokemon.id}
                    pokemon={pokemon}
                    onSelect={setPokemonSeleccionado}
                  />
                ))}
              </div>
            </section>

            <section id="ficha-completa" className="seccion">
              <h2>Ficha Completa de Pokemon</h2>
              <FichaCompletaPokemon pokemon={pokemonSeleccionado} />
            </section>

            <section id="fichas-movimientos" className="seccion">
              <h2>Fichas de Movimientos</h2>
              <div className="grid-tarjetas">
                {listaMovimientos.map((movimiento) => (
                  <FichaMovimiento
                    key={movimiento.id}
                    movimiento={movimiento}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
