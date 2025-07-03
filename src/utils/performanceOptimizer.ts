// Performance optimization utilities

/**
 * Optimiza imágenes para lazy loading
 */
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;

  // Intersection Observer para lazy loading mejorado
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;

        // Preload the image
        const imageLoader = new Image();
        imageLoader.onload = () => {
          img.src = img.dataset.src || img.src;
          img.classList.remove('preload-hidden');
          img.classList.add('preload-visible');
        };
        imageLoader.src = img.dataset.src || img.src;

        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before entering viewport
    threshold: 0.1
  });

  // Observe all lazy images
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Optimiza el manejo de eventos con debouncing
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Preload recursos críticos
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
  ];

  fontPreloads.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = font;
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/ProfileImage.webp'
  ];

  criticalImages.forEach(image => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = image;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // DNS prefetch for external domains
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://vercel.live',
    'https://vitals.vercel-insights.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

/**
 * Optimiza animaciones para mejor rendimiento
 */
export function optimizeAnimations() {
  if (typeof window === 'undefined') return;

  // Respeta la preferencia de reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleMotionPreference = () => {
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
      // Deshabilitar transformaciones complejas
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  handleMotionPreference();
  prefersReducedMotion.addEventListener('change', handleMotionPreference);

  // Optimizar animaciones para GPU
  const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="transition-"]');
  animatedElements.forEach(el => {
    (el as HTMLElement).style.willChange = 'transform, opacity';
  });
}

/**
 * Mejora el rendimiento del scroll
 */
export function optimizeScrollPerformance() {
  if (typeof window === 'undefined') return;

  let ticking = false;

  const updateScrollPosition = () => {
    // Optimizar elementos visibles durante scroll
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  };

  // Usar passive listeners para mejor performance
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Optimiza el LCP (Largest Contentful Paint)
 */
export function optimizeLCP() {
  if (typeof window === 'undefined') return;

  // Preload la imagen hero
  const heroImage = document.querySelector('img[priority="high"], [fetchpriority="high"]');
  if (heroImage) {
    const img = heroImage as HTMLImageElement;
    img.loading = 'eager';
    img.fetchPriority = 'high';
  }

  // Optimizar fuentes críticas
  document.head.insertAdjacentHTML('afterbegin', `
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  `);
}

/**
 * Optimiza el CLS (Cumulative Layout Shift)
 */
export function optimizeCLS() {
  if (typeof window === 'undefined') return;

  // Aplicar dimensiones a imágenes sin dimensiones explícitas
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach((img) => {
    const element = img as HTMLImageElement;
    element.style.aspectRatio = '16 / 9'; // Ratio por defecto
    element.style.maxWidth = '100%';
    element.style.height = 'auto';
  });

  // Reservar espacio para contenido dinámico
  const dynamicContainers = document.querySelectorAll('[data-dynamic]');
  dynamicContainers.forEach((container) => {
    const element = container as HTMLElement;
    if (!element.style.minHeight) {
      element.style.minHeight = '200px';
    }
  });
}

/**
 * Optimiza el FID (First Input Delay)
 */
export function optimizeFID() {
  if (typeof window === 'undefined') return;

  // Diferir scripts no críticos
  const nonCriticalScripts = document.querySelectorAll('script:not([async]):not([defer])');
  nonCriticalScripts.forEach((script) => {
    if (!script.hasAttribute('data-critical')) {
      script.setAttribute('defer', '');
    }
  });

  // Optimizar event listeners
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      // Prevenir doble click
      (e.target as HTMLElement).style.pointerEvents = 'none';
      setTimeout(() => {
        (e.target as HTMLElement).style.pointerEvents = 'auto';
      }, 300);
    }, { passive: true });
  });
}

/**
 * Optimiza el tiempo de carga de recursos críticos
 */
export function optimizeCriticalPath() {
  if (typeof window === 'undefined') return;

  // Inline critical CSS
  const criticalCSS = `
    body { font-family: system-ui, -apple-system, sans-serif; }
    .preload-hidden { opacity: 0; }
    .preload-visible { opacity: 1; transition: opacity 0.3s ease-in-out; }
    .reduce-motion * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Inicializa todas las optimizaciones de rendimiento
 */
export function initPerformanceOptimizations() {
  if (typeof window === 'undefined') return;

  // Ejecutar optimizaciones críticas inmediatamente
  optimizeCriticalPath();
  optimizeLCP();
  optimizeCLS();

  // Ejecutar optimizaciones cuando el DOM esté listo
  const runOptimizations = () => {
    optimizeImageLoading();
    preloadCriticalResources();
    optimizeAnimations();
    optimizeScrollPerformance();
    optimizeFID();

    // Limpiar recursos después de la carga inicial
    setTimeout(() => {
      const criticalPreloads = document.querySelectorAll('link[rel="preload"]');
      criticalPreloads.forEach(link => {
        if (link.getAttribute('data-cleanup') !== 'false') {
          link.remove();
        }
      });
    }, 3000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations, { once: true });
  } else {
    runOptimizations();
  }

  // Optimizar para visibilidad de página
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      optimizeImageLoading();
    }
  });
}
