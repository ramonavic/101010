import DB from '../../api/db.mjs'
const db = new DB()

export const validateOrCreateMigrationsTable = async () => {
    const result = await db.query(`SELECT 1 FROM db_migrations LIMIT 1`)
    console.log(result)
    if (!result || result.code === 'ER_NO_SUCH_TABLE') {
        db.query(`CREATE TABLE \`db_migrations\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`name\` varchar(60) NOT NULL,
            \`type\` varchar(10) NOT NULL,
            \`executed_at\` datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
          ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`)
    }
}

export const checkIfExecuted = async (type, name) => {
    return await db.query(
        `SELECT executed_at FROM db_migrations 
        WHERE type = ? 
            AND name = ?
        LIMIT 1`,
        [type, name]
    )
}

export const updateMigration = async (name, type) => {
    return await db.query(
        `INSERT INTO db_migrations (name, type)
        VALUES (?, ?)`,
        [
            name,
            type
        ]
    )
}

