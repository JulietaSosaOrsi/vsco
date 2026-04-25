import pg from 'pg';
const { Client } = pg;

export const handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Si recibimos los datos del "escaneo" (POST)
  if (event.httpMethod === "POST") {
    const d = JSON.parse(event.body);
    try {
      await client.connect();
      await client.query(
        `INSERT INTO vsco_clicks (user_agent, resolucion, bateria, idioma, plataforma) 
         VALUES ($1, $2, $3, $4, $5)`,
        [event.headers['user-agent'], d.res, d.bat, d.lang, d.plat]
      );
      return { statusCode: 200, body: "ok" };
    } finally {
      await client.end();
    }
  }

  // Si es el clic inicial, enviamos el script de rastreo invisible
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: `
      <script>
        async function track() {
          const data = {
            res: screen.width + "x" + screen.height,
            lang: navigator.language,
            plat: navigator.platform,
            bat: "N/A"
          };
          
          // Intentamos ver el nivel de batería (muy específico para identificar)
          if (navigator.getBattery) {
            const b = await navigator.getBattery();
            data.bat = (b.level * 100) + "%";
          }

          await fetch('', { method: 'POST', body: JSON.stringify(data) });
          window.location.href = "https://vsco.co/TU_USUARIO";
        }
        track();
      </script>
      <body style="background:white;"></body>
    `
  };
};
