import pg from 'pg';

const { Client } = pg;

export const handler = async (event, context) => {
  const userAgent = event.headers['user-agent'] || 'Desconocido';
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Apagamos la paranoia de SSL para Aiven
  });

  try {
    await client.connect();
    // Guardamos el clic usando la sintaxis de Postgres ($1)
    await client.query('INSERT INTO vsco_clicks (user_agent) VALUES ($1)', [userAgent]);
  } catch (error) {
    console.error('Error al guardar en DB:', error);
  } finally {
    await client.end();
  }

  return {
    statusCode: 302,
    headers: {
      Location: 'https://vsco.co/vscojulyy', // <-- ¡PON TU USUARIO DE VSCO AQUÍ!
    },
  };
};
