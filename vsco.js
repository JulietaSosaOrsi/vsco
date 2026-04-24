import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

export const handler = async (event, context) => {
  // En Netlify, los headers vienen dentro del objeto event
  const userAgent = event.headers['user-agent'] || 'Desconocido';
  
  try {
    await db.query('INSERT INTO vsco_clicks (user_agent) VALUES (?)', [userAgent]);
    await db.end();
  } catch (error) {
    console.error('Error al guardar en DB:', error);
  }

  // En lugar de res.redirect, retornamos una respuesta HTTP 302 manual
  return {
    statusCode: 302,
    headers: {
      Location: 'https://vsco.co/vscojulyy', // Cambia esto por tu usuario
    },
  };
};
