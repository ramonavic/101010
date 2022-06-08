import DB from '../../../api/db.mjs'

const db = new DB()

export const up = () => {
  return db.query(
    `CREATE TABLE \`playlist_tracks\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`playlist_id\` int DEFAULT NULL,
            \`sequence\` int DEFAULT NULL,
            \`title\` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            \`artists\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            \`duration_ms\` int DEFAULT NULL,
            PRIMARY KEY (\`id\`)
          ) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
          
          CREATE TABLE \`playlists\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`name\` varchar(50) NOT NULL,
            \`image\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
            \`description\` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
            \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`deleted_at\` timestamp NULL DEFAULT NULL,
            \`spotify_id\` varchar(50) NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`Spotify_id\` (\`spotify_id\`) USING BTREE
          ) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
          
          CREATE TABLE \`playlists_tags\` (
            \`playlist_id\` int NOT NULL,
            \`tag_id\` int NOT NULL,
            UNIQUE KEY \`playlist and tags\` (\`playlist_id\`,\`tag_id\`) USING BTREE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
          
          CREATE TABLE \`tags\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`name\` varchar(30) NOT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`is_theme\` tinyint(1) NOT NULL DEFAULT '0',
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`name\` (\`name\`) USING BTREE
          ) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
          
          CREATE TABLE \`users\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`name\` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            \`spotify_id\` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            \`email\` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
            \`refresh_token\` varchar(450) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`image\` tinytext,
            \`deleted_at\` timestamp NULL DEFAULT NULL,
            \`mail_subscription\` tinyint(1) NOT NULL DEFAULT '0',
            \`is_admin\` tinyint(1) NOT NULL DEFAULT '0',
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`email\` (\`email\`) USING BTREE
          ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
          `
  )
}

export const down = () => {
  // We're not gonna drop all these tables :/ 
}