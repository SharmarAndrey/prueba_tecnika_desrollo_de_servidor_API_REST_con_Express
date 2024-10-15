const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());

const filePath = path.join(__dirname, "users.json");


const formatUserList = (users) => {
	return users.map(user => {
		if (typeof user === "string") {
			// separate name and surname
			const [lastName, firstName] = user.split(", ");
			return {
				name: firstName,
				surnames: lastName
			};
		}
		return user;
	});
};



// route to recive list of users
app.get("/users", (req, res) => {
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			return res.status(500).json({ error: "Error to read tje file" });
		}

		let userList = JSON.parse(data); // parsing of JSON


		//All usert to this format( name: "Name", surnames: "Surname")
		userList.users = formatUserList(userList.users);

		const { name } = req.query;

		if (name) {
			userList.users = userList.users.filter(user => user.name.toLowerCase() === name.toLowerCase());
		}
		const { surnames } = req.query;

		if (surnames) {
			userList.users = userList.users.filter(user => user.surnames.toLowerCase() === surnames.toLowerCase());
		}


		res.status(200).json({ users: userList.users }); //return list of users in JSON format
	});
});

// route for add new User
app.post("/users", (req, res) => {
	const { lastName, firstName } = req.body;

	if (!firstName || !lastName) {
		return res.status(400).json({ error: "Please provide your first and last name." });
	}

	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			return res.status(500).json({ error: "Error reading file" });
		}

		let userList = JSON.parse(data);

		// Format newUser vith camps  "name" and "surnames"
		const newUser = {
			name: firstName,
			surnames: lastName
		};

		// Add newUser to Array
		userList.users.push(newUser);

		// Save JSON with new information to file
		fs.writeFile(filePath, JSON.stringify(userList, null, 2), "utf8", err => {
			if (err) {
				return res.status(500).json({ error: "Error saving file" });
			}

			res.status(200).json({ message: "New user added", users: userList.users });
		});
	});
});

// necesito filtrarlos? Corregir 21.42 
// 1.  query string. https://localhost:3000/users?name=Susana
// 2. ¿Qué método es el adecuado para filtrar los elementos de un array y obtener otro array con los elementos que cumplan cierta condición?


// launch server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`The server is running on port ${PORT}`);
});
