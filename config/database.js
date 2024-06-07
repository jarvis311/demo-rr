import Sequelize  from "sequelize";
import dotenv from 'dotenv'
dotenv.config()

// Create the first database connection
const RC = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
  host:  process.env.DB_HOST_RC,
  port:process.env.DB_PORT_RC,
  username:process.env.DB_USER_RC,
  password:process.env.DB_PASSWORD_RC,
  database: process.env.DB_DATABASE_RC,
});

  // Create the second database connection
  const Vehicle = new Sequelize({
    dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
    host:  process.env.DB_HOST_VEHICLE,
    port:process.env.DB_PORT_VEHICLE,
    username:process.env.DB_USER_VEHICLE,
    password:process.env.DB_PASSWORD_VEHICLE,
    database: process.env.DB_DATABASE_VEHICLE,
});

const WebRC = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
  host:  process.env.DB_HOST_WEB_SCRAPPING,
  port:process.env.DB_PORT_WEB_SCRAPPING,
  username:process.env.DB_USERNAME_WEB_SCRAPPING,
  password:process.env.DB_PASSWORD_WEB_SCRAPPING,
  database: process.env.DB_DATABASE_WEB_SCRAPPING,
});

export default { RC, Vehicle, WebRC}
