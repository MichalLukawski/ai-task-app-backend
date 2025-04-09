# AI Task App – Backend

Ten folder zawiera backend aplikacji AI Task App – serwer Express odpowiedzialny za rejestrację użytkowników, zarządzanie zadaniami oraz integrację z AI (planowana).

## 🧰 Technologie

- Node.js + Express
- MongoDB + Mongoose
- JWT (autoryzacja)
- Bcrypt (hashowanie haseł)
- Dotenv (zmienne środowiskowe)
- CORS
- Express-validator (walidacja danych wejściowych)
- Moduły pomocnicze (`utils/`, `middleware/`, `validators/`)

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
├── utils/             # sendSuccess/sendError
├── .env               # Zmienne środowiskowe
└── server.js          # Główna aplikacja Express
```

---

## 🚀 Uruchomienie backendu

1. Skonfiguruj plik `.env`:
```
MONGO_URI=mongodb://localhost:27017/ai-task-app
JWT_SECRET=twoj_super_sekret
PORT=5000
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom serwer:
```bash
node server.js
# lub z nodemon:
npx nodemon server.js
```

---

## 🔐 Uwierzytelnianie

- JWT generowane podczas logowania (`/api/auth/login`)
- Token przesyłany w nagłówku: `Authorization: Bearer <TOKEN>`
- Middleware `auth.js` chroni trasy `/api/tasks`

---

## 🗂️ Zadania

- Endpointy `POST`, `GET`, `PUT`, `POST /close` dla `/api/tasks`
- Obsługa pola `dueDate` (termin wykonania, opcjonalny)
- Walidacja pól zadań (`description`, `title`, `status`, `dueDate`)
- Middleware `validate.js` + `taskValidator.js`

---

## 🧠 Integracja AI (planowana)

- GPT-4 generuje tytuł/opis zadania
- Tworzenie podsumowań przy zamykaniu
- Semantyczne porównania (`/api/ai/similar-tasks`)

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
