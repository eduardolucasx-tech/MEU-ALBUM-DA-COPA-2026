window.ALBUM_DATA = {
  appName: 'Meu Álbum da Copa',
  version: '1.0.0-clean-mobile',
  total: 994,
  // Ordem de layout ajustada: seleções na ordem do álbum e, ao final, 00 + FWC 01–19 antes da Coca-Cola.
  teams: [
    {group:'A', code:'MEX', name:'México'}, {group:'A', code:'RSA', name:'África do Sul'}, {group:'A', code:'KOR', name:'Coreia do Sul'}, {group:'A', code:'CZE', name:'República Tcheca'},
    {group:'B', code:'CAN', name:'Canadá'}, {group:'B', code:'BIH', name:'Bósnia'}, {group:'B', code:'QAT', name:'Qatar'}, {group:'B', code:'SUI', name:'Suíça'},
    {group:'C', code:'BRA', name:'Brasil'}, {group:'C', code:'MAR', name:'Marrocos'}, {group:'C', code:'HAI', name:'Haiti'}, {group:'C', code:'SCO', name:'Escócia'},
    {group:'D', code:'USA', name:'Estados Unidos'}, {group:'D', code:'PAR', name:'Paraguai'}, {group:'D', code:'AUS', name:'Austrália'}, {group:'D', code:'TUR', name:'Turquia'},
    {group:'E', code:'GER', name:'Alemanha'}, {group:'E', code:'CUW', name:'Curaçao'}, {group:'E', code:'CIV', name:'Costa do Marfim'}, {group:'E', code:'ECU', name:'Equador'},
    {group:'F', code:'NED', name:'Países Baixos'}, {group:'F', code:'JPN', name:'Japão'}, {group:'F', code:'SWE', name:'Suécia'}, {group:'F', code:'TUN', name:'Tunísia'},
    {group:'G', code:'BEL', name:'Bélgica'}, {group:'G', code:'EGY', name:'Egito'}, {group:'G', code:'IRN', name:'Irã'}, {group:'G', code:'NZL', name:'Nova Zelândia'},
    {group:'H', code:'ESP', name:'Espanha'}, {group:'H', code:'CPV', name:'Cabo Verde'}, {group:'H', code:'KSA', name:'Arábia Saudita'}, {group:'H', code:'URU', name:'Uruguai'},
    {group:'I', code:'FRA', name:'França'}, {group:'I', code:'SEN', name:'Senegal'}, {group:'I', code:'IRQ', name:'Iraque'}, {group:'I', code:'NOR', name:'Noruega'},
    {group:'J', code:'ARG', name:'Argentina'}, {group:'J', code:'ALG', name:'Argélia'}, {group:'J', code:'AUT', name:'Áustria'}, {group:'J', code:'JOR', name:'Jordânia'},
    {group:'K', code:'POR', name:'Portugal'}, {group:'K', code:'COD', name:'Congo'}, {group:'K', code:'UZB', name:'Uzbequistão'}, {group:'K', code:'COL', name:'Colômbia'},
    {group:'L', code:'ENG', name:'Inglaterra'}, {group:'L', code:'CRO', name:'Croácia'}, {group:'L', code:'GHA', name:'Gana'}, {group:'L', code:'PAN', name:'Panamá'}
  ],
  specialSections: [
    {group:'EXTRAS', code:'FWC', name:'Figurinhas especiais FWC 01–20', count: 20, start: 1, sectionKey:'FWC-01-20'},
    {group:'EXTRAS', code:'COC', displayCode:'CC', name:'Coca-Cola', count: 14, start: 1, sectionKey:'COC-01-14'}
  ],
  sections: [
    {group:'A', code:'MEX', name:'México', kind:'team'}, {group:'A', code:'RSA', name:'África do Sul', kind:'team'}, {group:'A', code:'KOR', name:'Coreia do Sul', kind:'team'}, {group:'A', code:'CZE', name:'República Tcheca', kind:'team'},
    {group:'B', code:'CAN', name:'Canadá', kind:'team'}, {group:'B', code:'BIH', name:'Bósnia', kind:'team'}, {group:'B', code:'QAT', name:'Qatar', kind:'team'}, {group:'B', code:'SUI', name:'Suíça', kind:'team'},
    {group:'C', code:'BRA', name:'Brasil', kind:'team'}, {group:'C', code:'MAR', name:'Marrocos', kind:'team'}, {group:'C', code:'HAI', name:'Haiti', kind:'team'}, {group:'C', code:'SCO', name:'Escócia', kind:'team'},
    {group:'D', code:'USA', name:'Estados Unidos', kind:'team'}, {group:'D', code:'PAR', name:'Paraguai', kind:'team'}, {group:'D', code:'AUS', name:'Austrália', kind:'team'}, {group:'D', code:'TUR', name:'Turquia', kind:'team'},
    {group:'E', code:'GER', name:'Alemanha', kind:'team'}, {group:'E', code:'CUW', name:'Curaçao', kind:'team'}, {group:'E', code:'CIV', name:'Costa do Marfim', kind:'team'}, {group:'E', code:'ECU', name:'Equador', kind:'team'},
    {group:'F', code:'NED', name:'Países Baixos', kind:'team'}, {group:'F', code:'JPN', name:'Japão', kind:'team'}, {group:'F', code:'SWE', name:'Suécia', kind:'team'}, {group:'F', code:'TUN', name:'Tunísia', kind:'team'},
    {group:'G', code:'BEL', name:'Bélgica', kind:'team'}, {group:'G', code:'EGY', name:'Egito', kind:'team'}, {group:'G', code:'IRN', name:'Irã', kind:'team'}, {group:'G', code:'NZL', name:'Nova Zelândia', kind:'team'},
    {group:'H', code:'ESP', name:'Espanha', kind:'team'}, {group:'H', code:'CPV', name:'Cabo Verde', kind:'team'}, {group:'H', code:'KSA', name:'Arábia Saudita', kind:'team'}, {group:'H', code:'URU', name:'Uruguai', kind:'team'},
    {group:'I', code:'FRA', name:'França', kind:'team'}, {group:'I', code:'SEN', name:'Senegal', kind:'team'}, {group:'I', code:'IRQ', name:'Iraque', kind:'team'}, {group:'I', code:'NOR', name:'Noruega', kind:'team'},
    {group:'J', code:'ARG', name:'Argentina', kind:'team'}, {group:'J', code:'ALG', name:'Argélia', kind:'team'}, {group:'J', code:'AUT', name:'Áustria', kind:'team'}, {group:'J', code:'JOR', name:'Jordânia', kind:'team'},
    {group:'K', code:'POR', name:'Portugal', kind:'team'}, {group:'K', code:'COD', name:'Congo', kind:'team'}, {group:'K', code:'UZB', name:'Uzbequistão', kind:'team'}, {group:'K', code:'COL', name:'Colômbia', kind:'team'},
    {group:'L', code:'ENG', name:'Inglaterra', kind:'team'}, {group:'L', code:'CRO', name:'Croácia', kind:'team'}, {group:'L', code:'GHA', name:'Gana', kind:'team'}, {group:'L', code:'PAN', name:'Panamá', kind:'team'},
    {group:'EXTRAS', code:'FWC', name:'Figurinhas especiais FWC 01–20', count:20, start:1, kind:'special', sectionKey:'FWC-01-20'},
    {group:'EXTRAS', code:'COC', displayCode:'CC', name:'Coca-Cola', count:14, start:1, kind:'special', sectionKey:'COC-01-14'}
  ]
};



// v0.10.1 — metadados completos importados de NOMES E TAGS.txt.
// Total base: 48 seleções x 20 + FWC 01–20 + CC 01–14 = 994 figurinhas.
window.STICKER_META = {
  "MEX-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "MEX-02": {
    "name": "Luis Malagón",
    "type": "jogador"
  },
  "MEX-03": {
    "name": "Johan Vásquez",
    "type": "jogador"
  },
  "MEX-04": {
    "name": "Jorge Sánchez",
    "type": "jogador"
  },
  "MEX-05": {
    "name": "César Montes",
    "type": "jogador"
  },
  "MEX-06": {
    "name": "Jesús Gallardo",
    "type": "jogador"
  },
  "MEX-07": {
    "name": "Raúl Jiménez",
    "type": "jogador"
  },
  "MEX-08": {
    "name": "Diego Lainez",
    "type": "jogador"
  },
  "MEX-09": {
    "name": "Carlos Rodríguez",
    "type": "jogador"
  },
  "MEX-10": {
    "name": "Edson Álvarez",
    "type": "jogador"
  },
  "MEX-11": {
    "name": "Orbelín Pineda",
    "type": "jogador"
  },
  "MEX-12": {
    "name": "Mario Ruiz",
    "type": "jogador"
  },
  "MEX-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "MEX-14": {
    "name": "Erick Sánchez",
    "type": "jogador"
  },
  "MEX-15": {
    "name": "Luis Romo",
    "type": "jogador"
  },
  "MEX-16": {
    "name": "Santiago Giménez",
    "type": "jogador"
  },
  "MEX-17": {
    "name": "Raúl Jiménez",
    "type": "jogador"
  },
  "MEX-18": {
    "name": "Alexis Vega",
    "type": "jogador"
  },
  "MEX-19": {
    "name": "Roberto Alvarado",
    "type": "jogador"
  },
  "MEX-20": {
    "name": "César Huerta",
    "type": "jogador"
  },
  "RSA-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "RSA-02": {
    "name": "Ronwen Williams",
    "type": "jogador"
  },
  "RSA-03": {
    "name": "Sipho Chaine",
    "type": "jogador"
  },
  "RSA-04": {
    "name": "Mothobi Mvala",
    "type": "jogador"
  },
  "RSA-05": {
    "name": "Samukele Kabini",
    "type": "jogador"
  },
  "RSA-06": {
    "name": "Mbekezeli Mbokazi",
    "type": "jogador"
  },
  "RSA-07": {
    "name": "Khulumani Ndamane",
    "type": "jogador"
  },
  "RSA-08": {
    "name": "Siyabonga Ngezana",
    "type": "jogador"
  },
  "RSA-09": {
    "name": "Khuliso Mudau",
    "type": "jogador"
  },
  "RSA-10": {
    "name": "Nkosinathi Sibisi",
    "type": "jogador"
  },
  "RSA-11": {
    "name": "Teboho Mokoena",
    "type": "jogador"
  },
  "RSA-12": {
    "name": "Thalente Mbatha",
    "type": "jogador"
  },
  "RSA-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "RSA-14": {
    "name": "Bathusi Aubaas",
    "type": "jogador"
  },
  "RSA-15": {
    "name": "Yaya Sithole",
    "type": "jogador"
  },
  "RSA-16": {
    "name": "Sipho Mbule",
    "type": "jogador"
  },
  "RSA-17": {
    "name": "Lyle Foster",
    "type": "jogador"
  },
  "RSA-18": {
    "name": "Iqraam Rayners",
    "type": "jogador"
  },
  "RSA-19": {
    "name": "Mohau Nkota",
    "type": "jogador"
  },
  "RSA-20": {
    "name": "Oswin Appollis",
    "type": "jogador"
  },
  "KOR-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "KOR-02": {
    "name": "Hyeonwoo Jo",
    "type": "jogador"
  },
  "KOR-03": {
    "name": "Seunggyu Kim",
    "type": "jogador"
  },
  "KOR-04": {
    "name": "Minjae Kim",
    "type": "jogador"
  },
  "KOR-05": {
    "name": "Minjae Cho",
    "type": "jogador"
  },
  "KOR-06": {
    "name": "Youngwoo Seol",
    "type": "jogador"
  },
  "KOR-07": {
    "name": "Heungmin Son",
    "type": "jogador"
  },
  "KOR-08": {
    "name": "Kangin Lee",
    "type": "jogador"
  },
  "KOR-09": {
    "name": "Myungjae Lee",
    "type": "jogador"
  },
  "KOR-10": {
    "name": "Jaesung Lee",
    "type": "jogador"
  },
  "KOR-11": {
    "name": "Inbeom Hwang",
    "type": "jogador"
  },
  "KOR-12": {
    "name": "Kangin Lee",
    "type": "jogador"
  },
  "KOR-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "KOR-14": {
    "name": "Seungho Paik",
    "type": "jogador"
  },
  "KOR-15": {
    "name": "Jens Castrop",
    "type": "jogador"
  },
  "KOR-16": {
    "name": "Donggyeong Lee",
    "type": "jogador"
  },
  "KOR-17": {
    "name": "Guesung Cho",
    "type": "jogador"
  },
  "KOR-18": {
    "name": "Heungmin Son",
    "type": "jogador"
  },
  "KOR-19": {
    "name": "Heechan Hwang",
    "type": "jogador"
  },
  "KOR-20": {
    "name": "Hyeonju Oh",
    "type": "jogador"
  },
  "CZE-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "CZE-02": {
    "name": "Matěj Kovář",
    "type": "jogador"
  },
  "CZE-03": {
    "name": "Jindřich Staněk",
    "type": "jogador"
  },
  "CZE-04": {
    "name": "Ladislav Krejčí",
    "type": "jogador"
  },
  "CZE-05": {
    "name": "Vladimír Coufal",
    "type": "jogador"
  },
  "CZE-06": {
    "name": "Jaroslav Zelený",
    "type": "jogador"
  },
  "CZE-07": {
    "name": "Tomáš Holeš",
    "type": "jogador"
  },
  "CZE-08": {
    "name": "David Zima",
    "type": "jogador"
  },
  "CZE-09": {
    "name": "Michal Sadílek",
    "type": "jogador"
  },
  "CZE-10": {
    "name": "Lukáš Provod",
    "type": "jogador"
  },
  "CZE-11": {
    "name": "Lukáš Červ",
    "type": "jogador"
  },
  "CZE-12": {
    "name": "Tomáš Souček",
    "type": "jogador"
  },
  "CZE-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "CZE-14": {
    "name": "Pavel Šulc",
    "type": "jogador"
  },
  "CZE-15": {
    "name": "Matěj Vydra",
    "type": "jogador"
  },
  "CZE-16": {
    "name": "Vasil Kušej",
    "type": "jogador"
  },
  "CZE-17": {
    "name": "Tomáš Chorý",
    "type": "jogador"
  },
  "CZE-18": {
    "name": "Václav Černý",
    "type": "jogador"
  },
  "CZE-19": {
    "name": "Adam Hložek",
    "type": "jogador"
  },
  "CZE-20": {
    "name": "Patrik Schick",
    "type": "jogador"
  },
  "CAN-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "CAN-02": {
    "name": "Dayne St. Clair",
    "type": "jogador"
  },
  "CAN-03": {
    "name": "Alphonso Davies",
    "type": "jogador"
  },
  "CAN-04": {
    "name": "Alistair Johnston",
    "type": "jogador"
  },
  "CAN-05": {
    "name": "Samuel Adekugbe",
    "type": "jogador"
  },
  "CAN-06": {
    "name": "Richie Laryea",
    "type": "jogador"
  },
  "CAN-07": {
    "name": "Derek Cornelius",
    "type": "jogador"
  },
  "CAN-08": {
    "name": "Moïse Bombito",
    "type": "jogador"
  },
  "CAN-09": {
    "name": "Kamal Miller",
    "type": "jogador"
  },
  "CAN-10": {
    "name": "Stephen Eustáquio",
    "type": "jogador"
  },
  "CAN-11": {
    "name": "Ismaël Koné",
    "type": "jogador"
  },
  "CAN-12": {
    "name": "Jonathan Osorio",
    "type": "jogador"
  },
  "CAN-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "CAN-14": {
    "name": "Jacob Shaffelburg",
    "type": "jogador"
  },
  "CAN-15": {
    "name": "Mathieu Choinière",
    "type": "jogador"
  },
  "CAN-16": {
    "name": "Niko Sigur",
    "type": "jogador"
  },
  "CAN-17": {
    "name": "Tajon Buchanan",
    "type": "jogador"
  },
  "CAN-18": {
    "name": "Liam Millar",
    "type": "jogador"
  },
  "CAN-19": {
    "name": "Cyle Larin",
    "type": "jogador"
  },
  "CAN-20": {
    "name": "Jonathan David",
    "type": "jogador"
  },
  "BIH-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "BIH-02": {
    "name": "Nikola Vasilj",
    "type": "jogador"
  },
  "BIH-03": {
    "name": "Amar Dedić",
    "type": "jogador"
  },
  "BIH-04": {
    "name": "Sead Kolašinac",
    "type": "jogador"
  },
  "BIH-05": {
    "name": "Tarik Muharemović",
    "type": "jogador"
  },
  "BIH-06": {
    "name": "Nihad Mujakić",
    "type": "jogador"
  },
  "BIH-07": {
    "name": "Nikola Katić",
    "type": "jogador"
  },
  "BIH-08": {
    "name": "Amir Hadžiahmetović",
    "type": "jogador"
  },
  "BIH-09": {
    "name": "Benjamin Tahirović",
    "type": "jogador"
  },
  "BIH-10": {
    "name": "Armin Gigović",
    "type": "jogador"
  },
  "BIH-11": {
    "name": "Ivan Šunjić",
    "type": "jogador"
  },
  "BIH-12": {
    "name": "Ivan Bašić",
    "type": "jogador"
  },
  "BIH-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "BIH-14": {
    "name": "Dženis Burnić",
    "type": "jogador"
  },
  "BIH-15": {
    "name": "Esmir Bajraktarević",
    "type": "jogador"
  },
  "BIH-16": {
    "name": "Amar Memić",
    "type": "jogador"
  },
  "BIH-17": {
    "name": "Benjamin Demirović",
    "type": "jogador"
  },
  "BIH-18": {
    "name": "Edin Džeko",
    "type": "jogador"
  },
  "BIH-19": {
    "name": "Said Baždar",
    "type": "jogador"
  },
  "BIH-20": {
    "name": "Haris Tabaković",
    "type": "jogador"
  },
  "QAT-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "QAT-02": {
    "name": "Meshaal Barsham",
    "type": "jogador"
  },
  "QAT-03": {
    "name": "Sultan Al-Brake",
    "type": "jogador"
  },
  "QAT-04": {
    "name": "Lucas Mendes",
    "type": "jogador"
  },
  "QAT-05": {
    "name": "Homam Ahmed",
    "type": "jogador"
  },
  "QAT-06": {
    "name": "Boualem Khoukhi",
    "type": "jogador"
  },
  "QAT-07": {
    "name": "Pedro Miguel",
    "type": "jogador"
  },
  "QAT-08": {
    "name": "Tarek Salman",
    "type": "jogador"
  },
  "QAT-09": {
    "name": "Mohammed Muntari",
    "type": "jogador"
  },
  "QAT-10": {
    "name": "Karim Boudiaf",
    "type": "jogador"
  },
  "QAT-11": {
    "name": "Assim Madibo",
    "type": "jogador"
  },
  "QAT-12": {
    "name": "Hamed Fathi",
    "type": "jogador"
  },
  "QAT-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "QAT-14": {
    "name": "Mohammed Waad",
    "type": "jogador"
  },
  "QAT-15": {
    "name": "Abdulaziz Hatem",
    "type": "jogador"
  },
  "QAT-16": {
    "name": "Hassan Al-Haydos",
    "type": "jogador"
  },
  "QAT-17": {
    "name": "Edmilson Junior",
    "type": "jogador"
  },
  "QAT-18": {
    "name": "Akram Afif",
    "type": "jogador"
  },
  "QAT-19": {
    "name": "Ahmed Al-Ganehi",
    "type": "jogador"
  },
  "QAT-20": {
    "name": "Almoez Ali",
    "type": "jogador"
  },
  "SUI-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "SUI-02": {
    "name": "Gregor Kobel",
    "type": "jogador"
  },
  "SUI-03": {
    "name": "Yvon Mvogo",
    "type": "jogador"
  },
  "SUI-04": {
    "name": "Manuel Akanji",
    "type": "jogador"
  },
  "SUI-05": {
    "name": "Ricardo Rodríguez",
    "type": "jogador"
  },
  "SUI-06": {
    "name": "Nico Elvedi",
    "type": "jogador"
  },
  "SUI-07": {
    "name": "Michel Aebischer",
    "type": "jogador"
  },
  "SUI-08": {
    "name": "Silvan Widmer",
    "type": "jogador"
  },
  "SUI-09": {
    "name": "Granit Xhaka",
    "type": "jogador"
  },
  "SUI-10": {
    "name": "Denis Zakaria",
    "type": "jogador"
  },
  "SUI-11": {
    "name": "Remo Freuler",
    "type": "jogador"
  },
  "SUI-12": {
    "name": "Fabian Rieder",
    "type": "jogador"
  },
  "SUI-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "SUI-14": {
    "name": "Ardon Jashari",
    "type": "jogador"
  },
  "SUI-15": {
    "name": "Johan Manzambi",
    "type": "jogador"
  },
  "SUI-16": {
    "name": "Michel Aebischer",
    "type": "jogador"
  },
  "SUI-17": {
    "name": "Breel Embolo",
    "type": "jogador"
  },
  "SUI-18": {
    "name": "Ruben Vargas",
    "type": "jogador"
  },
  "SUI-19": {
    "name": "Dan Ndoye",
    "type": "jogador"
  },
  "SUI-20": {
    "name": "Zeki Amdouni",
    "type": "jogador"
  },
  "BRA-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "BRA-02": {
    "name": "Alisson",
    "type": "jogador"
  },
  "BRA-03": {
    "name": "Bento",
    "type": "jogador"
  },
  "BRA-04": {
    "name": "Marquinhos",
    "type": "jogador"
  },
  "BRA-05": {
    "name": "Éder Militão",
    "type": "jogador"
  },
  "BRA-06": {
    "name": "Gabriel Magalhães",
    "type": "jogador"
  },
  "BRA-07": {
    "name": "Danilo",
    "type": "jogador"
  },
  "BRA-08": {
    "name": "Wesley",
    "type": "jogador"
  },
  "BRA-09": {
    "name": "Lucas Paquetá",
    "type": "jogador"
  },
  "BRA-10": {
    "name": "Casemiro",
    "type": "jogador"
  },
  "BRA-11": {
    "name": "Bruno Guimarães",
    "type": "jogador"
  },
  "BRA-12": {
    "name": "Luiz Henrique",
    "type": "jogador"
  },
  "BRA-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "BRA-14": {
    "name": "Vinícius Júnior",
    "type": "jogador"
  },
  "BRA-15": {
    "name": "Rodrygo",
    "type": "jogador"
  },
  "BRA-16": {
    "name": "João Pedro",
    "type": "jogador"
  },
  "BRA-17": {
    "name": "Matheus Cunha",
    "type": "jogador"
  },
  "BRA-18": {
    "name": "Gabriel Martinelli",
    "type": "jogador"
  },
  "BRA-19": {
    "name": "Raphinha",
    "type": "jogador"
  },
  "BRA-20": {
    "name": "Estevão",
    "type": "jogador"
  },
  "MAR-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "MAR-02": {
    "name": "Yassine Bounou",
    "type": "jogador"
  },
  "MAR-03": {
    "name": "Munir El Kajoui",
    "type": "jogador"
  },
  "MAR-04": {
    "name": "Achraf Hakimi",
    "type": "jogador"
  },
  "MAR-05": {
    "name": "Noussair Mazraoui",
    "type": "jogador"
  },
  "MAR-06": {
    "name": "Nayef Aguerd",
    "type": "jogador"
  },
  "MAR-07": {
    "name": "Romain Saïss",
    "type": "jogador"
  },
  "MAR-08": {
    "name": "Jawad El Yamiq",
    "type": "jogador"
  },
  "MAR-09": {
    "name": "Adam Masina",
    "type": "jogador"
  },
  "MAR-10": {
    "name": "Sofyan Amrabat",
    "type": "jogador"
  },
  "MAR-11": {
    "name": "Azzedine Ounahi",
    "type": "jogador"
  },
  "MAR-12": {
    "name": "Eliesse Ben Seghir",
    "type": "jogador"
  },
  "MAR-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "MAR-14": {
    "name": "Bilal El Khannouss",
    "type": "jogador"
  },
  "MAR-15": {
    "name": "Ismael Saibari",
    "type": "jogador"
  },
  "MAR-16": {
    "name": "Youssef En-Nesyri",
    "type": "jogador"
  },
  "MAR-17": {
    "name": "Abde Ezzalzouli",
    "type": "jogador"
  },
  "MAR-18": {
    "name": "Soufiane Rahimi",
    "type": "jogador"
  },
  "MAR-19": {
    "name": "Brahim Díaz",
    "type": "jogador"
  },
  "MAR-20": {
    "name": "Ayoub El Kaabi",
    "type": "jogador"
  },
  "HAI-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "HAI-02": {
    "name": "Johny Placide",
    "type": "jogador"
  },
  "HAI-03": {
    "name": "Gariss Arcus",
    "type": "jogador"
  },
  "HAI-04": {
    "name": "Martin Expérience",
    "type": "jogador"
  },
  "HAI-05": {
    "name": "Jean-Kévin Duverne",
    "type": "jogador"
  },
  "HAI-06": {
    "name": "Ricardo Adé",
    "type": "jogador"
  },
  "HAI-07": {
    "name": "Duke Lacroix",
    "type": "jogador"
  },
  "HAI-08": {
    "name": "Garven Metusala",
    "type": "jogador"
  },
  "HAI-09": {
    "name": "Hannes Delcroix",
    "type": "jogador"
  },
  "HAI-10": {
    "name": "Leverton Pierre",
    "type": "jogador"
  },
  "HAI-11": {
    "name": "Danley Jean Jacques",
    "type": "jogador"
  },
  "HAI-12": {
    "name": "Jean-Ricner Bellegarde",
    "type": "jogador"
  },
  "HAI-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "HAI-14": {
    "name": "Christopher Attys",
    "type": "jogador"
  },
  "HAI-15": {
    "name": "Derrick Etienne Jr.",
    "type": "jogador"
  },
  "HAI-16": {
    "name": "Josué Casimir",
    "type": "jogador"
  },
  "HAI-17": {
    "name": "Ruben Providence",
    "type": "jogador"
  },
  "HAI-18": {
    "name": "Duckens Nazon",
    "type": "jogador"
  },
  "HAI-19": {
    "name": "Louicius Deedson",
    "type": "jogador"
  },
  "HAI-20": {
    "name": "Frantzdy Pierrot",
    "type": "jogador"
  },
  "SCO-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "SCO-02": {
    "name": "Angus Gunn",
    "type": "jogador"
  },
  "SCO-03": {
    "name": "Jack Hendry",
    "type": "jogador"
  },
  "SCO-04": {
    "name": "Kieran Tierney",
    "type": "jogador"
  },
  "SCO-05": {
    "name": "Aaron Hickey",
    "type": "jogador"
  },
  "SCO-06": {
    "name": "Andrew Robertson",
    "type": "jogador"
  },
  "SCO-07": {
    "name": "Scott McKenna",
    "type": "jogador"
  },
  "SCO-08": {
    "name": "John Souttar",
    "type": "jogador"
  },
  "SCO-09": {
    "name": "Anthony Ralston",
    "type": "jogador"
  },
  "SCO-10": {
    "name": "Grant Hanley",
    "type": "jogador"
  },
  "SCO-11": {
    "name": "Scott McTominay",
    "type": "jogador"
  },
  "SCO-12": {
    "name": "Billy Gilmour",
    "type": "jogador"
  },
  "SCO-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "SCO-14": {
    "name": "Lewis Ferguson",
    "type": "jogador"
  },
  "SCO-15": {
    "name": "Ryan Christie",
    "type": "jogador"
  },
  "SCO-16": {
    "name": "Kenny McLean",
    "type": "jogador"
  },
  "SCO-17": {
    "name": "John McGinn",
    "type": "jogador"
  },
  "SCO-18": {
    "name": "Lyndon Dykes",
    "type": "jogador"
  },
  "SCO-19": {
    "name": "Ché Adams",
    "type": "jogador"
  },
  "SCO-20": {
    "name": "Ben Gannon-Doak",
    "type": "jogador"
  },
  "USA-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "USA-02": {
    "name": "Matt Freese",
    "type": "jogador"
  },
  "USA-03": {
    "name": "Chris Richards",
    "type": "jogador"
  },
  "USA-04": {
    "name": "Tim Ream",
    "type": "jogador"
  },
  "USA-05": {
    "name": "Mark McKenzie",
    "type": "jogador"
  },
  "USA-06": {
    "name": "Alex Freeman",
    "type": "jogador"
  },
  "USA-07": {
    "name": "Antonee Robinson",
    "type": "jogador"
  },
  "USA-08": {
    "name": "Tyler Adams",
    "type": "jogador"
  },
  "USA-09": {
    "name": "Tanner Tessmann",
    "type": "jogador"
  },
  "USA-10": {
    "name": "Weston McKennie",
    "type": "jogador"
  },
  "USA-11": {
    "name": "Cristian Roldan",
    "type": "jogador"
  },
  "USA-12": {
    "name": "Timothy Weah",
    "type": "jogador"
  },
  "USA-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "USA-14": {
    "name": "Diego Luna",
    "type": "jogador"
  },
  "USA-15": {
    "name": "Malik Tillman",
    "type": "jogador"
  },
  "USA-16": {
    "name": "Christian Pulisic",
    "type": "jogador"
  },
  "USA-17": {
    "name": "Brenden Aaronson",
    "type": "jogador"
  },
  "USA-18": {
    "name": "Ricardo Pepi",
    "type": "jogador"
  },
  "USA-19": {
    "name": "Haji Wright",
    "type": "jogador"
  },
  "USA-20": {
    "name": "Folarin Balogun",
    "type": "jogador"
  },
  "PAR-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "PAR-02": {
    "name": "Roberto Fernández",
    "type": "jogador"
  },
  "PAR-03": {
    "name": "Ronaldo Dejesús",
    "type": "jogador"
  },
  "PAR-04": {
    "name": "Gustavo Gómez",
    "type": "jogador"
  },
  "PAR-05": {
    "name": "Fabián Balbuena",
    "type": "jogador"
  },
  "PAR-06": {
    "name": "Juan José Cáceres",
    "type": "jogador"
  },
  "PAR-07": {
    "name": "Omar Alderete",
    "type": "jogador"
  },
  "PAR-08": {
    "name": "Junior Alonso",
    "type": "jogador"
  },
  "PAR-09": {
    "name": "Matías Villasanti",
    "type": "jogador"
  },
  "PAR-10": {
    "name": "Diego Gómez",
    "type": "jogador"
  },
  "PAR-11": {
    "name": "Damián Bobadilla",
    "type": "jogador"
  },
  "PAR-12": {
    "name": "Andrés Cubas",
    "type": "jogador"
  },
  "PAR-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "PAR-14": {
    "name": "Matías Galarza Fonda",
    "type": "jogador"
  },
  "PAR-15": {
    "name": "Julio Enciso",
    "type": "jogador"
  },
  "PAR-16": {
    "name": "Alejandro Romero Gamarra",
    "type": "jogador"
  },
  "PAR-17": {
    "name": "Miguel Almirón",
    "type": "jogador"
  },
  "PAR-18": {
    "name": "Ramón Sosa",
    "type": "jogador"
  },
  "PAR-19": {
    "name": "Ángel Romero",
    "type": "jogador"
  },
  "PAR-20": {
    "name": "Antonio Sanabria",
    "type": "jogador"
  },
  "AUS-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "AUS-02": {
    "name": "Mathew Ryan",
    "type": "jogador"
  },
  "AUS-03": {
    "name": "Joe Gauci",
    "type": "jogador"
  },
  "AUS-04": {
    "name": "Harry Souttar",
    "type": "jogador"
  },
  "AUS-05": {
    "name": "Alessandro Circati",
    "type": "jogador"
  },
  "AUS-06": {
    "name": "Jordan Bos",
    "type": "jogador"
  },
  "AUS-07": {
    "name": "Aziz Behich",
    "type": "jogador"
  },
  "AUS-08": {
    "name": "Cameron Burgess",
    "type": "jogador"
  },
  "AUS-09": {
    "name": "Lewis Miller",
    "type": "jogador"
  },
  "AUS-10": {
    "name": "Milos Degenek",
    "type": "jogador"
  },
  "AUS-11": {
    "name": "Jackson Irvine",
    "type": "jogador"
  },
  "AUS-12": {
    "name": "Riley McGree",
    "type": "jogador"
  },
  "AUS-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "AUS-14": {
    "name": "Mitch Duke",
    "type": "jogador"
  },
  "AUS-15": {
    "name": "Connor Metcalfe",
    "type": "jogador"
  },
  "AUS-16": {
    "name": "Patrick Yazbek",
    "type": "jogador"
  },
  "AUS-17": {
    "name": "Craig Goodwin",
    "type": "jogador"
  },
  "AUS-18": {
    "name": "Kusini Yengi",
    "type": "jogador"
  },
  "AUS-19": {
    "name": "Nestory Irankunda",
    "type": "jogador"
  },
  "AUS-20": {
    "name": "Mohamed Toure",
    "type": "jogador"
  },
  "TUR-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "TUR-02": {
    "name": "Uğurcan Çakır",
    "type": "jogador"
  },
  "TUR-03": {
    "name": "Mert Müldür",
    "type": "jogador"
  },
  "TUR-04": {
    "name": "Eren Elmalı",
    "type": "jogador"
  },
  "TUR-05": {
    "name": "Abdülkerim Bardakcı",
    "type": "jogador"
  },
  "TUR-06": {
    "name": "Çağlar Söyüncü",
    "type": "jogador"
  },
  "TUR-07": {
    "name": "Merih Demiral",
    "type": "jogador"
  },
  "TUR-08": {
    "name": "Ferdi Kadıoğlu",
    "type": "jogador"
  },
  "TUR-09": {
    "name": "Kaan Ayhan",
    "type": "jogador"
  },
  "TUR-10": {
    "name": "İsmail Yüksek",
    "type": "jogador"
  },
  "TUR-11": {
    "name": "Hakan Çalhanoğlu",
    "type": "jogador"
  },
  "TUR-12": {
    "name": "Orkun Kökçü",
    "type": "jogador"
  },
  "TUR-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "TUR-14": {
    "name": "Arda Güler",
    "type": "jogador"
  },
  "TUR-15": {
    "name": "İrfan Can Kahveci",
    "type": "jogador"
  },
  "TUR-16": {
    "name": "Yunus Akgün",
    "type": "jogador"
  },
  "TUR-17": {
    "name": "Can Uzun",
    "type": "jogador"
  },
  "TUR-18": {
    "name": "Barış Alper Yılmaz",
    "type": "jogador"
  },
  "TUR-19": {
    "name": "Kerem Aktürkoğlu",
    "type": "jogador"
  },
  "TUR-20": {
    "name": "Kenan Yıldız",
    "type": "jogador"
  },
  "GER-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "GER-02": {
    "name": "Marc-André ter Stegen",
    "type": "jogador"
  },
  "GER-03": {
    "name": "Jonathan Tah",
    "type": "jogador"
  },
  "GER-04": {
    "name": "David Raum",
    "type": "jogador"
  },
  "GER-05": {
    "name": "Nico Schlotterbeck",
    "type": "jogador"
  },
  "GER-06": {
    "name": "Antonio Rüdiger",
    "type": "jogador"
  },
  "GER-07": {
    "name": "Waldemar Anton",
    "type": "jogador"
  },
  "GER-08": {
    "name": "Ridle Baku",
    "type": "jogador"
  },
  "GER-09": {
    "name": "Maximilian Mittelstädt",
    "type": "jogador"
  },
  "GER-10": {
    "name": "Joshua Kimmich",
    "type": "jogador"
  },
  "GER-11": {
    "name": "Florian Wirtz",
    "type": "jogador"
  },
  "GER-12": {
    "name": "Felix Nmecha",
    "type": "jogador"
  },
  "GER-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "GER-14": {
    "name": "Leon Goretzka",
    "type": "jogador"
  },
  "GER-15": {
    "name": "Jamal Musiala",
    "type": "jogador"
  },
  "GER-16": {
    "name": "Serge Gnabry",
    "type": "jogador"
  },
  "GER-17": {
    "name": "Kai Havertz",
    "type": "jogador"
  },
  "GER-18": {
    "name": "Leroy Sané",
    "type": "jogador"
  },
  "GER-19": {
    "name": "Karim Adeyemi",
    "type": "jogador"
  },
  "GER-20": {
    "name": "Nick Woltemade",
    "type": "jogador"
  },
  "CUW-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "CUW-02": {
    "name": "Eloy Room",
    "type": "jogador"
  },
  "CUW-03": {
    "name": "Armando Obispo",
    "type": "jogador"
  },
  "CUW-04": {
    "name": "Sherel Floranus",
    "type": "jogador"
  },
  "CUW-05": {
    "name": "Vurnon Anita",
    "type": "jogador"
  },
  "CUW-06": {
    "name": "Joshua Brenet",
    "type": "jogador"
  },
  "CUW-07": {
    "name": "Roshon van Eijma",
    "type": "jogador"
  },
  "CUW-08": {
    "name": "Shurandy Sambo",
    "type": "jogador"
  },
  "CUW-09": {
    "name": "Livano Comenencia",
    "type": "jogador"
  },
  "CUW-10": {
    "name": "Godfried Roemeratoe",
    "type": "jogador"
  },
  "CUW-11": {
    "name": "Juninho Bacuna",
    "type": "jogador"
  },
  "CUW-12": {
    "name": "Leandro Bacuna",
    "type": "jogador"
  },
  "CUW-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "CUW-14": {
    "name": "Tahith Chong",
    "type": "jogador"
  },
  "CUW-15": {
    "name": "Kenji Gorré",
    "type": "jogador"
  },
  "CUW-16": {
    "name": "Jearl Margaritha",
    "type": "jogador"
  },
  "CUW-17": {
    "name": "Jürgen Locadia",
    "type": "jogador"
  },
  "CUW-18": {
    "name": "Jeremy Antonisse",
    "type": "jogador"
  },
  "CUW-19": {
    "name": "Gervane Kastaneer",
    "type": "jogador"
  },
  "CUW-20": {
    "name": "Sontje Hansen",
    "type": "jogador"
  },
  "CIV-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "CIV-02": {
    "name": "Yahia Fofana",
    "type": "jogador"
  },
  "CIV-03": {
    "name": "Ghislain Konan",
    "type": "jogador"
  },
  "CIV-04": {
    "name": "Wilfried Singo",
    "type": "jogador"
  },
  "CIV-05": {
    "name": "Odilon Kossounou",
    "type": "jogador"
  },
  "CIV-06": {
    "name": "Evan N'Dicka",
    "type": "jogador"
  },
  "CIV-07": {
    "name": "Willy Boly",
    "type": "jogador"
  },
  "CIV-08": {
    "name": "Emmanuel Agbadou",
    "type": "jogador"
  },
  "CIV-09": {
    "name": "Ousmane Diomande",
    "type": "jogador"
  },
  "CIV-10": {
    "name": "Franck Kessié",
    "type": "jogador"
  },
  "CIV-11": {
    "name": "Seko Fofana",
    "type": "jogador"
  },
  "CIV-12": {
    "name": "Ibrahim Sangaré",
    "type": "jogador"
  },
  "CIV-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "CIV-14": {
    "name": "Jean-Philippe Gbamin",
    "type": "jogador"
  },
  "CIV-15": {
    "name": "Amad Diallo",
    "type": "jogador"
  },
  "CIV-16": {
    "name": "Sébastien Haller",
    "type": "jogador"
  },
  "CIV-17": {
    "name": "Nicolas Pépé",
    "type": "jogador"
  },
  "CIV-18": {
    "name": "Ivan Diomande",
    "type": "jogador"
  },
  "CIV-19": {
    "name": "Evann Guessand",
    "type": "jogador"
  },
  "CIV-20": {
    "name": "Oumar Diakité",
    "type": "jogador"
  },
  "ECU-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "ECU-02": {
    "name": "Hernán Galíndez",
    "type": "jogador"
  },
  "ECU-03": {
    "name": "Gonzalo Valle",
    "type": "jogador"
  },
  "ECU-04": {
    "name": "Piero Hincapié",
    "type": "jogador"
  },
  "ECU-05": {
    "name": "Moisés Caicedo",
    "type": "jogador"
  },
  "ECU-06": {
    "name": "William Pacho",
    "type": "jogador"
  },
  "ECU-07": {
    "name": "Ángelo Preciado",
    "type": "jogador"
  },
  "ECU-08": {
    "name": "Joel Ordóñez",
    "type": "jogador"
  },
  "ECU-09": {
    "name": "Jhon Yeboah",
    "type": "jogador"
  },
  "ECU-10": {
    "name": "Alan Franco",
    "type": "jogador"
  },
  "ECU-11": {
    "name": "Kendry Páez",
    "type": "jogador"
  },
  "ECU-12": {
    "name": "Pedro Vite",
    "type": "jogador"
  },
  "ECU-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "ECU-14": {
    "name": "Pervis Estupiñán",
    "type": "jogador"
  },
  "ECU-15": {
    "name": "Leonardo Campana",
    "type": "jogador"
  },
  "ECU-16": {
    "name": "Gonzalo Plata",
    "type": "jogador"
  },
  "ECU-17": {
    "name": "Nilson Angulo",
    "type": "jogador"
  },
  "ECU-18": {
    "name": "Alan Minda",
    "type": "jogador"
  },
  "ECU-19": {
    "name": "Kevin Rodríguez",
    "type": "jogador"
  },
  "ECU-20": {
    "name": "Enner Valencia",
    "type": "jogador"
  },
  "NED-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "NED-02": {
    "name": "Bart Verbruggen",
    "type": "jogador"
  },
  "NED-03": {
    "name": "Virgil van Dijk",
    "type": "jogador"
  },
  "NED-04": {
    "name": "Jan Paul van Hecke",
    "type": "jogador"
  },
  "NED-05": {
    "name": "Jurriën Timber",
    "type": "jogador"
  },
  "NED-06": {
    "name": "Denzel Dumfries",
    "type": "jogador"
  },
  "NED-07": {
    "name": "Nathan Aké",
    "type": "jogador"
  },
  "NED-08": {
    "name": "Jeremie Frimpong",
    "type": "jogador"
  },
  "NED-09": {
    "name": "Jan Paul van Hecke",
    "type": "jogador"
  },
  "NED-10": {
    "name": "Tijjani Reijnders",
    "type": "jogador"
  },
  "NED-11": {
    "name": "Ryan Gravenberch",
    "type": "jogador"
  },
  "NED-12": {
    "name": "Teun Koopmeiners",
    "type": "jogador"
  },
  "NED-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "NED-14": {
    "name": "Frenkie de Jong",
    "type": "jogador"
  },
  "NED-15": {
    "name": "Xavi Simons",
    "type": "jogador"
  },
  "NED-16": {
    "name": "Justin Kluivert",
    "type": "jogador"
  },
  "NED-17": {
    "name": "Memphis Depay",
    "type": "jogador"
  },
  "NED-18": {
    "name": "Donyell Malen",
    "type": "jogador"
  },
  "NED-19": {
    "name": "Wout Weghorst",
    "type": "jogador"
  },
  "NED-20": {
    "name": "Cody Gakpo",
    "type": "jogador"
  },
  "JPN-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "JPN-02": {
    "name": "Zion Suzuki",
    "type": "jogador"
  },
  "JPN-03": {
    "name": "Henry Heroki Mochizuki",
    "type": "jogador"
  },
  "JPN-04": {
    "name": "Ayumu Seko",
    "type": "jogador"
  },
  "JPN-05": {
    "name": "Ko Itakura",
    "type": "jogador"
  },
  "JPN-06": {
    "name": "Koki Machida",
    "type": "jogador"
  },
  "JPN-07": {
    "name": "Tsuyoshi Watanabe",
    "type": "jogador"
  },
  "JPN-08": {
    "name": "Kaishu Sano",
    "type": "jogador"
  },
  "JPN-09": {
    "name": "Yuki Soma",
    "type": "jogador"
  },
  "JPN-10": {
    "name": "Ao Tanaka",
    "type": "jogador"
  },
  "JPN-11": {
    "name": "Daichi Kamada",
    "type": "jogador"
  },
  "JPN-12": {
    "name": "Takefusa Kubo",
    "type": "jogador"
  },
  "JPN-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "JPN-14": {
    "name": "Ritsu Doan",
    "type": "jogador"
  },
  "JPN-15": {
    "name": "Wataru Endo",
    "type": "jogador"
  },
  "JPN-16": {
    "name": "Takumi Minamino",
    "type": "jogador"
  },
  "JPN-17": {
    "name": "Shuto Machino",
    "type": "jogador"
  },
  "JPN-18": {
    "name": "Yuma Ito",
    "type": "jogador"
  },
  "JPN-19": {
    "name": "Daizen Maeda",
    "type": "jogador"
  },
  "JPN-20": {
    "name": "Ayase Ueda",
    "type": "jogador"
  },
  "SWE-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "SWE-02": {
    "name": "Viktor Johansson",
    "type": "jogador"
  },
  "SWE-03": {
    "name": "Isak Hien",
    "type": "jogador"
  },
  "SWE-04": {
    "name": "Gabriel Gudmundsson",
    "type": "jogador"
  },
  "SWE-05": {
    "name": "Emil Holm",
    "type": "jogador"
  },
  "SWE-06": {
    "name": "Victor Nilsson Lindelöf",
    "type": "jogador"
  },
  "SWE-07": {
    "name": "Gustaf Lagerbielke",
    "type": "jogador"
  },
  "SWE-08": {
    "name": "Lucas Bergvall",
    "type": "jogador"
  },
  "SWE-09": {
    "name": "Hugo Larsson",
    "type": "jogador"
  },
  "SWE-10": {
    "name": "Jesper Karlström",
    "type": "jogador"
  },
  "SWE-11": {
    "name": "Yasin Ayari",
    "type": "jogador"
  },
  "SWE-12": {
    "name": "Mattias Svanberg",
    "type": "jogador"
  },
  "SWE-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "SWE-14": {
    "name": "Daniel Svensson",
    "type": "jogador"
  },
  "SWE-15": {
    "name": "Ken Sema",
    "type": "jogador"
  },
  "SWE-16": {
    "name": "Roony Bardghji",
    "type": "jogador"
  },
  "SWE-17": {
    "name": "Dejan Kulusevski",
    "type": "jogador"
  },
  "SWE-18": {
    "name": "Anthony Elanga",
    "type": "jogador"
  },
  "SWE-19": {
    "name": "Alexander Isak",
    "type": "jogador"
  },
  "SWE-20": {
    "name": "Viktor Gyökeres",
    "type": "jogador"
  },
  "TUN-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "TUN-02": {
    "name": "Bechir Ben Said",
    "type": "jogador"
  },
  "TUN-03": {
    "name": "Aymen Dahmen",
    "type": "jogador"
  },
  "TUN-04": {
    "name": "Wajdi Kechrida",
    "type": "jogador"
  },
  "TUN-05": {
    "name": "Montassar Talbi",
    "type": "jogador"
  },
  "TUN-06": {
    "name": "Yassine Meriah",
    "type": "jogador"
  },
  "TUN-07": {
    "name": "Ali Abdi",
    "type": "jogador"
  },
  "TUN-08": {
    "name": "Dylan Bronn",
    "type": "jogador"
  },
  "TUN-09": {
    "name": "Elies Skhiri",
    "type": "jogador"
  },
  "TUN-10": {
    "name": "Aïssa Laïdouni",
    "type": "jogador"
  },
  "TUN-11": {
    "name": "Ferjani Sassi",
    "type": "jogador"
  },
  "TUN-12": {
    "name": "Mohamed Ali Ben Romdhane",
    "type": "jogador"
  },
  "TUN-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "TUN-14": {
    "name": "Hannibal Mejbri",
    "type": "jogador"
  },
  "TUN-15": {
    "name": "Elias Achouri",
    "type": "jogador"
  },
  "TUN-16": {
    "name": "Elias Saad",
    "type": "jogador"
  },
  "TUN-17": {
    "name": "Hazem Mastouri",
    "type": "jogador"
  },
  "TUN-18": {
    "name": "Ismaël Gharbi",
    "type": "jogador"
  },
  "TUN-19": {
    "name": "Sayfallah Ltaief",
    "type": "jogador"
  },
  "TUN-20": {
    "name": "Naim Sliti",
    "type": "jogador"
  },
  "BEL-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "BEL-02": {
    "name": "Thibaut Courtois",
    "type": "jogador"
  },
  "BEL-03": {
    "name": "Arthur Theate",
    "type": "jogador"
  },
  "BEL-04": {
    "name": "Timothy Castagne",
    "type": "jogador"
  },
  "BEL-05": {
    "name": "Zeno Debast",
    "type": "jogador"
  },
  "BEL-06": {
    "name": "Brandon Mechele",
    "type": "jogador"
  },
  "BEL-07": {
    "name": "Maxim De Cuyper",
    "type": "jogador"
  },
  "BEL-08": {
    "name": "Thomas Meunier",
    "type": "jogador"
  },
  "BEL-09": {
    "name": "Youri Tielemans",
    "type": "jogador"
  },
  "BEL-10": {
    "name": "Amadou Onana",
    "type": "jogador"
  },
  "BEL-11": {
    "name": "Nicolas Raskin",
    "type": "jogador"
  },
  "BEL-12": {
    "name": "Alexis Saelemaekers",
    "type": "jogador"
  },
  "BEL-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "BEL-14": {
    "name": "Hans Vanaken",
    "type": "jogador"
  },
  "BEL-15": {
    "name": "Kevin De Bruyne",
    "type": "jogador"
  },
  "BEL-16": {
    "name": "Jérémy Doku",
    "type": "jogador"
  },
  "BEL-17": {
    "name": "Charles De Ketelaere",
    "type": "jogador"
  },
  "BEL-18": {
    "name": "Leandro Trossard",
    "type": "jogador"
  },
  "BEL-19": {
    "name": "Loïs Openda",
    "type": "jogador"
  },
  "BEL-20": {
    "name": "Romelu Lukaku",
    "type": "jogador"
  },
  "EGY-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "EGY-02": {
    "name": "Mohamed El Shenawy",
    "type": "jogador"
  },
  "EGY-03": {
    "name": "Mohamed Hany",
    "type": "jogador"
  },
  "EGY-04": {
    "name": "Mohamed Hamdy",
    "type": "jogador"
  },
  "EGY-05": {
    "name": "Yasser Ibrahim",
    "type": "jogador"
  },
  "EGY-06": {
    "name": "Khaled Sobhi",
    "type": "jogador"
  },
  "EGY-07": {
    "name": "Hamdi Fathy",
    "type": "jogador"
  },
  "EGY-08": {
    "name": "Marwan Attia",
    "type": "jogador"
  },
  "EGY-09": {
    "name": "Ahmed Fatouh",
    "type": "jogador"
  },
  "EGY-10": {
    "name": "Trezeguet",
    "type": "jogador"
  },
  "EGY-11": {
    "name": "Zizo",
    "type": "jogador"
  },
  "EGY-12": {
    "name": "Emam Ashour",
    "type": "jogador"
  },
  "EGY-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "EGY-14": {
    "name": "Mohamed Lasheen",
    "type": "jogador"
  },
  "EGY-15": {
    "name": "Emam Ashour",
    "type": "jogador"
  },
  "EGY-16": {
    "name": "Osama Faisal",
    "type": "jogador"
  },
  "EGY-17": {
    "name": "Mohamed Salah",
    "type": "jogador"
  },
  "EGY-18": {
    "name": "Mostafa Mohamed",
    "type": "jogador"
  },
  "EGY-19": {
    "name": "Trezeguet",
    "type": "jogador"
  },
  "EGY-20": {
    "name": "Omar Marmoush",
    "type": "jogador"
  },
  "IRN-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "IRN-02": {
    "name": "Alireza Beiranvand",
    "type": "jogador"
  },
  "IRN-03": {
    "name": "Milad Mohammadi",
    "type": "jogador"
  },
  "IRN-04": {
    "name": "Ehsan Hajsafi",
    "type": "jogador"
  },
  "IRN-05": {
    "name": "Sadegh Moharrami",
    "type": "jogador"
  },
  "IRN-06": {
    "name": "Saeid Ezatolahi",
    "type": "jogador"
  },
  "IRN-07": {
    "name": "Ramin Rezaeian",
    "type": "jogador"
  },
  "IRN-08": {
    "name": "Hossein Kanani",
    "type": "jogador"
  },
  "IRN-09": {
    "name": "Saman Ghoddos",
    "type": "jogador"
  },
  "IRN-10": {
    "name": "Ali Gholizadeh",
    "type": "jogador"
  },
  "IRN-11": {
    "name": "Saeed Ezatolahi",
    "type": "jogador"
  },
  "IRN-12": {
    "name": "Saman Ghoddos",
    "type": "jogador"
  },
  "IRN-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "IRN-14": {
    "name": "Omid Noorafkan",
    "type": "jogador"
  },
  "IRN-15": {
    "name": "Roozbeh Cheshmi",
    "type": "jogador"
  },
  "IRN-16": {
    "name": "Mohammad Mohebi",
    "type": "jogador"
  },
  "IRN-17": {
    "name": "Sardar Azmoun",
    "type": "jogador"
  },
  "IRN-18": {
    "name": "Mehdi Taremi",
    "type": "jogador"
  },
  "IRN-19": {
    "name": "Alireza Jahanbakhsh",
    "type": "jogador"
  },
  "IRN-20": {
    "name": "Ali Gholizadeh",
    "type": "jogador"
  },
  "NZL-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "NZL-02": {
    "name": "Max Crocombe",
    "type": "jogador"
  },
  "NZL-03": {
    "name": "Alex Paulsen",
    "type": "jogador"
  },
  "NZL-04": {
    "name": "Michael Boxall",
    "type": "jogador"
  },
  "NZL-05": {
    "name": "Liberato Cacace",
    "type": "jogador"
  },
  "NZL-06": {
    "name": "Tim Payne",
    "type": "jogador"
  },
  "NZL-07": {
    "name": "Tyler Bindon",
    "type": "jogador"
  },
  "NZL-08": {
    "name": "Francis De Vries",
    "type": "jogador"
  },
  "NZL-09": {
    "name": "Finn Surman",
    "type": "jogador"
  },
  "NZL-10": {
    "name": "Joe Bell",
    "type": "jogador"
  },
  "NZL-11": {
    "name": "Sarpreet Singh",
    "type": "jogador"
  },
  "NZL-12": {
    "name": "Ryan Thomas",
    "type": "jogador"
  },
  "NZL-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "NZL-14": {
    "name": "Matthew Garbett",
    "type": "jogador"
  },
  "NZL-15": {
    "name": "Marko Stamenić",
    "type": "jogador"
  },
  "NZL-16": {
    "name": "Ben Old",
    "type": "jogador"
  },
  "NZL-17": {
    "name": "Chris Wood",
    "type": "jogador"
  },
  "NZL-18": {
    "name": "Elijah Just",
    "type": "jogador"
  },
  "NZL-19": {
    "name": "Callum McCowatt",
    "type": "jogador"
  },
  "NZL-20": {
    "name": "Kosta Barbarouses",
    "type": "jogador"
  },
  "ESP-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "ESP-02": {
    "name": "Unai Simón",
    "type": "jogador"
  },
  "ESP-03": {
    "name": "Marc Cucurella",
    "type": "jogador"
  },
  "ESP-04": {
    "name": "Aymeric Laporte",
    "type": "jogador"
  },
  "ESP-05": {
    "name": "Dean Huijsen",
    "type": "jogador"
  },
  "ESP-06": {
    "name": "Pedro Porro",
    "type": "jogador"
  },
  "ESP-07": {
    "name": "Álvaro Morata",
    "type": "jogador"
  },
  "ESP-08": {
    "name": "Marc Cucurella",
    "type": "jogador"
  },
  "ESP-09": {
    "name": "Martín Zubimendi",
    "type": "jogador"
  },
  "ESP-10": {
    "name": "Rodri",
    "type": "jogador"
  },
  "ESP-11": {
    "name": "Ferran Torres",
    "type": "jogador"
  },
  "ESP-12": {
    "name": "Fabián Ruiz",
    "type": "jogador"
  },
  "ESP-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "ESP-14": {
    "name": "Mikel Merino",
    "type": "jogador"
  },
  "ESP-15": {
    "name": "Lamine Yamal",
    "type": "jogador"
  },
  "ESP-16": {
    "name": "Dani Olmo",
    "type": "jogador"
  },
  "ESP-17": {
    "name": "Nico Williams",
    "type": "jogador"
  },
  "ESP-18": {
    "name": "Ferran Torres",
    "type": "jogador"
  },
  "ESP-19": {
    "name": "Álvaro Morata",
    "type": "jogador"
  },
  "ESP-20": {
    "name": "Mikel Oyarzabal",
    "type": "jogador"
  },
  "CPV-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "CPV-02": {
    "name": "Vozinha",
    "type": "jogador"
  },
  "CPV-03": {
    "name": "Logan Costa",
    "type": "jogador"
  },
  "CPV-04": {
    "name": "Pico",
    "type": "jogador"
  },
  "CPV-05": {
    "name": "Diney",
    "type": "jogador"
  },
  "CPV-06": {
    "name": "Steven Moreira",
    "type": "jogador"
  },
  "CPV-07": {
    "name": "Wagner Pina",
    "type": "jogador"
  },
  "CPV-08": {
    "name": "João Paulo",
    "type": "jogador"
  },
  "CPV-09": {
    "name": "Yannick Semedo",
    "type": "jogador"
  },
  "CPV-10": {
    "name": "Kevin Pina",
    "type": "jogador"
  },
  "CPV-11": {
    "name": "Patrick Andrade",
    "type": "jogador"
  },
  "CPV-12": {
    "name": "Jamiro Monteiro",
    "type": "jogador"
  },
  "CPV-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "CPV-14": {
    "name": "Deroy Duarte",
    "type": "jogador"
  },
  "CPV-15": {
    "name": "Garry Rodrigues",
    "type": "jogador"
  },
  "CPV-16": {
    "name": "Jovane Cabral",
    "type": "jogador"
  },
  "CPV-17": {
    "name": "Ryan Mendes",
    "type": "jogador"
  },
  "CPV-18": {
    "name": "Dailon Livramento",
    "type": "jogador"
  },
  "CPV-19": {
    "name": "Willy Semedo",
    "type": "jogador"
  },
  "CPV-20": {
    "name": "Bebé",
    "type": "jogador"
  },
  "KSA-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "KSA-02": {
    "name": "Nawaf Alaqidi",
    "type": "jogador"
  },
  "KSA-03": {
    "name": "Abdulrahman Alobud",
    "type": "jogador"
  },
  "KSA-04": {
    "name": "Saud Abdulhamid",
    "type": "jogador"
  },
  "KSA-05": {
    "name": "Nawaf Boushal",
    "type": "jogador"
  },
  "KSA-06": {
    "name": "Ziyad Aljohani",
    "type": "jogador"
  },
  "KSA-07": {
    "name": "Moteb Alharbi",
    "type": "jogador"
  },
  "KSA-08": {
    "name": "Hassan Altambakti",
    "type": "jogador"
  },
  "KSA-09": {
    "name": "Firas Albrikan",
    "type": "jogador"
  },
  "KSA-10": {
    "name": "Musab Aljuwayr",
    "type": "jogador"
  },
  "KSA-11": {
    "name": "Nasser Alghamdi",
    "type": "jogador"
  },
  "KSA-12": {
    "name": "Marwan Alshahrani",
    "type": "jogador"
  },
  "KSA-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "KSA-14": {
    "name": "Saleh Abu Alshamat",
    "type": "jogador"
  },
  "KSA-15": {
    "name": "Marwan Alsahafi",
    "type": "jogador"
  },
  "KSA-16": {
    "name": "Salem Aldawsari",
    "type": "jogador"
  },
  "KSA-17": {
    "name": "Abdulrahman Alobud",
    "type": "jogador"
  },
  "KSA-18": {
    "name": "Feras Albrikan",
    "type": "jogador"
  },
  "KSA-19": {
    "name": "Saleh Alshehri",
    "type": "jogador"
  },
  "KSA-20": {
    "name": "Abdullah Alhamddan",
    "type": "jogador"
  },
  "URU-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "URU-02": {
    "name": "Sergio Rochet",
    "type": "jogador"
  },
  "URU-03": {
    "name": "Santiago Mele",
    "type": "jogador"
  },
  "URU-04": {
    "name": "Ronald Araújo",
    "type": "jogador"
  },
  "URU-05": {
    "name": "José María Giménez",
    "type": "jogador"
  },
  "URU-06": {
    "name": "Sebastián Cáceres",
    "type": "jogador"
  },
  "URU-07": {
    "name": "Matías Olivera",
    "type": "jogador"
  },
  "URU-08": {
    "name": "Guillermo Varela",
    "type": "jogador"
  },
  "URU-09": {
    "name": "Nahitan Nández",
    "type": "jogador"
  },
  "URU-10": {
    "name": "Federico Valverde",
    "type": "jogador"
  },
  "URU-11": {
    "name": "Brian De Arrascaeta",
    "type": "jogador"
  },
  "URU-12": {
    "name": "Rodrigo Bentancur",
    "type": "jogador"
  },
  "URU-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "URU-14": {
    "name": "Manuel Ugarte",
    "type": "jogador"
  },
  "URU-15": {
    "name": "Nicolás De La Cruz",
    "type": "jogador"
  },
  "URU-16": {
    "name": "Maximiliano Araújo",
    "type": "jogador"
  },
  "URU-17": {
    "name": "Darwin Núñez",
    "type": "jogador"
  },
  "URU-18": {
    "name": "Federico Viñas",
    "type": "jogador"
  },
  "URU-19": {
    "name": "Rodrigo Aguirre",
    "type": "jogador"
  },
  "URU-20": {
    "name": "Facundo Pellistri",
    "type": "jogador"
  },
  "FRA-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "FRA-02": {
    "name": "Mike Maignan",
    "type": "jogador"
  },
  "FRA-03": {
    "name": "Théo Hernandez",
    "type": "jogador"
  },
  "FRA-04": {
    "name": "William Saliba",
    "type": "jogador"
  },
  "FRA-05": {
    "name": "Jules Koundé",
    "type": "jogador"
  },
  "FRA-06": {
    "name": "Ibrahima Konaté",
    "type": "jogador"
  },
  "FRA-07": {
    "name": "Dayot Upamecano",
    "type": "jogador"
  },
  "FRA-08": {
    "name": "Lucas Digne",
    "type": "jogador"
  },
  "FRA-09": {
    "name": "Aurélien Tchouaméni",
    "type": "jogador"
  },
  "FRA-10": {
    "name": "Eduardo Camavinga",
    "type": "jogador"
  },
  "FRA-11": {
    "name": "Manu Koné",
    "type": "jogador"
  },
  "FRA-12": {
    "name": "Adrien Rabiot",
    "type": "jogador"
  },
  "FRA-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "FRA-14": {
    "name": "Michael Olise",
    "type": "jogador"
  },
  "FRA-15": {
    "name": "Ousmane Dembélé",
    "type": "jogador"
  },
  "FRA-16": {
    "name": "Bradley Barcola",
    "type": "jogador"
  },
  "FRA-17": {
    "name": "Désiré Doué",
    "type": "jogador"
  },
  "FRA-18": {
    "name": "Kingsley Coman",
    "type": "jogador"
  },
  "FRA-19": {
    "name": "Hugo Ekitiké",
    "type": "jogador"
  },
  "FRA-20": {
    "name": "Kylian Mbappé",
    "type": "jogador"
  },
  "SEN-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "SEN-02": {
    "name": "Édouard Mendy",
    "type": "jogador"
  },
  "SEN-03": {
    "name": "Yehvann Diouf",
    "type": "jogador"
  },
  "SEN-04": {
    "name": "Moussa Niakhaté",
    "type": "jogador"
  },
  "SEN-05": {
    "name": "Abdoulaye Seck",
    "type": "jogador"
  },
  "SEN-06": {
    "name": "Ismaïl Jakobs",
    "type": "jogador"
  },
  "SEN-07": {
    "name": "El Hadji Malick Diouf",
    "type": "jogador"
  },
  "SEN-08": {
    "name": "Kalidou Koulibaly",
    "type": "jogador"
  },
  "SEN-09": {
    "name": "Idrissa Gana Gueye",
    "type": "jogador"
  },
  "SEN-10": {
    "name": "Pape Matar Sarr",
    "type": "jogador"
  },
  "SEN-11": {
    "name": "Pape Gueye",
    "type": "jogador"
  },
  "SEN-12": {
    "name": "Habib Diarra",
    "type": "jogador"
  },
  "SEN-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "SEN-14": {
    "name": "Lamine Camara",
    "type": "jogador"
  },
  "SEN-15": {
    "name": "Sadio Mané",
    "type": "jogador"
  },
  "SEN-16": {
    "name": "Ismaïla Sarr",
    "type": "jogador"
  },
  "SEN-17": {
    "name": "Boulaye Dia",
    "type": "jogador"
  },
  "SEN-18": {
    "name": "Iliman Ndiaye",
    "type": "jogador"
  },
  "SEN-19": {
    "name": "Nicolas Jackson",
    "type": "jogador"
  },
  "SEN-20": {
    "name": "Krépin Diatta",
    "type": "jogador"
  },
  "IRQ-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "IRQ-02": {
    "name": "Jalal Hassan",
    "type": "jogador"
  },
  "IRQ-03": {
    "name": "Rebin Sulaka",
    "type": "jogador"
  },
  "IRQ-04": {
    "name": "Hussein Ali",
    "type": "jogador"
  },
  "IRQ-05": {
    "name": "Akam Hashem",
    "type": "jogador"
  },
  "IRQ-06": {
    "name": "Merchas Doski",
    "type": "jogador"
  },
  "IRQ-07": {
    "name": "Zaid Tahseen",
    "type": "jogador"
  },
  "IRQ-08": {
    "name": "Manaf Younis",
    "type": "jogador"
  },
  "IRQ-09": {
    "name": "Zidane Iqbal",
    "type": "jogador"
  },
  "IRQ-10": {
    "name": "Amir Al-Ammari",
    "type": "jogador"
  },
  "IRQ-11": {
    "name": "Ibrahim Bayesh",
    "type": "jogador"
  },
  "IRQ-12": {
    "name": "Ali Jasim",
    "type": "jogador"
  },
  "IRQ-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "IRQ-14": {
    "name": "Youssef Amyn",
    "type": "jogador"
  },
  "IRQ-15": {
    "name": "Aimar Sher",
    "type": "jogador"
  },
  "IRQ-16": {
    "name": "Marko Faraji",
    "type": "jogador"
  },
  "IRQ-17": {
    "name": "Osama Rashid",
    "type": "jogador"
  },
  "IRQ-18": {
    "name": "Ali Al-Hamadi",
    "type": "jogador"
  },
  "IRQ-19": {
    "name": "Aymen Hussein",
    "type": "jogador"
  },
  "IRQ-20": {
    "name": "Mohanad Ali",
    "type": "jogador"
  },
  "NOR-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "NOR-02": {
    "name": "Ørjan Nyland",
    "type": "jogador"
  },
  "NOR-03": {
    "name": "Julian Ryerson",
    "type": "jogador"
  },
  "NOR-04": {
    "name": "Leo Østigård",
    "type": "jogador"
  },
  "NOR-05": {
    "name": "Kristoffer Vassbakk Ajer",
    "type": "jogador"
  },
  "NOR-06": {
    "name": "Marcus Holmgren Pedersen",
    "type": "jogador"
  },
  "NOR-07": {
    "name": "David Møller Wolfe",
    "type": "jogador"
  },
  "NOR-08": {
    "name": "Torbjørn Heggem",
    "type": "jogador"
  },
  "NOR-09": {
    "name": "Morten Thorsby",
    "type": "jogador"
  },
  "NOR-10": {
    "name": "Martin Ødegaard",
    "type": "jogador"
  },
  "NOR-11": {
    "name": "Sander Berge",
    "type": "jogador"
  },
  "NOR-12": {
    "name": "Andreas Schjelderup",
    "type": "jogador"
  },
  "NOR-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "NOR-14": {
    "name": "Patrick Berg",
    "type": "jogador"
  },
  "NOR-15": {
    "name": "Erling Haaland",
    "type": "jogador"
  },
  "NOR-16": {
    "name": "Alexander Sørloth",
    "type": "jogador"
  },
  "NOR-17": {
    "name": "Aron Dønnum",
    "type": "jogador"
  },
  "NOR-18": {
    "name": "Jørgen Strand Larsen",
    "type": "jogador"
  },
  "NOR-19": {
    "name": "Antonio Nusa",
    "type": "jogador"
  },
  "NOR-20": {
    "name": "Oscar Bobb",
    "type": "jogador"
  },
  "ARG-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "ARG-02": {
    "name": "Emiliano Martínez",
    "type": "jogador"
  },
  "ARG-03": {
    "name": "Nahuel Molina",
    "type": "jogador"
  },
  "ARG-04": {
    "name": "Cristian Romero",
    "type": "jogador"
  },
  "ARG-05": {
    "name": "Nicolás Otamendi",
    "type": "jogador"
  },
  "ARG-06": {
    "name": "Nicolás Tagliafico",
    "type": "jogador"
  },
  "ARG-07": {
    "name": "Leonardo Balerdi",
    "type": "jogador"
  },
  "ARG-08": {
    "name": "Enzo Fernández",
    "type": "jogador"
  },
  "ARG-09": {
    "name": "Alexis Mac Allister",
    "type": "jogador"
  },
  "ARG-10": {
    "name": "Rodrigo De Paul",
    "type": "jogador"
  },
  "ARG-11": {
    "name": "Exequiel Palacios",
    "type": "jogador"
  },
  "ARG-12": {
    "name": "Leandro Paredes",
    "type": "jogador"
  },
  "ARG-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "ARG-14": {
    "name": "Nico Paz",
    "type": "jogador"
  },
  "ARG-15": {
    "name": "Franco Mastantuono",
    "type": "jogador"
  },
  "ARG-16": {
    "name": "Nico González",
    "type": "jogador"
  },
  "ARG-17": {
    "name": "Lionel Messi",
    "type": "jogador"
  },
  "ARG-18": {
    "name": "Lautaro Martínez",
    "type": "jogador"
  },
  "ARG-19": {
    "name": "Julián Alvarez",
    "type": "jogador"
  },
  "ARG-20": {
    "name": "Giuliano Simeone",
    "type": "jogador"
  },
  "ALG-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "ALG-02": {
    "name": "Alexis Guendouz",
    "type": "jogador"
  },
  "ALG-03": {
    "name": "Ramy Bensebaini",
    "type": "jogador"
  },
  "ALG-04": {
    "name": "Youcef Atal",
    "type": "jogador"
  },
  "ALG-05": {
    "name": "Rayan Aït-Nouri",
    "type": "jogador"
  },
  "ALG-06": {
    "name": "Mohamed Amine Tougaï",
    "type": "jogador"
  },
  "ALG-07": {
    "name": "Aïssa Mandi",
    "type": "jogador"
  },
  "ALG-08": {
    "name": "Ismaël Bennacer",
    "type": "jogador"
  },
  "ALG-09": {
    "name": "Houssem Aouar",
    "type": "jogador"
  },
  "ALG-10": {
    "name": "Hicham Boudaoui",
    "type": "jogador"
  },
  "ALG-11": {
    "name": "Ramiz Zerrouki",
    "type": "jogador"
  },
  "ALG-12": {
    "name": "Nabil Bentaleb",
    "type": "jogador"
  },
  "ALG-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "ALG-14": {
    "name": "Farès Chaïbi",
    "type": "jogador"
  },
  "ALG-15": {
    "name": "Riyad Mahrez",
    "type": "jogador"
  },
  "ALG-16": {
    "name": "Saïd Benrahma",
    "type": "jogador"
  },
  "ALG-17": {
    "name": "Anis Hadj Moussa",
    "type": "jogador"
  },
  "ALG-18": {
    "name": "Amine Gouiri",
    "type": "jogador"
  },
  "ALG-19": {
    "name": "Baghdad Bounedjah",
    "type": "jogador"
  },
  "ALG-20": {
    "name": "Mohammed Amoura",
    "type": "jogador"
  },
  "AUT-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "AUT-02": {
    "name": "Alexander Schlager",
    "type": "jogador"
  },
  "AUT-03": {
    "name": "Patrick Pentz",
    "type": "jogador"
  },
  "AUT-04": {
    "name": "David Alaba",
    "type": "jogador"
  },
  "AUT-05": {
    "name": "Kevin Danso",
    "type": "jogador"
  },
  "AUT-06": {
    "name": "Philipp Lienhart",
    "type": "jogador"
  },
  "AUT-07": {
    "name": "Stefan Posch",
    "type": "jogador"
  },
  "AUT-08": {
    "name": "Philipp Mwene",
    "type": "jogador"
  },
  "AUT-09": {
    "name": "Alexander Prass",
    "type": "jogador"
  },
  "AUT-10": {
    "name": "Xaver Schlager",
    "type": "jogador"
  },
  "AUT-11": {
    "name": "Marcel Sabitzer",
    "type": "jogador"
  },
  "AUT-12": {
    "name": "Konrad Laimer",
    "type": "jogador"
  },
  "AUT-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "AUT-14": {
    "name": "Florian Grillitsch",
    "type": "jogador"
  },
  "AUT-15": {
    "name": "Nicolas Seiwald",
    "type": "jogador"
  },
  "AUT-16": {
    "name": "Romano Schmid",
    "type": "jogador"
  },
  "AUT-17": {
    "name": "Patrick Wimmer",
    "type": "jogador"
  },
  "AUT-18": {
    "name": "Christoph Baumgartner",
    "type": "jogador"
  },
  "AUT-19": {
    "name": "Michael Gregoritsch",
    "type": "jogador"
  },
  "AUT-20": {
    "name": "Marko Arnautović",
    "type": "jogador"
  },
  "JOR-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "JOR-02": {
    "name": "Yazeed Abulaila",
    "type": "jogador"
  },
  "JOR-03": {
    "name": "Yazan Al-Arab",
    "type": "jogador"
  },
  "JOR-04": {
    "name": "Mohammad Abu Hashish",
    "type": "jogador"
  },
  "JOR-05": {
    "name": "Yazan Al-Arab",
    "type": "jogador"
  },
  "JOR-06": {
    "name": "Abdallah Nasib",
    "type": "jogador"
  },
  "JOR-07": {
    "name": "Salem Al-Ajalin",
    "type": "jogador"
  },
  "JOR-08": {
    "name": "Mohammad Abualnadi",
    "type": "jogador"
  },
  "JOR-09": {
    "name": "Ibrahim Sadeh",
    "type": "jogador"
  },
  "JOR-10": {
    "name": "Nizar Al-Rashdan",
    "type": "jogador"
  },
  "JOR-11": {
    "name": "Noor Al-Rawabdeh",
    "type": "jogador"
  },
  "JOR-12": {
    "name": "Mohammad Abu Taha",
    "type": "jogador"
  },
  "JOR-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "JOR-14": {
    "name": "Amer Jamous",
    "type": "jogador"
  },
  "JOR-15": {
    "name": "Mousa Al-Taamari",
    "type": "jogador"
  },
  "JOR-16": {
    "name": "Yazan Al-Naimat",
    "type": "jogador"
  },
  "JOR-17": {
    "name": "Mahmoud Al-Mardi",
    "type": "jogador"
  },
  "JOR-18": {
    "name": "Ali Olwan",
    "type": "jogador"
  },
  "JOR-19": {
    "name": "Mohammad Abu Zrayo",
    "type": "jogador"
  },
  "JOR-20": {
    "name": "Ibrahim Sabra",
    "type": "jogador"
  },
  "POR-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "POR-02": {
    "name": "Diogo Costa",
    "type": "jogador"
  },
  "POR-03": {
    "name": "José Sá",
    "type": "jogador"
  },
  "POR-04": {
    "name": "Rúben Dias",
    "type": "jogador"
  },
  "POR-05": {
    "name": "João Cancelo",
    "type": "jogador"
  },
  "POR-06": {
    "name": "Diogo Dalot",
    "type": "jogador"
  },
  "POR-07": {
    "name": "Nuno Mendes",
    "type": "jogador"
  },
  "POR-08": {
    "name": "Gonçalo Inácio",
    "type": "jogador"
  },
  "POR-09": {
    "name": "Bernardo Silva",
    "type": "jogador"
  },
  "POR-10": {
    "name": "Bruno Fernandes",
    "type": "jogador"
  },
  "POR-11": {
    "name": "Rúben Neves",
    "type": "jogador"
  },
  "POR-12": {
    "name": "Vitinha",
    "type": "jogador"
  },
  "POR-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "POR-14": {
    "name": "João Neves",
    "type": "jogador"
  },
  "POR-15": {
    "name": "Cristiano Ronaldo",
    "type": "jogador"
  },
  "POR-16": {
    "name": "Francisco Trincão",
    "type": "jogador"
  },
  "POR-17": {
    "name": "João Félix",
    "type": "jogador"
  },
  "POR-18": {
    "name": "Gonçalo Ramos",
    "type": "jogador"
  },
  "POR-19": {
    "name": "Pedro Neto",
    "type": "jogador"
  },
  "POR-20": {
    "name": "Rafael Leão",
    "type": "jogador"
  },
  "COD-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "COD-02": {
    "name": "Lionel Mpasi",
    "type": "jogador"
  },
  "COD-03": {
    "name": "Aaron Wan-Bissaka",
    "type": "jogador"
  },
  "COD-04": {
    "name": "Axel Tuanzebe",
    "type": "jogador"
  },
  "COD-05": {
    "name": "Arthur Masuaku",
    "type": "jogador"
  },
  "COD-06": {
    "name": "Chancel Mbemba",
    "type": "jogador"
  },
  "COD-07": {
    "name": "Joris Kayembe",
    "type": "jogador"
  },
  "COD-08": {
    "name": "Charles Pickel",
    "type": "jogador"
  },
  "COD-09": {
    "name": "Ngal'ayel Mukau",
    "type": "jogador"
  },
  "COD-10": {
    "name": "Edo Kayembe",
    "type": "jogador"
  },
  "COD-11": {
    "name": "Samuel Moutoussamy",
    "type": "jogador"
  },
  "COD-12": {
    "name": "Noah Sadiki",
    "type": "jogador"
  },
  "COD-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "COD-14": {
    "name": "Théo Bongonda",
    "type": "jogador"
  },
  "COD-15": {
    "name": "Meschack Elia",
    "type": "jogador"
  },
  "COD-16": {
    "name": "Yoane Wissa",
    "type": "jogador"
  },
  "COD-17": {
    "name": "Brian Cipenga",
    "type": "jogador"
  },
  "COD-18": {
    "name": "Fiston Mayele",
    "type": "jogador"
  },
  "COD-19": {
    "name": "Cédric Bakambu",
    "type": "jogador"
  },
  "COD-20": {
    "name": "Nathanaël Mbuku",
    "type": "jogador"
  },
  "UZB-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "UZB-02": {
    "name": "Utkir Yusupov",
    "type": "jogador"
  },
  "UZB-03": {
    "name": "Farrukh Sayfiev",
    "type": "jogador"
  },
  "UZB-04": {
    "name": "Sherzod Nasrullaev",
    "type": "jogador"
  },
  "UZB-05": {
    "name": "Umar Eshmurodov",
    "type": "jogador"
  },
  "UZB-06": {
    "name": "Husniddin Aliqulov",
    "type": "jogador"
  },
  "UZB-07": {
    "name": "Rustam Ashurmatov",
    "type": "jogador"
  },
  "UZB-08": {
    "name": "Khojiakbar Alijonov",
    "type": "jogador"
  },
  "UZB-09": {
    "name": "Abdukodir Khusanov",
    "type": "jogador"
  },
  "UZB-10": {
    "name": "Otabek Hamrobekov",
    "type": "jogador"
  },
  "UZB-11": {
    "name": "Otabek Shukurov",
    "type": "jogador"
  },
  "UZB-12": {
    "name": "Jamshid Iskanderov",
    "type": "jogador"
  },
  "UZB-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "UZB-14": {
    "name": "Azizbek Turgunboev",
    "type": "jogador"
  },
  "UZB-15": {
    "name": "Khojimat Erkinov",
    "type": "jogador"
  },
  "UZB-16": {
    "name": "Eldor Shomurodov",
    "type": "jogador"
  },
  "UZB-17": {
    "name": "Oston Urunov",
    "type": "jogador"
  },
  "UZB-18": {
    "name": "Jaloliddin Masharipov",
    "type": "jogador"
  },
  "UZB-19": {
    "name": "Igor Sergeev",
    "type": "jogador"
  },
  "UZB-20": {
    "name": "Abbosbek Fayzullaev",
    "type": "jogador"
  },
  "COL-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "COL-02": {
    "name": "Camilo Vargas",
    "type": "jogador"
  },
  "COL-03": {
    "name": "David Ospina",
    "type": "jogador"
  },
  "COL-04": {
    "name": "Davinson Sánchez",
    "type": "jogador"
  },
  "COL-05": {
    "name": "Yerry Mina",
    "type": "jogador"
  },
  "COL-06": {
    "name": "Daniel Muñoz",
    "type": "jogador"
  },
  "COL-07": {
    "name": "Johan Mojica",
    "type": "jogador"
  },
  "COL-08": {
    "name": "Jhon Lucumí",
    "type": "jogador"
  },
  "COL-09": {
    "name": "Santiago Arias",
    "type": "jogador"
  },
  "COL-10": {
    "name": "Jefferson Lerma",
    "type": "jogador"
  },
  "COL-11": {
    "name": "Kevin Castaño",
    "type": "jogador"
  },
  "COL-12": {
    "name": "Richard Ríos",
    "type": "jogador"
  },
  "COL-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "COL-14": {
    "name": "James Rodríguez",
    "type": "jogador"
  },
  "COL-15": {
    "name": "Juan Fernando Quintero",
    "type": "jogador"
  },
  "COL-16": {
    "name": "Jorge Carrascal",
    "type": "jogador"
  },
  "COL-17": {
    "name": "Jhon Arias",
    "type": "jogador"
  },
  "COL-18": {
    "name": "Jhon Córdoba",
    "type": "jogador"
  },
  "COL-19": {
    "name": "Luis Suárez",
    "type": "jogador"
  },
  "COL-20": {
    "name": "Luis Díaz",
    "type": "jogador"
  },
  "ENG-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "ENG-02": {
    "name": "Jordan Pickford",
    "type": "jogador"
  },
  "ENG-03": {
    "name": "John Stones",
    "type": "jogador"
  },
  "ENG-04": {
    "name": "Marc Guéhi",
    "type": "jogador"
  },
  "ENG-05": {
    "name": "Ezri Konsa",
    "type": "jogador"
  },
  "ENG-06": {
    "name": "Trent Alexander-Arnold",
    "type": "jogador"
  },
  "ENG-07": {
    "name": "Reece James",
    "type": "jogador"
  },
  "ENG-08": {
    "name": "Dan Burn",
    "type": "jogador"
  },
  "ENG-09": {
    "name": "Jordan Henderson",
    "type": "jogador"
  },
  "ENG-10": {
    "name": "Declan Rice",
    "type": "jogador"
  },
  "ENG-11": {
    "name": "Jude Bellingham",
    "type": "jogador"
  },
  "ENG-12": {
    "name": "Cole Palmer",
    "type": "jogador"
  },
  "ENG-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "ENG-14": {
    "name": "Morgan Rogers",
    "type": "jogador"
  },
  "ENG-15": {
    "name": "Anthony Gordon",
    "type": "jogador"
  },
  "ENG-16": {
    "name": "Phil Foden",
    "type": "jogador"
  },
  "ENG-17": {
    "name": "Bukayo Saka",
    "type": "jogador"
  },
  "ENG-18": {
    "name": "Harry Kane",
    "type": "jogador"
  },
  "ENG-19": {
    "name": "Marcus Rashford",
    "type": "jogador"
  },
  "ENG-20": {
    "name": "Ollie Watkins",
    "type": "jogador"
  },
  "CRO-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "CRO-02": {
    "name": "Dominik Livaković",
    "type": "jogador"
  },
  "CRO-03": {
    "name": "Duje Ćaleta-Car",
    "type": "jogador"
  },
  "CRO-04": {
    "name": "Joško Gvardiol",
    "type": "jogador"
  },
  "CRO-05": {
    "name": "Josip Šutalo",
    "type": "jogador"
  },
  "CRO-06": {
    "name": "Luka Vušković",
    "type": "jogador"
  },
  "CRO-07": {
    "name": "Josip Šutalo",
    "type": "jogador"
  },
  "CRO-08": {
    "name": "Kristijan Jakić",
    "type": "jogador"
  },
  "CRO-09": {
    "name": "Luka Modrić",
    "type": "jogador"
  },
  "CRO-10": {
    "name": "Mateo Kovačić",
    "type": "jogador"
  },
  "CRO-11": {
    "name": "Andrej Kramarić",
    "type": "jogador"
  },
  "CRO-12": {
    "name": "Lovro Majer",
    "type": "jogador"
  },
  "CRO-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "CRO-14": {
    "name": "Mario Pašalić",
    "type": "jogador"
  },
  "CRO-15": {
    "name": "Petar Sučić",
    "type": "jogador"
  },
  "CRO-16": {
    "name": "Luka Sučić",
    "type": "jogador"
  },
  "CRO-17": {
    "name": "Marco Pašalić",
    "type": "jogador"
  },
  "CRO-18": {
    "name": "Ante Budimir",
    "type": "jogador"
  },
  "CRO-19": {
    "name": "Andrej Kramarić",
    "type": "jogador"
  },
  "CRO-20": {
    "name": "Igor Matanović",
    "type": "jogador"
  },
  "GHA-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "GHA-02": {
    "name": "Lawrence Ati-Zigi",
    "type": "jogador"
  },
  "GHA-03": {
    "name": "Tariq Lamptey",
    "type": "jogador"
  },
  "GHA-04": {
    "name": "Mohammed Salisu",
    "type": "jogador"
  },
  "GHA-05": {
    "name": "Alexander Djiku",
    "type": "jogador"
  },
  "GHA-06": {
    "name": "Mohammed Kudus",
    "type": "jogador"
  },
  "GHA-07": {
    "name": "Gideon Mensah",
    "type": "jogador"
  },
  "GHA-08": {
    "name": "Caleb Yirenkyi",
    "type": "jogador"
  },
  "GHA-09": {
    "name": "Abdul Issahaku Fatawu",
    "type": "jogador"
  },
  "GHA-10": {
    "name": "Thomas Partey",
    "type": "jogador"
  },
  "GHA-11": {
    "name": "Salis Abdul Samed",
    "type": "jogador"
  },
  "GHA-12": {
    "name": "KamalDeen Sulemana",
    "type": "jogador"
  },
  "GHA-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "GHA-14": {
    "name": "Mohammed Kudus",
    "type": "jogador"
  },
  "GHA-15": {
    "name": "Iñaki Williams",
    "type": "jogador"
  },
  "GHA-16": {
    "name": "Jordan Ayew",
    "type": "jogador"
  },
  "GHA-17": {
    "name": "André Ayew",
    "type": "jogador"
  },
  "GHA-18": {
    "name": "Joseph Paintsil",
    "type": "jogador"
  },
  "GHA-19": {
    "name": "Osman Bukari",
    "type": "jogador"
  },
  "GHA-20": {
    "name": "Antoine Semenyo",
    "type": "jogador"
  },
  "PAN-01": {
    "name": "Federação / Escudo",
    "type": "escudo"
  },
  "PAN-02": {
    "name": "Orlando Mosquera",
    "type": "jogador"
  },
  "PAN-03": {
    "name": "Luis Mejía",
    "type": "jogador"
  },
  "PAN-04": {
    "name": "Fidel Escobar",
    "type": "jogador"
  },
  "PAN-05": {
    "name": "Andrés Andrade",
    "type": "jogador"
  },
  "PAN-06": {
    "name": "Michael Amir Murillo",
    "type": "jogador"
  },
  "PAN-07": {
    "name": "Eric Davis",
    "type": "jogador"
  },
  "PAN-08": {
    "name": "José Córdoba",
    "type": "jogador"
  },
  "PAN-09": {
    "name": "César Blackman",
    "type": "jogador"
  },
  "PAN-10": {
    "name": "Cristian Martínez",
    "type": "jogador"
  },
  "PAN-11": {
    "name": "Aníbal Godoy",
    "type": "jogador"
  },
  "PAN-12": {
    "name": "Adalberto Carrasquilla",
    "type": "jogador"
  },
  "PAN-13": {
    "name": "Símbolos / Especial",
    "type": "especial"
  },
  "PAN-14": {
    "name": "Édgar Bárcenas",
    "type": "jogador"
  },
  "PAN-15": {
    "name": "Carlos Harvey",
    "type": "jogador"
  },
  "PAN-16": {
    "name": "Ismael Díaz",
    "type": "jogador"
  },
  "PAN-17": {
    "name": "José Fajardo",
    "type": "jogador"
  },
  "PAN-18": {
    "name": "Cecilio Waterman",
    "type": "jogador"
  },
  "PAN-19": {
    "name": "José Luis Rodríguez",
    "type": "jogador"
  },
  "PAN-20": {
    "name": "Alberto Quintero",
    "type": "jogador"
  },
  "FWC-01": {
    "name": "FWC 1",
    "type": "history"
  },
  "FWC-02": {
    "name": "FWC 2",
    "type": "history"
  },
  "FWC-03": {
    "name": "FWC 3",
    "type": "history"
  },
  "FWC-04": {
    "name": "FWC 4",
    "type": "history"
  },
  "FWC-05": {
    "name": "FWC 5",
    "type": "history"
  },
  "FWC-06": {
    "name": "FWC 6",
    "type": "history"
  },
  "FWC-07": {
    "name": "FWC 7",
    "type": "history"
  },
  "FWC-08": {
    "name": "FWC 8",
    "type": "history"
  },
  "FWC-09": {
    "name": "FWC 9",
    "type": "history"
  },
  "FWC-10": {
    "name": "FWC 10",
    "type": "history"
  },
  "FWC-11": {
    "name": "FWC 11",
    "type": "history"
  },
  "FWC-12": {
    "name": "FWC 12",
    "type": "history"
  },
  "FWC-13": {
    "name": "FWC 13",
    "type": "history"
  },
  "FWC-14": {
    "name": "FWC 14",
    "type": "history"
  },
  "FWC-15": {
    "name": "FWC 15",
    "type": "history"
  },
  "FWC-16": {
    "name": "FWC 16",
    "type": "history"
  },
  "FWC-17": {
    "name": "FWC 17",
    "type": "history"
  },
  "FWC-18": {
    "name": "FWC 18",
    "type": "history"
  },
  "FWC-19": {
    "name": "FWC 19",
    "type": "history"
  },
  "FWC-20": {
    "name": "FWC 20",
    "type": "history"
  },
  "COC-01": {
    "name": "Lamine Yamal",
    "type": "coca-cola"
  },
  "CC-01": {
    "name": "Lamine Yamal",
    "type": "coca-cola"
  },
  "COC-02": {
    "name": "Joshua Kimmich",
    "type": "coca-cola"
  },
  "CC-02": {
    "name": "Joshua Kimmich",
    "type": "coca-cola"
  },
  "COC-03": {
    "name": "Harry Kane",
    "type": "coca-cola"
  },
  "CC-03": {
    "name": "Harry Kane",
    "type": "coca-cola"
  },
  "COC-04": {
    "name": "Santiago Giménez",
    "type": "coca-cola"
  },
  "CC-04": {
    "name": "Santiago Giménez",
    "type": "coca-cola"
  },
  "COC-05": {
    "name": "Joško Gvardiol",
    "type": "coca-cola"
  },
  "CC-05": {
    "name": "Joško Gvardiol",
    "type": "coca-cola"
  },
  "COC-06": {
    "name": "Federico Valverde",
    "type": "coca-cola"
  },
  "CC-06": {
    "name": "Federico Valverde",
    "type": "coca-cola"
  },
  "COC-07": {
    "name": "Jefferson Lerma",
    "type": "coca-cola"
  },
  "CC-07": {
    "name": "Jefferson Lerma",
    "type": "coca-cola"
  },
  "COC-08": {
    "name": "Enner Valencia",
    "type": "coca-cola"
  },
  "CC-08": {
    "name": "Enner Valencia",
    "type": "coca-cola"
  },
  "COC-09": {
    "name": "Gabriel Magalhães",
    "type": "coca-cola"
  },
  "CC-09": {
    "name": "Gabriel Magalhães",
    "type": "coca-cola"
  },
  "COC-10": {
    "name": "Virgil van Dijk",
    "type": "coca-cola"
  },
  "CC-10": {
    "name": "Virgil van Dijk",
    "type": "coca-cola"
  },
  "COC-11": {
    "name": "Alphonso Davies",
    "type": "coca-cola"
  },
  "CC-11": {
    "name": "Alphonso Davies",
    "type": "coca-cola"
  },
  "COC-12": {
    "name": "Emiliano Martínez",
    "type": "coca-cola"
  },
  "CC-12": {
    "name": "Emiliano Martínez",
    "type": "coca-cola"
  },
  "COC-13": {
    "name": "Raúl Jiménez",
    "type": "coca-cola"
  },
  "CC-13": {
    "name": "Raúl Jiménez",
    "type": "coca-cola"
  },
  "COC-14": {
    "name": "Lautaro Martínez",
    "type": "coca-cola"
  },
  "CC-14": {
    "name": "Lautaro Martínez",
    "type": "coca-cola"
  }
};
