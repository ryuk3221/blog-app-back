import express from "express";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(JSON.stringify({status: "Success", message: "Hello world"}));
});

app.post('/auth/login', (req, res) => {

  res.json(req.body);
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server has been starting');
});