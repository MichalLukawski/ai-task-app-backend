# Changelog

## [0.0.10] – 2025-04-13

### Added

- Nowy endpoint `PATCH /api/tasks/:id/close` do zamykania zadań poprzez kopiowanie `summary` z innego zadania (`sourceTaskId`)
- Całkowite rozdzielenie logiki zamykania zadań:
  - `/ai-close` – tylko z AI, wymaga `summary`, opcjonalne `force`
  - `/close` – tylko kopiowanie, wymaga `sourceTaskId`, `summary` niedozwolone
- Walidator `validateCloseTaskSimpleInput` do `/close`
- Walidator `validateUpdateTaskInput` do `PATCH /:id` (częściowa edycja)
- Aktualizacja dokumentacji:
  - `controllers.md`, `routes.md`, `api_spec.md`, `validators.md`
  - `project_overview.md`, `project_roadmap.md`, `backend_overview.md`
  - `services.md`, `ai_integration.md`, `README.md`, `README_backend.md`

### Changed

- Zamiana metody `POST` na `PATCH` w endpointach zamykających (`/close`, `/ai-close`) i edytujących (`/:id`)
- `validateTaskInput` używany tylko przy tworzeniu (`POST`), nie przy edycji
- `summary` może być przesyłany tylko w `/ai-close` i zawsze przechodzi ocenę AI
- Użytkownik może wymusić użycie słabego podsumowania (`force: true`)

### Removed

- Obsługa `sourceTaskId` w `/ai-close` – przeniesiona wyłącznie do `/close`
- Możliwość wp

## [0.0.9] – 2025-04-12

### Added

- Endpoint `POST /api/tasks/:id/ai-close` jako nowy sposób zamykania zadań:
  - Obsługa własnych podsumowań (`summary`) ocenianych przez AI
  - Wymuszenie użycia słabego opisu przez pole `force: true`
  - Wygładzanie opisu przez `improveSummary`
  - Możliwość skopiowania `summary` z innego zadania (`sourceTaskId`)
- Moduł `aiSummaryService.js` – logika warunkowa dla `ai-close`
- Nowe funkcje GPT (function calling):
  - `assess_summary` – ocena jakości opisu użytkownika
  - `improve_summary` – wygładzanie języka bez zmiany sensu
- Nowy walidator `validateCloseTaskInput`
- Aktualizacja dokumentacji:
  - `api_spec.md`, `routes.md`, `controllers.md`
  - `project_overview.md`, `project_roadmap.md`, `backend_overview.md`
  - `services.md`, `ai_integration.md`, `validators.md`, `README.md`, `README_backend.md`, `db_schema.md`

### Changed

- Zmieniono logikę zamykania zadań:
  - `summary` nie może być generowane automatycznie z `similarTasks`
  - AI nie podejmuje decyzji – zawsze wymagana inicjatywa użytkownika
- Zmiana trasy zamykania z `/close` na `/ai-close`
- AI nie działa, jeśli użytkownik nie poda opisu lub `sourceTaskId`

### Removed

- Obsługa `summary` generowanego automatycznie z `similarTasks` (zrezygnowano celowo)
- Zależność od decyzji AI w procesie zamykania – kontrola wyłącznie po stronie użytkownika

## [0.0.8] – 2025-04-11

### Added

- Wdrożenie GPT function calling (`gptService.function.js`) z pełną strukturą `title`, `description`, `dueDate`, `difficulty`
- Moduł `embeddingService.js`:
  - Generowanie embeddingów (`text-embedding-3-small`)
  - Porównywanie embeddingów z zamkniętymi zadaniami (cosine similarity)
  - Przypisywanie podobnych zadań (`similarTasks`) – top 5 z wynikiem >= 0.75
- Asynchroniczne wywołanie `generateAndAttachEmbedding()` po zapisaniu zadania
- Obsługa pola `difficulty` generowanego przez GPT
- Obsługa pola `embedding` i `similarTasks` w modelu `Task`
- Dokumentacja funkcji AI i podobieństw (`project_roadmap.md`, `ai_integration.md`)
- Ujednolicone formaty dokumentacji: `utils.md`, `services.md`, `models.md`, `controllers.md`, `backend_overview.md`, `project_overview.md`, `README.md`, `README (root).md`
- Nowy sposób dokumentowania (tylko stan aktualny, zmiany w changelogu)

### Changed

- Usunięto fallback i logger (`logGPTFallback`) z `gptService.js`
- `createWithAI` korzysta z `gptService.function.js` i nie zapisuje już `notes`
- `taskModel.js` – usunięto `tags`, `priority`, `source`, dodano `difficulty`
- Rozdzielono `gptService.js` na `gptService.function.js` (function calling)
- Aktualizacja `db_schema.md` zgodnie z nowym modelem `Task`
- Refaktoryzacja dokumentacji do aktualnego stanu projektu

### Removed

- `logGPTFallback()` i plik `logs/gpt_fallbacks.log`
- Fallback JSON (`try/catch + notes`) – zastąpiony przez function calling
- Wzmianki o `notes` z flow backendu (pozostaje opcjonalne w modelu)

---

## [0.0.7] – 2025-04-10

### Added

- Obsługa odpowiedzi GPT w formacie JSON przy tworzeniu zadania (`/api/tasks/ai-create`)
- Parsowanie odpowiedzi GPT i fallback do `notes` w przypadku niepoprawnego JSON
- Funkcja `logGPTFallback()` zapisująca przypadki błędnego JSON do `logs/gpt_fallbacks.log`
- Uwzględnienie bieżącej daty w promcie do GPT, aby poprawnie rozpoznawać daty `dueDate`
- Dokumentacja dla `logGPTFallback` w `utils.md`
- Planowana integracja z modelem `text-embedding-3-small` do porównywania podobnych zadań (wstępna analiza semantyczna)
- Zaplanowana funkcja oceny trudności zadania (`difficulty: 1–5`) – obecnie w fazie koncepcyjnej

### Changed

- Zmodyfikowano `gptService.js`:
  - prompt GPT generuje czysty JSON bez markdown
  - obsługa wyjątku `JSON.parse()` z fallbackiem
- Zmodyfikowano `createWithAI` w `taskController.js` – integracja z nową wersją GPT API
- Uaktualniono dokumentację: `ai_integration.md`, `project_roadmap.md`, `services.md`, `backend_overview.md`, `utils.md`

## [0.0.6] – 2025-04-10

### Added

- Endpoint `POST /api/tasks/ai-create` do tworzenia zadań z pomocą GPT-4o
- Moduł `gptService.js` do komunikacji z OpenAI API
- Plik konfiguracyjny `prettier.config.js`
- Automatyczne formatowanie kodu backendu za pomocą Prettiera

### Changed

- Plik `taskController.js`: dodanie metody `createWithAI`
- Plik `taskRoutes.js`: dodanie trasy `/api/tasks/ai-create`
- Plik `package.json`: aktualizacja wersji, zależności (`openai`)
- Formatowanie plików backendu (zgodność z Prettier)

## [0.0.5] – 2025-04-10

### Dodano

- Pole `dueDate` (termin wykonania) do modelu `Task.js`
- Walidację pola `dueDate` jako daty ISO (`isISO8601`) w `taskValidator.js`
- Middleware `validate.js` do obsługi błędów walidacji
- Nową dokumentację: `validators.md`, `validators_UPDATED.md`
- Rozszerzenia dokumentów: `db_schema.md`, `api_spec.md`, `routes.md`, `project_overview.md`, `project_roadmap.md`

### Zmieniono

- Walidator `validateTaskInput` obsługuje teraz także `dueDate`
- Trasy `POST` i `PUT /api/tasks` obsługują dodatkowe pole `dueDate`
- Zaktualizowano `README.md` backendu o informacje o walidacji i dueDate
- Podniesiono wersję `package.json` do `0.0.5`

## [0.0.4] – 2025-04-09

### Added

- Endpoint `POST /api/auth/login` z JWT i walidacją hasła (`bcrypt`)
- Model `Task.js` i pełna obsługa zadań (`taskController`, `taskRoutes`)
- Middleware `auth.js` do ochrony tras na podstawie tokena JWT
- Plik `utils/responseHandler.js` z funkcjami `sendSuccess` i `sendError`
- Dokumentacja techniczna: `utils.md`, `middleware.md`
- Walidacja statusów i autoryzacja użytkownika (`ownerId`)
- Nowa dokumentacja: zaktualizowane `project_overview.md`, `project_roadmap.md`, `api_spec.md`, `backend_overview.md`

### Changed

- Kod `authController.js` uzupełniony o logikę logowania
- Struktura backendu gotowa do testów i dalszej rozbudowy (AI, frontend)

### Fixed

- Literówki w `process.env.JWT_SECRET`
- Duplikaty tras w `server.js`

## [0.0.3] – 2025-04-09

### Added

- Pełna dokumentacja Markdown w folderze `docs/`
- README.md dla backendu i frontendu z linkami do dokumentacji
- Opis integracji z GPT (ai_integration.md)
- Roadmapa funkcji i rozwoju (project_roadmap.md)

### Changed

- Zmieniona struktura repozytorium: backend i frontend jako submoduły
- `.gitmodules` dodany do repo głównego
- Wersja backendu ustawiona na 0.0.3
