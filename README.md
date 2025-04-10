# AI Task App – Backend

Ten folder zawiera backend aplikacji AI Task App – serwer Express odpowiedzialny za rejestrację użytkowników, zarządzanie zadaniami oraz integrację z AI.

## 🧰 Technologie

- Node.js + Express
- MongoDB + Mongoose
- JWT (autoryzacja)
- Bcrypt (hashowanie haseł)
- Dotenv (zmienne środowiskowe)
- CORS
- Express-validator (walidacja danych wejściowych)
- OpenAI API (GPT-4o)
- Prettier (formatowanie kodu)

---

## 📁 Struktura katalogów

```
backend/
├── config/            # Konfiguracja MongoDB
├── controllers/       # Logika auth + tasks
├── models/            # Schematy: User, Task
├── routes/            # Ścieżki API
├── middleware/        # JWT auth, walidacja danych
├── validators/        # Walidatory pól (express-validator)
├── services/          # Integracja z GPT (gptService.js)
├── utils/             # sendSuccess/sendError
├── .env               # Zmienne środowiskowe
├── prettier.config.js # Formatowanie kodu
└── server.js          # Główna aplikacja Express
```

---

## 🚀 Uruchomienie backendu

1. Skonfiguruj plik `.env`:

```
MONGO_URI=mongodb://localhost:27017/ai-task-app
JWT_SECRET=twoj_super_sekret
OPENAI_API_KEY=sk-... (własny klucz OpenAI)
PORT=5000
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Uruchom serwer:

```bash
npm run dev
```

---

## 🔐 Uwierzytelnianie

- JWT generowane podczas logowania (`/api/auth/login`)
- Token przesyłany w nagłówku: `Authorization: Bearer <TOKEN>`
- Middleware `auth.js` chroni trasy `/api/tasks`

---

## 🗂️ Zadania

- Endpointy `POST`, `GET`, `PUT`, `POST /close` dla `/api/tasks`
- Nowość: `POST /api/tasks/ai-create` – tworzenie zadania z pomocą GPT-4o
- Obsługa pola `dueDate` (termin wykonania, opcjonalny)
- Walidacja pól zadań (`description`, `title`, `status`, `dueDate`)
- Middleware `validate.js` + `taskValidator.js`

---

## 🧠 Integracja AI – GPT-4o (OpenAI)

- Wykorzystanie modelu GPT-4o do generowania struktury zadania
- Obsługiwane przez `services/gptService.js`
- Automatyczne tworzenie `notes` na podstawie promptu użytkownika
- Możliwość dalszej rozbudowy (podsumowania, analiza trudności, itp.)

---

## 🎨 Formatowanie kodu

Do formatowania kodu backendu używany jest Prettier.  
Plik konfiguracyjny: `prettier.config.js`

**Przykład:**

```bash
npm run format
```

---

## 📄 Dokumentacja

- `project_overview.md`
- `backend_overview.md`
- `api_spec.md`
- `project_roadmap.md`
- `controllers.md`
- `middleware.md`
- `utils.md`
- `validators.md`
