const fs = require('fs');
const util = require('util');

const readFileContent = util.promisify(fs.readFile);
const path = __dirname + '/db/users.json';

//* read
const getUsers = () => {
	try {
		return loadUsers();
	} catch (err) {
		console.log(err);
	}
};

const getUserId = async (id) => {
	try {
		const users = await loadUsers();
		const user = users.filter((el) => el.id === id);
		return user;
	} catch (err) {
		console.log(err);
	}
};

//* create
const createUser = async (user) => {
	try {
		const users = await loadUsers();
		users.push(user);
		saveUsers(users);
	} catch (error) {
		console.log(error);
	}
};

//* delete
const deleteMovie = async (id) => {
	try {
		const movies = await loadUsers();
		const newMovies = movies.filter((el) => el.id !== id);
		saveMovies(newMovies);
		console.log('Movie Successfully deleted');
	} catch (error) {
		console.log(error);
	}
};

//* deposit cash
const depositCash = async (id, data) => {
	try {
		const users = await loadUsers();
		const editUsers = users.map((el) => {
			if (el.id === id) {
				return { ...el, ...data };
			} else {
				return el;
			}
		});
		saveUsers(editUsers);
	} catch (error) {
		console.log(error);
	}
};

//! LOAD
const loadUsers = async () => {
	try {
		const dataBuffer = await readFileContent(path);
		const dataJSON = dataBuffer.toString();
		return JSON.parse(dataJSON);
	} catch (error) {
		return [];
	}
};

//! SAVE
const saveUsers = (users) => {
	const dataJSON = JSON.stringify(users);
	fs.writeFile(path, dataJSON, (err) => {
		if (err) throw err;
		console.log('the files saved');
	});
};

module.exports = {
	getUsers,
	getUserId,
	createUser,
	deleteMovie,
	depositCash,
};
