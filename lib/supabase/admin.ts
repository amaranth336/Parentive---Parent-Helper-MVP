/**
 * Server-only Supabase service-role client.
 *
 * Import this from API routes, submit, and other server modules only.
 * Never import from client components, createBrowserClient, or lib/supabase/index.ts.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * createClient always constructs a Realtime socket, which requires a
 * WebSocket implementation. Netlify's Node runtime has no global WebSocket,
 * so construction throws before any PostgREST write. Service-role callers
 * only use REST, and this stub is never connected.
 */
class RestOnlyWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readonly CONNECTING = RestOnlyWebSocket.CONNECTING;
  readonly OPEN = RestOnlyWebSocket.OPEN;
  readonly CLOSING = RestOnlyWebSocket.CLOSING;
  readonly CLOSED = RestOnlyWebSocket.CLOSED;
  readonly readyState = RestOnlyWebSocket.CLOSED;
  readonly url: string;
  readonly protocol = "";
  onopen: ((this: RestOnlyWebSocket, ev: Event) => void) | null = null;
  onmessage: ((this: RestOnlyWebSocket, ev: MessageEvent) => void) | null =
    null;
  onclose: ((this: RestOnlyWebSocket, ev: CloseEvent) => void) | null = null;
  onerror: ((this: RestOnlyWebSocket, ev: Event) => void) | null = null;

  constructor(address: string | URL) {
    this.url = String(address);
  }

  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
}

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  try {
    return createClient<Database>(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        transport: RestOnlyWebSocket,
      },
    });
  } catch (error) {
    console.error(
      "service role client failed",
      error instanceof Error ? error.message : "unknown",
    );
    return null;
  }
}
