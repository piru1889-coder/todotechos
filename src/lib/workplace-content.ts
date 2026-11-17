import "server-only";
import type { RowDataPacket } from "mysql2";
import { workplaces, type Workplace } from "@/content/workplaces";
import { ensureWorkplaceTable, getMysqlPool } from "@/lib/media-db";

interface WorkplaceRow extends RowDataPacket {
  workplace_key: string;
  title: string;
  location: string;
}

export async function getWorkplacesWithOverrides(): Promise<Workplace[]> {
  await ensureWorkplaceTable();
  const [rows] = await getMysqlPool().query<WorkplaceRow[]>(
    "SELECT workplace_key, title, location FROM site_workplaces",
  );
  const overrides = new Map(rows.map((row) => [row.workplace_key, row]));

  return workplaces.map((workplace) => {
    const saved = overrides.get(workplace.key);
    return saved ? { ...workplace, title: saved.title, location: saved.location } : workplace;
  });
}

export async function saveWorkplaceDetails(key: string, title: string, location: string) {
  await ensureWorkplaceTable();
  await getMysqlPool().execute(
    `INSERT INTO site_workplaces (workplace_key, title, location)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), location = VALUES(location)`,
    [key, title, location],
  );
}
