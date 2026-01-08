# Financieel Ecosysteem

Een interactieve webapp die het "Financieel Ecosysteem" model visualiseert.

Gebouwd met:

- React (Vite)
- React Router
- Tailwind CSS
- Supabase (voor het opslaan van aanmeldingen)

## Vereisten

- Node.js (bij voorkeur 18+)
- npm

## Installeren

```bash
npm install
```

## Development server

```bash
npm run dev
```

Vite start standaard op `http://localhost:5173`.

## Build

```bash
npm run build
```

## Preview (na build)

```bash
npm run preview
```

## Supabase

Deze app gebruikt `@supabase/supabase-js`.

- Configuratie staat in `src/supabaseClient.js`.
- De pitch/aanmeld-form schrijft naar de tabel `zzp_signups`.

Zorg dat de tabel bestaat en dat je (RLS) policies inserts toestaan voor jouw gebruikssituatie.
