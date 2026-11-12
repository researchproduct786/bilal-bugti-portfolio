# Third-party notices

Everything below is open source and used within its licence. No paid service, API key or proprietary asset is required to build or run this site.

| Component | Used for | Licence |
| --- | --- | --- |
| Next.js, React | Application framework | MIT |
| three.js | Real-time 3D studio and process journey | MIT |
| GSAP | Scroll-linked animation | GreenSock Standard "no charge" licence |
| meshoptimizer (decoder shipped with three.js) | Decoding the compressed avatar mesh | MIT |
| glTF-Transform CLI (build-time only) | Compressing `public/avatar/head.glb` | MIT |
| ICT-FaceKit neutral face mesh (USC Institute for Creative Technologies) | Base topology the avatar head is fitted from (build-time only; the fitted result is shipped, not the kit) | MIT |
| MediaPipe Face Mesh (Google) | Facial landmarks used to fit the head (build-time only) | Apache-2.0 |
| OpenCV, NumPy (build-time only) | Image processing in `tools/avatar` | Apache-2.0 / BSD-3-Clause |
| Archivo (variable) | Sans-serif typeface | SIL OFL 1.1 |
| Instrument Serif | Serif italic typeface | SIL OFL 1.1 |
| IBM Plex Mono | Monospace typeface | SIL OFL 1.1 |
| Noto Sans Arabic (variable) | Arabic typeface | SIL OFL 1.1 |
| @sparticuz/chromium, puppeteer-core (tests only) | Headless browser tests | MIT / Apache-2.0 |

## The avatar

`public/avatar/head.glb` is a derived 3D model: a generic head mesh fitted to facial landmarks detected in one photograph
supplied by Bilal Bugti, who authorised its use as the identity reference for this site. The photograph itself is not in
this repository and is not served by the site. The colour texture inside the model is a projection of that photograph.
