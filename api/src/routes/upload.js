const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const pool = require("../db/connection");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

function formatCUIT(cuit) {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

function formatDate(dateStr) {
  const clean = dateStr.trim().replace(/\s+/g, "");
  const [day, month, year] = clean.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function isValidDate(yyyyMMdd) {
  return /^\d{4}-\d{2}-\d{2}$/.test(yyyyMMdd);
}

router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No se subió ningún archivo." });
  }

  const results = [];

  fs.createReadStream(file.path)
    .pipe(csv({ separator: ";", mapHeaders: ({ header }) => header.trim() }))
    .on("data", (data) => {
      try {
        if (
          !data["CUIT Cuenta"] ||
          !data["Fecha Valor"] ||
          !data["Fecha"] ||
          !data["Monto"]
        ) {
          return;
        }

        const rawCUIT = data["CUIT Cuenta"].replace(/\D/g, "");
        const CUIT_CUIL = formatCUIT(rawCUIT);
        const Fecha_valor = formatDate(data["Fecha Valor"]);
        const Fecha_devengado = formatDate(data["Fecha"]);

        if (!isValidDate(Fecha_valor) || !isValidDate(Fecha_devengado)) {
          return;
        }

        const montoStr = data["Monto"].replace(/\./g, "").replace(",", ".");
        const Monto = parseFloat(montoStr);
        const Numero_op =
          data["N° de Comprobante"] === "-" ? null : data["N° de Comprobante"];

        if (isNaN(Monto)) return;

        results.push({
          CUIT_CUIL,
          Fecha_valor,
          Fecha_devengado,
          Monto,
          Numero_op,
          Id_tpo_transaccion: 4,
          Id_sector: 4,
        });
      } catch (error) {
        console.error("Error al procesar una fila:", error);
      }
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          return res
            .status(400)
            .json({ message: "No se encontraron datos válidos." });
        }

        // CUITs válidos
        const [entes] = await pool.query("SELECT CUIT_CUIL FROM Entes");
        const validCUITs = new Set(entes.map((e) => e.CUIT_CUIL));

        const validRows = [];
        const cuitInvalidos = new Set();

        for (const item of results) {
          if (validCUITs.has(item.CUIT_CUIL)) {
            validRows.push([
              item.CUIT_CUIL,
              item.Fecha_valor,
              item.Fecha_devengado,
              item.Monto,
              item.Numero_op,
              item.Id_tpo_transaccion,
              item.Id_sector,
            ]);
          } else {
            cuitInvalidos.add(item.CUIT_CUIL);
          }
        }

        let insertedCount = 0;
        let failedCount = 0;

        if (validRows.length > 0) {
          try {
            const [insertResult] = await pool.query(
              `INSERT INTO Transaccion 
              (CUIT_CUIL, Fecha_valor, Fecha_devengado, Monto, Numero_op, Id_tpo_transaccion, Id_sector)
              VALUES ?`,
              [validRows]
            );
            insertedCount = validRows.length;
          } catch (insertError) {
            console.error("Error al hacer inserción masiva:", insertError);
            failedCount = validRows.length;
          }
        }

        fs.unlinkSync(file.path);

        return res.status(200).json({
          message: "Archivo procesado.",
          insertados: insertedCount,
          fallidos: failedCount,
          cuitInvalidos: Array.from(cuitInvalidos),
        });
      } catch (err) {
        console.error("Error al procesar el archivo:", err);
        res.status(500).json({ message: "Error al procesar el archivo." });
      }
    });
});

module.exports = router;

/* const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const pool = require("../db/connection");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

function formatCUIT(cuit) {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

function formatDate(dateStr) {
  const clean = dateStr.trim().replace(/\s+/g, "");
  const [day, month, year] = clean.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function isValidDate(yyyyMMdd) {
  return /^\d{4}-\d{2}-\d{2}$/.test(yyyyMMdd);
}

router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No se subió ningún archivo." });
  }

  const results = [];

  fs.createReadStream(file.path)
    .pipe(csv({ separator: ";", mapHeaders: ({ header }) => header.trim() }))
    .on("data", (data) => {
      try {
        if (
          !data["CUIT Cuenta"] ||
          !data["Fecha Valor"] ||
          !data["Fecha"] ||
          !data["Monto"]
        ) {
          console.warn("Fila con datos incompletos:", data);
          return;
        }

        const rawCUIT = data["CUIT Cuenta"].replace(/\D/g, "");
        const CUIT_CUIL = formatCUIT(rawCUIT);
        const Fecha_valor = formatDate(data["Fecha Valor"]);
        const Fecha_devengado = formatDate(data["Fecha"]);

        if (!isValidDate(Fecha_valor) || !isValidDate(Fecha_devengado)) {
          console.warn(
            "Fechas con formato inválido:",
            Fecha_valor,
            Fecha_devengado
          );
          return;
        }

        const montoStr = data["Monto"].replace(/\./g, "").replace(",", ".");
        const Monto = parseFloat(montoStr);
        const Numero_op =
          data["N° de Comprobante"] === "-" ? null : data["N° de Comprobante"];

        if (isNaN(Monto)) throw new Error("Monto inválido");

        results.push({
          CUIT_CUIL,
          Fecha_valor,
          Fecha_devengado,
          Monto,
          Numero_op,
          Id_tpo_transaccion: 4,
          Id_sector: 4,
        });
      } catch (error) {
        console.error("Error al procesar una fila:", error);
      }
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          return res
            .status(400)
            .json({ message: "No se encontraron datos válidos." });
        }

        // Obtener CUITs válidos de la tabla Entes
        const [entes] = await pool.query("SELECT CUIT_CUIL FROM Entes");
        const validCUITs = new Set(entes.map((e) => e.CUIT_CUIL));

        let insertedCount = 0;
        let failedCount = 0;
        const unknownCUITs = new Set();

        for (const item of results) {
          if (!validCUITs.has(item.CUIT_CUIL)) {
            if (!unknownCUITs.has(item.CUIT_CUIL)) {
              console.warn(`CUIT no encontrado en Entes: ${item.CUIT_CUIL}`);
              unknownCUITs.add(item.CUIT_CUIL);
            }
            failedCount++;
            continue;
          }

          try {
            await pool.query(
              `INSERT INTO Transaccion 
                (CUIT_CUIL, Fecha_valor, Fecha_devengado, Monto, Numero_op, Id_tpo_transaccion, Id_sector)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                item.CUIT_CUIL,
                item.Fecha_valor,
                item.Fecha_devengado,
                item.Monto,
                item.Numero_op,
                item.Id_tpo_transaccion,
                item.Id_sector,
              ]
            );
            insertedCount++;
          } catch (insertError) {
            console.error("Error al insertar fila:", insertError);
            failedCount++;
          }
        }

        fs.unlinkSync(file.path);

        return res.status(200).json({
          message: "Archivo procesado.",
          insertados: insertedCount,
          fallidos: failedCount,
          cuitInvalidos: Array.from(unknownCUITs),
        });
      } catch (err) {
        console.error("Error al procesar el archivo:", err);
        res.status(500).json({ message: "Error al procesar el archivo." });
      }
    });
});

module.exports = router; */
