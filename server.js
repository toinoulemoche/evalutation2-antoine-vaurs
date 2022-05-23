const express = require('express');

const app = express();
const port = process.env.PORT || 4001;
app.use(express.json())

// routes will go here

app.post('/', (req, res) => {
	console.log(req.body)
	res.send(req.body);
})

app.get('/taches', (req,res) => {
    res.status(200).json(taches)
})

app.get('/taches/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const tache = taches.find(taches => tache.id === id)
    res.status(200).json(tache)
})

app.post('/taches', (req,res) => {
    taches.push(req.body)
    res.status(200).json(taches)
})

app.post('/taches', (req,res) => {
    taches.push(req.body)
    res.status(200).json(taches)
})

app.listen(port);
console.log('Server started at http://localhost:' + port);
