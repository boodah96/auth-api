'use strict';
// Error Routes
const errorHandler = require('./error-handlers/500.js');
const notFoundHandler = require('./error-handlers/404.js');
//requir
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');



const v1Routes = require('./api-server/routes/v1.js');
const v2Routes = require('./api-server/routes/v2.js');
const authRoutes = require('./auth-server/routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
app.use(authRoutes);

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
    server: app,
    start: port => {

        app.listen(port, () => console.log(`UP on PORT ${port}`));
    },
};