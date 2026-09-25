export type HelpersApiSuccess = { ok: true };
export type HelpersApiError = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};
export type HelpersApiResponse = HelpersApiSuccess | HelpersApiError;

export function isVerifiedHelpersSuccess(
  httpOk: boolean,
  body: unknown,
): body is HelpersApiSuccess {
  return (
    httpOk === true &&
    typeof body === "object" &&
    body !== null &&
    (body as { ok?: unknown }).ok === true
  );
}
