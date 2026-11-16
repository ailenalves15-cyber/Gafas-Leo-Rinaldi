
// ==========================================
// CONFIGURACIÓN DE COMPRA
// ==========================================

const URL_API = "https://gafas-leo-rinaldi-api.ailenalves15.workers.dev";

// ==========================================
// PRODUCTOS
// ==========================================

const imagenPrueba =
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80";

const variantesBase = [
    { nombre: "Negro", imagen: imagenPrueba },
    { nombre: "Marrón claro", imagen: imagenPrueba },
    { nombre: "Marrón oscuro", imagen: imagenPrueba },
    { nombre: "Tao", imagen: imagenPrueba },
    { nombre: "Bicolor", imagen: imagenPrueba },
    { nombre: "Albiceleste", imagen: imagenPrueba },
    { nombre: "Tango", imagen: imagenPrueba },
    { nombre: "Edición limitada", imagen: imagenPrueba }
];

const productos = [
    { id: 1, nombre: "Danubio", modelo: "Danubio", precio: 25000, descripcion: "Modelo Danubio. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] },
    { id: 2, nombre: "Brenta", modelo: "Brenta", precio: 25000, descripcion: "Modelo Brenta. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] },
    { id: 3, nombre: "Yangtse", modelo: "Yangtse", precio: 25000, descripcion: "Modelo Yangtse. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] },
    { id: 4, nombre: "Tiber", modelo: "Tiber", precio: 25000, descripcion: "Modelo Tiber. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] },
    { id: 5, nombre: "Nilo Black", modelo: "Nilo Black", precio: 25000, descripcion: "Modelo Nilo Black. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] },
    { id: 6, nombre: "Nilo Blue", modelo: "Nilo Blue", precio: 25000, descripcion: "Modelo Nilo Blue. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] },
    { id: 7, nombre: "Eufrates", modelo: "Eufrates", precio: 25000, descripcion: "Modelo Eufrates. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] },
    { id: 8, nombre: "Edo", modelo: "Edo", precio: 25000, descripcion: "Modelo Edo. Diseño artesanal pensado para destacar en cualquier ocasión.", variantes: [...variantesBase] }
];

// ==========================================
// CARRITO
// ==========================================

let carrito = [];
let varianteSeleccionada = 0;

// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(lista = productos) {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    lista.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";
        tarjeta.onclick = () => abrirProducto(producto.id);

        tarjeta.innerHTML = `
            <div class="producto-imagen">
                <img src="${producto.variantes[0].imagen}"
                     alt="${producto.nombre}"
                     onerror="imagenFallback(this)">
            </div>
            <div class="producto-info">
                <p class="producto-categoria">Gafa de sol</p>
                <h3>${producto.nombre}</h3>
                <p class="producto-precio">$${formatearPrecio(producto.precio)}</p>
                <div class="producto-botones">
                    <button class="btn-producto"
                        onclick="event.stopPropagation(); abrirProducto(${producto.id})">
                        VER MODELO
                    </button>
                    <button class="btn-producto btn-probar"
                        onclick="event.stopPropagation(); abrirProbador(${producto.id})">
                        🕶️ PROBAR
                    </button>
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}

function filtrarProductos(modelo, boton) {
    document.querySelectorAll(".filtro").forEach(btn => btn.classList.remove("activo"));
    if (boton) boton.classList.add("activo");

    mostrarProductos(
        modelo === "todos"
            ? productos
            : productos.filter(producto => producto.modelo === modelo)
    );
}

// ==========================================
// DETALLE DEL PRODUCTO
// ==========================================

function abrirProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    varianteSeleccionada = 0;

    const detalle = document.getElementById("detalle-producto");

    const variantesHTML = producto.variantes.map((variant, index) => `
        <button type="button"
            class="detalle-variante ${index === 0 ? "seleccionada" : ""}"
            onclick="seleccionarVariante(${producto.id}, ${index})"
            title="${variant.nombre}">
            <img src="${variant.imagen}" alt="${variant.nombre}"
                 onerror="imagenFallback(this)">
        </button>
    `).join("");

    detalle.innerHTML = `
        <div class="detalle-producto">
            <div class="detalle-imagen">
                <img id="imagen-detalle"
                     src="${producto.variantes[0].imagen}"
                     alt="${producto.nombre}"
                     onerror="imagenFallback(this)">
            </div>
            <div class="detalle-info">
                <p class="detalle-categoria">Gafa de sol</p>
                <h2>${producto.nombre}</h2>
                <p class="detalle-precio">$${formatearPrecio(producto.precio)}</p>
                <p class="detalle-descripcion">${producto.descripcion}</p>
                <p class="detalle-colores-titulo">ELEGÍ TU VARIANTE</p>
                <div class="detalle-colores">${variantesHTML}</div>
                <p id="variante-seleccionada" class="variante-seleccionada-texto">
                    Variante: ${producto.variantes[0].nombre}
                </p>
                <div class="detalle-botones">
                    <button class="btn btn-naranja"
                        onclick="agregarAlCarritoDesdeDetalle(${producto.id})">
                        AGREGAR AL CARRITO
                    </button>
                    <button class="btn btn-outline"
                        onclick="probarProductoDesdeDetalle(${producto.id})">
                        🕶️ PROBAR VIRTUALMENTE
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("modal-producto").classList.add("activo");
}

function seleccionarVariante(id, indice) {
    const producto = productos.find(p => p.id === id);
    if (!producto || !producto.variantes[indice]) return;

    varianteSeleccionada = indice;

    const variante = producto.variantes[indice];
    const imagen = document.getElementById("imagen-detalle");
    if (imagen) imagen.src = variante.imagen;

    const texto = document.getElementById("variante-seleccionada");
    if (texto) texto.textContent = "Variante: " + variante.nombre;

    document.querySelectorAll(".detalle-variante").forEach((boton, index) => {
        boton.classList.toggle("seleccionada", index === indice);
    });
}

function cerrarProducto() {
    document.getElementById("modal-producto").classList.remove("activo");
}

function cerrarProductoDesdeFondo(event) {
    if (event.target.id === "modal-producto") cerrarProducto();
}

function probarProductoDesdeDetalle(id) {
    cerrarProducto();
    abrirProbador(id);
}

// ==========================================
// CARRITO
// ==========================================

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const variante = producto.variantes[varianteSeleccionada];
    const clave = `${producto.id}-${variante.nombre}`;
    const existente = carrito.find(item => item.clave === clave);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            clave,
            id: producto.id,
            nombre: producto.nombre,
            modelo: producto.modelo,
            variante: variante.nombre,
            precio: producto.precio,
            imagen: variante.imagen,
            cantidad: 1
        });
    }

    actualizarCarrito();
    abrirCarrito();
}

function agregarAlCarritoDesdeDetalle(id) {
    agregarAlCarrito(id);
    cerrarProducto();
}

function actualizarCarrito() {
    const contenedor = document.getElementById("items-carrito");
    const contador = document.getElementById("contador-carrito");
    const totalElemento = document.getElementById("total-carrito");

    if (!contenedor || !contador || !totalElemento) return;

    contador.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio"><p>Tu carrito está vacío.</p></div>
        `;
        totalElemento.textContent = "$0";
        return;
    }

    contenedor.innerHTML = "";

    carrito.forEach(item => {
        const elemento = document.createElement("div");
        elemento.className = "item-carrito";

        elemento.innerHTML = `
            <div>
                <h4>${item.nombre}</h4>
                <p>Variante: ${item.variante}</p>
                <p>${item.cantidad} × $${formatearPrecio(item.precio)}</p>
            </div>
            <div>
                <strong>$${formatearPrecio(item.precio * item.cantidad)}</strong>
                <br>
                <button class="eliminar-item"
                    onclick="eliminarDelCarrito('${item.clave}')">
                    Eliminar
                </button>
            </div>
        `;

        contenedor.appendChild(elemento);
    });

    const total = carrito.reduce(
        (suma, item) => suma + item.precio * item.cantidad, 0
    );

    totalElemento.textContent = "$" + formatearPrecio(total);
}

function eliminarDelCarrito(clave) {
    carrito = carrito.filter(item => item.clave !== clave);
    actualizarCarrito();
}

function abrirCarrito() {
    document.getElementById("carrito").classList.add("abierto");
    document.getElementById("overlay").classList.add("activo");
}

function cerrarCarrito() {
    document.getElementById("carrito").classList.remove("abierto");
    document.getElementById("overlay").classList.remove("activo");
}

// ==========================================
// CHECKOUT / MERCADO PAGO
// ==========================================

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    cerrarCarrito();
    mostrarResumenCheckout();

    document.getElementById("checkout-error").textContent = "";
    document.getElementById("modal-checkout").classList.add("activo");
}

function cerrarCheckout() {
    document.getElementById("modal-checkout").classList.remove("activo");
}

function mostrarResumenCheckout() {
    const resumen = document.getElementById("checkout-resumen");

    const lineas = carrito.map(item => `
        <div class="checkout-linea">
            <span>${item.cantidad} × ${item.nombre} (${item.variante})</span>
            <strong>$${formatearPrecio(item.precio * item.cantidad)}</strong>
        </div>
    `).join("");

    const total = carrito.reduce(
        (suma, item) => suma + item.precio * item.cantidad, 0
    );

    resumen.innerHTML = `
        <h3>Tu pedido</h3>
        ${lineas}
        <div class="checkout-total">
            <span>Total de productos</span>
            <strong>$${formatearPrecio(total)}</strong>
        </div>
    `;
}

function cambiarEntrega() {
    const metodo = document.querySelector(
        'input[name="metodoEntrega"]:checked'
    )?.value;

    const campos = document.getElementById("datos-andreani");
    const esAndreani = metodo === "andreani";

    campos.hidden = !esAndreani;

    ["checkout-direccion", "checkout-cp", "checkout-localidad", "checkout-provincia"]
        .forEach(id => {
            const campo = document.getElementById(id);
            campo.required = esAndreani;
        });
}

async function enviarCompra(event) {
    event.preventDefault();

    if (carrito.length === 0) {
        mostrarErrorCheckout("Tu carrito está vacío.");
        return;
    }

    const formulario = document.getElementById("form-checkout");
    const boton = document.getElementById("btn-pagar");
    const datos = new FormData(formulario);

    const payload = {
        nombre: String(datos.get("nombre") || "").trim(),
        email: String(datos.get("email") || "").trim(),
        telefono: String(datos.get("telefono") || "").trim(),
        metodoEntrega: String(datos.get("metodoEntrega") || ""),
        direccion: String(datos.get("direccion") || "").trim(),
        codigoPostal: String(datos.get("codigoPostal") || "").trim(),
        localidad: String(datos.get("localidad") || "").trim(),
        provincia: String(datos.get("provincia") || "").trim(),
        productos: carrito.map(item => ({
            nombre: item.nombre,
            variante: item.variante,
            cantidad: item.cantidad
        }))
    };

    if (!payload.nombre || !payload.email || !payload.telefono) {
        mostrarErrorCheckout("Completá todos tus datos de contacto.");
        return;
    }

    if (
        payload.metodoEntrega === "andreani" &&
        (!payload.direccion || !payload.codigoPostal ||
         !payload.localidad || !payload.provincia)
    ) {
        mostrarErrorCheckout("Completá todos los datos de envío.");
        return;
    }

    boton.disabled = true;
    boton.textContent = "CONECTANDO CON MERCADO PAGO...";
    mostrarErrorCheckout("");

    try {
        const respuesta = await fetch(`${URL_API}/crear-pago`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {
            throw new Error(
                resultado.error || "No pudimos iniciar el pago. Intentá nuevamente."
            );
        }

        if (
            !resultado.checkoutUrl ||
            !resultado.checkoutUrl.startsWith("https://")
        ) {
            throw new Error("El enlace de pago recibido no es válido.");
        }

        // No vaciamos el carrito: el pago todavía debe verificarse.
        window.location.href = resultado.checkoutUrl;

    } catch (error) {
        console.error("Error al iniciar el pago:", error);
        mostrarErrorCheckout(
            error.message || "Ocurrió un error al conectar con Mercado Pago."
        );

        boton.disabled = false;
        boton.textContent = "CONTINUAR A MERCADO PAGO";
    }
}

function mostrarErrorCheckout(mensaje) {
    document.getElementById("checkout-error").textContent = mensaje;
}

// ==========================================
// MENSAJES DE REGRESO DE MERCADO PAGO
// ==========================================

function revisarRegresoDePago() {
    const parametros = new URLSearchParams(window.location.search);
    const estado = parametros.get("pago");

    if (!estado) return;

    const mensajes = {
        aprobado: "Mercado Pago informó que finalizaste el pago. Estamos verificando el estado de la operación. Esta pantalla todavía no es una confirmación definitiva.",
        rechazado: "El pago fue rechazado o no pudo completarse. Podés volver a intentar la compra.",
        pendiente: "Tu pago está pendiente. Esperá la confirmación antes de considerar finalizada la compra."
    };

    const mensaje = mensajes[estado];
    if (!mensaje) return;

    const elemento = document.getElementById("mensaje-pago");
    elemento.textContent = mensaje;
    elemento.hidden = false;

    // Limpiamos el parámetro visual de la URL sin modificar el estado del pedido.
    window.history.replaceState({}, document.title, window.location.pathname);
}

// ==========================================
// PROBADOR VIRTUAL
// ==========================================

let camaraActiva = null;
let detectorFacial = null;
let animacionCamara = null;
let cargandoDetector = false;
let productoProbadorId = 1;

const imagenDanubio = new Image();
imagenDanubio.src = "danubio.png";

imagenDanubio.onerror = () => {
    console.error("No se pudo cargar danubio.png.");
};

function abrirProbador(id = 1) {
    cerrarProducto();

    productoProbadorId = Number(id) || 1;
    document.getElementById("modal-probador").classList.add("activo");

    const estado = document.getElementById("estado-probador");
    if (estado && !camaraActiva) {
        estado.textContent = productoProbadorId === 1
            ? "Modelo Danubio seleccionado"
            : "Este modelo todavía no tiene una imagen propia para el probador.";
    }
}

function cerrarProbador() {
    detenerCamara();
    document.getElementById("modal-probador").classList.remove("activo");
}

async function activarCamara() {
    if (camaraActiva) return;

    const video = document.getElementById("video-probador");
    const mensaje = document.getElementById("mensaje-camara");
    const estado = document.getElementById("estado-probador");
    const botonActivar = document.getElementById("btn-activar-camara");
    const botonDetener = document.getElementById("btn-detener-camara");

    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("Tu navegador no permite acceder a la cámara.");
        }

        estado.textContent = "Solicitando acceso a la cámara...";

        camaraActiva = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        video.srcObject = camaraActiva;
        await video.play();

        mensaje.style.display = "none";
        botonActivar.style.display = "none";
        botonDetener.style.display = "inline-flex";

        estado.textContent = "Cargando detección facial...";
        await iniciarDetectorFacial();
        iniciarSeguimientoRostro();

    } catch (error) {
        console.error("Error en el probador:", error);
        detenerCamara();
        estado.textContent = error.message || "No se pudo activar la cámara.";

        alert("No pudimos iniciar el probador. Revisá los permisos de cámara y que estés usando HTTPS o localhost.");
    }
}

async function iniciarDetectorFacial() {
    if (detectorFacial) return;

    if (cargandoDetector) {
        throw new Error("El detector facial todavía se está cargando.");
    }

    cargandoDetector = true;

    try {
        const vision = await import(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm"
        );

        const archivos = await vision.FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        detectorFacial = await vision.FaceLandmarker.createFromOptions(
            archivos,
            {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numFaces: 1
            }
        );
    } catch (error) {
        console.error("Error cargando MediaPipe:", error);
        throw new Error("No se pudo cargar el detector facial. Revisá tu conexión a internet.");
    } finally {
        cargandoDetector = false;
    }
}

function iniciarSeguimientoRostro() {
    const video = document.getElementById("video-probador");
    const canvas = document.getElementById("canvas-probador");
    const estado = document.getElementById("estado-probador");
    const contexto = canvas.getContext("2d");

    function detectar() {
        if (!camaraActiva) return;

        if (video.readyState < 2) {
            animacionCamara = requestAnimationFrame(detectar);
            return;
        }

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        contexto.clearRect(0, 0, canvas.width, canvas.height);

        const resultado = detectorFacial.detectForVideo(video, performance.now());

        if (resultado.faceLandmarks?.length > 0) {
            dibujarGafas(contexto, resultado.faceLandmarks[0], canvas.width, canvas.height);
            estado.textContent = "¡Rostro detectado! Mové la cabeza para probar.";
        } else {
            estado.textContent = "Buscando tu rostro...";
        }

        animacionCamara = requestAnimationFrame(detectar);
    }

    detectar();
}

function dibujarGafas(ctx, puntos, ancho, alto) {
    const punto = indice => ({
        x: puntos[indice].x * ancho,
        y: puntos[indice].y * alto
    });

    const ojoIzquierdoExterior = punto(33);
    const ojoIzquierdoInterior = punto(133);
    const ojoDerechoInterior = punto(362);
    const ojoDerechoExterior = punto(263);

    const centroIzquierdo = {
        x: (ojoIzquierdoExterior.x + ojoIzquierdoInterior.x) / 2,
        y: (ojoIzquierdoExterior.y + ojoIzquierdoInterior.y) / 2
    };

    const centroDerecho = {
        x: (ojoDerechoInterior.x + ojoDerechoExterior.x) / 2,
        y: (ojoDerechoInterior.y + ojoDerechoExterior.y) / 2
    };

    const distancia = Math.hypot(
        centroDerecho.x - centroIzquierdo.x,
        centroDerecho.y - centroIzquierdo.y
    );

    const angulo = Math.atan2(
        centroDerecho.y - centroIzquierdo.y,
        centroDerecho.x - centroIzquierdo.x
    );

    if (productoProbadorId === 1 && imagenDanubio.complete && imagenDanubio.naturalWidth > 0) {
        ctx.save();

        const centroX = (centroIzquierdo.x + centroDerecho.x) / 2;
        const centroY = (centroIzquierdo.y + centroDerecho.y) / 2;

        ctx.translate(centroX, centroY);
        ctx.rotate(angulo);

        const anchoGafas = distancia * 3.7;
        const altoGafas = anchoGafas * (imagenDanubio.naturalHeight / imagenDanubio.naturalWidth);

        const xImagen = -anchoGafas / 2;
        const yImagen = -altoGafas / 2 - distancia * 0.04;

        ctx.drawImage(imagenDanubio, xImagen, yImagen, anchoGafas, altoGafas);

        ctx.save();
        ctx.translate(xImagen, yImagen);
        ctx.scale(
            anchoGafas / imagenDanubio.naturalWidth,
            altoGafas / imagenDanubio.naturalHeight
        );

        ctx.beginPath();
        ctx.moveTo(165, 158);
        ctx.bezierCurveTo(183, 140, 211, 132, 241, 137);
        ctx.bezierCurveTo(272, 141, 295, 154, 303, 176);
        ctx.bezierCurveTo(307, 198, 298, 235, 280, 257);
        ctx.bezierCurveTo(258, 278, 219, 282, 190, 261);
        ctx.bezierCurveTo(166, 243, 151, 190, 165, 158);
        ctx.closePath();

        ctx.save();
        ctx.clip();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "black";
        ctx.fillRect(140, 120, 180, 180);
        ctx.restore();

        ctx.save();
        ctx.clip();
        ctx.fillStyle = "rgba(105, 62, 43, 0.38)";
        ctx.fillRect(140, 120, 180, 180);
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(387, 158);
        ctx.bezierCurveTo(406, 140, 434, 132, 464, 137);
        ctx.bezierCurveTo(495, 141, 521, 154, 533, 176);
        ctx.bezierCurveTo(541, 199, 531, 237, 511, 259);
        ctx.bezierCurveTo(487, 280, 449, 283, 419, 261);
        ctx.bezierCurveTo(393, 242, 375, 190, 387, 158);
        ctx.closePath();

        ctx.save();
        ctx.clip();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "black";
        ctx.fillRect(365, 120, 185, 180);
        ctx.restore();

        ctx.save();
        ctx.clip();
        ctx.fillStyle = "rgba(105, 62, 43, 0.38)";
        ctx.fillRect(365, 120, 185, 180);
        ctx.restore();

        ctx.restore();
        ctx.restore();
        return;
    }

    dibujarGafasProvisorias(
        ctx,
        distancia,
        angulo,
        (centroIzquierdo.x + centroDerecho.x) / 2,
        (centroIzquierdo.y + centroDerecho.y) / 2
    );
}

function dibujarGafasProvisorias(ctx, distancia, angulo, centroX, centroY) {
    const anchoLente = distancia * 0.58;
    const altoLente = anchoLente * 0.68;
    const grosor = Math.max(4, distancia * 0.035);

    ctx.save();
    ctx.translate(centroX, centroY);
    ctx.rotate(angulo);

    ctx.lineWidth = grosor;
    ctx.strokeStyle = "#171717";
    ctx.fillStyle = "rgba(255, 255, 255, 0.10)";

    function dibujarLente(x) {
        ctx.beginPath();
        ctx.roundRect(
            x - anchoLente / 2,
            -altoLente / 2,
            anchoLente,
            altoLente,
            altoLente * 0.22
        );
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - anchoLente * 0.35, -altoLente * 0.42);
        ctx.lineTo(x + anchoLente * 0.35, -altoLente * 0.42);
        ctx.strokeStyle = "#ff5a00";
        ctx.lineWidth = Math.max(2, grosor * 0.45);
        ctx.stroke();
    }

    dibujarLente(-distancia / 2);
    dibujarLente(distancia / 2);

    ctx.beginPath();
    ctx.moveTo(-distancia * 0.13, 0);
    ctx.quadraticCurveTo(0, -altoLente * 0.20, distancia * 0.13, 0);
    ctx.strokeStyle = "#171717";
    ctx.lineWidth = grosor;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-distancia * 0.98, -altoLente * 0.15);
    ctx.lineTo(-distancia * 1.17, -altoLente * 0.22);
    ctx.moveTo(distancia * 0.98, -altoLente * 0.15);
    ctx.lineTo(distancia * 1.17, -altoLente * 0.22);
    ctx.stroke();

    ctx.restore();
}

function detenerCamara() {
    if (animacionCamara) {
        cancelAnimationFrame(animacionCamara);
        animacionCamara = null;
    }

    if (camaraActiva) {
        camaraActiva.getTracks().forEach(pista => pista.stop());
        camaraActiva = null;
    }

    const video = document.getElementById("video-probador");
    const canvas = document.getElementById("canvas-probador");
    const mensaje = document.getElementById("mensaje-camara");
    const estado = document.getElementById("estado-probador");
    const botonActivar = document.getElementById("btn-activar-camara");
    const botonDetener = document.getElementById("btn-detener-camara");

    if (video) video.srcObject = null;

    if (canvas) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }

    if (mensaje) mensaje.style.display = "flex";
    if (estado) estado.textContent = "Cámara desactivada";
    if (botonActivar) botonActivar.style.display = "inline-flex";
    if (botonDetener) botonDetener.style.display = "none";
}

// ==========================================
// NEWSLETTER
// ==========================================

function suscribirse(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    alert(`¡Gracias! Registramos ${email}.`);
    document.getElementById("email").value = "";
}

// ==========================================
// UTILIDADES
// ==========================================

function formatearPrecio(numero) {
    return numero.toLocaleString("es-AR");
}

function imagenFallback(imagen) {
    imagen.style.display = "none";
    imagen.parentElement.innerHTML = `
        <div class="producto-imagen-fallback">🕶️</div>
    `;
}

// ==========================================
// INICIO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    mostrarProductos();
    actualizarCarrito();
    cambiarEntrega();
    revisarRegresoDePago();
});
