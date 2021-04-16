const express = require('express');
const app = express();
const {
	getUsers,
	createUser,
	deleteUser,
	getUserId,
	depositCash,
	updateCredit,
	withdraw,
	transfer,
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

//! deposit
app.put('/api/users/deposit/:id', (req, res) => {
	const { id } = req.params;
	const data = req.query;
	if (data.cash && data.cash > 0) {
		depositCash(id, data);
		res.status(200).send('cash updated successfully');
	} else {
		res.status(400).send('not a valid params, check again');
	}
});

//! credit
app.put('/api/users/credit/:id', (req, res) => {
	const { id } = req.params;
	const data = req.query;
	if (data.credit && data.credit > 0) {
		updateCredit(id, data);
		res.status(200).send('credit updated successfully');
	} else {
		res.status(400).send('not a valid params, check again');
	}
});

//! withdraw
app.put('/api/users/withdraw/:id', (req, res) => {
	const { id } = req.params;
	const data = req.query;
	if (data.cash && data.cash > 0) {
		withdraw(id, data);
		res.status(200).send('withdraw completed');
	} else {
		res.status(400).send('not a valid params, check again');
	}
});

// transfer
app.put('/api/users/transfer/', (req, res) => {
	const { fromId, toId, cash } = req.query;
	const data = req.query;
	if (fromId && toId && cash && cash > 0) {
		transfer(data);
		res.status(200).send('transfer completed');
	} else {
		res.status(400).send('not a valid params, check again');
	}
});

//! delete existing user by id
app.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;
	deleteUser(id);
	res.status(200).send('User deleted successfully');
});

app.listen(PORT, () => {
	console.log('listening to port: ' + PORT);
});
