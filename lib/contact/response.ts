export type ContactApiSuccess = { ok: true };
export type ContactApiError = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};
export type ContactApiResponse = ContactApiSuccess | ContactApiError;

export function isVerifiedContactSuccess(
  httpOk: boolean,
  body: unknown,
): body is ContactApiSuccess {
  return (
    httpOk === true &&
    typeof body === "object" &&
    body !== null &&
    (body as { ok?: unknown }).ok === true
  );
}
