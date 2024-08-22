// import { prisma } from "./prisma-client";
import { PrismaPromise } from "@prisma/client";

export type BulkUpdateEntry = {
  id: number | string;
  [key: string]: number | string | boolean | Date;
};
export type BulkUpdateEntries = BulkUpdateEntry[];

export function bulkUpdate(
  prisma: any,
  tableName: string,
  entries: BulkUpdateEntries,
): PrismaPromise<number> {
  if (entries.length === 0) return prisma.$executeRawUnsafe(`SELECT 1;`);

  const fields = Object.keys(entries[0]!).filter((key) => key !== "id");
  const setSql = fields
    .map((field) => `"${field}" = data."${field}"`)
    .join(", ");

  const valuesSql = entries
    .map((entry) => {
      const values = fields.map((field) => {
        const value = entry[field];
        if (typeof value === "string") {
          // Handle strings and escape single quotes
          return `'${value.replace(/'/g, "''")}'`;
        } else if (value instanceof Date) {
          // Convert Date to ISO 8601 string format
          return `'${value.toISOString()}'`;
        } else if (value == null) {
          // Handle null values or undefined
          return `NULL`;
        }
        // Numbers and booleans are used as-is
        return value;
      });

      return `('${entry.id}', ${values.join(", ")})`;
    })
    .join(", ");

  const sql = `
    UPDATE "${tableName}"
    SET ${setSql}
    FROM (VALUES ${valuesSql}) AS data(id, ${fields
      .map((field) => `"${field}"`)
      .join(", ")})
    WHERE "${tableName}".id::text = data.id;
  `;

  return prisma.$executeRawUnsafe(sql);
}
