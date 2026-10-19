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

function readEnv(name: string): string {
  let value = process.env[name]?.trim() ?? "";
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value.replace(/[\u200B-\u200D\uFEFF]/g, "");
}

function normalizeSupabaseUrl(raw: string): string {
  if (/^[a-z0-9]{20}$/i.test(raw)) {
    return `https://${raw}.supabase.co`;
  }

  if (/^[a-z0-9-]+\.supabase\.co\/?$/i.test(raw)) {
    return `https://${raw.replace(/\/$/, "")}`;
  }

  return raw;
}

function safeClientError(error: unknown, url: string): string {
  const message = error instanceof Error ? error.message : "unknown";
  const shape = [
    `len=${url.length}`,
    `scheme=${/^https?:\/\//i.test(url)}`,
    `host=${url.toLowerCase().includes("supabase.co")}`,
    `space=${/\s/.test(url)}`,
  ].join(",");
  return `${message} (${shape})`
    .replace(/[\r\n]+/g, " ")
    .replace(/eyJ[A-Za-z0-9_-]{10,}/g, "[redacted]")
    .replace(/sb_[A-Za-z0-9_-]+/g, "[redacted]")
    .slice(0, 180);
}

function ensureServerWebSocket(): void {
  if (typeof globalThis.WebSocket !== "undefined") {
    return;
  }

  Object.defineProperty(globalThis, "WebSocket", {
    configurable: true,
    writable: true,
    value: RestOnlyWebSocket,
  });
}

export function createServiceRoleClient() {
  const url = normalizeSupabaseUrl(readEnv("NEXT_PUBLIC_SUPABASE_URL"));
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    return null;
  }

  try {
    ensureServerWebSocket();
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
    console.error("service role client failed", safeClientError(error, url));
    return null;
  }
}
