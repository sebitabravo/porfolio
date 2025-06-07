---
title: "Construyendo mi portafolio con Astro y Tailwind"
description: "Proceso completo de construcción de un portafolio moderno utilizando Astro, Tailwind CSS y TypeScript."
publishDate: "2024-01-20"
author: "Sebastián Bravo"
tags: ["astro", "tailwind", "typescript", "portafolio"]
draft: false
---

# Construyendo mi portafolio con Astro y Tailwind

En este artículo quiero compartir mi experiencia construyendo este portafolio utilizando tecnologías modernas y por qué elegí este stack específico.

## ¿Por qué Astro?

**Astro** se ha convertido en mi framework favorito para sitios estáticos por estas razones:

### ✅ **Zero JavaScript por defecto**
Astro envía HTML puro al navegador, cargando JavaScript solo cuando es necesario.

### 🚀 **Rendimiento excepcional**
Los sitios generados con Astro son extremadamente rápidos y tienen excelentes métricas de Core Web Vitals.

### 🧩 **Flexibilidad de componentes**
Puedo usar componentes de React, Vue, Svelte o crear componentes nativos de Astro.

## Mi stack tecnológico

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [tailwind(), mdx()],
  output: 'static'
});
```

### **Frontend**
- **Astro** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios

### **Herramientas**
- **Vercel** - Despliegue automático
- **Git** - Control de versiones
- **VSCode** - Editor de código

## Estructura del proyecto

La organización que uso es simple pero efectiva:

```
src/
├── components/     # Componentes reutilizables
├── layouts/        # Layouts de página
├── pages/          # Rutas de la aplicación
├── styles/         # Estilos globales
└── utils/          # Funciones utilitarias
```

## Desafíos y soluciones

### **1. Sistema de design consistente**
- Creé una paleta de colores personalizada en Tailwind
- Desarrollé componentes reutilizables como `AnimatedButton`
- Implementé un sistema de dark mode robusto

### **2. Optimización para SEO**
- Meta tags dinámicos en cada página
- Sitemap automático
- Structured data para mejor indexación

### **3. Rendimiento**
- Imágenes optimizadas con formato WebP
- CSS crítico inline
- Preload de recursos importantes

## Próximos pasos

Algunas mejoras que tengo planeadas:

1. **Blog con MDX** - Para contenido más interactivo
2. **Animaciones avanzadas** - Con Framer Motion
3. **Análiticas** - Para medir el engagement

## Conclusión

Astro + Tailwind ha sido una combinación perfecta para mi portafolio. Me permite crear sitios rápidos, mantenibles y con una excelente experiencia de desarrollo.

**¿Te interesa este stack?** Te recomiendo probarlo en tu próximo proyecto personal.

---

*El código completo está disponible en mi [GitHub](https://github.com/sebitabravo/porfolio)*

# Construyendo mi portafolio con Astro y Tailwind

En este post voy a compartir el proceso completo de cómo construí mi portafolio personal usando tecnologías modernas y un enfoque centrado en el rendimiento.

## ¿Por qué elegí Astro?

Después de evaluar varias opciones, me decidí por Astro por estas razones:

### 🚀 **Rendimiento excepcional**
- Genera sitios estáticos super rápidos
- Hidratación selectiva de componentes
- Carga mínima de JavaScript en el cliente

### 🛠️ **Flexibilidad**
- Soporte para múltiples frameworks (React, Vue, Svelte)
- Arquitectura basada en islas
- Excelente DX (Developer Experience)

### 📦 **Ecosystem maduro**
- Gran comunidad y documentación
- Muchas integraciones disponibles
- Fácil deployment en Vercel/Netlify

## Configuración inicial

```bash
# Crear proyecto
npm create astro@latest portafolio

# Instalar dependencias
cd portafolio
npm install

# Agregar Tailwind
npx astro add tailwind
```

## Estructura del proyecto

```
src/
├── components/
│   ├── AnimatedButton.astro
│   ├── Badge.astro
│   ├── ThemeToggle.astro
│   └── icons/
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── blog.astro
│   └── componentes.astro
└── content/
    └── blog/
```

## Configuración de Tailwind personalizada

Una de las partes más importantes fue definir una paleta de colores consistente:

```javascript
// tailwind.config.js
import colors from 'tailwindcss/colors'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.amber,
        accent: colors.emerald,
        neutral: colors.neutral,
      },
    },
  },
}
```

## Componentes reutilizables

Creé un sistema de componentes consistente:

### AnimatedButton
```astro
---
export interface Props {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}
---
```

### ThemeToggle
Implementé un toggle de tema que:
- Respeta la preferencia del sistema
- Guarda la elección en localStorage
- Funciona correctamente en todas las páginas

## Optimizaciones implementadas

1. **Imágenes optimizadas** - Uso de WebP y lazy loading
2. **Fonts locales** - Evitar requests externos
3. **CSS crítico** - Inline de estilos importantes
4. **Minificación** - Compresión de assets

## Resultados de performance

Métricas de Lighthouse:
- ✅ **Performance**: 98/100
- ✅ **Accessibility**: 100/100
- ✅ **Best Practices**: 100/100
- ✅ **SEO**: 100/100

## Próximos pasos

Funcionalidades que quiero agregar:

- [ ] Blog con MDX
- [ ] Sección de proyectos dinámicos
- [ ] Formulario de contacto
- [ ] Analytics básico

## Conclusión

Astro + Tailwind resultó ser una combinación perfecta para mi portafolio. El resultado es un sitio rápido, mantenible y con una excelente experiencia de desarrollo.

¿Qué stack utilizas tú para tus proyectos personales? ¡Me encantaría conocer tu experiencia!

---

*El código completo está disponible en mi [GitHub](https://github.com/sebitabravo/porfolio)*
