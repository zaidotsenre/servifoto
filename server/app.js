require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const imageRoutes = require('./routes/imageRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const relationshipRoutes = require('./routes/relationshipRoutes');
const { sequelize } = require('./models');
const cors = require('cors');
const restrictToSameHost = require('./middleware/restrictToSameHost');



const app = express();

app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
if(process.env.NODE_ENV != 'development') {
    app.use(restrictToSameHost);
}



// Routes
app.use('/api', imageRoutes);
app.use('/api', collectionRoutes);
app.use('/api', relationshipRoutes);

// Sync Sequelize and start the server
sequelize.sync().then(() => {
    console.log('Database synced');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
