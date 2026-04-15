# Konfiguracja Firebase + Cloudinary dla Love Timeline

Kompleksowy przewodnik konfiguracji Firebase (Firestore) + Cloudinary (obrazy) dla aplikacji osi czasu związku.

---

## 1. Rejestracja i utworzenie projektu Firebase

### Krok 1: Wejdź na Firebase Console
- Przejdź na [Firebase Console](https://console.firebase.google.com/)
- Zaloguj się przy pomocy konta Google
- Kliknij **+ Add project** lub **Create a project**

### Krok 2: Konfiguracja nowego projektu
- **Project name**: Wpisz nazwę projektu (np. `love-timeline`)
- Kliknij **Continue**

### Krok 3: Zaakceptuj warunki
- Zaznacz pole: "I accept the Firebase terms"
- Kliknij **Create project**

### Krok 4: Czekaj na inicjalizację
- Firebase generuje projekt (czeka ~2-3 minuty)
- Po zakończeniu kliknij **Continue**

---

## 2. Pobierz dane konfiguracyjne Firebase

### Krok 1: Przejdź do Project Settings
- W Firebase Console kliknij ikonę **⚙️ (koło zębate)** w lewym menu
- Wybierz **Project settings**

### Krok 2: Przejdź do zakładki General
- Upewnij się, że jesteś na zakładce **General**

### Krok 3: Znajdź konfigurację aplikacji
- Przewiń w dół do sekcji **Your apps**
- Jeśli brak aplikacji, kliknij **Add app** i wybierz ikonę `</>` (Web)
- Wpisz **Nickname**: `love-timeline-web` (lub dowolna nazwa)
- Zaznacz **Also set up Firebase Hosting for this app** (opcjonalne)
- Kliknij **Register app**

### Krok 4: Skopiuj konfigurację
Zobaczysz kod JavaScript zawierający:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "love-timeline-xxx.firebaseapp.com",
  projectId: "love-timeline-xxx",
  storageBucket: "love-timeline-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd..."
};
```

### Krok 5: Wypełnij `.env.local`
Skopiuj wartości do pliku `.env.local`:

```bash
cp .env.example .env.local
```

Edytuj `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=love-timeline-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=love-timeline-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=love-timeline-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcd...
```

---

## 3. Konfiguracja Firestore Database

### Krok 1: Utwórz Firestore Database
- W Firebase Console przejdź do **Build** → **Firestore Database** (lewe menu)
- Kliknij **Create database**

### Krok 2: Wybierz ustawienia
- **Location**: Wybierz `Europe (Warszawa)` lub bliski region
- Kliknij **Next**

### Krok 3: Ustaw Security Rules
- Wybierz **Start in test mode** (zmienimy je zaraz)
- Kliknij **Create**

### Krok 4: Czekaj na inicjalizację
- Czeka ~2-3 minuty na utworzenie bazy

### Krok 5: Skonfiguruj Security Rules
Po utworzeniu bazy:
- Przejdź do zakładki **Rules** w Firestore
- Zamień całą zawartość na:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /relationship_events/{document=**} {
      allow read, write: if true;
    }
  }
}
```

- Kliknij **Publish**

### Krok 6: Utwórz collection
- Wróć do zakładki **Data**
- Kliknij **+ Start collection**
- **Collection ID**: `relationship_events`
- Kliknij **Next**
- Kliknij **Auto ID** (do automatycznego wygenerowania ID dokumentu)
- Dodaj pola dla testowego dokumentu (opcjonalne):
  - `event_date`: `2025-01-01` (string)
  - `title`: `Testowe wydarzenie` (string)
  - `description`: `Test` (string)
  - `image_url`: `https://example.com/test.jpg` (string)
- Kliknij **Save**

**Gotowe!** Collection `relationship_events` jest teraz dostępna.

---

## 4. Konfiguracja Cloudinary (do zdjęć)

### Krok 1: Załóż konto i wejdź do Cloudinary Console
- Przejdź na [Cloudinary Console](https://console.cloudinary.com/)
- Zaloguj się / utwórz konto

### Krok 2: Skopiuj Cloud Name
- W Dashboard znajdź pole **Cloud name**
- Skopiuj wartość do `.env.local` jako:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=twoj_cloud_name`

### Krok 3: Utwórz Unsigned Upload Preset
- W Cloudinary przejdź do **Settings** → **Upload**
- Kliknij **Add upload preset**
- Ustaw:
  - **Signing Mode**: `Unsigned`
  - (Opcjonalnie) **Folder**: `events`
- Zapisz preset i skopiuj jego nazwę

### Krok 4: Uzupełnij `.env.local`
Dodaj:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=twoj_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=twoj_unsigned_preset
NEXT_PUBLIC_CLOUDINARY_FOLDER=events
```

**Gotowe!** Aplikacja będzie przesyłać zdjęcia do Cloudinary, a do Firestore zapisze URL obrazu.

---

## 5. Weryfikacja konfiguracji

### Krok 1: Testuj lokalnie
W głównym katalogu projektu (`/Users/mateuszmaniak/Desktop/code/jess/apk/`):

```bash
npm run dev
```

Aplikacja powinna być dostępna pod: `http://localhost:3000`

### Krok 2: Sprawdź czy Firebase się załaduje
- Otwórz aplikację w przeglądarce
- Przejdź na `/dodaj-wydarzenie`
- Jeśli **brak komunikatu ostrzeżenia** o braku konfiguracji → wszystko OK!
- Jeśli pojawi się **żółta wiadomość** → sprawdź zmienne w `.env.local`

### Krok 3: Dodaj testowe wydarzenie
- Wypełnij formularz: data, tytuł, opis, zdjęcie
- Kliknij **Zapisz wydarzenie**
- Jeśli dodanie powiedzie się → będziesz przekierowany na stronę główną

### Krok 4: Sprawdź Firestore
- W Firebase Console przejdź do **Firestore Database**
- Otworz collection `relationship_events`
- Powinieneś zobaczyć nowy dokument z twoimi danymi

### Krok 5: Sprawdź Cloudinary
- W Cloudinary przejdź do **Media Library**
- Powinieneś zobaczyć przesłane zdjęcie (np. w folderze `events/`)

---

## 6. Rozwiązywanie problemów

### ❌ "Firebase nie jest skonfigurowany"
**Przyczyna**: Brak zmiennych w `.env.local` lub są puste
**Rozwiązanie**:
- Sprawdź czy `.env.local` istnieje w katalogu głównym (`/Users/mateuszmaniak/Desktop/code/jess/apk/`)
- Sprawdź czy wszystkie 6 zmiennych jest uzupełnionych
- Restartuj serwer: `npm run dev`

### ❌ "Nie udało się załadować wydarzeń z Firebase"
**Przyczyna**: Firestore nie jest prawidłowo skonfigurowany lub Security Rules są błędne
**Rozwiązanie**:
- Sprawdź czy collection `relationship_events` istnieje
- Sprawdź Security Rules (powinny pozwalać na read/write)
- W Firebase Console otwórz **Firestore Database** → **Rules** i sprawdź czy są opublikowane

### ❌ "Cloudinary nie jest skonfigurowany"
**Przyczyna**: Brak `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` lub `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
**Rozwiązanie**:
- Uzupełnij brakujące zmienne w `.env.local`
- Sprawdź czy upload preset jest typu **Unsigned**
- Restartuj serwer `npm run dev`

### ❌ CORS error w konsoli przeglądarki
**Przyczyna**: Błąd uwierzytelniania lub konfiguracji
**Rozwiązanie**:
- Sprawdź czy `apiKey` jest prawidłowy
- Sprawdź czy `authDomain` jest prawidłowy
- Wyczyść cache: `Ctrl+Shift+Delete` (Chrome) lub `Cmd+Shift+Delete` (Mac)
- Restartuj serwer

### ❌ Zduplikowana/pusta baza
**Rozwiązanie**: 
- Jeśli chcesz wyczyścić bazę, w Firebase Console:
  - Przejdź do **Firestore Database**
  - Kliknij na collection `relationship_events`
  - Zaznacz wszystkie dokumenty
  - Kliknij **Delete** w menu kontekstowym
  - Usuń całą collection klikając **Delete collection** przy `relationship_events`

---

## 7. Zmienne środowiskowe — pełna referencja

| Zmienna | Skąd pobrać | Przykład |
|---------|-----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → General → firebaseConfig | `AIzaSyD...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → General → firebaseConfig | `love-timeline.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → General → firebaseConfig | `love-timeline-xxx` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → General → firebaseConfig | `love-timeline.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → General → firebaseConfig | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings → General → firebaseConfig | `1:123456789:web:abc...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Console → Dashboard | `demo` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Console → Settings → Upload → Upload presets | `timeline_unsigned` |
| `NEXT_PUBLIC_CLOUDINARY_FOLDER` | Własna wartość (opcjonalna) | `events` |

---

## 8. Struktura danych Firestore

Collection: `relationship_events`

```json
{
  "event_date": "2025-04-14",
  "title": "Pierwsza randka",
  "description": "Długi spacer, śmiech i rozmowa...",
  "image_url": "https://res.cloudinary.com/...",
  "image_provider": "cloudinary",
  "image_public_id": "events/abc123",
  "created_at": "2025-04-14T10:30:00Z"
}
```

**Pola obowiązkowe**:
- `event_date` (string, format: YYYY-MM-DD)
- `title` (string)
- `description` (string)
- `image_url` (string, URL zdjęcia z Cloudinary)

**Pola opcjonalne**:
- `created_at` (timestamp, automatycznie ustawiane przez aplikację)

---

## 9. Automatyczne tworzenie collection

Jeśli zapomniałeś utworzyć collection `relationship_events` — nie martw się!

Gdy dodasz pierwsze wydarzenie w aplikacji, Firestore **automatycznie** utworzy:
- Collection: `relationship_events`
- Dokument z twoimi danymi

Jednak zalecam **ręczne** utworzenie collection przed użytkowaniem, aby uniknąć błędów.

---

## 10. Bezpieczeństwo

⚠️ **WAŻNE**: Zmienne z `NEXT_PUBLIC_*` są **publiczne** i widoczne w kodzie źródłowym!

Bieżące Security Rules pozwalają **każdemu** czytać i pisać do bazy bez autentyki. To jest OK dla testów, ale **przed wdrożeniem na produkcję**:

1. Dodaj autentykację (Google Sign-In, itp.)
2. Zrestrykcjonuj dostęp tylko dla zalogowanych użytkowników
3. Dodaj rate limiting w Cloud Functions

---

## 11. Następne kroki

Teraz możesz:
- ✅ Dodawać wydarzenia ze zdjęciami
- ✅ Przeglądać osś czasu
- ✅ Zarządzać danymi w Firebase Console

Zapraszam do eksperymentów! 🎉

---

## Przydatne linki

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Next.js + Firebase Guide](https://nextjs.org/learn-pages-router/basics/data-fetching/firebase)
