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

  const criticalResources = [
    '/ProfileImage.webp',
    // Añade más recursos críticos aquí
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = resource;
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

  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }
}

/**
 * Mejora el rendimiento del scroll
 */
export function optimizeScrollPerformance() {
  if (typeof window === 'undefined') return;

  let ticking = false;

  const updateScrollPosition = () => {
    // Aquí puedes añadir lógica de scroll optimizada
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Inicializa todas las optimizaciones de rendimiento
 */
export function initPerformanceOptimizations() {
  if (typeof window === 'undefined') return;

  // Ejecutar optimizaciones cuando el DOM esté listo
  const runOptimizations = () => {
    optimizeImageLoading();
    preloadCriticalResources();
    optimizeAnimations();
    optimizeScrollPerformance();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations, { once: true });
  } else {
    runOptimizations();
  }
}
