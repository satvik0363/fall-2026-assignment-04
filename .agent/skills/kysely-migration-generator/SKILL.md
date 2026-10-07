---
name: kysely-migration-generator
description: Translates a Mermaid ERD into a type-safe Kysely migration. Use when asked to generate a Kysely migration, database migration, or SQL schema from an ERD or Mermaid diagram.
---

# Kysely Migration Generator
Reads a Mermaid `erDiagram` and writes a Kysely migration matching the structure of `src/db/migrations/001_initial_schema.ts`.

## Translation Rules
- **Entities to tables:** convert each entity name to a snake_case table name (`USERS` to `users`).
- **PK:** `.addColumn('id', 'serial', (col) => col.primaryKey())`. Use `uuid` with `.defaultTo(sql\`gen_random_uuid()\`)` only if the ERD types the key as `uuid`.
- **FK:** `.addColumn('user_id', 'integer', (col) => col.references('users.id').onDelete('cascade').notNull())`.
- **Other columns:** map Mermaid types to Kysely types (`int` to `integer`, `varchar` to `varchar(255)`, `datetime` to `timestamp`). 
- **Cardinalities:**
  - `A ||--o{ B` (one-to-many): `B` gets a FK column to `A`.
  - `A ||--o| B` (one-to-one): `B`'s FK column also gets `.unique()`.

## Output
- Write to `src/db/migrations/<timestamp>_<migration_name>.ts`, with a sortable timestamp.
- Begin with `import {Kysely, sql} from 'kysely';`.
- Export both `up(db: Kysely<any>): Promise<void>` and `down(db: Kysely<any>): Promise<void>`.
- In `up`, create parent tables before the tables that reference them.
- In `down`, drop tables in order of children before parents, using `await db.schema.dropTable('<name>').execute();`.