const { error } = require('console');
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
const deleteUser = async (id) => {
	try {
		const users = await loadUsers();
		const newUsers = users.filter((el) => el.id !== id);
		saveUsers(newUsers);
		console.log('user Successfully deleted');
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
				data.cash = (Number(el.cash) + Number(data.cash)).toString();
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

//* update credit
const updateCredit = async (id, data) => {
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

//! withdraw
const withdraw = async (id, data) => {
	try {
		const users = await loadUsers();
		const editUsers = users.map((el) => {
			if (el.id === id) {
				if (el.cash - data.cash >= -el.credit) {
					data.cash = (el.cash - data.cash).toString();
					return { ...el, ...data };
				} else {
					throw error(
						`you dont have enough money, max withdraw: ${
							Number(el.credit) + Number(el.cash)
						}`
					);
				}
			} else {
				return el;
			}
		});
		saveUsers(editUsers);
		return 'Withdrawd';
	} catch (error) {
		console.log(error);
	}
};

// transfer
const transfer = async (data) => {
	const { fromId, toId, cash } = data;
	try {
		const users = await loadUsers();
		users.map(async (el) => {
			if (el.id === fromId) {
				const withdrawSucceed = await withdraw(fromId, {
					cash: cash.toString(),
				});
				if (withdrawSucceed) {
					depositCash(toId, { cash: cash.toString() });
				}
			}
			return console.log('transfer failed');
		});
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
	deleteUser,
	depositCash,
	updateCredit,
	withdraw,
	transfer,
};
