declare module "std/http/server.ts" {
  export interface ServeInit {
    port?: number;
    hostname?: string;
    handler: (request: Request) => Response | Promise<Response>;
  }

  export function serve(handler: (request: Request) => Response | Promise<Response>, init?: ServeInit): void;
}

declare module "xhr" {
  global {
    interface Window {
      XMLHttpRequest: typeof XMLHttpRequest;
    }
  }
}
