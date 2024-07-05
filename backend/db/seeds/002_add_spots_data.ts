import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("spots").del();

  // Inserts seed entries

  await knex.raw(
    `INSERT INTO spots (spot_id, name, description, location, local_government_code, image_url) VALUES 
        (1, '常夜燈', null, ST_MakePoint(136.9672798123269,35.06860432603339),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (2, '鍾馗様', null, ST_MakePoint(136.9709867265857,35.06657084927808),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (3, '瓦に山ヨ', null, ST_MakePoint(136.97038256667997,35.06723026834543),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (4, '駒留め', null, ST_MakePoint(136.96742823585564,35.068486640328175),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (5, '旧竹谷佐兵衛店', null, ST_MakePoint(136.97203038510355,35.06596471921301),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (6, 'ガス灯', null, ST_MakePoint(136.96880493707403,35.067881252057916),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (7, '岡家住宅&浮世絵', null, ST_MakePoint(136.96775504689705,35.06820993164237),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (8, '竹田庄九郎碑,鈴木金蔵碑', null, ST_MakePoint(136.9709361536767,35.06601823070259),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (9, '小塚家住宅', null, ST_MakePoint(136.96739921513634,35.0684855149003),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (10, '有松一里塚', null, ST_MakePoint(136.96662157817323,35.06907054586859),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (11, '山車車庫', null, ST_MakePoint(136.97220117736617,35.066374001134285),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (12, 'なまこ壁', null, ST_MakePoint(136.97123862095177,35.0664684082691),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (13, '祇園寺', null, ST_MakePoint(136.96696220499004,35.068965932723906),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-7/description.jpeg'),
        (14, '棚橋家住宅', null, ST_MakePoint(136.97094427449932,35.06653268140044),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-14/description.jpeg'),
        (15, '我が家', null, ST_MakePoint(137.188312987738,35.113051266560056),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-14/description.jpeg'),
        (16, '我が家', null, ST_MakePoint(136.99190151422795,34.905028215033795),231142,'https://btc6-final-prj.s3.amazonaws.com/spot-14/description.jpeg')
        `
  );

  await knex("spots").where({ spot_id: 1 }).update({
    description:
      "有松の「山ヨ」の瓦は、絞商（しぼりしょう）であった山田与吉郎家のもので、彼らが所有していた建物にその印が見られます。この瓦に刻まれた「山ヨ」は、山田与吉郎家がかつてこの建物を所有していた名残を示しています。山田与吉郎家は有松絞りで知られる有名な絞商",
  });
  await knex("spots").where({ spot_id: 2 }).update({
    description:
      "有松は絞り染めで有名な地域であり、その文化と融合して鍾馗様の像が町の至る所に見られます。 昔は鬼に睨まれたお家の人は病気になってしまうと言われていたそうで、厄除に、お向かいの家の屋根には『鍾馗さま』を置くという風習がありました。有松ではその習わしがいまでも受け継がれています。",
  });
  await knex("spots").where({ spot_id: 3 }).update({
    description:
      "有松の「山ヨ」の瓦は、絞商（しぼりしょう）であった山田与吉郎家のもので、彼らが所有していた建物にその印が見られます。この瓦に刻まれた「山ヨ」は、山田与吉郎家がかつてこの建物を所有していた名残を示しています。山田与吉郎家は有松絞りで知られる有名な絞商",
  });
  await knex("spots").where({ spot_id: 4 }).update({
    description:
      "昔、街道を旅する人々が連れていた馬をつないでおくために使われていたもの。高い位置は馬用。地面に近い低い場所に付いているものは牛のための留め具",
  });
  await knex("spots").where({ spot_id: 5 }).update({
    description:
      "「有松絞 竹谷佐兵衛店先」は、幕末を代表する浮世絵師歌川広重（初代）が描いた錦絵（にしきえ）（多色摺木版画）で賛も広重による。いわゆる大倍版（おおばいばん）という大きめのサイズである。落款の書体や人物の描き方により、弘化・嘉永年間（1844年から1854年）頃の制作と思われ、画中に「彫竹」（江戸の彫師、横川竹二郎）とあることから、江戸で版木が制作されたことが分かる。なお、当館では所蔵していないが、広重には他に「尾州有松絞店之図 河村弥平店先」がある。",
  });
  await knex("spots").where({ spot_id: 6 }).update({
    description:
      "当時のガス灯設備は今も見られる。緑区有松の竹 田嘉兵衛家には、明治期のガス灯が残っている。有 松にガスが引かれたのは1911年5月で、電気が引か れたのは1912年2月であり 、ガスの方が早かったの である。 また、半田の中埜半六邸にも2個所にガス灯設備 が残っている。半田では、1910年6月に知多瓦斯が開業し、電灯会社が開業するのは1914(大正3)年1月であった。中埜半六 は知多瓦斯の取締役でもあった。それから、金山駅南広場正面には、ガス灯（東邦瓦斯建設）が建てられているので、 帰路、ご覧になって行かれるとよいだろう。",
  });
  await knex("spots").where({ spot_id: 7 }).update({
    description:
      "天明4年（1784）の大火で多くが焼失したが、尾張藩の援助もあり20年ほどで復興を遂げ、切妻造、平入、塗籠造の町家で構成される町並みとなった。明治時代には東海道の往来者が減ったことにより有松絞りは衰退したが、その後新たな意匠や製造法、卸売販売への業態転換などにより販路が拡大し、明治後期から昭和初期に最も栄えた。そして有松は、絞商の豪壮な屋敷構えと、絞りに関わる諸職の町家が混在して建ち並び特色ある町並みを良く残すとして、平成28（2016）年に国が選定する「重要伝統的建造物群保存地区」に選ばれた。",
  });
  await knex("spots").where({ spot_id: 8 }).update({
    description:
      "鈴木金蔵は嵐絞を考案し、絞り染の効率を一気にあげました。更に氏が発案した絞りの技術、技法は枚挙にいとまがありませんでした。絞り中興の祖として、明治39年（1906）遺徳を偲び、当初祇園寺境内に碑が建てられました。",
  });
  await knex("spots").where({ spot_id: 9 }).update({
    description:
      "当住宅は、茶室の付く主屋、表倉、南倉などからなり、重厚広壮な有松の絞問屋の形態をよくとどめており、改造も少なく、建築的にも優れ、歴史的にも町並み景観の上からも貴重な建物です。主屋は、隣家との境に「うだつ」が設けられています。卯建は本来、延焼を食い止めるため、設置されるものですが、それ以上に権力や財力の象徴という意味合いが大きかったと言われています。 かつて有松には、卯建のある家が数十軒あったそうですが、現在は服部家住宅と西町の小塚家住宅の二軒を残すのみとなりました。 建築年:文久2年頃（1862頃） 名古屋市指定有形文化財（1992年）",
  });
  await knex("spots").where({ spot_id: 10 }).update({
    description:
      "「一里塚」は江戸日本橋を起点とし各街道の両側に、一里（4km）の目印となる塚木を植え、行程の目安、休息の場や籠z代・荷物などの運賃計 算の基準になっていました。緑区史によると、有松一里塚の大きさは約 9.1ｍで、松並木から目立つ様に塚頂上に榎を植えたものでしたが、 大正 13 年に国から民地に払い下げられた後に塚が消滅したと記載されています。 有志による再建への強い要望に国土交通省が応え、平成 24 年 3 月 現在地に「有松一里塚」が再現されました。",
  });
  await knex("spots").where({ spot_id: 11 }).update({
    description:
      "有松のお祭りが現在の「山車まつり」の形式になったのは、3輌の山車が明治時代に各町に備えられてからとされています。午前中には東町布袋車、中町唐子車、西町神功皇后車が有松の古い町並みを曳行し、楫方の見せ場の「車切り（しゃぎり）」と呼ばれる山車の方向転換、東海道の山車の擦れ違いやからくり奉納をした後、楫方や囃子方が天満社への総参りを行い、神事をおさめます。夕方からは山車に提灯を取り付け、昼の勇壮な姿から幻想的な姿へと変え、哀愁漂う夜囃子の音色が有松の古い町並みに響き渡りながら夜祭をおさめます。",
  });
  await knex("spots").where({ spot_id: 12 }).update({
    description:
      "江戸末期の建造で広い敷地には、主屋1棟・井戸屋形1棟・客室1棟・門1棟・門長屋1棟・蔵6棟からなる大屋敷。連子格子・なまこ壁・虫籠窓・塗ごめ造り・卯達と当時の防火対策を今に残している有松を代表する",
  });
  await knex("spots").where({ spot_id: 13 }).update({
    description:
      "宝暦5年（1755年）、鳴海にあった猿堂寺を有松に移して「祗園寺」に改号した事から、有松の祗園寺の歴史が始まりました。天満社がいつから祗園寺の境内にあったのかは定かではありませんが、天満社は祗園寺の鎮守として存在していました。寛政年間（1789年）、祗園寺4世文章卍瑞より、祗園寺の後方にある山（天満社の現在の鎮座地）に数千人から捧げられた詩歌文章等を埋納し、天満社を遷座しました。この事から、有松天満社の鎮座する山は「文章嶺（ぶんしょうれい）」または「フミノミネ」と称されるようになりました。",
  });
  await knex("spots").where({ spot_id: 14 }).update({
    description:
      "明治８年（1875）に建造された棚橋家住宅。国登録有形文化財で、元は有松を代表する絞商の建物として建てられたが、昭和８年（1933）からは医院として約50年間使われた。1階に出格子を設けてあり、2階は格子窓が並び、漆喰で塗り込められている。",
  });

  await knex("spots").where({ spot_id: 15 }).update({
    description: "2019年入居",
  });

  await knex("spots").where({ spot_id: 16 }).update({
    description: "ここ！",
  });
}
