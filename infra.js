//core
const { Client } = require('pg');
const connection = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'CERBERUS',
};

//bd functions
async function list_keyrings() {
  const client = new Client(connection);
  await client.connect();
  const res = await client.query('SELECT * FROM keyrings');
  const keyringlist = res.rows;
  await client.end();
  return keyringlist;
};

async function clean_keyrings() {
  const client = new Client(connection);
  await client.connect();
  await client.query('DELETE FROM keyrings');
  await client.end();
}
  
async function clean_gates() {
  const client = new Client(connection);
  await client.connect();
  await client.query('DELETE FROM gates');
  await client.end();
}
  
async function insert_keyring(keyring) {
  const client = new Client(connection);
  await client.connect();
  const query = 'INSERT INTO keyrings ("user", keys) VALUES ($1, $2) RETURNING *';
  const values = [keyring.user, keyring.keys];
  const res = await client.query(query, values);
  const insertedKeyring = res.rows[0];
  await client.end();
  return insertedKeyring;
}
  
async function insert_gate(gate) {
    const client = new Client(connection);
    await client.connect();
    const query = 'INSERT INTO gates (name) VALUES ($1) RETURNING *';
    const values = [gate.name];
    const res = await client.query(query, values);
    const insertedGate = res.rows[0];
    await client.end();
    return insertedGate;
}
  
async function findbyID(id) {
    const client = new Client(connection);
    await client.connect();
    const query = 'SELECT * FROM keyrings WHERE id = $1';
    const res = await client.query(query, [id]);
    if (res.rows.length === 0) {
      await client.end();
      throw {
        number: 404,
        msg: 'Error: Keyring not found!'
      };
    }
    const foundKeyring = res.rows[0];
    await client.end();
    return foundKeyring;
}
  
async function findbyCODE(code) {
    const client = new Client(connection);
    await client.connect();
    const query = 'SELECT * FROM gates WHERE code = $1';
    const res = await client.query(query, [code]);
    if (res.rows.length === 0) {
      await client.end();
      throw {
        number: 404,
        msg: 'Error: Gate not found!'
      };
    }
    const foundGate = res.rows[0];
    await client.end();
    return foundGate;
}
  
async function update_keyring(id, newkeyring) {
    const client = new Client(connection);
    await client.connect();
    const query = 'UPDATE keyrings SET "user" = $1, keys = $2 WHERE id = $3 RETURNING *';
    const values = [newkeyring.user, newkeyring.keys, id];
    const res = await client.query(query, values);
    if (res.rows.length === 0) {
      await client.end();
      throw {
        number: 404,
        msg: 'Error: Keyring not found!'
      };
    }
    const updatedKeyring = res.rows[0];
    await client.end();
    return updatedKeyring;
}
  
async function update_gate(code, newgate) {
    const client = new Client(connection);
    await client.connect();
    const query = 'UPDATE gates SET name = $1 WHERE code = $2 RETURNING *';
    const values = [newgate.name, code];
    const res = await client.query(query, values);
    if (res.rows.length === 0) {
      await client.end();
      throw {
        number: 404,
        msg: 'Error: Gate not found!'
      };
    }
    const updatedGate = res.rows[0];
    await client.end();
    return updatedGate;
}
  
async function delete_keyring(id) {
    const client = new Client(connection);
    await client.connect();
    const query = 'DELETE FROM keyrings WHERE id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    if (res.rows.length === 0) {
      await client.end();
      throw {
        number: 404,
        msg: 'Error: Keyring not found!'
      };
    }
    const deletedKeyring = res.rows[0];
    await client.end();
    return deletedKeyring;
}
  
async function delete_gate(code) {
    const client = new Client(connection);
    await client.connect();
    const query = 'DELETE FROM gates WHERE code = $1 RETURNING *';
    const res = await client.query(query, [code]);
    if (res.rows.length === 0) {
      await client.end();
      throw {
        number: 404,
        msg: 'Error: Gate not found!'
      };
    }
    const deletedGate = res.rows[0];
    await client.end();
    return deletedGate;
}
  
async function access(keyringid, gateid) {
    const client = new Client(connection);
    await client.connect();
    const keyringQuery = 'SELECT * FROM keyrings WHERE id = $1';
    const keyringRes = await client.query(keyringQuery, [keyringid]);
    if (keyringRes.rows.length === 0) {
      await client.end();
      throw {
        number: 404,
        msg: 'Error: Keyring not found!'
      };
    }
    const keyring = keyringRes.rows[0];
    for (const key of keyring.keys) {
      const gateQuery = 'SELECT * FROM gates WHERE code = $1';
      const gateRes = await client.query(gateQuery, [gateid]);
      if (gateRes.rows.length > 0) {
        const gate = gateRes.rows[0];
        if (key === gate.code) {
          await client.end();
          return 'Access granted!';
        }
      }
    }
    await client.end();
    return 'Access denied!';
}

async function list_gates() {
    const client = new Client(connection);
    await client.connect();
    const res = await client.query('SELECT * FROM gates');
    const gateList = res.rows;
    await client.end();
    return gateList;
}


module.exports = {
    list_gates, 
    clean_keyrings,
    clean_gates,
    list_keyrings,
    insert_keyring,
    insert_gate,
    findbyID,
    findbyCODE,
    update_keyring,
    update_gate,
    delete_keyring,
    delete_gate,
    access
};