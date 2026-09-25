import { ReadableStream } from "node:stream/web";
import {
  HelpersBodyTooLargeError,
  readHelpersBodyWithLimit,
  rebuildRequestWithBody,
} from "./request-body";

function requestFromBytes(
  bytes: Uint8Array,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://127.0.0.1/api/helpers", {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
      ...headers,
    },
    body: bytes,
    duplex: "half",
  } as RequestInit);
}

function requestFromStream(
  chunks: Uint8Array[],
  headers: Record<string, string> = {},
): Request {
  let index = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(chunks[index]!);
      index += 1;
    },
  });

  return new Request("http://127.0.0.1/api/helpers", {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
      ...headers,
    },
    body: stream,
    duplex: "half",
  } as RequestInit);
}

describe("readHelpersBodyWithLimit", () => {
  it("reads an empty body when Content-Length is absent", async () => {
    const request = new Request("http://127.0.0.1/api/helpers", {
      method: "POST",
    });
    const body = await readHelpersBodyWithLimit(request, 100);
    expect(body.byteLength).toBe(0);
  });

  it("accepts a body at the exact cap", async () => {
    const bytes = new Uint8Array(16).fill(7);
    const body = await readHelpersBodyWithLimit(requestFromBytes(bytes), 16);
    expect(body.byteLength).toBe(16);
    expect(Array.from(body)).toEqual(Array.from(bytes));
  });

  it("rejects when the stream exceeds the cap even if Content-Length is understated", async () => {
    const chunks = [new Uint8Array(8).fill(1), new Uint8Array(8).fill(2)];
    const request = requestFromStream(chunks, {
      "content-length": "4",
    });

    await expect(readHelpersBodyWithLimit(request, 10)).rejects.toBeInstanceOf(
      HelpersBodyTooLargeError,
    );
  });

  it("rejects an oversized body", async () => {
    const bytes = new Uint8Array(32).fill(3);
    await expect(
      readHelpersBodyWithLimit(requestFromBytes(bytes), 16),
    ).rejects.toBeInstanceOf(HelpersBodyTooLargeError);
  });

  it("rebuilds a Request that formData can parse", async () => {
    const form = new FormData();
    form.set("firstName", "Alex");
    form.set(
      "document",
      new File([new Uint8Array([1, 2, 3])], "experience.pdf", {
        type: "application/pdf",
      }),
    );

    const original = new Request("http://127.0.0.1/api/helpers", {
      method: "POST",
      body: form,
    });

    const capped = await readHelpersBodyWithLimit(original, 1024 * 1024);
    const rebuilt = rebuildRequestWithBody(original, capped);
    const parsed = await rebuilt.formData();
    expect(parsed.get("firstName")).toBe("Alex");
    const file = parsed.get("document");
    expect(file).toBeInstanceOf(File);
  });
});
