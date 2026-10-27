# Vendored browser libraries

| Library | Version | Upstream | License |
|---|---|---|---|
| Vue | 3 (existing pinned file) | https://github.com/vuejs/core | MIT; existing license |
| qrcode-generator | 2.0.4 | https://github.com/kazuhikoarase/qrcode-generator | MIT; QRCODE-LICENSE.txt |
| pdf-lib | 1.17.1 | https://github.com/Hopding/pdf-lib | MIT; PDF-LIB-LICENSE.md |
| @pdf-lib/fontkit | 1.1.1 | https://github.com/Hopding/fontkit | MIT; FONTKIT-LICENSE.txt and upstream README |

The three export libraries were fetched from the official npm registry as pinned tarballs and checked against registry integrity metadata. They are served locally without a runtime CDN. Fontkit's npm tarball omits a standalone license file; its upstream README declares MIT, and the distributed license notice retains that attribution.

PDF Chinese font: `assets/fonts/beline-document.ttf`, a renamed static derivative of Source Han Sans CN under SIL OFL. See the adjacent font license. Full-font embedding is used because the tested font subset output lost visible glyphs in the PDF renderer. PDF export loads the font on demand. Demo QR payloads start with BELINE-DEMO and cannot open actual locks.
