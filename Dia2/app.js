
const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());

const { connectDB, getDB, disconnectDB } = require('./db');
const PORT = process.env.PORT

// CREATE
app.post('/campers', async (req, res) => {
  try {
    const errors = validateCamper(req.body, { partial: false });
    if (errors.length) return res.status(400).json({ errors });

    const db = getDB();
    const now = new Date();
    const camper = {
      nombre: req.body.nombre.trim(),
      edad: req.body.edad,
      email: req.body.email ?? null,
      activo: req.body.activo ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('campers').insertOne(camper);
    res.status(201).json({ insertedId: result.insertedId, camper });
  } catch (err) {
    console.error('POST /campers error:', err);
    res.status(500).json({ error: 'Error creando camper' });
  }
});


// READ
app.get('/campers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'id inválido' });

    const db = getDB();
    const camper = await db.collection('campers').findOne({ _id: new ObjectId(id) });
    if (!camper) return res.status(404).json({ error: 'camper no encontrado' });

    res.json(camper);
  } catch (err) {
    console.error('GET /campers/:id error:', err);
    res.status(500).json({ error: 'Error obteniendo camper' });
  }
});

// UPDATE 
app.put('/campers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'id inválido' });

    const errors = validateCamper(req.body, { partial: false });
    if (errors.length) return res.status(400).json({ errors });

    const db = getDB();
    const now = new Date();
    const doc = {
      nombre: req.body.nombre.trim(),
      edad: req.body.edad,
      email: req.body.email ?? null,
      activo: req.body.activo ?? true,
      updatedAt: now,
    };

    const result = await db.collection('campers').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: doc },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'camper no encontrado' });
    res.json(result.value);
  } catch (err) {
    console.error('PUT /campers/:id error:', err);
    res.status(500).json({ error: 'Error actualizando camper' });
  }
});



// DELETE
app.delete('/campers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'id inválido' });

    const db = getDB();
    const result = await db.collection('campers').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'camper no encontrado' });

    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /campers/:id error:', err);
    res.status(500).json({ error: 'Error eliminando camper' });
  }
});

// Conección Mongo
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ACTIVOOO 😎 en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ No se pudo conectar a MongoDB:', err);
    process.exit(1);
  });


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ACTIVOOO 😎 en http://localhost:${PORT}`);
});
