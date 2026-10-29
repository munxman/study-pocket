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

## Official IMAT taster

`imat-trial-content.js` contains twelve biology questions from the Italian Ministry's official IMAT 2025 administrative examination paper (questions 29, 28, 19, 20, 21, 32, 16, 27, 13, 18, 24, 31), https://accessoprogrammato.mur.gov.it/compiti/CompitoInglese2025.pdf. English content is preserved with PDF line wrapping/typography normalized; option order is rearranged. The explanatory feedback is original. The Ministry's official-act text is distinguished from our authored exercises (Italian Law 633/1941 Article 5); no third-party reading passages or commercial worked solutions are reproduced. The sample is not a full mock or a readiness estimate. The untouched 2026 paper is reserved for later.

Trial state is in a separate private module. `/trial-sync` uses the same device authentication as `/sync`; old clients keep the original module set. Timed results are frozen before optional untimed reconsideration; reports keep these separate and omit raw answer selections.
