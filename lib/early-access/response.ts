export type EarlyAccessApiSuccess = { ok: true };
export type EarlyAccessApiError = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};
export type EarlyAccessApiResponse = EarlyAccessApiSuccess | EarlyAccessApiError;

export function isVerifiedEarlyAccessSuccess(
  httpOk: boolean,
  body: unknown,
): body is EarlyAccessApiSuccess {
  return (
    httpOk === true &&
    typeof body === "object" &&
    body !== null &&
    (body as { ok?: unknown }).ok === true
  );
}
