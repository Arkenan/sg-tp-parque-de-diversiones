# sg-tp-parque-de-diversiones
Trabajo práctico de Sistemas Gráficos, 66.71,
segundo cuatrimestre del 2015. Render de una escena con un parque de diversiones.

La entrega fue el 4 de diciembre de 2015. Los cambios posteriores corren independientemente de la materia.

### Requisitos en Desarrollo
* Browser que soporte WebGL
* NodeJS
* NPM

### Requisitos en Produccion
* Browser que soporte WebGL

### Instalación
Compilar con:
```bash
npm run build
```
Esto genera un archivo bundle.js que contiene todo el código del tp.

### Ejecución
Por criterios de permisos respecto a las direcciones locales, el firefox es el único que puede abrir el index.html y cargar correctamente las texturas.

La forma de ejecución óptima, que además soluciona este problema, es levantar un servidor local con el Parque. El script que incluimos para facilitar esto, se ejecuta en la terminal con:
```bash
npm run start
```
Una vez andando el servidor, el Parque puede verse en <http://localhost:8000>, en cualquier browser con webgl. Fue probado satisfactoriamente en Chrome.

### Créditos
#### Texturas
* Skybox: Trabajo de Emil Persson, aka Humus: <http://www.humus.name>.
* Mapa de Normales del Agua: Tutorial de DigitalRune sobre [Water Rendering](http://www.digitalrune.com/Blog/Post/1758/Water-Rendering).
