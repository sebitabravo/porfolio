
# Guía de Commits — Convención para el Proyecto

Este proyecto utiliza la convención [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para estructurar los mensajes de commit.

El objetivo es que el historial de cambios sea:

✅ Claro y fácil de leer
✅ Consistente
✅ Automatizable (para changelogs y versiones)
✅ Comprensible para cualquier persona que contribuya

---

## 📐 Estructura del Commit

```
<type>(<scope>): <short description>
```

### Componentes:

- `<type>` → tipo de cambio (obligatorio)
- `<scope>` → área del código afectada (opcional pero recomendado)
- `<short description>` → descripción breve del cambio (obligatorio)

Ejemplo:

```
feat(api): agregar endpoint de autenticación
```

---

## 🗂️ Tipos de Commit

| Tipo    | Uso |
|---------|-----|
| `feat`  | Añadir nueva funcionalidad |
| `fix`   | Corregir un error o bug |
| `docs`  | Cambios en la documentación |
| `style` | Cambios de formato (espacios, comas, indentación), sin afectar el comportamiento del código |
| `refactor` | Refactorización de código que no corrige errores ni agrega funcionalidades |
| `perf`  | Mejoras de rendimiento |
| `test`  | Añadir o actualizar tests |
| `chore` | Tareas de mantenimiento, configuración, cambios menores que no afectan el código de producción |
| `ci`    | Cambios en configuración de CI/CD o infraestructura (Vercel, GitHub Actions, etc.) |

---

## ✏️ Ejemplos de Commits

```
feat(api): agregar endpoint de autenticación
fix(vercel): corregir configuración para producción
chore(config): actualizar dependencias
docs(readme): actualizar documentación del proyecto
refactor(utils): simplificar lógica de validación de URL
perf(shortener): mejorar tiempo de respuesta del acortador de links
ci(vercel): configurar adapter de Vercel
```

---

## 📋 Reglas

- ✅ Usa el inglés para los commits (opcional, pero recomendado por compatibilidad con herramientas)
- ✅ Usa `:` después del tipo y del scope
- ✅ No uses mayúscula en la primera palabra de la descripción (`feat: agregar funcionalidad`, NO `feat: Agregar funcionalidad`)
- ✅ El commit debe ser claro y específico
- ✅ Evita commits genéricos como `update`, `fix bug`, `change`, etc. → sé descriptivo
- ✅ El scope es opcional, pero recomendado cuando quieras dar más contexto (por ejemplo: `feat(auth)`, `fix(blog)`, `ci(vercel)`)

---

## 🚀 Commits para Releases

Cuando se hace un release importante (nueva versión del proyecto), se utiliza:

```
feat: release vX.X.X
```

Ejemplo:

```
feat: release v1.0.0
```

👉 Este commit indica que se publicó una nueva versión oficial.

---

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Semver — Semantic Versioning](https://semver.org/)
