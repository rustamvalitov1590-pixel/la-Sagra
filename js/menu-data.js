/**
 * La SAGRA — Italian Kitchen & Wine (г. Уральск, ул. Маншук Маметовой, 44, ЖК Central)
 * Каталог блюд, архитектурных зон, реальных фотографий 2ГИС и отзывов гостей
 */

const RESTAURANT_INFO = {
  name: 'La SAGRA',
  subtitle: 'Italian Kitchen & Wine',
  city: 'Уральск',
  address: 'ул. Маншук Маметовой, 44 (ЖК Central)',
  phoneDisplay: '+7 (778) 455-13-42',
  phoneRaw: '+77784551342',
  whatsappUrl: 'https://wa.me/77784551342',
  instagramUrl: 'https://www.instagram.com/lasagra.restaurant/',
  twoGisUrl: 'https://2gis.kz/uralsk/firm/70000001116870134',
  twoGisPhotosUrl: 'https://go.2gis.com/7ZYyE',
  hours: 'Ежедневно 12:00 – 00:00',
  kitchenHours: 'Кухня работает до 23:00',
  rating: '4.6',
  ratingsCount: 91,
  reviewsCount: 42,
  coords: [51.219474, 51.360436]
};

const ARCHITECTURAL_ZONES = [
  {
    id: 'vaults',
    floor: '1 этаж',
    name: 'Зал под кирпичными сводами',
    subtitle: 'Брусчатка, оливковые деревья и люстра с лимонами Амальфи',
    capacity: 'Столы на 2–6 персон',
    atmosphere: 'Просторный светлый зал с высокими стрельчатыми окнами, сводчатыми потолками из старого кирпича и живыми оливами в кадках.',
    mainPhoto: 'assets/photos/hall-cobblestone.jpg',
    secondaryPhoto: 'assets/photos/hall-overview.jpg',
    detailPhoto: 'assets/photos/lemon-chandelier-arch.jpg',
    features: ['Стрельчатые окна в пол', 'Люстра из ветвей с лимонами', 'Мягкие велюровые кресла цвета бордо']
  },
  {
    id: 'fireplace',
    floor: '1 этаж',
    name: 'Каминный салон у лестницы',
    subtitle: 'Резной портал камина, состаренное зеркало и кованая балюстрада',
    capacity: 'Камерные столы на 2–4 персоны',
    atmosphere: 'Уютная зона у скульптурного камина цвета теплого известняка с высоким антикварным зеркалом в латунной раскладке и видом на винтовую лестницу.',
    mainPhoto: 'assets/photos/main-hall-fireplace.jpg',
    secondaryPhoto: 'assets/photos/fireplace-detail.jpg',
    detailPhoto: 'assets/photos/spiral-staircase.jpg',
    features: ['Резной каминный портал', 'Антикварное зеркало в золотой раме', 'Подходит для романтического ужина']
  },
  {
    id: 'forno',
    floor: '1 этаж',
    name: 'Зона у мозаичной печи Forno',
    subtitle: 'Открытая кухня, терракотовая печь и кресла с орнаментом икат',
    capacity: 'Столы на 2–6 персон',
    atmosphere: 'Живая гастрономическая сцена у дровяной мозаичной печи, где на ваших глазах выпекают неаполитанскую пиццу и фокаччу из муки Le 5 Stagioni.',
    mainPhoto: 'assets/photos/open-kitchen-hall.jpg',
    secondaryPhoto: 'assets/photos/forno-mosaic.jpg',
    detailPhoto: 'assets/photos/collage-details.jpg',
    features: ['Живой огонь дровяной печи', 'Расписная стойка с лимонами', 'Быстрая подача горячей пиццы и фокаччи']
  },
  {
    id: 'gallery',
    floor: '2 этаж',
    name: 'Верхняя галерея & Банкетный зал',
    subtitle: 'Кессонный потолок, ботанические фрески и приватная посадка',
    capacity: 'Компании 6–25 персон и приватные столы',
    atmosphere: 'Уединенный второй этаж, куда ведет кованая винтовая лестница. Кессонный потолок с мягкой подсветкой, коллекция гравюр и праздничная сервировка с бордовым текстилем.',
    mainPhoto: 'assets/photos/banquet-table.jpg',
    secondaryPhoto: 'assets/photos/botanical-gallery-wall.jpg',
    detailPhoto: 'assets/photos/sconce-fresco.jpg',
    features: ['Приватная атмосфера 2 этажа', 'Именная банкетная сервировка', 'Торт Чиприани в комплимент именинникам']
  }
];

const MENU_CATEGORIES = [
  { id: 'all', name: 'Все разделы' },
  { id: 'pasta', name: 'Паста & Ризони' },
  { id: 'pizza', name: 'Пицца из печи & Фокачча' },
  { id: 'antipasti', name: 'Антипасти & Салаты' },
  { id: 'mains', name: 'Горячее & Морепродукты' },
  { id: 'desserts', name: 'Десерты у стола' },
  { id: 'bar', name: 'Лимончелло & Вино' }
];

const MENU_ITEMS = [
  // Паста & Ризони (Реальные позиции из фото и отзывов 2ГИС)
  {
    id: 'pasta-frutti-di-mare',
    category: 'pasta',
    title: 'Казаречче с морепродуктами в медной сковороде',
    titleIt: 'Casarecce ai Frutti di Mare',
    termExplain: 'Казаречче — домашняя сицилийская паста в форме свернутых трубочек, удерживающая густой морской соус внутри.',
    price: 7800,
    weight: '360 г',
    calories: '510 ккал',
    note: 'Подача в медной сковороде',
    image: 'assets/photos/pasta-frutti-di-mare.jpg',
    description: 'Домашняя паста казаречче с аргентинским лангустином на гриле, мидиями в створках, вонголе, кольцами кальмара и томатами черри в соусе биск на белом вине.',
    ingredients: ['Паста казаречче ручной работы', 'Аргентинский лангустин', 'Вонголе и мидии', 'Кальмар', 'Томаты черри', 'Соус биск и петрушка'],
    winePairing: 'Pinot Grigio Alto Adige или охлажденное Vermentino di Sardegna.'
  },
  {
    id: 'risoni-unagi',
    category: 'pasta',
    title: 'Сливочное ризони с угрем унаги и пармезаном',
    titleIt: 'Risoni Cremosi con Anguilla',
    termExplain: 'Ризони (орзо) — итальянская паста в форме крупных рисовых зерен, которую готовят по технике кремового ризотто.',
    price: 6900,
    weight: '310 г',
    calories: '580 ккал',
    note: 'Фирменная подача на керамике',
    image: 'assets/photos/risoni-unagi.jpg',
    description: 'Нежная паста ризони, томленная в сливках с выдержанным Parmigiano Reggiano и зеленью, подается с обжаренным филе угря в карамельном соусе унаги.',
    ingredients: ['Паста ризони (орзо)', 'Филе угря унаги', 'Сыр Parmigiano Reggiano 24 мес.', 'Сливки 33%', 'Соус унаги', 'Микрозелень'],
    winePairing: 'Бокал полусухого Riesling или легкое Soave Classico.'
  },
  {
    id: 'pasta-truffle-parmigiano',
    category: 'pasta',
    title: 'Тальолини в сырной голове с черным трюфелем',
    titleIt: 'Tagliolini al Tartufo Nero in Forma',
    termExplain: 'Паста замешивается в горячем виде прямо в выдержанной голове сыра Пармиджано Реджано.',
    price: 7400,
    weight: '290 г',
    calories: '590 ккал',
    note: 'Из сырной головы Parmigiano',
    image: 'assets/photos/truffle-pasta-pear-pizza.jpg',
    description: 'Тонкая яичная паста ручной нарезки в густом сливочно-трюфельном соусе с пастой из черного умбрийского трюфеля и хлопьями выдержанного пармезана.',
    ingredients: ['Домашние тальолини на желтках', 'Крем из черного трюфеля', 'Сыр Parmigiano Reggiano', 'Сливочное масло 82.5%', 'Свежемолотый перец'],
    winePairing: 'Выдержанное Barbaresco или Barbera d’Alba.'
  },
  {
    id: 'risoni-pollo-demiglace',
    category: 'pasta',
    title: 'Ризони с фермерским цыпленком и соусом демигляс',
    titleIt: 'Risoni con Pollo Arrosto',
    termExplain: 'Ризони — мелкая итальянская паста, томленная с сыром и сливочным маслом до шелковистой текстуры.',
    price: 5400,
    weight: '320 г',
    calories: '520 ккал',
    note: 'Сытное блюдо',
    image: 'assets/photos/risoni-pollo.jpg',
    description: 'Томленая паста ризони с пармезаном и травами под румяным филе цыпленка су-вид с глянцевым мясным соусом демигляс.',
    ingredients: ['Паста ризони', 'Филе фермерского цыпленка', 'Мясной соус демигляс', 'Пармезан', 'Сливочное масло', 'Петрушка'],
    winePairing: 'Мягкое тосканское Chianti Classico или Шардоне.'
  },
  {
    id: 'pasta-carbonara-autentica',
    category: 'pasta',
    title: 'Спагетти Карбонара на желтках и гуанчале',
    titleIt: 'Spaghetti alla Carbonara',
    termExplain: 'Готовится по римскому канону: соус эмульгируется из фермерских желтков и овечьего сыра Пекорино.',
    price: 5600,
    weight: '290 г',
    calories: '610 ккал',
    note: 'Римская классика',
    image: 'assets/photos/pasta-frutti-di-mare.jpg',
    description: 'Классическая паста с хрустящими ломтиками вяленого гуанчале, эмульсией из яичных желтков, сыром Pecorino Romano и дробленым черным перцем.',
    ingredients: ['Спагетти из твердой пшеницы', 'Гуанчале', 'Желтки фермерских яиц', 'Pecorino Romano DOP', 'Черный перец горошком'],
    winePairing: 'Montepulciano d’Abruzzo или сухое розовое вино.'
  },
  {
    id: 'pasta-gamberi-pesto',
    category: 'pasta',
    title: 'Лингвини с тигровыми креветками и генуэзским песто',
    titleIt: 'Linguine ai Gamberi e Pesto',
    termExplain: 'Лингвини — плоская длинная паста родом из Лигурии, созданная специально для соуса песто и морепродуктов.',
    price: 6800,
    weight: '310 г',
    calories: '530 ккал',
    note: 'Хит по отзывам гостей',
    image: 'assets/photos/grilled-prawns.jpg',
    description: 'Паста лингвини с обжаренными тигровыми креветками, домашним песто из зеленого базилика, кедровых орешков, оливкового масла Extra Virgin и пармезана.',
    ingredients: ['Паста лингвини', 'Тигровые креветки', 'Свежий зеленый базилик', 'Кедровый орех', 'Оливковое масло Extra Virgin', 'Пармезан'],
    winePairing: 'Gavi di Gavi или свежий Sauvignon Blanc.'
  },

  // Пицца из мозаичной печи Forno a Legna & Фокачча
  {
    id: 'pizza-pera-gorgonzola',
    category: 'pizza',
    title: 'Пицца с грушей, горгонзолой и медом из дровяной печи',
    titleIt: 'Pizza Pera e Gorgonzola',
    termExplain: 'Выпекается в нашей мозаичной печи из итальянской муки Le 5 Stagioni Napoletana Rossa при 430 °C.',
    price: 5400,
    weight: '420 г',
    calories: '640 ккал',
    note: 'Печь Forno a Legna · Le 5 Stagioni',
    image: 'assets/photos/truffle-pasta-pear-pizza.jpg',
    description: 'Тонкое тесто длительной ферментации с воздушным леопардовым бортиком, сливочной моцареллой фиор ди латте, пикантной горгонзолой, ломтиками спелой груши и цветочным медом.',
    ingredients: ['Мука Le 5 Stagioni Napoletana', 'Моцарелла Fior di Latte', 'Сыр Горгонзола DOP', 'Спелая груша Конференция', 'Цветочный мед'],
    winePairing: 'Бокал Prosecco Superiore Valdobbiadene или белое сухое Soave.'
  },
  {
    id: 'pizza-mortadella-pistacchio',
    category: 'pizza',
    title: 'Неаполитанская пицца с мортаделлой и страчателлой',
    titleIt: 'Pizza Mortadella e Stracciatella',
    termExplain: 'Мортаделла — традиционная болонская вареная колбаса с фисташками, выкладывается на горячую пиццу после печи.',
    price: 5900,
    weight: '450 г',
    calories: '690 ккал',
    note: 'Подача на расписной керамике',
    image: 'assets/photos/service-pizza.jpg',
    description: 'Пицца из мозаичной дровяной печи со сливочной основой, нежной страчателлой, тонкими слайсами итальянской мортаделлы, дробленой фисташкой и листиками базилика.',
    ingredients: ['Тесто 48 часов ферментации', 'Итальянская мортаделла', 'Свежая страчателла', 'Фисташка жареная', 'Моцарелла', 'Оливковое масло'],
    winePairing: 'Легкое Lambrusco Secco или молодое Pinot Noir.'
  },
  {
    id: 'focaccia-rosmarino',
    category: 'pizza',
    title: 'Горячая фокачча из дровяной печи с розмарином и пармезаном',
    titleIt: 'Focaccia Calda al Rosmarino',
    termExplain: 'Традиционная итальянская лепешка из печи, которую подают в стол к закускам, салатам и вину.',
    price: 2200,
    weight: '240 г',
    calories: '380 ккал',
    note: 'К закускам и салатам',
    image: 'assets/photos/stracciatella-focaccia.jpg',
    description: 'Тонкая хрустящая фокачча из печи с оливковым маслом первого отжима, морской солью, веточками свежего розмарина и тертым пармезаном.',
    ingredients: ['Мука Le 5 Stagioni', 'Оливковое масло Extra Virgin', 'Свежий розмарин', 'Пармезан', 'Морская соль'],
    winePairing: 'Идеальна к любым антипасти и аперитивам.'
  },

  // Антипасти & Салаты
  {
    id: 'salad-tuna-tataki',
    category: 'antipasti',
    title: 'Нисуаз по-итальянски с татаки из тунца и молодым картофелем',
    titleIt: 'Insalata con Tonno Scottato',
    termExplain: 'Татаки — филе тунца, быстро обжаренное только по краям, чтобы середина осталась сочной и нежной.',
    price: 6400,
    weight: '280 г',
    calories: '390 ккал',
    note: 'Реальное фото подачи',
    image: 'assets/photos/tuna-tataki-salad.jpg',
    description: 'Обжаренное филе желтоперого тунца редкой прожарки с молодым запеченным картофелем, фермерским яйцом, томатами черри, каперсами, красным луком и листьями шпината.',
    ingredients: ['Филе желтоперого тунца', 'Молодой картофель', 'Яйцо всмятку', 'Шпинат и салатный микс', 'Томаты черри', 'Каперсы и цитрусовая заправка'],
    winePairing: 'Розовое вино Прованса или сухое Vermentino.'
  },
  {
    id: 'antipasti-stracciatella-pomodori',
    category: 'antipasti',
    title: 'Страчателла со сладкими томатами, песто и кедровым орехом',
    titleIt: 'Stracciatella con Pomodori Dolci',
    termExplain: 'Страчателла — самая нежная внутренняя часть сыра буррата из нитей моцареллы в густых сливках.',
    price: 5200,
    weight: '260 г',
    calories: '360 ккал',
    note: 'Свежий сливочный сыр',
    image: 'assets/photos/stracciatella-focaccia.jpg',
    description: 'Прохладная сливочная страчателла на подушке из спелых томатов черри с пряным соусом песто, дробленым орехом, зеленью и бальзамическим кремом из Модены.',
    ingredients: ['Сыр страчателла', 'Сладкие томаты черри', 'Домашний соус песто', 'Кедровый орех', 'Бальзамик из Модены', 'Свежая зелень'],
    winePairing: 'Хрустящее Pinot Grigio или бокал Franciacorta.'
  },
  {
    id: 'salad-roastbeef-rucola',
    category: 'antipasti',
    title: 'Салат с нежным ростбифом, рукколой и вялеными томатами',
    titleIt: 'Insalata di Roastbeef e Rucola',
    termExplain: 'Тонкие слайсы маринованной в травах говяжьей вырезки розовой прожарки.',
    price: 5800,
    weight: '250 г',
    calories: '370 ккал',
    note: 'Розовая прожарка Medium Rare',
    image: 'assets/photos/stracciatella-focaccia.jpg',
    description: 'Тонкие лепестки сочного ростбифа с дикой рукколой, сладкими томатами, кедровыми орешками и горчично-медовой заправкой на оливковом масле.',
    ingredients: ['Ростбиф из говяжьей вырезки', 'Дикая руккола', 'Томаты черри', 'Пармезан', 'Горчично-медовый дрессинг'],
    winePairing: 'Молодое Chianti или Valpolicella Classico.'
  },

  // Горячее & Морепродукты
  {
    id: 'mains-grilled-tiger-prawns',
    category: 'mains',
    title: 'Тигровые креветки на гриле с овощами и молодым картофелем',
    titleIt: 'Gamberoni alla Griglia con Verdure',
    termExplain: 'Крупные креветки в панцире обжариваются на открытом огне с чесночным маслом и травами.',
    price: 9800,
    weight: '380 г',
    calories: '440 ккал',
    note: 'Большая порция на гриле',
    image: 'assets/photos/grilled-prawns.jpg',
    description: 'Королевские и тигровые креветки на гриле с румяным молодым картофелем, сахарной кукурузой, брокколи, шампиньонами, печеными томатами и красным луком.',
    ingredients: ['Крупные тигровые креветки', 'Молодой картофель', 'Брокколи и шампиньоны на гриле', 'Сахарная кукуруза', 'Печеные томаты', 'Чесночно-травяное масло'],
    winePairing: 'Выдержанное Chardonnay или Сицилийское Grillo.'
  },
  {
    id: 'mains-filetto-manzo',
    category: 'mains',
    title: 'Медальоны из говяжьей вырезки с белыми грибами и картофелем',
    titleIt: 'Medaglioni di Manzo ai Funghi Porcini',
    termExplain: 'Центральная часть говяжьей вырезки с минимальным содержанием жира и самой мягкой текстурой.',
    price: 11200,
    weight: '310 г',
    calories: '540 ккал',
    note: 'Мраморная вырезка',
    image: 'assets/photos/banquet-table.jpg',
    description: 'Сочные медальоны прожарки Medium с рагу из лесных белых грибов, обжаренным до золотистой корочки молодым картофелем и винным соусом демигляс.',
    ingredients: ['Говяжья вырезка Prime', 'Белые грибы порчини', 'Молодой картофель с травами', 'Соус демигляс на красном вине', 'Тимьян и розмарин'],
    winePairing: 'Структурное Brunello di Montalcino или Super Tuscan.'
  },

  // Десерты с подачей у стола
  {
    id: 'dessert-tiramisu-tableside',
    category: 'desserts',
    title: 'Фирменный Тирамису La Sagra с подачей у вашего стола',
    titleIt: 'Tiramisù della Casa al Tavolo',
    termExplain: 'Официант выкладывает порцию из большой керамической формы и посыпает какао прямо перед вами.',
    price: 3800,
    weight: '190 г',
    calories: '420 ккал',
    note: 'Ритуал подачи у стола',
    image: 'assets/photos/tiramisu-tableside.jpg',
    description: 'Воздушный крем из итальянского маскарпоне и фермерских желтков, печенье савоярди, пропитанное свежесваренным эспрессо с каплей кофейного ликера, и бархатный слой какао.',
    ingredients: ['Сыр Mascarpone Crema', 'Печенье Savoiardi', 'Свежий эспрессо 100% арабика', 'Какао-пудра', 'Кофейный ликер'],
    winePairing: 'Эспрессо, авторский чай в расписном фарфоре или домашний Лимончелло.'
  },
  {
    id: 'dessert-cipriani-cake',
    category: 'desserts',
    title: 'Венецианский торт Чиприани с воздушной меренгой',
    titleIt: 'Torta Cipriani Veneziana',
    termExplain: 'Легендарный десерт венецианского Harry’s Bar из тонких бисквитных коржей, крема шантильи и обожженной меренги.',
    price: 3900,
    weight: '170 г',
    calories: '390 ккал',
    note: 'Комплимент именинникам',
    image: 'assets/photos/tiramisu-tea.jpg',
    description: 'Нежнейший многослойный ванильный бисквит с легким заварным кремом димпломат и облаком карамелизированной итальянской меренги. Именинникам подаем праздничный торт от команды ресторана.',
    ingredients: ['Ванильный бисквит', 'Крем шантильи с мадагаскарской ванилью', 'Итальянская меренга', 'Цедра лимона'],
    winePairing: 'Бокал Moscato d’Asti или авторский облепиховый чай.'
  },
  {
    id: 'dessert-cioccolato-frutti',
    category: 'desserts',
    title: 'Шоколадный ганаш с малиновым кули и трюфельным кремом',
    titleIt: 'Torta al Cioccolato Fondente e Lampone',
    termExplain: 'Плотный бархатный десерт из бельгийского темного шоколада 70% с яркой ягодной кислинкой.',
    price: 3700,
    weight: '160 г',
    calories: '430 ккал',
    note: 'Бельгийский шоколад 70%',
    image: 'assets/photos/tiramisu-tea.jpg',
    description: 'Насыщенный шоколадный мусс-ганаш с кнелей пралине, томленой малиной и съедобными лепестками василька на расписном фарфоре.',
    ingredients: ['Темный шоколад 70%', 'Свежая малина', 'Крем-пралине', 'Сливки', 'Лепестки цветов'],
    winePairing: 'Выдержанный портвейн Ruby или двойной эспрессо.'
  },

  // Лимончелло, Чай и Винная карта
  {
    id: 'bar-limoncello-casa',
    category: 'bar',
    title: 'Домашний ледяной Лимончелло Амальфи',
    titleIt: 'Limoncello Artigianale Ghiacciato',
    termExplain: 'Итальянский дижестив на цедре ароматных лимонов, подается в охлажденном тюльпановидном бокале.',
    price: 2600,
    weight: '60 мл',
    calories: '155 ккал',
    note: 'Собственная настойка',
    image: 'assets/photos/limoncello-service.jpg',
    description: 'Ароматный дижестив, настоянный на цедре солнечных лимонов без белой горчинки. Подается ледяным после основного ужина или к десерту.',
    ingredients: ['Цедра лимонов Амальфи', 'Тростниковый сироп', 'Чистая родниковая вода'],
    winePairing: 'Традиционное завершение итальянского ужина.'
  },
  {
    id: 'bar-basil-citrus-spritz',
    category: 'bar',
    title: 'Изумрудный Спритц с базиликом, бузиной и просекко',
    titleIt: 'Spritz al Basilico e Sambuco',
    termExplain: 'Освежающий аперитив перед подачей антипасти и горячей фокаччи.',
    price: 3900,
    weight: '250 мл',
    calories: '140 ккал',
    note: 'Свежий аперитив',
    image: 'assets/photos/stracciatella-focaccia.jpg',
    description: 'Легкий травянисто-цитрусовый коктейль на основе кордиала из зеленого базилика, ликера цветков бузины, сухого Prosecco и содовой со льдом.',
    ingredients: ['Prosecco DOC', 'Ликер бузины', 'Кордиал зеленый базилик и лайм', 'Содовая'],
    winePairing: 'Рекомендуется к страчателле, татаки из тунца и креветкам.'
  },
  {
    id: 'bar-sea-buckthorn-tea',
    category: 'bar',
    title: 'Пряный облепихово-цитрусовый чай в расписном фарфоре',
    titleIt: 'Tè Caldo all’Olivello Spinoso e Agrumi',
    termExplain: 'Согревающий ягодно-цитрусовый настой, сервируется в коллекционных чайных парах с красной ботанической росписью.',
    price: 3200,
    weight: '600 мл',
    calories: '120 ккал',
    note: 'Сервировка в фарфоре',
    image: 'assets/photos/tiramisu-tea.jpg',
    description: 'Густой согревающий чай из свежей облепихи, сока апельсина, цедры лимона, палочки цейлонской корицы и цветочного меда.',
    ingredients: ['Ягоды облепихи', 'Свежевыжатый апельсин', 'Лимон', 'Корица', 'Цветочный мед'],
    winePairing: 'К тирамису и торту Чиприани.'
  }
];

const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    category: 'architecture',
    zoneLabel: '1 этаж · Своды и камин',
    title: 'Люстра из ветвей с лимонами Амальфи и кирпичная арка',
    subtitle: 'Центральная ось первого этажа: своды из старого кирпича, антикварное зеркало в латунной раме и резной камин',
    image: 'assets/photos/lemon-chandelier-arch.jpg',
    aspect: 'tall'
  },
  {
    id: 'gal-2',
    category: 'forno',
    zoneLabel: 'Открытая кухня · Печь',
    title: 'Мозаичная дровяная печь Forno a Legna',
    subtitle: 'Терракотовая мозаика ручной выкладки и полосатая бордово-кремовая плитка на открытой кухне',
    image: 'assets/photos/forno-mosaic.jpg',
    aspect: 'wide'
  },
  {
    id: 'gal-3',
    category: 'architecture',
    zoneLabel: '1 этаж · Главный зал',
    title: 'Каменная брусчатка, кессонный потолок и живая олива',
    subtitle: 'Пространство главного зала с кованой винтовой лестницей на второй этаж',
    image: 'assets/photos/hall-cobblestone.jpg',
    aspect: 'tall'
  },
  {
    id: 'gal-4',
    category: 'details',
    zoneLabel: 'Фрески и свет',
    title: 'Латунное бра в виде оливковой ветви на фоне фрески',
    subtitle: 'Монохромная ботаническая роспись стен с кипарисами и пиниями в технике гризайль',
    image: 'assets/photos/sconce-fresco.jpg',
    aspect: 'tall'
  },
  {
    id: 'gal-5',
    category: 'service',
    zoneLabel: 'Подача блюд',
    title: 'Неаполитанская пицца и сервис в фирменной форме',
    subtitle: 'Внимательная подача горячих блюд из печи к столу со свечами и бордовым текстилем',
    image: 'assets/photos/service-pizza.jpg',
    aspect: 'tall'
  },
  {
    id: 'gal-6',
    category: 'service',
    zoneLabel: 'Банкеты · 2 этаж',
    title: 'Праздничная сервировка для камерных торжеств',
    subtitle: 'Драпировка цвета кьянти, жемчужные кольца для салфеток, ручная керамика и именные карточки гостей',
    image: 'assets/photos/banquet-table.jpg',
    aspect: 'normal'
  },
  {
    id: 'gal-7',
    category: 'architecture',
    zoneLabel: 'Стрельчатые окна',
    title: 'Кирпичные крестовые своды и венецианские окна',
    subtitle: 'Высокие арочные окна наполняют зал естественным светом днем и мягким свечением вечером',
    image: 'assets/photos/brick-vaults.jpg',
    aspect: 'normal'
  },
  {
    id: 'gal-8',
    category: 'facade',
    zoneLabel: 'Фасад · ЖК Central',
    title: 'Три бордовых портала La SAGRA на Маншук Маметовой, 44',
    subtitle: 'Мраморный цоколь первого этажа ЖК Central и фирменная входная группа ресторана',
    image: 'assets/photos/facade-portals.jpg',
    aspect: 'wide'
  }
];

const REVIEWS_DATA = [
  {
    id: 'rev-1',
    author: 'Azamat Sugurbayev',
    date: '2ГИС · Подтвержденный гость',
    rating: 5,
    tag: 'Сервис и атмосфера',
    staffMention: 'Администратор Лаура и команда зала',
    text: 'Остались очень приятные впечатления от посещения ресторана La Sagra. Уютная атмосфера, отличное обслуживание и внимание к гостям создают желание возвращаться сюда снова. Отдельная благодарность администратору Лауре за профессионализм, приветливость и заботу о гостях.'
  },
  {
    id: 'rev-2',
    author: 'Symbat Izbassarova',
    date: '2ГИС · День рождения в La Sagra',
    rating: 5,
    tag: 'Паста, пицца и комплимент',
    staffMention: 'Торт Чиприани от заведения',
    text: 'Отмечала тут свой день рождения: потрясающая атмосфера, красивая подача блюд, большой выбор вина. По кухне рекомендую все виды паст — особенно с креветками, карбонара, в соусе песто, пицца великолепна. На день рождения сделали комплимент — целый торт Чиприани на нашу компанию.'
  },
  {
    id: 'rev-3',
    author: 'Lyazat Adayeva',
    date: '2ГИС · Подтвержденный гость',
    rating: 5,
    tag: 'Интерьер маленькой Италии',
    staffMention: 'Администратор Лаура',
    text: 'Посетила самый красивый ресторан в городе Уральске. Все было на высшем уровне — и обслуживание, и кухня, и особенно интерьер, в котором на самом деле попадаешь в Италию. Особо хотела поблагодарить администратора Лауру за внимательное отношение.'
  },
  {
    id: 'rev-4',
    author: 'Мира & Елена Куксова',
    date: '2ГИС · Вечерний ужин',
    rating: 5,
    tag: 'Посуда и внимание к деталям',
    staffMention: 'Официанты Исмаил и Мади',
    text: 'Такое ощущение, что это вовсе не у нас в Уральске. Подача блюд очень красивая, начиная от расписной керамической посуды и заканчивая отношением персонала. Официанты Исмаил и Мади — очень внимательные, вежливые и компетентные.'
  }
];
