---
title: "Implementando seguridad web completa: De principiante a configuración sólida"
description: "Mi experiencia configurando seguridad web desde cero: desde la compra del dominio hasta implementar Cloudflare, SSL/TLS y medidas anti-DDoS en producción."
publishDate: "2025-06-08"
author: "Sebastián Bravo"
tags: ["seguridad", "cloudflare", "vercel", "ssl", "ddos", "dns", "dominio"]
draft: false
---

# Implementando seguridad web completa: De principiante a configuración sólida

En este artículo comparto cómo un simple despliegue en Vercel evolucionó hacia una implementación robusta de seguridad web: protección anti-DDoS, SSL/TLS y configuraciones avanzadas de seguridad gestionadas a través de Cloudflare.

## 🎯 El objetivo: Seguridad sin comprometer la experiencia

Después de crear mi portafolio, tenía dos objetivos claros:

1. **Proteger mi sitio web** contra ataques DDoS y vulnerabilidades comunes.
2. **Configurar mi dominio personal** ([sebita.dev](https://sebita.dev)) de forma profesional.

Lo que parecía una tarea simple para alguien con experiencia, se convirtió en una valiosa lección de seguridad web que quiero compartir contigo.

## 📚 La base del conocimiento: Aprendiendo de los expertos

### Descubriendo el mundo de la seguridad web

Para comenzar, encontré un recurso invaluable: el video de **Midudev** titulado [**"Curso Cloudflare DESDE CERO: Evita ataques DDoS, HTTPS, Optimización y más"**](https://youtu.be/I2mv4456l74?si=A6YTCmvu_yfVSXFv).

Como principiante en temas de seguridad web, inicialmente me enfoqué en los primeros 45 minutos donde explicaba conceptos fundamentales:

#### Conceptos clave que aprendí:

1. **¿Qué son los ataques DDoS y DoS?**
   - **DoS (Denial of Service)**: Un solo atacante sobrecarga el servidor.
   - **DDoS (Distributed Denial of Service)**: Múltiples atacantes coordinados.

2. **¿Por qué ocurren estos ataques?**
   - Motivaciones maliciosas.
   - Competencia desleal.
   - Pruebas de penetración no autorizadas.

3. **¿Cómo se ejecutan?**
   - Scripts automatizados.
   - Botnets distribuidas.
   - Herramientas como `curl` o bibliotecas de Python.

4. **Configuración básica de protección en Vercel.**

## 🛡️ Implementando las primeras capas de seguridad

### 1. Attack Challenge Mode: La primera línea de defensa

Una de las estrategias más efectivas que aprendí fue el **Attack Challenge Mode** del firewall de Cloudflare:

![Configuración del Attack Challenge Mode](/blog/seguridad/enable-attack-challenge-mode.webp)

#### ¿Cómo funciona?
- Cada visitante debe completar un *challenge* de verificación humana.
- Bloquea efectivamente bots maliciosos.
- **Trade-off**: Ligero incremento en tiempo de carga (~2-3 segundos adicionales).

### 2. Reglas de firewall avanzadas

El segundo nivel de protección involucra **reglas personalizadas** para bloquear User-Agents específicos:

#### Configuración de reglas anti-bot:
- Bloqueo de herramientas comunes: `curl`, `wget`, `python-requests`.
- Detección de patrones de scripts automatizados.
- Lista blanca para bots legítimos (Google, Bing, etc.).

**Limitación importante**: Los atacantes pueden falsificar User-Agents fácilmente, pero esta medida añade una capa básica de protección.

![Nueva ruta configurada en Vercel](/blog/seguridad/vercel-new-route.webp)

## 🌐 Configuración del dominio: De novato a profesional

### El desafío inicial

Hasta este punto tenía conocimientos básicos de seguridad, pero me faltaba lo más crucial: **configurar el dominio correctamente**. Para personas con experiencia, esto son "3 clics y listo", pero para mí —en mi primera experiencia con un sitio en producción— representaba un territorio completamente nuevo.

### Ampliando el conocimiento

Busqué recursos adicionales y encontré el video de **MoureDev**: [**"Tutorial CLOUDFLARE: Protege tu WEB contra ATAQUES en minutos y gratis"**](https://youtu.be/ue375N4JXXs?si=9hxeQ_X_PHsIulhb).

Este tutorial complementó perfectamente el de Midudev, cubriendo:

- **Experiencias reales** con ataques DDoS.
- **Casos de estudio** de sitios web comprometidos.
- **Configuraciones paso a paso** para principiantes.
- **Mejores prácticas** de la industria.

## 💰 Adquisición del dominio: Eligiendo la plataforma correcta

### ¿Por qué Porkbun?

Después de investigar varias opciones, elegí **Porkbun** por:

1. **Precios competitivos**: Significativamente más barato que competidores.
2. **Interfaz intuitiva**: Perfecta para principiantes.
3. **Transparencia**: Sin tarifas ocultas de renovación.
4. **Soporte técnico**: Documentación clara y apoyo responsivo.

### La inversión

Compré el dominio `sebita.dev` por **$32 USD por 3 años** (~$10.67/año), una excelente inversión por:

- Extensión `.dev` moderna y profesional.
- Protección de privacidad WHOIS incluida.
- SSL gratuito incluido.
- Transferencias ilimitadas.

## ⚙️ Configuración en Vercel: Conectando dominio y aplicación

### Proceso paso a paso

El proceso de conexión del dominio con Vercel fue más directo de lo esperado:

1. **Acceso al dashboard**: Navegué a mi proyecto en Vercel.
2. **Configuración de dominios**: `Settings → Domains`.
3. **Añadir dominio personalizado**: Introduje `sebita.dev`.

![Configuración de dominio en Vercel](/blog/seguridad/vercel-domain-config.webp)

### Configuración de subdominios

Siguiendo las mejores prácticas, configuré tanto el dominio raíz como el subdominio `www`:

#### Configuración recomendada:
- ✅ `sebita.dev` (dominio principal).
- ✅ `www.sebita.dev` (redirección automática).

Esta configuración asegura que los usuarios puedan acceder al sitio independientemente de si escriben `www` o no.

## 🌍 Configuración de DNS y Cloudflare: La capa de seguridad definitiva

### DNS en Porkbun

Inicialmente configuré los registros DNS directamente en Porkbun usando los valores proporcionados por Vercel.

### Implementando Cloudflare

Ambos expertos coincidían en la importancia de usar **Cloudflare** como capa frontal. Las razones son contundentes:

- **Protección anti-DDoS avanzada**.
- **CDN global**.
- **Ahorro económico** en caso de recibir un ataque.
- **Herramientas de monitoreo y configuración avanzadas**.

#### Proceso de configuración

- Creé una cuenta en Cloudflare (gratuita).
- Agregué mi dominio `sebita.dev`.
- Ejecuté el **escaneo rápido** automático.
- Verifiqué y actualicé los **Nameservers** en Porkbun a los de Cloudflare.

## 🔒 Configuraciones avanzadas de seguridad

### SSL/TLS: Cifrado de extremo a extremo

Configuré el nivel de cifrado SSL/TLS en **"Full (Strict)"**, asegurando que la comunicación sea segura entre el navegador del usuario y el servidor.

### Reglas de mitigación DDoS

Implementé reglas de limitación de tasa y protección contra bots en Cloudflare, añadiendo capas adicionales de defensa ante posibles ataques.

## 💡 Lecciones aprendidas y mejores prácticas

### Reflexión final

Esta experiencia me enseñó una lección importante: **la seguridad es un proceso continuo**. Aunque aún no soy experto en ciberseguridad, he logrado implementar prácticas sólidas que me permiten proteger mi sitio como lo haría un profesional del sector.

Tener múltiples capas de seguridad, monitorear constantemente y estar preparado para mejorar la configuración es clave para mantener un sitio web seguro.

---

*¿Tienes preguntas sobre implementación de seguridad web? te recomiendo ver los videos de donde saque toda la informacion [**"Mouredev"**](https://youtu.be/ue375N4JXXs?si=9hxeQ_X_PHsIulhb), [**"Midudev"**](https://youtu.be/I2mv4456l74?si=A6YTCmvu_yfVSXFv)*
