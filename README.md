# Práctica 6 - API REST de productos

## Cómo ejecutar

```bash
npm install
npm start
```

El servidor corre en http://localhost:3000

## Endpoints

| Método | Ruta              | Estado        |
|--------|-------------------|---------------|
| GET    | /productos        | Implementado  |
| GET    | /productos/:id    | Implementado  |
| POST   | /productos        | Implementado  |
| PUT    | /productos/:id    | Implementado  |
| DELETE | /productos/:id    | Implementado  |

## Ejemplos

- `POST /productos` con `{ "nombre", "descripcion", "precio" }` → 201 y el producto creado (400 si falta un campo o el precio no es mayor que cero).
- `PUT /productos/:id` → 200 con el producto actualizado (404 si no existe, 400 si faltan campos).
- `DELETE /productos/:id` → 200 con `{ "mensaje": "Producto eliminado", "producto": {...} }` (404 si no existe).

Todas las respuestas son JSON. Los datos se guardan en memoria y se reinician al reiniciar el servidor.
