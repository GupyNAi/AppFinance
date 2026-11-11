# Mis Finanzas (PWA, 100 % local)
## Instalar en Android
1. Aloja la carpeta en HTTPS (GitHub Pages, Netlify o Cloudflare Pages, gratis; solo se sube el código, nunca tus datos).
2. Abre la URL en Chrome para Android, espera a que cargue una vez con internet.
3. Menú ⋮ › "Instalar aplicación" / "Agregar a pantalla de inicio". Luego funciona sin conexión.
(Probar en el computador: `python3 -m http.server 8000` en esta carpeta y abrir localhost:8000.)
## Copia de seguridad
Más › Copia de seguridad › "Exportar copia (JSON)". Guarda el archivo en Drive o tu correo. Para restaurar: Más › Restaurar copia. Hazla cada semana: borrar datos de Chrome o desinstalar la app borra tus registros.
## Pruebas
`node test.js` verifica las fórmulas (saldo, distribución, prioridades, metas, edición/borrado).
