import postgres from 'postgres'
import fs from 'fs'
import path from 'path'

// Use session mode connection (port 5432) for DDL operations
const connectionString = process.env.DATABASE_URL!.replace(':6543', ':5432')

const sql = postgres(connectionString)

async function runMigration() {
  try {
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/001_create_crm_tables.sql')
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('Running migration...')

    // Execute the full migration file
    await sql.unsafe(migrationSql)

    console.log('Migration completed successfully!')

    // Verify tables were created
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('contacts', 'projects', 'activity_log')
    `

    console.log('Created tables:', tables.map(t => t.table_name))

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()
