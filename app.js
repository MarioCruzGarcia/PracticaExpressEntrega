const express = require("express");
const app = express(); // Inicializa la aplicación Express

const mysql = require("mysql");

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // Configura el middleware para parsear solicitudes con formato JSON
app.use(bodyParser.urlencoded({ extended: true })); // Configura el middleware para parsear solicitudes con datos codificados en URL

const connection = mysql.createConnection({
  // Crea la conexión a la base de datos MySQL
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "t2p2",
});

connection.connect((err) => {
  // Conecta a la base de datos MySQL
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

const queryAsync = (sql, values) => {
  // Función para realizar consultas a la base de datos de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

app.get("/vuelos/create", function (req, res) {
  // Ruta para mostrar el formulario de creación de vuelos
  let dir = __dirname + "/public/templates/vuelos/create.html";
  res.sendFile(dir, (err) => {
    if (err) {
      res.status(404);
    }
  });
});

app.post("/vuelos/save", (req, res) => {
  // Ruta para guardar un nuevo vuelo en la base de datos
  let query =
    "INSERT INTO vuelos (numero_vuelo, aerolinea, origen, destino, fecha_salida, hora_salida, fecha_llegada, hora_llegada) VALUES (?, ?, ?, ?, ?,?,?,?);";
  connection.query(
    query,
    [
      req.body.numero_vuelo,
      req.body.aerolinea,
      req.body.origen,
      req.body.destino,
      req.body.fecha_salida,
      req.body.hora_salida,
      req.body.fecha_llegada,
      req.body.hora_llegada,
    ],
    function (err) {
      if (err) {
        res.status(500).send("Error al crear el vuelo");
      }
    }
  )
  res.redirect(302, "/vuelos/index"); // Redirecciona a la página de índice de vuelos
});

app.put("/vuelos/update/:id", (req, res) => {
  // Ruta para actualizar un vuelo existente en la base de datos
  let id = req.params.id;
  let query = `UPDATE vuelos SET numero_vuelo = '${req.body.numero_vuelo}', aerolinea = '${req.body.aerolinea}', origen = '${req.body.origen}', destino = '${req.body.destino}', fecha_salida = '${req.body.fecha_salida}', hora_salida = '${req.body.hora_salida}', fecha_llegada = '${req.body.fecha_llegada}', hora_llegada = '${req.body.hora_llegada}' WHERE id = ${id}`;
  connection.query(query,[], function (error, results, fields) {
    if (error) {
    } else if(results){
      res.json({message : true});
    }
  });
});

app.get("/vuelos/index", function (req, res) {
  // Ruta para mostrar la página de índice de vuelos
  let dir = __dirname + "/public/templates/vuelos/index.html";
  res.sendFile(dir, (err) => {
    if (err) {
      res.status(err.status);
    }
  });
});

app.get("/vuelos-all", function (req, res) {
  // Ruta para obtener todos los vuelos de la base de datos
  let query = "SELECT * FROM vuelos";
  connection.query(query, [], function (error, results, fields) {
    if (error) {
      console.log(error);
    }
    if (results) {
      res.json(results);
    }
  });
});

app.get("/vuelos/edit/:id", function (req, res) {
  // Ruta para mostrar el formulario de edición de un vuelo
  let dir = __dirname + "/public/templates/vuelos/edit.html";
  res.sendFile(dir, (err) => {
    if (err) {
      res.status(err.status);
    }
  });
});

app.get("/vuelos/:id", function (req, res) {
  // Ruta para obtener un vuelo específico de la base de datos por su ID
  let id = req.params.id;
  let query = "SELECT * FROM vuelos WHERE id = ?";
  connection.query(query, [id], function (err, row) {
    if (err) {
      res.status(500).send("Error: " + err.message);
    }
    if (row == "undefined") {
      res.status(200).send("No hay datos");
    } else {
      res.json(row);
    }
  });
});

app.delete(`/vuelos/delete/:id`, (req, res) => {
  // Ruta para eliminar un vuelo de la base de datos por su ID
  let id = req.params.id;
  let query = "DELETE FROM vuelos WHERE id = ?";
  connection.query(query, [id], function (err) {
    if (err) {
      res.status(500).send("Error: " + err.message);
    }
    res.status(200).send("Eliminado correctamente");
  });
});

const port = 3000;
app.listen(port, () => {
  // Inicia el servidor en el puerto especificado
  console.log(`Servidor: http://localhost:${port}`);
});
