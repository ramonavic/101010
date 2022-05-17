import DB from '../../../api/db.mjs'

const db = new DB()

export const up = async () => {
    return await db.query(
        `INSERT INTO \`playlist_tracks\` (\`id\`, \`playlist_id\`, \`sequence\`, \`title\`, \`artists\`, \`duration_ms\`) VALUES
        (11, 19, 1, 'Westbound Train', 'Dennis Brown', 182840),
        (12, 19, 2, 'I Was Born A Winner', 'Freddie McGregor', 217800),
        (13, 19, 3, 'Bubbling Telephone (Chalice)', 'Charlie Chaplin', 204973),
        (14, 19, 4, 'All My Loving', 'Prince Buster', 110088),
        (15, 19, 5, 'Jamaica, Jamaica', 'Brigadier Jerry', 185653),
        (16, 20, 1, 'Cogele el Golpe', 'Cachao', 165772),
        (17, 20, 2, 'Yambeque', 'Sonora Ponceña', 383533),
        (18, 20, 3, 'Lluvia con Nieve', 'Mon Rivera', 177680),
        (19, 20, 4, 'Con Salsa Y Sabor', 'Menique, Charlie Palmieri', 250946),
        (20, 20, 5, 'Loco', 'Héctor Lavoe', 325213),
        (21, 20, 6, 'Pedro Navaja', 'Rubén Blades', 443480),
        (22, 20, 7, 'Anacaona', 'Cheo Feliciano', 253253),
        (23, 20, 8, 'Tu Loco Loco Y Yo Tranquilo', 'Roberto Roena Y Su Apollo Sound', 199049),
        (24, 20, 9, 'Cali Pachanguero', 'Grupo Niche', 310360),
        (25, 20, 10, 'Todo Tiene Su Final', 'Willie Colón, Héctor Lavoe', 303373),
        (26, 20, 11, 'En Barranquilla Me Quedo', 'Joe Arroyo, La Verdad', 312480),
        (27, 21, 1, 'Paracaídas', 'Junglelyd', 489503),
        (28, 21, 2, 'El Pajarito - Ben Matik instrumental edit', 'Pernett, Ben Matik', 237818),
        (29, 21, 3, 'Manos', 'Mente Orgánica', 310401),
        (30, 21, 4, 'Oruro', 'Mente Orgánica', 504973),
        (31, 21, 5, 'Añoranza en las Yungas', 'Lagartijeando', 338630),
        (32, 21, 6, 'La Frontera', 'Lagartijeando, Minuk', 340616),
        (33, 21, 7, 'Amaotayku Avelino Sinani - El Buho Remix', 'Luzmila Carpio, El Búho', 328028),
        (34, 21, 8, 'Chan Chara', 'JAJA', 301485),
        (35, 21, 9, 'Zaka', 'JAJA', 464175),
        (36, 21, 10, 'Absolut', 'El Búho, Tremor', 251598),
        (37, 21, 11, 'Jardines', 'Chancha Via Circuito, Lido Pimienta', 286000),
        (38, 21, 12, 'Cumbia Sobre el Mar - El Búho Remix', 'Quantic, El Búho', 312914),
        (39, 21, 13, 'Semilla Solar', 'Huaira', 285611),
        (40, 21, 14, 'Paruma (feat. History of Colour)', 'Nicola Cruz, History of Colour', 258000),
        (41, 21, 15, 'Alegría', 'Chancha Via Circuito', 300048),
        (42, 21, 16, 'Los Pastores', 'Chancha Via Circuito', 183669),
        (43, 21, 17, 'Añoranza en las Yungas - El Búho Remix', 'Lagartijeando, El Búho', 258875),
        (44, 21, 18, 'Tokwaj', 'Nación Ekeko', 226017),
        (45, 21, 19, 'El Hijo del Altiplano', 'Nación Ekeko', 345766),
        (46, 22, 1, 'Como Noide', 'Chancha Via Circuito, Miriam García', 277546),
        (47, 22, 2, 'Beat Cari', 'CERO39', 332142),
        (48, 22, 3, 'Mangüeiro', 'Baiuca, Aliboria', 288308),
        (49, 22, 4, 'Ilaló - Baiuca Remix', 'Chancha Via Circuito, Mateo Kingman, Baiuca', 291181),
        (50, 22, 5, 'Otun (feat. Nidia Gongora)', 'Montoya, Nidia Gongora', 205252),
        (51, 22, 6, 'Coge el Paso', 'La Payara, La Perla', 296625),
        (52, 22, 7, 'Aima', 'Nicola Cruz', 308813),
        (53, 22, 8, 'Obatala - Nicola Cruz Remix', 'Sabo, Nicola Cruz', 387026),
        (54, 22, 9, 'Melancolía', 'Sinego, Ácido Pantera', 222366),
        (55, 22, 10, 'Liberta', 'Omeria', 439315),
        (56, 22, 11, 'Sr. Tigre - French Braids Rework', 'YoSoyMatt, Eva de Marce, French Braids', 212621),
        (69, 3, 1, 'Pideme la Luna', 'Los Mirlos', 193093),
        (70, 3, 2, 'La Subienda', 'Gabriel Romero', 271880),
        (71, 3, 3, 'Cumbia Pa Gozar', 'Los Ángeles Azules', 207830),
        (72, 3, 4, 'Las Brujas', 'La Sonora Dinamita', 274830),
        (73, 3, 5, 'Estoy como nunca', 'Eliades Ochoa', 301600),
        (74, 3, 6, 'Borracho la Embarré', 'Juan Carlos Hurtado', 185706),
        (75, 3, 7, 'Traicionera', 'Pastor Lopez', 205893),
        (76, 3, 8, 'El Ciclón', 'La Sonora Dinamita, Rodolfo Aicardi', 229680),
        (77, 3, 9, 'Tiene Espinas El Rosal', 'Grupo Cañaveral De Humberto Pabón', 237960),
        (78, 3, 10, 'Sabor a Mí', 'Eydie Gormé, Los Panchos', 168400),
        (79, 3, 11, 'El Hombre Que Más Te Amó', 'Vicente Fernández', 196520),
        (80, 3, 12, 'En Tu Pelo', 'Javier Solís', 180133);
        
        INSERT INTO \`playlists\` (\`id\`, \`name\`, \`image\`, \`description\`, \`created_at\`, \`deleted_at\`, \`spotify_id\`) VALUES
            (3, 'Latin Cowboys', 'https://i.scdn.co/image/ab67616d0000b2736a96b8de34afe8654a45b4b3', '', '2022-03-06 17:11:54', NULL, '5urIPJGo5orQDSMMIHnFHk'),
            (20, 'Salsa por Siempre', 'https://mosaic.scdn.co/640/ab67616d0000b273955b96065a4cf24947183071ab67616d0000b273c6af0dce19ed3d2feed86568ab67616d0000b273f49a0a8d039542e54aa3a10aab67616d0000b273faf76be372a3894a0def9490', '', '2022-04-27 06:37:44', NULL, '7yNHPf8jEXdkfa9hJw7BU6'),
            (21, 'The Andes Expedition', 'https://i.scdn.co/image/ab67706c0000bebbbe54ba5ca004701958382500', 'test ', '2022-04-27 06:38:42', NULL, '3lliTvfrs7iJ6Bz4SXIe5J'),
            (22, 'Andean Nights', 'https://i.scdn.co/image/ab67706c0000bebb4a1dd558ce40733f86119990', '', '2022-05-02 03:51:56', NULL, '4dTghZ2r0K9VQNaUrlsWTl');
            
        INSERT INTO \`playlists_tags\` (\`playlist_id\`, \`tag_id\`) VALUES
        (2, 1),
        (2, 2),
        (2, 4),
        (2, 5),
        (3, 1),
        (3, 2),
        (3, 4),
        (5, 3),
        (6, 1),
        (6, 4),
        (20, 1),
        (20, 4);
        
        INSERT INTO \`tags\` (\`id\`, \`name\`, \`created_at\`, \`is_theme\`) VALUES
        (1, 'latino', '2022-03-20 21:23:41', 1),
        (2, 'electronic', '2022-03-20 21:23:41', 0),
        (3, 'chillings', '2022-03-20 21:23:41', 0),
        (4, 'groovy', '2022-03-20 21:23:42', 0),
        (5, 'mystique', '2022-03-20 21:25:08', 0),
        (44, 'party mode', '2022-05-02 03:49:37', 0);`
    )
}