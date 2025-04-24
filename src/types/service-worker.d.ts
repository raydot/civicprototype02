/// <reference lib="webworker" />
/// <reference lib="es2015" />

declare module 'service-worker' {
  interface ExtendableEvent extends Event {
    waitUntil(fn: Promise<any>): void;
  }

  interface FetchEvent extends ExtendableEvent {
    request: Request;
    respondWith(response: Promise<Response> | Response): void;
  }

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

  interface WorkerGlobalScopeEventMap {
    install: ExtendableEvent;
    activate: ExtendableEvent;
    fetch: FetchEvent;
    sync: SyncEvent;
    push: PushEvent;
    notificationclick: NotificationEvent;
  }

  interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
    __WB_MANIFEST: Array<{
      revision: string | null;
      url: string;
    }>;
    skipWaiting(): Promise<void>;
    clients: Clients;
    registration: ServiceWorkerRegistration;
    addEventListener<K extends keyof WorkerGlobalScopeEventMap>(
      type: K,
      listener: (this: ServiceWorkerGlobalScope, ev: WorkerGlobalScopeEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
  }
}

declare const self: ServiceWorkerGlobalScope;
