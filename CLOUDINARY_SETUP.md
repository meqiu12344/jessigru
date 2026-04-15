# Konfiguracja Cloudinary (Love Timeline)

Krótki przewodnik konfiguracji Cloudinary tak, aby zdjęcia były wysyłane do Cloudinary, a dane wydarzeń zapisywane w Firebase Firestore.

---

## 1) Załóż konto i sprawdź `Cloud name`

1. Wejdź na [Cloudinary Console](https://console.cloudinary.com/).
2. Zaloguj się / utwórz konto.
3. W **Dashboard** skopiuj wartość **Cloud name**.

Będzie potrzebna jako:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

---

## 2) Utwórz Upload Preset (unsigned)

1. Wejdź w **Settings** → **Upload**.
2. W sekcji **Upload presets** kliknij **Add upload preset**.
3. Ustaw:
   - **Signing Mode**: `Unsigned`
   - (Opcjonalnie) **Folder**: `events`
4. Zapisz preset i skopiuj jego nazwę.

Będzie potrzebna jako:

- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## 3) Uzupełnij `.env.local`

W pliku `.env.local` dodaj/uzupełnij:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="twoj_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="twoj_unsigned_preset"
NEXT_PUBLIC_CLOUDINARY_FOLDER="events"
```

> `NEXT_PUBLIC_CLOUDINARY_FOLDER` jest opcjonalne (ale zalecane dla porządku).

---

## 4) Uruchom aplikację

```bash
npm run dev
```

Przejdź do `/dodaj-wydarzenie`, dodaj event ze zdjęciem i zapisz.

---

## 5) Weryfikacja

### Cloudinary
- Otwórz **Media Library**.
- Sprawdź, czy pojawił się nowy obraz (np. w folderze `events/`).

### Firestore
W kolekcji `relationship_events` sprawdź pola:
- `image_url` (URL z Cloudinary)
- `image_provider` (np. `cloudinary`)
- `image_public_id` (ID zasobu)

---

## Najczęstsze problemy

### „Cloudinary nie jest skonfigurowany”
- Uzupełnij `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` i `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- Zrestartuj serwer dev po zmianach env.

### Błąd uploadu (HTTP 400/401)
- Sprawdź, czy preset istnieje.
- Upewnij się, że preset jest `Unsigned`.
- Sprawdź, czy `Cloud name` jest poprawny.

### Brak obrazu na stronie
- Zweryfikuj, czy w Firestore `image_url` zawiera poprawny link `https://res.cloudinary.com/...`.

---

## Bezpieczeństwo (ważne)

W tym projekcie używany jest upload **unsigned** po stronie klienta (prostszy setup).
Do produkcji zalecane jest przejście na **signed upload** przez endpoint serwerowy, aby lepiej kontrolować kto i co może wysyłać.