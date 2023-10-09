import DatabaseConnection from "./../../model/models";
require("dotenv").config();
const { performance } = require("perf_hooks");
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  const db = new DatabaseConnection();
  if (req.method === "POST") {
    const startTime = performance.now();
    const { data } = req.body;
    if (data[0]["pass"] == process.env.PASS) {
      try {
        await db.connect();
        console.log(
          "realizendo a verificação se existe dados anteriores do id indicado"
        );
        var results = await db.query(
          "SELECT COUNT(*) AS count FROM tabelaTotal WHERE idUsuario = ?",
          [data[0]["idUsuario"]]
        );
        if (results.length > 0) {
          console.log(
            "verificação realizada e existe dados anteriores do id indicado"
          );
          console.log("INICIANDO o procedimento para dados anteriores");
          await db.query(
            `DELETE FROM tabelaTotal WHERE idUsuario = '${data[0]["idUsuario"]}' `
          );
        }
        //=====================================================================
        // Logs
        console.log(
          "==========================================================="
        );
        console.log(
          "==========================================================="
        );
        console.log(
          "==========================================================="
        );
        console.log(`INICIANDO o carregamento de registro`);
        console.log(`Registros carregados em nome de ${data[0]["idUsuario"]}`);
        console.log(
          `Registros carregados no horario de ${data[0]["dataTimeUpload"]}`
        );
        console.log(`Quantidade totais de registros ${data.length}`);
        console.log(
          "==========================================================="
        );
        //=====================================================================
        // erro timeout // corrigir
        //=====================================================================

        let record = data.map(
          (e) =>
            `('${e["dataTimeUpload"]}' ,'${e["idUsuario"]}' ,'${e["nomeUsuario"]}' ,'${e["nome"]}' ,${e["idade"]} ,'${e["atendimento"]}' ,'${e["sexo"]}' ,'${e["distancia"]}')`
        );
        let itemQuery = record.join(", ");
        let queryStringBuilder =
          "INSERT INTO tabelaTotal ( dataTimeUpload, idUsuario, nomeUsuario, nome, idade, atendimento, sexo, distancia) VALUES " +
          itemQuery;
        //=====================================================================
        // Logs
        //=====================================================================
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        console.log(
          `COMPLETO o carregamento de registro tempo total: ${totalTime} milissegundos`
        );
        console.log(
          "==========================================================="
        );
        console.log(
          "==========================================================="
        );
        console.log(
          "==========================================================="
        );
        await db.query(queryStringBuilder);
        res.status(200).json({ data: true });
      } catch (error) {
        console.error("Error executing SQL query:", error.message);
        res.status(500).json({ data: false });
      } finally {
        await db.close();
      }
    } else {
      res.status(500).json({ data: false });
    }
  } else {
    res.status(500).json({ data: false });
  }
}
