# Word Imposter 🎭

**Word Imposter** is een multiplayer party game geïnspireerd door *Spyfall* en *Among Us*.  

De regels zijn simpel: meerdere spelers kennen een geheim woord, behalve **de imposter**. Elke speler moet een hint geven door een woord te typen. De imposter probeert mee te doen zonder op te vallen. Na een aantal rondes stemmen spelers wie zij verdenken. Ontmasker de imposter, of win door onopvallend te blijven!  

---

## 🚀 Features
- Lobby aanmaken met korte code  
- Spelers joinen via code en naam  
- Multiplayer communicatie via REST + WebSockets  
- Tijdelijke sessies (geen database nodig)  
- React Native app in TypeScript (Expo)  
- Spring Boot backend in Docker  

---

## 🛠️ Tech Stack
- **Frontend:** React Native (TypeScript, Expo)  
- **Backend:** Java Spring Boot (REST API + STOMP WebSocket)  
- **Infra:** Docker + docker-compose  

---

## 📂 Projectstructuur
```
word-imposter/
├── backend/      # Spring Boot backend (Java 17)
├── mobile/       # React Native app (TypeScript, Expo)
└── docker-compose.yml
```

---

## ⚙️ Installatie

### Backend starten
```bash
docker-compose up --build
```
De backend draait daarna op `http://localhost:8080`.

### Mobile app starten
```bash
cd mobile
npm install
npx expo start
```
Scan de QR-code met de **Expo Go app** (iOS/Android) of gebruik een emulator.  
Let op: vervang `localhost` in je app door je **LAN IP** of gebruik **ngrok** bij testen op mobiel.  

---

## 🔗 API Endpoints
- `POST /lobby` → nieuwe lobby maken → `{ code: "ABC123" }`  
- `POST /lobby/{code}/join` → joinen met naam  

### WebSocket
- Connect: `ws://<server>:8080/ws`  
- Stuur berichten: `/app/send`  
- Ontvang updates: `/topic/messages`  

---

## 📌 Roadmap
- ✅ MVP: lobby + join + WebSocket test  
- ⏳ Ronde logica met timer  
- ⏳ Stemronde + eliminatie  
- ⏳ Woordenlijst integratie  
- ⏳ UI verbeteringen en animaties  
- ⏳ Deployment op VPS/Cloud  

---

## 🤝 Contributie
Feedback en pull requests zijn welkom.  
Voor grotere wijzigingen: open eerst een issue om het idee te bespreken.  

---
