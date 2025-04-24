/// <reference lib="webworker" />
/// <reference lib="es2015" />
/// <reference no-default-lib="true"/>
/// <reference path="../src/types/service-worker.d.ts" />

declare const self: ServiceWorkerGlobalScope;

interface SyncEvent extends ExtendableEvent {
  readonly tag: string;
}

interface PushEvent extends ExtendableEvent {
  readonly data: PushMessageData | null;
}

interface NotificationEvent extends ExtendableEvent {
  readonly action: string;
  readonly notification: Notification;
}

interface ServiceWorkerGlobalScopeEventMap {
  sync: SyncEvent;
  push: PushEvent;
  notificationclick: NotificationEvent;
}

declare global {
  interface ServiceWorkerGlobalScope {
    addEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
      type: K,
      listener: (this: ServiceWorkerGlobalScope, ev: ServiceWorkerGlobalScopeEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
  }
}

const CACHE_NAME = 'civic-prototype-v1';
const OFFLINE_URL = '/offline.html';

// Resources to pre-cache
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/styles.css',
  '/index.html',
];

// API routes to cache
const API_ROUTES = [
  '/api/representatives',
  '/api/candidates',
  '/api/ballot-measures',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Pre-cache offline page and essential resources
      await cache.addAll(PRECACHE_URLS);
    })()
  );
  // Force waiting service worker to become active
  void self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      // Take control of all clients
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(handleApiRequest(event));
    return;
  }

  // Handle static assets
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event));
    return;
  }

  // Default fetch strategy
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});

async function handleApiRequest(event: FetchEvent): Promise<Response> {
  const { request } = event;

  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // If offline, try to return cached response
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cached response, return offline error
    return new Response(
      JSON.stringify({
        error: 'You are offline',
        code: 'OFFLINE',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleNavigationRequest(event: FetchEvent): Promise<Response> {
  try {
    // Try network first for navigation requests
    return await fetch(event.request);
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    
    return (
      cachedResponse ??
      (await cache.match(OFFLINE_URL)) ??
      new Response('You are offline', { status: 503 })
    );
  }
}

// Handle background sync for failed requests
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-priorities') {
    event.waitUntil(syncPriorities());
  }
});

// Handle push notifications
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  const data = event.data.json();
  const options: NotificationOptions = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.url,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(
      self.clients.openWindow(event.notification.data)
    );
  }
});

async function syncPriorities(): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  const priorityRequests = requests.filter(request => 
    request.url.includes('/api/priorities')
  );

  await Promise.all(
    priorityRequests.map(async (request) => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Failed to sync:', error);
      }
    })
  );
}
