// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require ('cors');

const connectDB = require('./config/db');

// Wczytaj zmienne środowiskowe z pliku .env
dotenv.config();

//Tworzy instancję aplikacji Express – to ona będzie nasłuchiwać, obsługiwać middleware i endpointy
const app = express();

//pozwala Reactowi (działającemu np. na porcie 3000) wysyłać żądania do API
app.use(cors());
//umożliwia obsługę JSON-a w requestach (req.body)
app.use(express.json());


//prosty test, czy serwer działa – można otworzyć w przeglądarce lub curl/postmanem
const { sendSuccess } = require ('./utils/responseHandler');
app.get('/', (req, res) => {
    sendSuccess(res, 'AI Task App backend is running!');
});

//import i użycie tras. Oddziela logikę rejestracji/logowania od pliku głównego. Oddzielenie odpowiedzialności (Separation of Concerns)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

//Połączenie z MongoDB i uruchomienie serwera
connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
});
