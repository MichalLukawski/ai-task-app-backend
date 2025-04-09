# AI Task App – Backend

Ten folder zawiera backend aplikacji AI Task App – osobistego asystenta AI do zarządzania zadaniami.  
Zbudowany w oparciu o Express (Node.js) i MongoDB.

## 📦 Technologie

- Node.js + Express
- MongoDB + Mongoose
- JWT (autoryzacja)
- bcrypt (hashowanie haseł)
- dotenv (zmienne środowiskowe)
- modularna architektura kodu

## 📁 Struktura katalogów

```
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── utils/
├── server.js
├── .env.example
└── .gitignore
```

## 🚀 Uruchomienie backendu

1. Skonfiguruj plik `.env` na podstawie `.env.example`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-task-app
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Uruchom serwer:

```bash
node server.js
```

## 🔐 Endpointy (aktualne i planowane)

- `POST /api/auth/register` – rejestracja użytkownika
- `POST /api/auth/login` – (planowane)
- `POST /api/tasks` – (planowane)
- `GET /api/health` – (planowane)
- `POST /api/ai/similar-tasks` – (planowane)

## 📄 Dokumentacja

- [project_overview.md](https://github.com/MichalLukawski/ai_task_app/blob/main/docs/project_overview.md)
- [backend_overview.md](https://github.com/MichalLukawski/ai_task_app/blob/main/docs/backend_overview.md)
- [frontend_overview.md](https://github.com/MichalLukawski/ai_task_app/blob/main/docs/frontend_overview.md)
- [api_spec.md](https://github.com/MichalLukawski/ai_task_app/blob/main/docs/api_spec.md)
- [ai_integration.md](https://github.com/MichalLukawski/ai_task_app/blob/main/docs/ai_integration.md)
- [project_roadmap.md](https://github.com/MichalLukawski/ai_task_app/blob/main/docs/project_roadmap.md)
