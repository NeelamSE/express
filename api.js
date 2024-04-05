const express = require('express');
const app = express();
const JWT = require("jsonwebtoken");

const array = [];
app.use(express.json());

app.post('/signUp', (req, res) => {
    const data = req.body;
    let dataPresent = false;
    array.forEach((variable) => {
        if (variable.email === data.email) {
            // Assigning password instead of checking equality
            variable.password = data.password;
            dataPresent = true;
        }
    });
    if (!dataPresent) {
        array.push(data);
    }
    
    res.json({ valid: true });
});

app.post("/login", (req, res) => {
    const data = req.body;
    array.forEach((a) => {
        if (data.email === a.email && data.password === a.password) { // Fixed comparison
            const token = JWT.sign({ "email": data.email }, "neelam123@##", { expiresIn: "2h" });
            res.json({ token: token });
            return;
        }
    });
    res.json({ token: "" });
});

app.post("/verify", (req, res) => {
    const data = req.body;
    const token = data.token;
    if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
    }
    JWT.verify(token, "neelam123@##", (err, decode) => {
        if (err) {
            console.log("verification failed", err);
            res.status(401).json(err);
        } else {
            console.log(decode);
            res.json(decode);
        }
    });
});

app.listen(3000);
