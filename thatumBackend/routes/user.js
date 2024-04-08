const router = require("express").Router();
const { query } = require("express");
const dbConfig = require("../config/app.conf");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: dbConfig.development.host,
  user: dbConfig.development.username,
  port: dbConfig.development.port,
  password: dbConfig.development.password,
  database: dbConfig.development.database,
});

connection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
  } else {
    console.log("Connected to database");
  }
});
router.get("/test", (req, res) => {
  res.send("Test route");
});

router.get("/", async (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send(`Error retrieving users: ${err}`);
    } else {
      res.status(200).send(results);
    }
  });
});

router.get("/:id", async (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE user_id =?`,
    [req.params.id],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .json({ error: true, message: `Error to find a user with id` });
      } else if (results.length === 0) {
        res.status(404).json({ error: true, message: "User not found" });
      } else {
        res
          .status(200)
          .json({ error: false, message: "user id selected", data: results });
      }
    }
  );
});

router.post("/", async (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE name = ? and lastname = ?`,
    [req.body.name, req.body.lastname],
    (err, results) => {
      if (results.length > 0) {
        res.status(409).json({ error: true, message: `User already exists` });
      } else {
        connection.query(
          `INSERT INTO users (name, lastname , age , gender , birthdate) VALUES (?, ? ,? ,? ,?)`,
          [
            req.body.name,
            req.body.lastname,
            req.body.age,
            req.body.gender,
            req.body.birthdate,
          ],
          (err, results) => {
            if (err) {
              res
                .status(500)
                .json({ error: true, message: `Error creating user` });
            } else {
              res
                .status(201)
                .json({ error: false, message: "User created successfully" });
            }
          }
        );
      }
    }
  );
});

router.put("/:id", async (req, res) => {
  queryString = `UPDATE users SET `;
  let values = [];
  if (req.body.name) {
    queryString += `name = ? ,`;
    values.push(req.body.name);
  }
  if (req.body.lastname) {
    queryString += `lastname = ? ,`;
    values.push(req.body.lastname);
  }
  if (req.body.age) {
    queryString += `age = ? ,`;
    values.push(req.body.age);
  }
  if (req.body.birthdate) {
    queryString += `birthdate = ? ,`;
    values.push(req.body.birthdate);
  }
  queryString = queryString.slice(0, -1);
  queryString += ` WHERE user_id = ?`;
  values.push(req.params.id);
  connection.query(queryString, values, (err, results) => {
    if (err) {
      res.status(500).json({ error: true, message: `Error updating user` });
    } else {
      res
        .status(200)
        .json({ error: false, message: "User updated successfully" });
    }
  });
});

router.delete("/:id", async (req, res) => {
  connection.query(
    `DELETE FROM users WHERE user_id =?`,
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: true, message: `Error deleting user` });
      } else {
        res
          .status(200)
          .json({ error: false, message: "User deleted successfully" });
      }
    }
  );
});

module.exports = router;
