# Boxful Challenge - Frontend Dashboard

Aplicación web moderna desarrollada con **Next.js 14**, **TypeScript** y **Ant Design**. Permite la gestión integral de envíos, creación de órdenes con múltiples paquetes y visualización de historial con reportes.

## Tecnologías
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Component Library:** Ant Design (Pixel Perfect implementation)
- **HTTP Client:** Axios
- **Formatting:** Date-fns

---

## Configuración e Instalación

### 1. Requisitos Previos
- Node.js (v18 o superior)
- Backend API corriendo (se espera que esté en el puerto 3000)

### 2. Instalación
```bash
# Entrar al directorio del frontend
cd frontend

# Instalar dependencias
npm install
3. Ejecutar el Proyecto
Para evitar conflictos con el Backend (que utiliza el puerto 3000 por defecto), este proyecto está configurado para iniciarse en el puerto 3001.

Bash
npm run dev
Abra su navegador en: http://localhost:3001

Nota: La aplicación está preconfigurada para buscar el Backend en http://localhost:3000. Si su API corre en otro puerto, ajuste la configuración en src/lib/axios.ts.

Estructura del Proyecto
La arquitectura sigue los principios de Modularidad y Separación de Responsabilidades:

src/app: Rutas de la aplicación (Next.js App Router).

src/components: Componentes reutilizables (Layouts, Modales, Tablas).

src/utils: Constantes, formateadores y funciones auxiliares.

src/lib: Configuración de clientes externos (Axios).

Esfuerzos Extras y Mejoras
Además de los requerimientos visuales y funcionales básicos, se implementaron las siguientes mejoras técnicas:

Arquitectura Modular y Clean Code
Refactorización de componentes complejos (como el formulario de "Crear Orden") para evitar archivos monolíticos. Se separó la lógica de negocio, la data estática (utils/consts.ts) y los componentes visuales (SuccessModal), mejorando la mantenibilidad y legibilidad del código.

Exportación de Datos (CSV)
Implementación de la funcionalidad opcional de descarga de CSV. Genera un reporte detallado de las órdenes visibles en pantalla, formateando fechas y montos monetarios correctamente para su uso en hojas de cálculo.

Filtros de Búsqueda (Server-Side)
Integración real con el Backend para el filtrado de órdenes por rango de fechas. No es un filtro solo visual, sino que realiza peticiones optimizadas a la base de datos para manejar grandes volúmenes de información.

Validación Robusta de Tipos
Implementación de una capa de sanitización en los formularios. Se asegura la conversión estricta de tipos (Strings a Numbers) antes de enviar los payloads al servidor, previniendo errores 400 Bad Request y mejorando la experiencia de usuario.