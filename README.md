# Study Pocket / Õpitasku

Independent, no-login offline study companion. Public assets contain original Estonian biology explanations/questions and original English IELTS-style tasks/audio. No private learner history, family examples, school PDFs, credentials or server database is included.

## Run / build

Node.js 22+; no package installation required.

- `npm run build` copies the reviewed `src` into `docs`, computes an immutable offline manifest and writes `release.json`.
- `npm test` verifies adaptive practice, marking, local backup/import, audio storage, privacy and offline pack behavior.
- `python3 -m http.server 8777 --bind 127.0.0.1 --directory docs` serves a local preview.

Publish only `docs` through GitHub Pages, branch main. Paths and service-worker scope work under a project subdirectory. No external runtime dependency or ChatGPT login is required.

## Data and offline limits

New study is saved automatically in this browser using a localStorage snapshot and an IndexedDB mirror. Writing drafts and answer/scheduling state are included. Optional JSON backup and previewed merge preserve stable session IDs. Speaking recordings stay in IndexedDB and can be downloaded individually from Speaking; the JSON backup does not contain audio blobs. Optional private device pairing retrieves the existing core biology/IMAT/IELTS history from the main database and automatically syncs while this app is open online. No ChatGPT sign-in is needed on the phone. Until paired, progress remains local. Source history is never embedded in public assets. Recordings do not upload.

Open online once. Download the offline listening pack and wait for readiness before disconnecting. About 0.69 MB core + 15.67 MB listening, excluding browser overhead. A small content update reuses hash-matching downloaded recordings. Browser/site-data deletion or eviction can remove local work; a separate private backup file is useful. Auth, external links and external Writing/Speaking review services are not part of offline operation. This is a companion, not an official IELTS/IMAT test or a claim of exam readiness.

The public source preserves historical module identifiers for future compatibility; those names are schema identifiers, not embedded learner records. The public-reachable sync gateway requires a private device key for every progress read/write, restricts the frontend origin, and forwards only to the fixed protected main-app endpoint. Invitations are single-use, expiring and bound on the server; server credentials never ship in this repository. Offline work retries on reopening, reconnect and foreground intervals, not while the app is closed.
