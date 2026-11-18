const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// Contador para generar ids nuevos: empieza en el id más alto existente + 1
let siguienteId = productos.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1

// Función auxiliar: indica si un campo viene vacío o no fue enviado
const campoVacio = (valor) => valor === undefined || valor === null || valor === ''

// Función auxiliar: valida que lleguen nombre, descripcion y precio,
// y que el precio sea un número mayor que cero (reto opcional).
// Devuelve un mensaje de error, o null si todo está correcto.
const validarProducto = (datos) => {
    const { nombre, descripcion, precio } = datos || {}

    if (campoVacio(nombre) || campoVacio(descripcion) || campoVacio(precio)) {
        return 'Los campos nombre, descripcion y precio son obligatorios'
    }

    const precioNumerico = parseFloat(precio)
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
        return 'El precio debe ser un número mayor que cero'
    }

    return null
}

// POST /productos - Crear nuevo producto
app.post('/productos', (req, res) => {
    // 1. Validar los datos recibidos en el cuerpo de la petición
    const error = validarProducto(req.body)
    if (error) {
        return res.status(400).json({ mensaje: error })
    }

    const { nombre, descripcion, precio } = req.body

    // 2. Generar un id único usando el contador (nunca se repite,
    //    ni siquiera el id de un producto que ya fue eliminado)
    const nuevoId = siguienteId
    siguienteId++

    // 3. Crear el producto convirtiendo el precio a número
    const nuevoProducto = {
        id: nuevoId,
        nombre,
        descripcion,
        precio: parseFloat(precio)
    }

    // 4. Agregarlo al arreglo y responder con 201 (Created)
    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})


// PUT /productos/:id - Actualizar producto
app.put('/productos/:id', (req, res) => {
    // 1. Obtener el id y buscar la posición del producto
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // 2. Si no existe, responder 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // 3. Validar los datos recibidos
    const error = validarProducto(req.body)
    if (error) {
        return res.status(400).json({ mensaje: error })
    }

    const { nombre, descripcion, precio } = req.body

    // 4. Reemplazar los datos conservando el mismo id
    const productoActualizado = {
        id,
        nombre,
        descripcion,
        precio: parseFloat(precio)
    }
    productos[indice] = productoActualizado

    // 5. Responder con 200 y el producto actualizado
    res.status(200).json(productoActualizado)
})


// DELETE /productos/:id - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    // 1. Obtener el id y buscar la posición del producto
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // 2. Si no existe, responder 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // 3. Eliminar del arreglo con splice (devuelve un arreglo con lo eliminado)
    const [productoEliminado] = productos.splice(indice, 1)

    // 4. Responder con mensaje de confirmación y los datos eliminados
    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})


// Manejo de errores: si el cuerpo trae un JSON mal escrito,
// responder en JSON con código 400 en lugar de una página de error
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' })
    }
    res.status(500).json({ mensaje: 'Error interno del servidor' })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
