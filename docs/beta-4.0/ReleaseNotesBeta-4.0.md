# Release Notes - eCSB Beta 4.0

## Dodane funkcjonalności biznesowe
- Rejestracja przez maila - dodano zakładanie konta w systemie poprzez potwierdzania rejestracji na podanego maila

<img src="images/after_register.PNG" alt="Ekran po rejestracji" height="200" />

<img src="images/verfication_mail.PNG" alt="Email z tokenem weryfikacyjnym" height="200" />

- Domyślne zasoby do tworzenia gry - administrator w przypadku braku dostępnych zasobów może skorzystać z domyślnych przy tworzeniu sesji gry

<img src="images/default_assets.PNG" alt="Domyślne zasoby" height="150" />

- Zaciąganie przeszłej konfiguracji przy tworzeniu nowej gry - przy tworzeniu nowej sesji gry można wczytać ustawienia dowolnej przeszłej sesji gry (skrócenie czasu tworzenia rozgrywki o 90%)
  
<img src="images/config_entered.PNG" alt="Wybranie przeszłej sesji" height="200" />
  
<img src="images/config_loaded.PNG" alt="Wczytanie przeszłej sesji" height="200" />

- Podgląd wgranych zasobów - szybsza weryfikacja poprawności wgranych zasobów
  
<img src="images/assets_preview.PNG" alt="Podgląd wgranych zasobów" height="200" />

- Walidacja tworzenia gry - każda strona formularza tworzenia gry jest osobno walidowana, by nie dochodziło do błędów przy końcowym wysyłaniu żądania

<img src="images/validation.png" alt="Walidacja tworzenia gry" height="200" />

- Sugestie podczas handlu oraz kooperacji - możliwość poinformowania drugiej strony interakcji o swoim stanie ekwipunku/oczekiwaniach
  
<img src="images/suggestion.PNG" alt="Wysyłanie sugestii" height="300" />
  
<img src="images/view_suggestion.PNG" alt="Odbiór sugestii" height="300" />

- Ponaglanie drugiej strony w handlu i kooperacji - możliwość ponaglenia drugiej strony interakcji, aby szybciej skończyła swoją turę
  
<img src="images/reminder.PNG" alt="Ponaglanie drugiej strony" height="300" />

- Poprawienie logiki tokenów czasu - tokeny odnawiają się niezależnie i po kolei

<img src="images/tokens.PNG" alt="Tokeny czasu" height="100" />

## Dodane funkcjonalności techniczne
- Podbicie wersji bibliotek - zaktualizowanie wersji frameworka KTOR oraz biblioteki od WebSocketów
- Dopracowanie obsługi zerwania połączenia - zastosowanie algorytmu Backoff oraz ponawiania połączenia przy ewentualnym zerwaniu
- Obsługa użytkowników bez roli - odpowiednie informowania użytkownika, jeśli jego akcje nie uzyskały autoryzacji serwera
- Zmiana algorytmu wyszukiwania ścieżki - zmiana z Bidirectional BFS na JPS
- Pozbycie się endpointów typu REST z modułu chat - wysyłanie ekwipunku w wiadomości WebSocket zamiast żądania typu REST
- Przeniesienie logiki lobby do modułu game-init - przeniesienie logiki odpowiedzialnej za dołączenie gracza do gry do modułu odpowiedzialnego za tworzenie gry (game-init) 
