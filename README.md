# sg-tp-parque-de-diversiones
Trabajo práctico de Sistemas Gráficos, 66.71,
segundo cuatrimestre del 2015. Render de una escena con un parque de diversiones.

La entrega fue el 4 de diciembre de 2015. Los cambios posteriores corren independientemente de la materia.

<h3>Requisitos en Desarrollo</h3>
<ul>
 <li>Browser que soporte WebGL</li>
 <li>NodeJS</li>
 <li>NPM</li>
</ul>

<h3>Requisitos en Produccion</h3>
<ul>
 <li>Browser que soporte WebGL</li>
</ul>

<h3>Instalación</h3>
Compilar con:
```bash
npm run build
```
Esto genera un archivo bundle.js que contiene todo el código del tp.

<h3>Ejecución</h3>
Por criterios de permisos respecto a las direcciones locales, el firefox es el único que puede abrir el index.html y cargar correctamente las texturas.

La forma de ejecución óptima, que además soluciona este problema, es levantar un servidor local con el Parque. El script que incluimos para facilitar esto, se ejecuta en la terminal con:
```bash
npm run start
```
Una vez andando el servidor, el Parque puede verse en <http://localhost:8000>, en cualquier browser con webgl. Fue probado satisfactoriamente en Chrome.

<h3>Créditos</h3>
<h4>Texturas</h4>
<ul>
 <li>Skybox: Trabajo de Emil Persson, aka Humus: <http://www.humus.name>.</li>
</ul>
