# AI Task App – Backend

Ten folder zawiera backend aplikacji AI Task App – serwer Express odpowiedzialny za rejestrację użytkowników, zarządzanie zadaniami oraz integrację z AI (GPT-4o + embeddingi).

## 🧰 Technologie

- Node.js + Express
- MongoDB + Mongoose
- JWT (autoryzacja)
- Bcrypt (hashowanie haseł)
- Dotenv (zmienne środowiskowe)
- CORS
- Express-validator (walidacja danych wejściowych)
- OpenAI API (GPT-4o + embeddingi)
- Prettier (formatowanie kodu)

---

## 📁 Struktura katalogów

```
backend/
├── config/             # Konfiguracja MongoDB
├── controllers/        # Logika auth + tasks
├── models/             # Schematy: User, Task
├── routes/             # Ścieżki API
├── middleware/         # JWT auth, walidacja danych
├── validators/         # Walidatory pól (express-validator)
├── services/           # gptService.function.js, embeddingService.js
├── utils/              # responseHandler.js (sendSuccess/sendError)
├── prettier.config.js  # Formatowanie kodu
└── server.js           # Główna aplikacja Express
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
- Endpoint `POST /api/tasks/ai-create`:
  - Używa GPT-4o (function calling)
  - Generuje `title`, `description`, `dueDate`, `difficulty`
  - Zadanie zapisywane do MongoDB
  - Następnie generowany jest `embedding`
  - Przypisywane są podobne zadania (`similarTasks`) jeśli similarity >= 0.75

---

## 🧠 Integracja AI – GPT-4o (OpenAI)

- Mechanizm function calling (OpenAI tools)
- Odpowiedź GPT zawiera kompletne dane w formacie strukturalnym
- Brak fallbacków – wyłącznie poprawny JSON
- Obsługa `difficulty` i automatyczne dopasowanie podobnych zadań (embedding)

---

## 🎨 Formatowanie kodu

Do formatowania kodu backendu używany jest Prettier.  
Plik konfiguracyjny: `prettier.config.js`

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
- `services.md`
- `ai_integration.md`
