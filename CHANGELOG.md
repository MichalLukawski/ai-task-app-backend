# Changelog

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


# Changelog

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