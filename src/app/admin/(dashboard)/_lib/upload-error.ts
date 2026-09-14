/**
 * Turn a thrown upload failure into something an editor can act on.
 *
 * The upload forms expect their server action to *return* `{ ok, error }`. But
 * an action can be refused before it ever runs - most often when the request
 * body is over the limit, which Next answers with a 413 - and that arrives as a
 * thrown rejection instead. With no catch, the submit handler stops at the
 * throw: the busy flag is never cleared, no toast appears, and the dialog just
 * sits there with a disabled button. That is exactly how this failed in
 * practice, and nothing on screen said why.
 *
 * Client-safe on purpose. The other helpers in this folder reach for the
 * database and the session, which a form component cannot import.
 */
export function uploadFailureMessage(error: unknown) {
  const text = error instanceof Error ? error.message : String(error);

  if (/body|413|payload|too large|exceeded/i.test(text)) {
    return "That file is too large to upload. Filings are limited to 25 MB and images to 8 MB.";
  }

  return "The upload did not go through. Check your connection and try again.";
}
