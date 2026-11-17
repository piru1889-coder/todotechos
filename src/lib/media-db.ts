import "server-only";
import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

declare global {
  var todoTechosMysqlPool: Pool | undefined;
}

export function isMysqlConfigured() {
  return Boolean(
    process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_DATABASE &&
    process.env.MYSQL_PASSWORD !== undefined,
  );
}

export function getMysqlPool() {
  if (!isMysqlConfigured()) {
    throw new Error("Falta configurar MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD y MYSQL_DATABASE.");
  }

  if (!globalThis.todoTechosMysqlPool) {
    globalThis.todoTechosMysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      charset: "utf8mb4",
    });
  }

  return globalThis.todoTechosMysqlPool;
}

let schemaReady: Promise<void> | undefined;
let workplaceSchemaReady: Promise<void> | undefined;

export async function ensureMediaTable() {
  if (!schemaReady) {
    schemaReady = getMysqlPool()
      .execute(`
        CREATE TABLE IF NOT EXISTS site_media (
          slot_key VARCHAR(190) NOT NULL PRIMARY KEY,
          content_type VARCHAR(32) NOT NULL,
          file_data LONGBLOB NOT NULL,
          fit_mode ENUM('cover', 'contain') NOT NULL DEFAULT 'cover',
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `)
      .then(async () => {
        const [columns] = await getMysqlPool().query<RowDataPacket[]>(
          "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'site_media' AND COLUMN_NAME = 'fit_mode'",
        );
        if (columns.length === 0) {
          await getMysqlPool().execute(
            "ALTER TABLE site_media ADD COLUMN fit_mode ENUM('cover', 'contain') NOT NULL DEFAULT 'cover' AFTER file_data",
          );
          await getMysqlPool().execute(
            "UPDATE site_media SET fit_mode = 'contain' WHERE slot_key IN ('brand.logo', 'hero.poster') OR slot_key LIKE 'client.%'",
          );
        }
        const [fileColumns] = await getMysqlPool().query<RowDataPacket[]>(
          "SELECT DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'site_media' AND COLUMN_NAME = 'file_data'",
        );
        if (fileColumns[0]?.DATA_TYPE !== "longblob") {
          await getMysqlPool().execute(
            "ALTER TABLE site_media MODIFY file_data LONGBLOB NOT NULL",
          );
        }
      })
      .then(() => undefined)
      .catch((error: unknown) => {
        schemaReady = undefined;
        throw error;
      });
  }

  await schemaReady;
}

export async function ensureWorkplaceTable() {
  if (!workplaceSchemaReady) {
    workplaceSchemaReady = getMysqlPool()
      .execute(`
        CREATE TABLE IF NOT EXISTS site_workplaces (
          workplace_key VARCHAR(80) NOT NULL PRIMARY KEY,
          title VARCHAR(190) NOT NULL,
          location VARCHAR(255) NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `)
      .then(() => undefined)
      .catch((error: unknown) => {
        workplaceSchemaReady = undefined;
        throw error;
      });
  }

  await workplaceSchemaReady;
}
