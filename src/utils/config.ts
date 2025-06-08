export const CONFIG = {
  // Configuración de autenticación
  // El hash de la contraseña admin se obtiene de la variable de entorno ADMIN_PASSWORD_HASH
  // Para cambiar la contraseña:
  // 1. Ve a https://passwordsgenerator.net/sha256-hash-generator/
  // 2. Ingresa tu nueva contraseña
  // 3. Copia el hash SHA256 generado
  // 4. Configura la variable de entorno ADMIN_PASSWORD_HASH con el hash
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,

  // Configuraciones de rate limiting (opcionales en variables de entorno)
  MAX_REQUESTS_PER_MINUTE: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '100'),
  MAX_CREATION_ATTEMPTS: parseInt(process.env.MAX_CREATION_ATTEMPTS || '5'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '300000'), // 5 minutos

  // Rutas reservadas que no se pueden usar como paths personalizados
  RESERVED_PATHS: [
    'api',
    'admin',
    'admin-panel',
    'acortador',
    'blog',
    'componentes',
    'r',
    '_astro',
    '_next',
    'favicon.svg',
    'public',
    'src',
    'data',
    'assets',
    'static',
    'media',
    'uploads',
    'auth',
    'login',
    'logout',
    'register',
    'signup',
    'profile',
    'user',
    'users',
    'settings',
    'config',
    'dashboard',
    'terms',
    'privacy',
    'robots.txt',
    'sitemap.xml',
    '.git',
    '.env',
    'node_modules',
    'package.json',
    '.well-known',
    'vercel.json',
    'shortcut',
    'index',
    '404'
  ],

  // Configuración de limpieza automática
  CLEANUP_DAYS: parseInt(process.env.CLEANUP_DAYS || '30'), // Días después de los cuales se eliminan links sin clicks

  // Configuración de dominio base (opcional)
  BASE_DOMAIN: process.env.BASE_DOMAIN || '',

  // URLs de empresas (opcional)
  INACAP_URL: process.env.INACAP_URL || 'https://www.inacap.cl/',
  TELSUR_URL: process.env.TELSUR_URL || 'https://www.telsur.cl/',

  // GitHub repository (opcional)
  GITHUB_REPO_URL: process.env.GITHUB_REPO_URL || 'https://github.com/sebitabravo/porfolio',

  // Configuración de validación
  MIN_CUSTOM_PATH_LENGTH: 2,
  MAX_CUSTOM_PATH_LENGTH: 50,
  CUSTOM_PATH_REGEX: /^[a-zA-Z0-9-_]+$/, // Solo letras, números, guiones y guiones bajos
};

// Instrucciones para configurar la contraseña de administrador:
//
// MÉTODO 1: Variable de entorno (RECOMENDADO para producción)
// 1. Decide tu nueva contraseña (ej: "miSuperPassword123")
// 2. Ve a: https://passwordsgenerator.net/sha256-hash-generator/
// 3. Ingresa tu contraseña en el campo de texto
// 4. Copia el hash SHA256 generado
// 5. Configura la variable de entorno:
//    - En Vercel: Dashboard > Project > Settings > Environment Variables
//    - Localmente: crea archivo .env con: ADMIN_PASSWORD_HASH=tu_hash_aqui
//
// MÉTODO 2: Desarrollo local (.env.local)
// 1. Crea un archivo .env.local en la raíz del proyecto
// 2. Agrega: ADMIN_PASSWORD_HASH=tu_hash_sha256_aqui
// 3. El archivo .env.local ya está en .gitignore por seguridad

export default CONFIG;
