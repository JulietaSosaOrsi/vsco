import mysql from 'serverless-mysql';

// Configuramos la conexión a la base de datos usando variables de entorno
const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || 'Desconocido';
  
  try {
    // Registramos el clic
    await db.query('INSERT INTO vsco_clicks (user_agent) VALUES (?)', [userAgent]);
    // Limpiamos la conexión para no saturar el servidor MySQL
    await db.end();
  } catch (error) {
    // Si falla la BD, imprimimos el error pero no detenemos la ejecución
    console.error('Error al guardar en DB:', error);
  } finally {
    // Redirección invisible e instantánea a tu perfil
    res.redirect(302, 'https://vsco.co/vscojulyy');
  }
}