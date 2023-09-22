import DatabaseConnection from "./../../model/models";
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
    try {
      const { data } = req.body;
      await db.connect();
      var results = await db.query(
        "SELECT COUNT(*) AS count FROM tabelaTotal WHERE idUsuario = ?",
        [data[0]["idUsuario"]]
      );
      if (results.length > 0) {
        await db.query(
          `DELETE FROM tabelaTotal WHERE idUsuario = '${data[0]["idUsuario"]}' `
        );
      }
      for (let index = 0; index < data.length; index++) {
        await db.query(
          "INSERT INTO tabelaTotal ( dataTimeUpload, idUsuario, nomeUsuario, nome, idade, atendimento, sexo, distancia) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            data[index]["dataTimeUpload"],
            data[index]["idUsuario"],
            data[index]["nomeUsuario"],
            data[index]["nome"],
            data[index]["idade"],
            data[index]["atendimento"],
            data[index]["sexo"],
            data[index]["distancia"],
          ]
        );
      }

      res.status(200).json({ data: "insert feito com sucesso" });
    } catch (error) {
      console.error("Error executing SQL query:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await db.close();
    }
  } else {
    res.status(500).json({ error: "Metodo não permitido" });
  }
}