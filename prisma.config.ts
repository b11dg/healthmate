import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        // CLI schema operations (db push/migrate) need the direct, non-pooled
        // connection — PgBouncer transaction-mode pooling on DATABASE_URL
        // hangs on the advisory locks/prepared statements these need.
        url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
    },
});
