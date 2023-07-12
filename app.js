const express = require('express');
const app = express();
const PORT = 3001;
const infra = require('./infra');

app.use(express.json())

//menu
app.get('/', (req, res) => {
    res.json("Hello World!");
});

//Keyring requests
app.get('/keyrings', async (req, res) => {
    try {
      const keyringList = await infra.list_keyrings();
      res.json(keyringList);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
app.get('/keyrings/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const keyring = await infra.findbyID(id);
      res.json(keyring);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
app.post('/keyrings', async (req, res) => {
    const keyring = req.body;
    try {
      const insertedKeyring = await infra.insert_keyring(keyring);
      res.status(201).json(insertedKeyring);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
app.put('/keyrings/:id', async (req, res) => {
    const id = req.params.id;
    const keyring = req.body;
    try {
      const updatedKeyring = await infra.update_keyring(id, keyring);
      res.json(updatedKeyring);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
app.delete('/keyrings/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const deletedKeyring = await infra.delete_keyring(id);
      res.json(deletedKeyring);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
// Gates requests
app.post('/gates', async (req, res) => {
    const gate = req.body;
    try {
      const insertedGate = await infra.insert_gate(gate);
      res.status(201).json(insertedGate);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
app.delete('/gates/:code', async (req, res) => {
    const code = req.params.code;
    try {
      const deletedGate = await infra.delete_gate(code);
      res.json(deletedGate);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
app.get('/gates', async (req, res) => {
    try {
      const gateList = await infra.list_gates();
      res.json(gateList);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
// Access try
app.get('/access/:keyring/:gate', async (req, res) => {
    const keyringid = req.params.keyring;
    const gateid = req.params.gate;
    try {
      const accessResult = await infra.access(keyringid, gateid);
      res.json(accessResult);
    } catch (err) {
      res.status(err.number).json(err);
    }
});
  
app.listen(PORT, () => {
  console.log("Server running on http://localhost:3001")  
});
