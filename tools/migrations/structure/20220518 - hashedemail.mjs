import DB from '../../../api/db.mjs'

const db = new DB()

export const up = () => {
    db.query(`ALTER TABLE \`db\`.\`users\` CHANGE \`hashed_email\` \`hashed_email\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;`)
}