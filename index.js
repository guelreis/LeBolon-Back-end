const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

app.get('/mesas', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mesas');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar mesas:', err);  // Mostra o erro no console
    res.status(500).json({ error: 'Erro ao buscar mesas' });
  }
});

app.post('/mesas', async (req, res) => {
  const { numero } = req.body;
  try {
    const [result] = await db.query('INSERT INTO mesas (numero) VALUES (?)', [numero]);
    res.status(201).json({ id: result.insertId, numero });
  } catch (err) {
    console.error('Erro ao inserir mesa:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/mesas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('SELECT FROM mesas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mesa não encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar mesa:', err);
    res.status(500).json({ error: 'Erro ao buscar mesa' });
  }
});



app.delete('/mesas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM mesas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mesa não encontrada' });
    }

    res.json({ message: 'Mesa excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir mesa:', err);
    res.status(500).json({ error: 'Erro ao excluir mesa' });
  }
});


app.get('/garcons', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM garcons');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar garcons' });
  }
});

app.delete('/garcons/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM garcons WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Garçons não encontrada' });
    }

    res.json({ message: 'Garçom Demitido com sucesso' });
  } catch (err) {
    console.error('Erro ao Demitir o Garçom:', err);
    res.status(500).json({ error: 'Erro ao Demitir o Garçom' });
  }
});



app.post('/garcons', async (req, res) => {
  const { nome } = req.body;
  try {
    const [result] = await db.query('INSERT INTO garcons (nome) VALUES (?)', [nome]);
    res.status(201).json({ id: result.insertId, nome });
  } catch (err) {
    console.error('Erro ao inserir mesa:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/reservas', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
});

app.post('/reservas', async (req, res) => {
  const {
    data,
    hora,
    mesa_id,
    qtd_pessoas,
    nome_responsavel,
    garcom_id // opcional
  } = req.body;

  if (!data || !hora || !mesa_id || !qtd_pessoas || !nome_responsavel) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO reservas
      (data, hora, mesa_id, qtd_pessoas, nome_responsavel, garcom_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [data, hora, mesa_id, qtd_pessoas, nome_responsavel, garcom_id || null]
    );

    res.status(201).json({
      id: result.insertId,
      data,
      hora,
      mesa_id,
      qtd_pessoas,
      nome_responsavel,
      garcom_id: garcom_id || null,
      status: 'reservada'
    });

  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
});

app.put('/reservas/:id', async (req, res) => {
  const { id } = req.params;
  const {
    data,
    hora,
    mesa_id,
    qtd_pessoas,
    nome_responsavel,
    garcom_id // opcional
  } = req.body;

  if (!data || !hora || !mesa_id || !qtd_pessoas || !nome_responsavel) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const [result] = await db.query(
      `UPDATE reservas SET
        data = ?,
        hora = ?,
        mesa_id = ?,
        qtd_pessoas = ?,
        nome_responsavel = ?,
        garcom_id = ?
      WHERE id = ?`,
      [data, hora, mesa_id, qtd_pessoas, nome_responsavel, garcom_id || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    res.json({
      id,
      data,
      hora,
      mesa_id,
      qtd_pessoas,
      nome_responsavel,
      garcom_id: garcom_id || null,
      status: 'atualizada'
    });

  } catch (err) {
    console.error('Erro ao atualizar reserva:', err);
    res.status(500).json({ error: 'Erro ao atualizar reserva' });
  }
});


app.delete('/reservas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM reservas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    res.json({ message: 'Reserva cancelada com sucesso' });
  } catch (err) {
    console.error('Erro ao cancelar a Reserva:', err);
    res.status(500).json({ error: 'Erro ao cancelar Reserva' });
  }
});



app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
