## Love Timeline (Next.js + Firebase + Cloudinary)

Aplikacja osi czasu związku z możliwością dodawania wydarzeń i zdjęć.
Zdjęcia są przechowywane w Cloudinary, a dane wydarzeń (w tym URL zdjęcia) w Firestore.
Na stronie głównej znajdziesz też zakładkę z licznikiem czasu razem.

## Konfiguracja zewnętrznej bazy danych i obrazów

### 1. Skopiuj plik `.env.example` do `.env.local` i uzupełnij wartości:

```bash
cp .env.example .env.local
```

### 2. Pobierz konfigurację Firebase:

- Wejdź na [Firebase Console](https://console.firebase.google.com/)
- Utwórz nowy projekt (lub skorzystaj z istniejącego)
- Przejdź do **Project Settings** (ikonka koła zębatego)
- W sekcji **General** znajdź konfigurację (`apiKey`, `authDomain`, `projectId` itd.)
- Skopiuj wartości do `.env.local`

### 3. Skonfiguruj Cloudinary (upload zdjęć):

- Wejdź na [Cloudinary Console](https://console.cloudinary.com/)
- Skopiuj `Cloud name` do `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Utwórz **Unsigned Upload Preset** i skopiuj jego nazwę do `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- (Opcjonalnie) ustaw folder, np. `events`, przez `NEXT_PUBLIC_CLOUDINARY_FOLDER`
- (Opcjonalnie) ustaw datę startu związku przez `NEXT_PUBLIC_RELATIONSHIP_START_DATE=YYYY-MM-DD`

### 4. Skonfiguruj Firestore Database:

- W Firebase Console przejdź do **Firestore Database**
- Kliknij **Create database**
- Wybierz lokalizację (np. Europe - Warszawa)
- Zaakceptuj domyślne reguły bezpieczeństwa (lub edytuj je poniżej)

Domyślne reguły Firestore (`Security Rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Utwórz Firestore Collection ręcznie lub pozwól aplikacji na jej automatyczne utworzenie:

Jeśli chcesz utworzyć ją ręcznie:
- W Firestore Database kliknij **+ Start collection**
- Nazwa: `relationship_events`
- Dodaj dokument z polami:
  - `event_date` (string, format: YYYY-MM-DD)
  - `title` (string)
  - `description` (string)
  - `image_url` (string, URL z Cloudinary)
  - `image_provider` (string, opcjonalne, np. `cloudinary`)
  - `image_public_id` (string, opcjonalne, ID zasobu w Cloudinary)
  - `created_at` (timestamp, opcjonalne)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) and:

- zobacz oś czasu: `/`
- dodaj wydarzenie: `/dodaj-wydarzenie`
