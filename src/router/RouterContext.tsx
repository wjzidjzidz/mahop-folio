import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

function normalizeRoutePath(path: string): string {
  if (!path) return '/';
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizeRoutePath(window.location.pathname || '/');
    }
    return '/';
  });

  const navigationActionRef = useRef<'push' | 'pop' | 'init'>('init');

  useEffect(() => {
    const handlePopState = () => {
      navigationActionRef.current = 'pop';
      setCurrentPath(normalizeRoutePath(window.location.pathname || '/'));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Run scroll reset, body overflow cleanup, and ScrollTrigger sync AFTER React commits the new route DOM
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    document.body.style.overflow = '';

    if (navigationActionRef.current === 'push') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    navigationActionRef.current = 'init';

    window.dispatchEvent(
      new CustomEvent('mahop:route-change', { detail: currentPath })
    );

    const raf1 = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
      window.dispatchEvent(
        new CustomEvent('mahop:route-change', { detail: currentPath })
      );
    });
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh(true);
      window.dispatchEvent(
        new CustomEvent('mahop:route-change', { detail: currentPath })
      );
    }, 220);

    return () => {
      window.cancelAnimationFrame(raf1);
      window.clearTimeout(timer);
    };
  }, [currentPath]);

  const navigate = (to: string) => {
    document.body.style.overflow = '';
    const cleanTo = normalizeRoutePath(to);
    const cleanCurrent = normalizeRoutePath(currentPath);

    if (cleanTo === cleanCurrent) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigationActionRef.current = 'push';
    window.history.pushState({}, '', cleanTo);
    setCurrentPath(cleanTo);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export function Link({
  href,
  children,
  className = '',
  activeClassName = '',
  onClick,
  ...props
}: LinkProps) {
  const { currentPath, navigate } = useRouter();
  const isActive = normalizeRoutePath(currentPath) === normalizeRoutePath(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (
      e.defaultPrevented ||
      props.target === '_blank' ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('#')
    ) {
      return;
    }

    e.preventDefault();
    navigate(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
