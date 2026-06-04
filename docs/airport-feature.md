# Airport Feature — Full Trace & Modification Guide

> Trace complet de la fonctionnalité « aéroport » (lieu de récupération) dans Airsline :
> d'où viennent les données, structure DB, ce qui les modifie, et — pour chaque type de
> changement — les fichiers exacts à toucher.

---

## 1. D'où viennent les données

Les aéroports sont **seedés une seule fois** dans PostgreSQL puis **read-only** dans toute l'app.
Aucune création/modification/suppression à l'exécution — même pas dans le panel admin.

**Origine = le fichier de seed :**
`backend/prisma/seed.ts` (lignes ~14–30) — définit les 7 aéroports algériens, upsert par `code` :

```ts
const airports = [
  { name: "Aéroport Houari Boumédiène", city: "Alger",       code: "ALG" },
  { name: "Aéroport Mohamed Boudiaf",   city: "Constantine", code: "CZL" },
  { name: "Aéroport Ahmed Ben Bella",   city: "Oran",        code: "ORN" },
  { name: "Aéroport Rabah Bitat",       city: "Annaba",      code: "AAE" },
  { name: "Aéroport Abane Ramdane",     city: "Béjaïa",      code: "BJA" },
  { name: "Aéroport Bou Saada",         city: "M'Sila",      code: "BUJ" },
  { name: "Aéroport Tébessa",           city: "Tébessa",     code: "TEE" },
];
```

**Servis par un seul endpoint :** `GET /api/airports` → renvoie tous les aéroports triés par ville.
- Route : `backend/src/routes/airport.routes.ts` (`router.get('/', getAirports)`)
- Controller : `backend/src/controllers/airport.controller.ts`
  ```ts
  export async function getAirports(_req, res) {
    const airports = await prisma.airport.findMany({ orderBy: { city: 'asc' } })
    res.json(airports)
  }
  ```
- Monté dans `backend/src/index.ts` : `app.use("/api/airports", airportRoutes)`
- **Aucune auth** requise pour lire.

**Récupérés côté frontend** via une fonction API + une clé TanStack Query partagée :
- `frontend/src/api/cars.ts` →
  ```ts
  export interface Airport { id: number; name: string; city: string; code: string }
  export const airportsApi = { getAll: () => api.get<Airport[]>('/airports').then(r => r.data) }
  ```
- `useQuery({ queryKey: ['airports'], queryFn: airportsApi.getAll })` est appelé à 3 endroits :
  `frontend/src/pages/home/HomePage.tsx`, `frontend/src/pages/search/SearchPage.tsx`,
  `frontend/src/pages/cars/CarForm.tsx`. (HomePage & SearchPage sélectionnent ALG par défaut.)
- Pas de store Zustand pour les aéroports — juste le cache de la query + l'état local des composants.

---

## 2. Structure de la base de données

`backend/prisma/schema.prisma` :
```prisma
model Airport {
  id   Int    @id @default(autoincrement())
  name String
  city String
  code String @unique
  cars Car[]          // one-to-many
}

model Car {
  // ...
  airportId Int
  airport   Airport @relation(fields: [airportId], references: [id])
}
```
- Migration de référence : `backend/prisma/migrations/20260514213456_init/migration.sql`
  (crée `Airport`, index unique sur `code`, et la FK `Car.airportId` avec **ON DELETE RESTRICT** —
  un aéroport ne peut pas être supprimé tant que des voitures le référencent).
- Les voitures embarquent l'objet `airport` complet dans les réponses API, donc chaque carte de
  voiture / ligne de réservation lit `car.airport.city` / `car.airport.code` sans fetch séparé.

---

## 3. Ce qui modifie les données

**Rien à l'exécution.** Pas de POST/PUT/PATCH/DELETE pour les aéroports, pas de schéma Zod
(`backend/src/schemas/` ne contient que `car.schema.ts` et `reservation.schema.ts`), pas d'UI admin.
La seule façon de changer les aéroports aujourd'hui : éditer `seed.ts` et relancer le seed, ou
modifier la DB directement. Le seul endroit où `airportId` est *écrit* est la création/édition d'une
**voiture** (`CarForm.tsx` → `POST/PUT /api/cars`), qui référence un aéroport existant.

---

## 4. Où les aéroports sont AFFICHÉS (chaque site de rendu)

| # | Fichier | Contexte | Ce qui est affiché |
|---|---------|----------|--------------------|
| A | `frontend/src/pages/home/HeroSection.tsx` (lignes 81–91) | Formulaire de réservation hero (accueil) | `<select>` natif, `{city} — {code}` |
| B | `frontend/src/components/SearchBar.tsx` (lignes 40–51) | Formulaire de recherche réutilisable (SearchPage) | `<Select>` shadcn, `{city} — {code}` |
| C | `frontend/src/pages/cars/CarForm.tsx` (lignes 158–171) | Création/édition voiture (admin) | `<Select>` shadcn, `{city} — {code}` |
| D | `frontend/src/pages/home/CarGrid.tsx` (sous-titre ~41–45 ; carte ~97) | Cartes voitures accueil | `city` dans le sous-titre, badge `code` sur la carte |
| E | `frontend/src/pages/search/SearchPage.tsx` (sous-titre ~112–116 ; carte ~182–184) | Résultats de recherche | `city` dans le sous-titre, badge `code` sur la carte |
| F | `frontend/src/pages/search/BookingModal.tsx` (lignes 93–95) | Récapitulatif réservation | `{city} — {code}` |
| G | `frontend/src/pages/reservations/ReservationsPage.tsx` (table ~131–133 ; détail ~234) | Réservations (admin) | `city` + `code` dans la table & le détail |

Le format de label `{a.city} — {a.code}` est répété en A, B, C (dropdowns).

---

## 5. « Si je voulais… » — les fichiers exacts à modifier

### → Changer l'UI (apparence/layout du sélecteur, badges, etc.)
- Dropdowns : `HeroSection.tsx` (A), `SearchBar.tsx` (B), `CarForm.tsx` (C).
- Badges/sous-titres des cartes : `home/CarGrid.tsx` (D), `search/SearchPage.tsx` (E).
- Récap & vues admin : `BookingModal.tsx` (F), `ReservationsPage.tsx` (G).
- Le style est dans `frontend/src/index.css` et `frontend/src/pages/home/home.css`
  (ex. `.bk-field`, `.airport-badge`).

### → Changer les données affichées (ex. afficher `name` au lieu de `city — code`)
- Modifier les expressions JSX à chaque site d'affichage (A–G). La chaîne `{a.city} — {a.code}` est
  ce qu'on change dans les dropdowns ; `car.airport.code` / `.city` dans les cartes & tables.
- Aucun changement backend nécessaire — `name`, `city`, `code` sont déjà renvoyés par
  `GET /api/airports` et embarqués dans `car.airport`.

### → Ajouter un nouveau champ (ex. `region`, `terminal`, `latitude`)
Full stack, dans cet ordre :
1. **DB/schéma :** ajouter le champ au `model Airport` dans `backend/prisma/schema.prisma`.
2. **Migration :** `cd backend && npx prisma migrate dev --name add_airport_<champ>`
   (tuer node d'abord — cf. gotcha CLAUDE.md ; puis `npx prisma generate` si besoin).
3. **Seed :** ajouter la valeur du champ pour les 7 aéroports dans `backend/prisma/seed.ts`,
   relancer `npm run seed`.
4. **Type :** ajouter le champ à `interface Airport` dans `frontend/src/api/cars.ts`.
5. **Rendu :** l'afficher où souhaité (A–G).
6. Le controller `getAirports` ne change pas (`findMany` renvoie toutes les colonnes).

### → Changer les règles métier
- **Ordre de tri de la liste** (actuellement `city` asc) : `airport.controller.ts` → `orderBy`.
- **Aéroport sélectionné par défaut** (ALG auto) : l'effet d'auto-sélection dans `HomePage.tsx`
  et `SearchPage.tsx`.
- **Filtrage des voitures par aéroport** (la recherche réelle) : `carsApi.getAll(airportId, …)` dans
  `frontend/src/api/cars.ts` + le controller voitures (`backend/src/controllers/car.controller.ts`,
  gestion de `?airportId=`). Note : le filtrage fait partie de la feature de recherche F04/F05.
- **Restreindre la lecture des aéroports à l'auth, ou ajouter de la validation :** ajouter
  `requireAuth` dans `airport.routes.ts`, et/ou un schéma Zod sous `backend/src/schemas/`.

### → Changer la structure de la base de données
- `backend/prisma/schema.prisma` (le model + la relation `Car.airport` si pertinent).
- Une nouvelle migration sous `backend/prisma/migrations/` (générée par `prisma migrate dev`).
- `backend/prisma/seed.ts` si les valeurs seedées sont impactées.
- Pour rendre les aéroports **éditables à l'exécution** (nouveau CRUD), ajouter aussi : un schéma Zod
  (`backend/src/schemas/airport.schema.ts`), des handlers POST/PUT/DELETE dans
  `airport.controller.ts`, des routes dans `airport.routes.ts` (protégées par `requireAuth`), une API
  frontend dans `cars.ts` (ou un nouveau `airports.ts`), et une page/form admin calquée sur
  `CarForm.tsx`.

---

## 6. Vérification (après tout changement)

1. Depuis la racine `aireline/` : `npm run dev` (API :3000, frontend :5173).
2. Backend : `curl http://localhost:3000/api/airports` → vérifier la forme/les champs.
3. Frontend : ouvrir `http://localhost:5173/` → le dropdown hero liste les aéroports ; choisir un
   aéroport + dates → « Voir les voitures » → les résultats montrent le badge `code`.
4. Admin : se connecter (`admin@airsline.dz` / `admin123`) → Voitures → création/édition montre le
   dropdown aéroport ; la table/le détail des Réservations montrent ville + code.
5. Si le schéma a changé : relancer migration + `npm run seed`, puis revérifier les étapes 2–4.
