const express = require('express');
const cors = require('cors');

const { save, load} = require('./endpoints/database');

const app = express();
const port = process.env.PORT || 6160;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is on.');
});

app.post('/api/save', save);
app.get('/api/load', load);

//start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});