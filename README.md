# 🧠 AI Task App

AI Task App to aplikacja do zarządzania zadaniami, wspierana przez sztuczną inteligencję (GPT-4o). Umożliwia tworzenie zadań ręcznie lub automatycznie z pomocą AI, generowanie embeddingów, zamykanie zadań z automatycznym ocenianiem i podsumowaniem, a także odnajdywanie podobnych zadań w kontekście semantycznym.

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

## 🚀 Jak uruchomić projekt lokalnie

### 1. Klonowanie repozytorium:

```bash
git clone https://github.com/twoje-repo/ai-task-app.git
cd ai-task-app
```

### 2. Instalacja zależności:

```bash
npm install

```

### 3. Pliki `.env`

Utwórz `.env` w `backend/` z poniższymi zmiennymi:

```
PORT=5000
MONGO_URI=<twoje_uri>
JWT_SECRET=<tajny_klucz>
OPENAI_API_KEY=<klucz_openai>
SECRET_ENCRYPTION_KEY=<klucz_AES_256>
```

### 4. Uruchomienie projektu:

```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## 🧠 Funkcje AI

| Funkcja                | Opis                                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| **createTaskWithAI**   | Tworzy strukturę zadania na podstawie opisu użytkownika                         |
| **processTaskClosure** | Ocenia jakość `summary`, opcjonalnie poprawia                                   |
| **embeddingService**   | Tworzy embedding i identyfikuje podobne zadania                                 |
| **function_calling**   | Integracja z GPT-4o poprzez nazwane funkcje (`create_task`, `evaluate_summary`) |

---

## 🔐 Autoryzacja

- Rejestracja i logowanie z JWT (`authController.js`)
- Middleware `auth.js` sprawdza token i przypisuje `req.user`
- Obsługa ról (`role`) zaplanowana na kolejne wersje

---

## 📘 API (wybrane trasy)

| Metoda | Endpoint                  | Opis                          |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/api/auth/register`      | Rejestracja użytkownika       |
| POST   | `/api/auth/login`         | Logowanie i JWT               |
| POST   | `/api/tasks`              | Tworzenie zadania             |
| POST   | `/api/tasks/ai-create`    | Tworzenie z AI                |
| PATCH  | `/api/tasks/:id/ai-close` | Zamykanie przez AI            |
| PATCH  | `/api/tasks/:id/close`    | Kopiowanie `summary`          |
| POST   | `/api/system/openai-key`  | Zapis klucza OpenAI (AES-256) |

---

## 🧱 Backend – struktura folderów

| Folder         | Zawartość                                    |
| -------------- | -------------------------------------------- |
| `controllers/` | Logika wykonawcza dla tras                   |
| `routes/`      | Deklaracja endpointów                        |
| `services/`    | Interfejs AI, embeddingi, klucze             |
| `models/`      | Mongoose schemas                             |
| `middleware/`  | JWT, walidacja, błędy                        |
| `validators/`  | Walidacja danych wejściowych                 |
| `utils/`       | `sendSuccess`, `sendError`, `handleTryCatch` |

---

## 🧩 Dokumentacja

- `docs/controllers.md`
- `docs/routes.md`
- `docs/services.md`
- `docs/validators.md`
- `docs/utils.md`
- `docs/api_spec.md`
- `docs/project_roadmap.md`
- `docs/project_overview.md`
- `docs/backend_overview.md`

---

## 📌 Status projektu

- ✅ AI integracja (tworzenie, ocena, wygładzanie)
- ✅ Rejestracja, logowanie, token JWT
- ✅ Refaktoryzacja backendu
- ✅ Edycja karty zadania (model `editedTask`)
- 🔄 W trakcie: system ról, podgląd podobnych zadań
