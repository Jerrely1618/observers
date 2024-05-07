const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
const userRoutes = require('./routes/userRoutes');
const storyRoutes = require('./routes/storyRoutes');

app.use(cors());
app.use(bodyParser.json());
app.use(userRoutes);
app.use(storyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
