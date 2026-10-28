# atlasascension
 DnD Skill Trees for Homebrew Campaign

## Dati

Il sito è statico (GitHub Pages) e usa Firebase Realtime Database (piano gratuito, non va in pausa) tramite
`dist/pcs/localclient.js`. `dist/utils/db.json` contiene i dati iniziali (da importare nel database) e
`dist/utils/firebase-rules.json` le regole di sicurezza. Le parole segrete sono salvate come hash SHA-256.
