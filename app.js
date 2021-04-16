const express = require('express');
const app = express();
const {
	getUsers,
	createUser,
	deleteMovie,
	getUserId,
	depositCash,
} = require('./utils');

const PORT = 3000;

app.use(express.json());

//! get all users
app.get('/api/users', async (req, res) => {
	const users = await getUsers();
	res.status(200).send(users);
});

//! get user by id
app.get('/api/users/:id', async (req, res) => {
	const { id } = req.params;
	const user = await getUserId(id);
	res.status(200).send(user);
});

//! add user
app.post('/api/users', (req, res) => {
	createUser(req.body);
	res.status(201).send('User uploaded successfully');
});

// depositing cash to user by id and amount of cash
app.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const data = req.query;
	depositCash(id, data);
	res.status(200).send('cash updated successfully');
});

// delete existing movie by id
app.delete('/api/movies/:id', (req, res) => {
	const { id } = req.params;
	deleteMovie(id);
	res.status(200).send('Movie deleted successfully');
});

app.listen(PORT, () => {
	console.log('listening to port: ' + PORT);
});
