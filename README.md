# 🧠 AI Task App – Backend README

Ten plik zawiera kompletną dokumentację backendu aplikacji AI Task App – inteligentnego systemu do zarządzania zadaniami technicznymi, wspieranego przez modele GPT-4o i embeddingi semantyczne. Backend odpowiada za rejestrację użytkowników, logowanie, obsługę zadań oraz integrację z usługami AI.

---

## 📚 Zawartość

- [Opis projektu](#opis-projektu)
- [Technologie](#technologie)
- [Struktura katalogów](#struktura-katalogów)
- [Uruchomienie](#uruchomienie)
- [Uwierzytelnianie](#uwierzytelnianie)
- [API zadań](#api-zadań)
- [Integracja AI](#integracja-ai)
- [Szyfrowanie kluczy OpenAI](#szyfrowanie-kluczy-openai)
- [Formatowanie kodu](#formatowanie-kodu)
- [Powiązana dokumentacja](#powiązana-dokumentacja)

---

## 📌 Opis projektu

Backend to serwer Express.js, który:

- zarządza użytkownikami (`User`)
- obsługuje tworzenie i zamykanie zadań (`Task`)
- korzysta z OpenAI (GPT-4o + embeddingi) do wspomagania użytkownika
- zapisuje embeddingi i przypisuje podobne zadania
- integruje się z frontendem przez REST API

---

## 🧰 Technologie

- Node.js + Express
- MongoDB + Mongoose
- JWT (autoryzacja)
- Bcrypt (hasła)
- Dotenv (zmienne środowiskowe)
- Express-validator
- OpenAI SDK
- AES-256-GCM (szyfrowanie kluczy)
- Prettier (formatowanie)

---

## 📁 Struktura katalogów

```
backend/
├── config/             # Konfiguracja MongoDB
├── controllers/        # Logika auth + tasks
├── middleware/         # JWT, walidacja, błędy
├── models/             # User, Task, ApiKey
├── routes/             # Routing (auth, tasks, system)
├── services/           # GPT, embeddingi, szyfrowanie
├── utils/              # sendSuccess, sendError
├── validators/         # express-validator
├── prettier.config.js  # Konfiguracja Prettier
└── server.js           # Główna aplikacja Express
```

---

## 🚀 Uruchomienie

1. Utwórz plik `.env` (szczegóły: ../docs/backend/env.md)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-task-app
JWT_SECRET=twoj_super_sekret
SECRET_ENCRYPTION_KEY=64-znakowy-hex
# OPENAI_API_KEY=sk-... (opcjonalny fallback)
```

2. Zainstaluj zależności

```bash
npm install
```

3. Uruchom backend

```bash
npm run dev
```

---

## 🔐 Uwierzytelnianie

- Rejestracja: `POST /api/auth/register`
- Logowanie: `POST /api/auth/login` → zwraca JWT
- Token wymagany w: `/api/tasks`, `/api/system/...`
- Nagłówek: `Authorization: Bearer <TOKEN>`
- Walidacja tokena: middleware `auth.js`

---

## 🧾 API zadań

- Tworzenie:
  - `POST /api/tasks` – ręczne
  - `POST /api/tasks/ai-create` – przez GPT
- Edycja: `PATCH /api/tasks/:id`
- Zamykanie:
  - `PATCH /api/tasks/:id/ai-close` – AI ocenia i wygładza `summary`
  - `PATCH /api/tasks/:id/close` – kopiowanie `summary` z innego zadania
- Wyszukiwanie: `GET /api/tasks` – wszystkie zadania użytkownika

---

## 🧠 Integracja AI

- GPT-4o (`gptService.function.js`)
  - `create_task` – wygenerowanie danych zadania
  - `assess_summary` – ocena jakości opisu
  - `improve_summary` – wygładzenie
- AI zawsze odpowiada przez `tool_calls`
- Embeddingi (`text-embedding-3-small`) generowane w `embeddingService.js`
- `similarTasks` wybierane automatycznie (cosine similarity ≥ 0.75)

---

## 🔐 Szyfrowanie kluczy OpenAI

- Klucze mogą być:
  - zapisane zaszyfrowane w MongoDB (`ApiKey`)
  - fallback do `.env` (`OPENAI_API_KEY`)
- Szyfrowanie: AES-256-GCM
- Klucz szyfrujący: `SECRET_ENCRYPTION_KEY` (64-znakowy hex)
- Endpoint: `POST /api/system/openai-key` (tylko dla admina)

---

## 🎨 Formatowanie kodu

Plik `prettier.config.js` zapewnia jednolity styl kodu.  
Aby sformatować:

```bash
npm run format
```

---

## 📄 Powiązana dokumentacja

- `backend_overview.md` – szczegółowy opis backendu
- `api_spec.md` – endpointy, metody, parametry
- `controllers.md`, `validators.md`, `services.md`
- `middleware.md`, `utils.md`
- `ai_integration.md` – GPT + embeddingi
- `b_env_FULL.md` – zmienne środowiskowe backendu
