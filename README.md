# AI Task App – Backend

Ten folder zawiera backend aplikacji AI Task App – serwer Express odpowiedzialny za rejestrację użytkowników, zarządzanie zadaniami oraz integrację z AI (GPT-4o + embeddingi). System wspiera zarówno tworzenie zadań ręcznie, jak i za pomocą AI oraz inteligentne zamykanie zadań – przez ocenę i wygładzenie `summary`, lub przez skopiowanie rozwiązania z innego zadania.

---

## 🧰 Technologie

- Node.js + Express
- MongoDB + Mongoose
- JWT (autoryzacja)
- Bcrypt (hashowanie haseł)
- Dotenv (zmienne środowiskowe)
- CORS
- Express-validator (walidacja danych wejściowych)
- OpenAI API (GPT-4o + `text-embedding-3-small`)
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
├── services/           # Integracje AI: gptService, aiSummaryService, embeddingService
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
- Hasła przechowywane w postaci hashowanej (bcrypt)

---

## 🗂️ Zadania

- Tworzenie zadania:
  - `POST /api/tasks` – ręczne
  - `POST /api/tasks/ai-create` – z pomocą GPT-4o
- Edycja zadania:
  - `PATCH /api/tasks/:id` – częściowa aktualizacja (tytuł, opis, termin, status)
- Zamykanie zadania:
  - `PATCH /api/tasks/:id/ai-close` – AI ocenia `summary` i wygładza je
    - jeśli za krótkie lub słabe → błąd (chyba że `force: true`)
    - AI działa tylko w tym endpointzie
  - `PATCH /api/tasks/:id/close` – kopiowanie `summary` z innego zadania
    - wymaga `sourceTaskId`
    - `summary` nie może być przesyłane ręcznie

---

## 🧠 Integracja AI – GPT-4o (OpenAI)

- Obsługa `function calling` (z pełną strukturą JSON):
  - `create_task` – struktura nowego zadania
  - `assess_summary` – ocena jakości rozwiązania
  - `improve_summary` – wygładzenie (stylistyka, użyteczność)
- Brak fallbacków – AI zawsze odpowiada przez `tool_call`
- Język odpowiedzi AI dostosowany do języka użytkownika
- `summary` nie jest generowane automatycznie – użytkownik je wpisuje lub kopiuje
- Embeddingi generowane po utworzeniu zadania – służą do porównywania z zakończonymi (`similarity ≥ 0.75`)

---

## 🎨 Formatowanie kodu

Do formatowania kodu backendu używany jest Prettier.  
Plik konfiguracyjny: `prettier.config.js`

```bash
npm run format
```

---

## 📄 Dokumentacja

- `project_overview.md` – cel, architektura, sposób działania
- `backend_overview.md` – szczegóły backendu
- `api_spec.md` – endpointy, metody, pola, odpowiedzi
- `project_roadmap.md` – harmonogram etapów
- `controllers.md` – kontrolery i ich logika
- `validators.md` – walidatory danych
- `services.md` – AI, embeddingi, obsługa GPT
- `ai_integration.md` – function calling, zasady działania GPT
- `middleware.md`, `utils.md` – warstwy pomocnicze
