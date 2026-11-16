const NASA_API_KEY = 'N6FJGPCMtqQWG9DrcJftHbck7WfpmhNq6LWLKBzM';
const NASA_URL = 'https://api.nasa.gov';
const JSON_PLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com/posts';

const botonApod = document.getElementById('boton-apod');
const resultadoApod = document.getElementById('resultado-apod');

const formularioBusqueda = document.getElementById('formulario-busqueda');
const resultadoGaleria = document.getElementById('resultado-galeria');

const formularioAsteroides = document.getElementById('formulario-asteroides');
const resultadoAsteroides = document.getElementById('resultado-asteroides');

const formularioFavorito = document.getElementById('formulario-favorito');
const mensajeFavorito = document.getElementById('mensaje-favorito');

const formularioObservacion = document.getElementById('formulario-observacion');
const mensajeObservacion = document.getElementById('mensaje-observacion');

async function obtenerImagenDelDia() {
    resultadoApod.textContent = 'Cargando...';

    try {
        const respuesta = await fetch(
            `${NASA_URL}/planetary/apod?api_key=${NASA_API_KEY}`
        );

        if (!respuesta.ok) {
            throw new Error('No se pudo obtener la imagen.');
        }

        const datos = await respuesta.json();

        resultadoApod.innerHTML = '';

        const titulo = document.createElement('h3');
        titulo.textContent = datos.title;

        const fecha = document.createElement('p');
        fecha.textContent = `Fecha: ${datos.date}`;

        const explicacion = document.createElement('p');
        explicacion.textContent = datos.explanation;

        resultadoApod.append(titulo, fecha, explicacion);

        if (datos.media_type === 'image') {
            const imagen = document.createElement('img');
            imagen.src = datos.url;
            imagen.alt = datos.title;

            resultadoApod.appendChild(imagen);
        } else {
            const enlace = document.createElement('a');
            enlace.href = datos.url;
            enlace.textContent = 'Ver contenido multimedia';
            enlace.target = '_blank';
            enlace.rel = 'noopener noreferrer';

            resultadoApod.appendChild(enlace);
        }
    } catch (error) {
        resultadoApod.textContent = error.message;
    }
}

botonApod.addEventListener('click', obtenerImagenDelDia);

async function buscarImagenes(evento) {
    evento.preventDefault();

    const busqueda = document.getElementById('busqueda').value.trim();

    resultadoGaleria.textContent = 'Buscando imágenes...';

    try {
        const respuesta = await fetch(
            `https://images-api.nasa.gov/search?q=${encodeURIComponent(busqueda)}&media_type=image`
        );

        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener las imágenes.');
        }

        const datos = await respuesta.json();

        resultadoGaleria.innerHTML = '';

        const imagenes = datos.collection.items.slice(0, 9);

        if (imagenes.length === 0) {
            resultadoGaleria.textContent = 'No se encontraron imágenes.';
            return;
        }

        imagenes.forEach((elemento) => {
            const informacion = elemento.data[0];
            const urlImagen = elemento.links?.[0]?.href;

            if (!urlImagen) {
                return;
            }

            const contenedor = document.createElement('div');
            contenedor.className = 'resultado-imagen';

            const titulo = document.createElement('h3');
            titulo.textContent = informacion.title;

            const imagen = document.createElement('img');
            imagen.src = urlImagen;
            imagen.alt = informacion.title;
            imagen.loading = 'lazy';

            contenedor.append(titulo, imagen);
            resultadoGaleria.appendChild(contenedor);
        });
    } catch (error) {
        resultadoGaleria.textContent = error.message;
    }
}

formularioBusqueda.addEventListener('submit', buscarImagenes);

async function obtenerAsteroides(evento) {
    evento.preventDefault();

    const fecha = document.getElementById('fecha-asteroides').value;

    resultadoAsteroides.textContent = 'Consultando asteroides...';

    try {
        const respuesta = await fetch(
            `${NASA_URL}/neo/rest/v1/feed?start_date=${fecha}&end_date=${fecha}&api_key=${NASA_API_KEY}`
        );

        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los asteroides.');
        }

        const datos = await respuesta.json();
        const asteroides = datos.near_earth_objects[fecha];

        resultadoAsteroides.innerHTML = '';

        if (!asteroides || asteroides.length === 0) {
            resultadoAsteroides.textContent = 'No hay asteroides registrados para esta fecha.';
            return;
        }

        asteroides.forEach((asteroide) => {
            const contenedor = document.createElement('article');

            const nombre = document.createElement('h3');
            nombre.textContent = asteroide.name;

            const diametro = document.createElement('p');
            diametro.textContent =
                `Diámetro máximo: ${asteroide.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km`;

            const velocidad = document.createElement('p');
            velocidad.textContent =
                `Velocidad: ${Number(asteroide.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)} km/h`;

            const distancia = document.createElement('p');
            distancia.textContent =
                `Distancia: ${Number(asteroide.close_approach_data[0].miss_distance.kilometers).toFixed(2)} km`;

            const peligroso = document.createElement('p');
            peligroso.textContent = asteroide.is_potentially_hazardous_asteroid
                ? 'Potencialmente peligroso: Sí'
                : 'Potencialmente peligroso: No';

            contenedor.append(nombre, diametro, velocidad, distancia, peligroso);
            resultadoAsteroides.appendChild(contenedor);
        });
    } catch (error) {
        resultadoAsteroides.textContent = error.message;
    }
}

formularioAsteroides.addEventListener('submit', obtenerAsteroides);

async function enviarFavorito(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombre-favorito').value.trim();

    mensajeFavorito.textContent = 'Enviando...';

    try {
        const respuesta = await fetch(JSON_PLACEHOLDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: nombre,
                type: 'favorito'
            })
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo enviar el favorito.');
        }

        const datos = await respuesta.json();

        mensajeFavorito.textContent =
            `Favorito enviado correctamente. ID de respuesta: ${datos.id}`;

        formularioFavorito.reset();
    } catch (error) {
        mensajeFavorito.textContent = error.message;
    }
}

formularioFavorito.addEventListener('submit', enviarFavorito);

async function enviarObservacion(evento) {
    evento.preventDefault();

    const titulo = document.getElementById('titulo-observacion').value.trim();
    const descripcion = document.getElementById('descripcion-observacion').value.trim();

    mensajeObservacion.textContent = 'Enviando...';

    try {
        const respuesta = await fetch(JSON_PLACEHOLDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: titulo,
                body: descripcion,
                type: 'observacion'
            })
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo enviar la observación.');
        }

        const datos = await respuesta.json();

        mensajeObservacion.textContent =
            `Observación enviada correctamente. ID de respuesta: ${datos.id}`;

        formularioObservacion.reset();
    } catch (error) {
        mensajeObservacion.textContent = error.message;
    }
}

formularioObservacion.addEventListener('submit', enviarObservacion);

const fechaHoy = new Date().toLocaleDateString('en-CA');
document.getElementById('fecha-asteroides').value = fechaHoy;
document.getElementById('fecha-asteroides').max = fechaHoy;