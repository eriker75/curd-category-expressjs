// Importamos las herramientas de Express
import express from 'express';
import mongoose from 'mongoose';

// Creamos una nueva aplicación Express
const app = express();

// Configuramos la capacidad de recibir body
app.use(express.json())

// Conectamos a la base de datos MongoDB
const connectionString = 'mongodb://localhost:27117/cat-database';
mongoose.connect(connectionString);

// Creamos el modelo de categoría
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  }
});

// Creamos la colección de categorías
const CategoryModel = mongoose.model('Category', CategorySchema);

// Creamos las rutas
app.get('/categories', async (req, res) => {
  // Obtenemos todas las categorías
  try{
    const categories = await CategoryModel.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: 'error finding categories'});
  }
});

app.post('/categories', (req, res) => {
  // Creamos una nueva categoría
  console.log(req.body)
  const category = new CategoryModel({
    name: req.body.name,
  });
  try{
    category.save()
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: 'error creating category'});
  }
});

app.get('/categories/:id', async (req, res) => {
  // Obtenemos la categoría por ID
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      throw new Error('Category not found');
    }

    res.json(category);
  } catch (error) {
    res.send(error);
  }
});

app.put('/categories/:id', async (req, res) => {
  // Obtenemos la categoría por ID
  try {
    const category = await CategoryModel.findById(req.params.id);
    console.log(category.id)
    if (!category) {
      throw new Error('Category not found');
    }

    // Actualizamos la categoría
    category.name = req.body.name;
    await category.save();

    res.json(category);
  } catch (error) {
    res.send(error);
  }
});

app.delete('/categories/:id', async (req, res) => {
  // Obtenemos la categoría por ID
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      throw new Error('Category not found');
    }

    // Eliminamos la categoría
    await category.deleteOne()

    res.json(category);
  } catch (error) {
    res.send(error);
  }
});

// Iniciamos el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});