function Menu() {
  return (
    <header className="menu">
      <div className="menu-container">
        <span className="menu-logo">PokeApi React</span>
        <nav>
          <ul className="menu-list">
            <li><a href="#fichas-resumidas">Fichas Resumidas</a></li>
            <li><a href="#ficha-completa">Ficha Completa</a></li>
            <li><a href="#fichas-movimientos">Movimientos</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Menu
