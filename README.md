# AI Task App – Backend

AI Task App to aplikacja webowa wspierana przez sztuczną inteligencję (GPT), służąca do zarządzania zadaniami technicznymi, zapisywania wiedzy i przeszukiwania historii problemów.

Ten folder zawiera kod backendu aplikacji – oparty na Node.js, Express i MongoDB.

## 🔧 Technologie

- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcrypt
- dotenv + modularna struktura kodu
- CORS

## 📂 Struktura folderów

```
backend/
├── config/           # Połączenie z MongoDB
├── controllers/      # Logika biznesowa
├── models/           # Schematy danych Mongoose
├── routes/           # Endpointy API
├── utils/            # Narzędzia pomocnicze (np. response handler)
├── .env              # Zmienne środowiskowe (nie commitować)
├── .gitignore
└── server.js         # Główna aplikacja Express
```

## 🚀 Jak uruchomić backend lokalnie

1. Zainstaluj zależności:

```bash
npm install
```

2. Utwórz plik `.env` na podstawie `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-task-app
```

3. Uruchom serwer:

```bash
node server.js
```

Serwer będzie nasłuchiwał na porcie `5000`. Możesz sprawdzić jego działanie pod adresem: `http://localhost:5000/`

## ✅ Endpointy

- `POST /api/auth/register` – rejestracja użytkownika
- (Wkrótce) `POST /api/auth/login` – logowanie z JWT
- (Wkrótce) `POST /api/tasks` – tworzenie zadania
- (Wkrótce) `GET /api/tasks` – pobieranie zadań

## 🧠 Cele systemu

- Wspomaganie zapamiętywania i organizacji rozwiązań technicznych
- Przechowywanie wiedzy eksperckiej
- Integracja z GPT do opisu, podsumowania i przeszukiwania zadań

## 📄 Dokumentacja

Pełna dokumentacja znajduje się w pliku:  
`../docs/AI_Task_App_backend_dokumentacja_szczegolowa.docx`
