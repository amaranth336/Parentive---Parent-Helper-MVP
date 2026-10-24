export type VisitRequestApiSuccess = { ok: true };
export type VisitRequestApiError = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};
export type VisitRequestApiResponse =
  | VisitRequestApiSuccess
  | VisitRequestApiError;

export function isVerifiedVisitRequestSuccess(
  httpOk: boolean,
  body: unknown,
): body is VisitRequestApiSuccess {
  return (
    httpOk === true &&
    typeof body === "object" &&
    body !== null &&
    (body as { ok?: unknown }).ok === true
  );
}
