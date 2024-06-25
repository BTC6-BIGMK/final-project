import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("spots").del();

	// Inserts seed entries

	await knex.raw(
		`INSERT INTO spots (spot_id, name, description, location, local_government_code) VALUES 
        (1, '常夜燈', null, ST_MakePoint(136.9672798123269,35.06860432603339),231142),
        (2, '鍾馗様', null, ST_MakePoint(136.9709867265857,35.06657084927808),231142),
        (3, '瓦に山ヨ', null, ST_MakePoint(136.97038256667997,35.06723026834543),231142),
        (4, '駒留め', null, ST_MakePoint(136.96742823585564,35.068486640328175),231142),
        (5, '旧竹谷佐兵衛店', null, ST_MakePoint(136.97203038510355,35.06596471921301),231142),
        (6, 'ガス灯', null, ST_MakePoint(136.96880493707403,35.067881252057916),231142),
        (7, '岡家住宅&浮世絵', null, ST_MakePoint(136.96775504689705,35.06820993164237),231142),
        (8, '竹田庄九郎碑,鈴木金蔵碑', null, ST_MakePoint(136.9709361536767,35.06601823070259),231142),
        (9, '小塚家住宅', null, ST_MakePoint(136.96739921513634,35.0684855149003),231142),
        (10, '有松一里塚', null, ST_MakePoint(136.96662157817323,35.06907054586859),231142),
        (11, '山車車庫', null, ST_MakePoint(136.97220117736617,35.066374001134285),231142),
        (12, 'なまこ壁', null, ST_MakePoint(136.97123862095177,35.0664684082691),231142),
        (13, '祇園寺', null, ST_MakePoint(136.96696220499004,35.068965932723906),231142)
        `
	);
}
