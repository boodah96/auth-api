'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./error-handlers/500.js');
const notFoundHandler = require('./error-handlers/404.js');
const foodRouter = require('./routes/food.js');
const clothRouter = require('./routes/clothes.js');
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


//Routs
app.use('/api/v1/food/', foodRouter);
app.use('/api/v1/clothes/', clothRouter);

//Error
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
    server: app,
    start: (port) => {
        const PORT = port || 3030;
        app.listen(PORT, () => console.log(`listening to PORT ${PORT}`));
    }
};