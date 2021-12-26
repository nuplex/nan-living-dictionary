const express = require('express');
const cors = require('cors');

const { save, saveLessons, load, loadLessons, deleteAll } = require('./endpoints/database');

const app = express();
const port = process.env.PORT || 6160;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is on.');
});

app.post('/api/save', save);
app.post('/api/saveLessons', saveLessons);
app.get('/api/load', load);
app.get('/api/loadLessons', loadLessons);
app.post('/api/delete', deleteAll);


//start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});