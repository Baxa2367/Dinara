/* Dinaraa — script.js
   Қазақ тіліндегі демонстрациялық әйелдер киімі дүкені (hash-маршрутизация, localStorage). */
'use strict';

/* ============================================================
   1. ТҰРАҚТЫЛАР ЖӘНЕ ДЕРЕКТЕР
   ============================================================ */
const BRAND = 'Dinaraa';
const KEYS = { cart: 'maral_cart_v1', fav: 'maral_fav_v1' };
const MAX_QTY = 10;
const FREE_DELIVERY_FROM = 50000;
const CL = ['XS', 'S', 'M', 'L', 'XL'];
const ONE = ['Бір өлшем'];
const SORTS = { popular: 'Танымалдығы бойынша', newest: 'Жаңалары бастапқыда', 'price-asc': 'Бағасы: өсу бойынша', 'price-desc': 'Бағасы: кему бойынша' };

const DELIVERY = {
  courier: { label: 'Курьермен жеткізу', fee: 1800, note: 'Қала ішінде (үлгі шарт)' },
  post: { label: 'Пошта арқылы (Қазақстан бойынша)', fee: 2500, note: 'Басқа қалаларға (үлгі шарт)' },
  pickup: { label: 'Дүкеннен алып кету', fee: 0, note: 'Мекенжай кейін көрсетіледі' }
};
const PAYMENTS = {
  cash: 'Алған кезде қолма-қол төлем',
  card: 'Алған кезде банк картасымен төлем',
  transfer: 'Банк аударымы (демо)'
};
const CITIES = ['Алматы', 'Астана', 'Шымкент', 'Қарағанды', 'Ақтөбе', 'Тараз', 'Павлодар', 'Өскемен', 'Семей', 'Атырау', 'Қостанай', 'Қызылорда', 'Орал', 'Петропавл', 'Ақтау', 'Түркістан', 'Көкшетау', 'Талдықорған', 'Басқа қала'];

const COLORS = {
  'Қара': '#1f1b18', 'Піл сүйегі': '#efe6d6', 'Бежді': '#cdb79e', 'Қоңыр': '#6b4a3a', 'Зәйтүн': '#7a7a55',
  'Бордо': '#6d2433', 'Сұр': '#9a9792', 'Ақ': '#fbf9f4', 'Қою көк': '#26324a', 'Ақшыл қызғылт': '#e3c4bb'
};

const CATEGORIES = [
  { id: 'koylekter', name: 'Көйлектер', desc: 'Күнделікті және мерекелік көйлектер: жұмсақ силуэттер мен таза сызықтар.', photo: '1496747611176-843222e1e57c' },
  { id: 'bluzkalar', name: 'Жейделер мен блузкалар', desc: 'Кеңсеге де, серуенге де лайық жеңіл жейделер мен нәзік блузкалар.', photo: '1485968579580-b6d095142e6e' },
  { id: 'shalbarlar', name: 'Шалбарлар', desc: 'Кең балақтан классикалық түзу пішінге дейінгі ыңғайлы шалбарлар.', photo: '1539109136881-3be0616acf4b' },
  { id: 'beldemsheler', name: 'Белдемшелер', desc: 'Мидi, қалам және плиссе белдемшелер — кез келген образға сәйкес.', photo: '1572804013309-59a88b7e92f1' },
  { id: 'syrt-kiim', name: 'Сырт киім', desc: 'Тренчтер, пальтолар және күртешелер — салқын күндердің сенімді серігі.', photo: '1591047139829-d91aecb6caea' },
  { id: 'kostumder', name: 'Костюмдер мен жиынтықтар', desc: 'Бір-бірімен үйлесетін жиынтықтар: образ жасауға кететін уақытты үнемдейді.', photo: '1594633312681-425c7b97ccd1' },
  { id: 'toqyma', name: 'Тоқыма киімдер', desc: 'Свитерлер, кардигандар және жұмсақ тоқыма заттар.', photo: '1434389677669-e08b4cac3105' },
  { id: 'aksessuarlar', name: 'Аксессуарлар', desc: 'Сөмкелер, орамалдар және образды аяқтайтын нәзік детальдар.', photo: '1584917865442-de89df76afd3' }
];

const CARE_GENTLE = '30 °C-та нәзік жуу. Төмен температурада үтіктеу. Ағартқыш қолданбаңыз.';
const CARE_DRY = 'Химиялық тазалау ұсынылады. Бумен немесе төмен температурамен үтіктеу.';
const CARE_KNIT = 'Қолмен немесе 30 °C-та нәзік жуу. Жайып кептіру, ілмеу.';
const CARE_ACC = 'Құрғақ жұмсақ шүберекпен сүртіңіз. Ылғал мен тікелей күннен сақтаңыз.';

/* Үлгі каталог: нақты қойма деректері емес */
const PRODUCTS = [
  { id: 1, name: 'Мидi көйлек «Сәуле»', cat: 'koylekter', price: 38900, old: 46900, photo: '1496747611176-843222e1e57c', sizes: CL, colors: ['Қара', 'Қоңыр', 'Зәйтүн'], material: 'Вискоза 70%, полиэстер 30%', care: CARE_GENTLE, isNew: true, best: true, pop: 96, stock: 14, added: '2026-10-05', desc: 'Белді әдемі даралайтын, тізеден төмен түсетін мидi көйлек. Мата жұмсақ әрі жеңіл, сондықтан күні бойы жайлы киіледі.' },
  { id: 2, name: 'Кешкі көйлек «Назым»', cat: 'koylekter', price: 52900, old: null, photo: '1566174053879-31528523f8ae', sizes: CL, colors: ['Бордо', 'Қара'], material: 'Сатин тәрізді полиэстер 100%', care: CARE_DRY, isNew: false, best: false, pop: 71, stock: 6, added: '2026-08-14', desc: 'Жылтыры нәзік сатин тәрізді матадан тігілген кешкі көйлек. Мерекелік кештер мен ерекше кездесулерге лайық.' },
  { id: 3, name: 'Тоқыма көйлек «Дала»', cat: 'koylekter', price: 29900, old: null, photo: '1583496661160-fb5886a13d44', sizes: CL, colors: ['Бежді', 'Сұр'], material: 'Мақта 60%, акрил 40%', care: CARE_KNIT, isNew: true, best: false, pop: 64, stock: 9, added: '2026-10-09', desc: 'Денеге жағымды тоқыма матадан жасалған күнделікті көйлек. Күртешемен де, пальтомен де жақсы үйлеседі.' },
  { id: 4, name: 'Поплин жейде «Ару»', cat: 'bluzkalar', price: 17900, old: null, photo: '1485968579580-b6d095142e6e', sizes: CL, colors: ['Ақ', 'Ақшыл қызғылт'], material: 'Мақта 100%', care: CARE_GENTLE, isNew: false, best: true, pop: 90, stock: 20, added: '2026-07-20', desc: 'Мақта поплинінен жасалған классикалық жейде. Таза сызықтары кеңсе стиліне де, күнделікті образға да сай келеді.' },
  { id: 5, name: 'Атлас блузка «Меруерт»', cat: 'bluzkalar', price: 21500, old: 25900, photo: '1487222477894-8943e31ef7b2', sizes: CL, colors: ['Піл сүйегі', 'Бордо'], material: 'Атлас тәрізді полиэстер 100%', care: CARE_GENTLE, isNew: false, best: false, pop: 68, stock: 11, added: '2026-09-02', desc: 'Жұмсақ жылтыры бар атлас блузка. Шалбармен немесе белдемшемен үйлестіріп, көркем образ жасауға болады.' },
  { id: 6, name: 'Шифон блузка «Қарлығаш»', cat: 'bluzkalar', price: 19900, old: null, photo: '1469334031218-e382a71b716b', sizes: CL, colors: ['Ақ', 'Қара', 'Бежді'], material: 'Шифон (полиэстер) 100%', care: CARE_GENTLE, isNew: true, best: false, pop: 55, stock: 8, added: '2026-10-11', desc: 'Жеңдері кең, жеңіл шифоннан тігілген блузка. Жеке де, жилеттің немесе пиджактың астынан да киюге ыңғайлы.' },
  { id: 7, name: 'Кең балақ шалбар «Алтын күз»', cat: 'shalbarlar', price: 24900, old: null, photo: '1539109136881-3be0616acf4b', sizes: CL, colors: ['Қоңыр', 'Қара', 'Бежді'], material: 'Вискоза 55%, полиэстер 45%', care: CARE_GENTLE, isNew: true, best: true, pop: 88, stock: 17, added: '2026-10-07', desc: 'Белі биік, балағы кең шалбар. Аяқты ұзарта көрсетіп, қимылға толық еркіндік береді.' },
  { id: 8, name: 'Классикалық шалбар «Астана»', cat: 'shalbarlar', price: 22900, old: 27500, photo: '1594633312681-425c7b97ccd1', sizes: CL, colors: ['Қара', 'Сұр'], material: 'Полиэстер 65%, вискоза 33%, эластан 2%', care: CARE_DRY, isNew: false, best: false, pop: 73, stock: 13, added: '2026-06-18', desc: 'Түзу кесімді, ұқыпты классикалық шалбар. Пиджакпен және жейдемен өте жақсы үйлеседі.' },
  { id: 9, name: 'Биік белді джинс «Алматы»', cat: 'shalbarlar', price: 26900, old: null, photo: '1524504388940-b1c1722653e1', sizes: CL, colors: ['Қою көк', 'Қара'], material: 'Мақта 98%, эластан 2%', care: CARE_GENTLE, isNew: false, best: true, pop: 92, stock: 4, added: '2026-05-30', desc: 'Тығыз джинс матасынан жасалған, белі биік шалбар. Күнделікті гардеробтың негізгі бөлігіне айналады.' },
  { id: 10, name: 'Плиссе белдемше «Шуақ»', cat: 'beldemsheler', price: 21900, old: null, photo: '1572804013309-59a88b7e92f1', sizes: CL, colors: ['Піл сүйегі', 'Зәйтүн'], material: 'Полиэстер 100%', care: CARE_GENTLE, isNew: true, best: false, pop: 66, stock: 10, added: '2026-10-03', desc: 'Жүріс кезінде әдемі қозғалатын плиссе мидi белдемше. Свитермен де, блузкамен де жарасады.' },
  { id: 11, name: 'Қысқа белдемше «Түн»', cat: 'beldemsheler', price: 18900, old: null, photo: '1509631179647-0177331693ae', sizes: CL, colors: ['Қара', 'Қоңыр'], material: 'Экобылғары (полиуретан)', care: CARE_ACC, isNew: false, best: false, pop: 52, stock: 7, added: '2026-08-25', desc: 'Экобылғары тәрізді матадан тігілген қысқа белдемше. Батыл әрі заманауи образ жасауға арналған.' },
  { id: 12, name: 'Қалам белдемше «Нұр»', cat: 'beldemsheler', price: 19500, old: 23500, photo: '1525507119028-ed4c629a60a3', sizes: CL, colors: ['Сұр', 'Қою көк'], material: 'Полиэстер 70%, вискоза 28%, эластан 2%', care: CARE_DRY, isNew: false, best: false, pop: 60, stock: 12, added: '2026-07-04', desc: 'Денеге сәйкес келетін, тізеге дейінгі қалам белдемше. Артында қимылға ыңғайлы жырығы бар.' },
  { id: 13, name: 'Тренч «Сарыарқа»', cat: 'syrt-kiim', price: 69900, old: 79900, photo: '1551028719-00167b16eac5', sizes: CL, colors: ['Бежді', 'Қара'], material: 'Мақта 65%, полиэстер 35%', care: CARE_DRY, isNew: false, best: true, pop: 94, stock: 5, added: '2026-09-12', desc: 'Күзгі ауа райына арналған классикалық тренч. Белдігі бар, жеңіл мата күні бойы жайлы сезім береді.' },
  { id: 14, name: 'Жүн пальто «Алтай»', cat: 'syrt-kiim', price: 98900, old: null, photo: '1591047139829-d91aecb6caea', sizes: CL, colors: ['Қоңыр', 'Сұр'], material: 'Жүн 50%, полиэстер 45%, кашемир 5%', care: CARE_DRY, isNew: true, best: false, pop: 79, stock: 3, added: '2026-10-12', desc: 'Жылы, жүн қоспалы матадан тігілген ұзын пальто. Салқын күндерге арналған сәнді әрі жайлы сырт киім.' },
  { id: 15, name: 'Қысқа күртеше «Көкжиек»', cat: 'syrt-kiim', price: 58900, old: null, photo: '1612336307429-8a898d10e223', sizes: CL, colors: ['Қара', 'Бордо'], material: 'Экобылғары, ішкі беті — полиэстер', care: CARE_ACC, isNew: false, best: false, pop: 70, stock: 8, added: '2026-09-20', desc: 'Экобылғары тәрізді қысқа күртеше. Пішіні кез келген көйлекпен немесе шалбармен жарасады.' },
  { id: 16, name: 'Пиджак пен шалбар жиынтығы «Бизнес»', cat: 'kostumder', price: 84900, old: null, photo: '1594633312681-425c7b97ccd1', sizes: CL, colors: ['Қара', 'Сұр', 'Бежді'], material: 'Полиэстер 68%, вискоза 30%, эластан 2%', care: CARE_DRY, isNew: true, best: true, pop: 83, stock: 6, added: '2026-10-08', desc: 'Пиджак пен шалбардан тұратын классикалық жиынтық. Кеңсеге және маңызды кездесулерге лайық.' },
  { id: 17, name: 'Тоқыма жиынтық «Үй сәні»', cat: 'kostumder', price: 45900, old: null, photo: '1544441893-675973e31985', sizes: CL, colors: ['Піл сүйегі', 'Қоңыр'], material: 'Мақта 55%, вискоза 40%, эластан 5%', care: CARE_KNIT, isNew: false, best: false, pop: 58, stock: 15, added: '2026-08-02', desc: 'Свитер мен шалбардан тұратын жұмсақ тоқыма жиынтық. Үйде де, серуенде де жайлы.' },
  { id: 18, name: 'Лен жиынтығы «Жайлау»', cat: 'kostumder', price: 52900, old: 61900, photo: '1509319117193-57bab727e09d', sizes: CL, colors: ['Бежді', 'Ақ'], material: 'Лен 55%, вискоза 45%', care: CARE_GENTLE, isNew: false, best: false, pop: 49, stock: 9, added: '2026-06-01', desc: 'Жазға арналған жеңіл лен қоспалы жиынтық. Мата тыныс алады, ыстық күндерге ыңғайлы.' },
  { id: 19, name: 'Жүн қоспалы свитер «Қыс»', cat: 'toqyma', price: 33900, old: null, photo: '1434389677669-e08b4cac3105', sizes: CL, colors: ['Піл сүйегі', 'Қою көк', 'Бордо'], material: 'Жүн 40%, акрил 60%', care: CARE_KNIT, isNew: true, best: true, pop: 85, stock: 18, added: '2026-10-10', desc: 'Жұмсақ жүн қоспалы свитер. Мойны биік, қыс айларында жылы ұстайды.' },
  { id: 20, name: 'Ұзын кардиган «Жұмсақ»', cat: 'toqyma', price: 29900, old: 34900, photo: '1490481651871-ab68de25d43d', sizes: CL, colors: ['Сұр', 'Бежді'], material: 'Акрил 70%, жүн 30%', care: CARE_KNIT, isNew: false, best: false, pop: 62, stock: 10, added: '2026-09-08', desc: 'Көйлектің немесе жейденің үстінен жеңіл қабат ретінде киюге болатын ұзын кардиган.' },
  { id: 21, name: 'Водолазка «Сымбат»', cat: 'toqyma', price: 15900, old: null, photo: '1529139574466-a303027c1d8b', sizes: CL, colors: ['Қара', 'Ақ', 'Қоңыр'], material: 'Мақта 95%, эластан 5%', care: CARE_GENTLE, isNew: false, best: true, pop: 87, stock: 25, added: '2026-07-11', desc: 'Денеге жағымды, ұзын жеңді водолазка. Жеке де, пиджактың астынан да киюге болады.' },
  { id: 22, name: 'Орамал «Шабыт»', cat: 'aksessuarlar', price: 12900, old: null, photo: '1492707892479-7bc8d5a4ee93', sizes: ONE, colors: ['Бордо', 'Бежді'], material: 'Жібек тәрізді полиэстер 100%', care: CARE_ACC, isNew: true, best: false, pop: 57, stock: 22, added: '2026-10-06', desc: 'Жібек тәрізді матадан жасалған орамал. Мойынға, шашқа немесе сөмке сабына байлауға болады.' },
  { id: 23, name: 'Қол сөмке «Мирас»', cat: 'aksessuarlar', price: 45900, old: 52900, photo: '1553062407-98eeb64c6a62', sizes: ONE, colors: ['Қара', 'Қоңыр'], material: 'Экобылғары, астары — мата', care: CARE_ACC, isNew: false, best: true, pop: 81, stock: 5, added: '2026-08-19', desc: 'Экобылғарыдан жасалған кең қол сөмке. Құжаттарға және күнделікті заттарға жеткілікті орын бар.' },
  { id: 24, name: 'Жүн шарф «Күз»', cat: 'aksessuarlar', price: 14900, old: null, photo: '1521577352947-9bb58764b69a', sizes: ONE, colors: ['Сұр', 'Қоңыр', 'Піл сүйегі'], material: 'Жүн 30%, акрил 70%', care: CARE_KNIT, isNew: false, best: false, pop: 59, stock: 16, added: '2026-09-15', desc: 'Жұмсақ әрі жылы шарф. Пальтомен және тренчпен өте жақсы үйлеседі.' }
];

const SIZE_GUIDE = [
  ['XS', '80', '62', '88'], ['S', '84', '66', '92'], ['M', '88', '70', '96'], ['L', '92', '74', '100'], ['XL', '96', '78', '104']
];

const INFO = {
  delivery: { title: 'Жеткізу', text: [
    'Бұл беттегі шарттар — демонстрациялық үлгі. Нақты шарттар дүкен жұмысын бастаған кезде жаңартылады.',
    'Курьермен жеткізу — 1 800 ₸, пошта арқылы Қазақстан бойынша — 2 500 ₸, дүкеннен алып кету — тегін.',
    '50 000 ₸ және одан жоғары тапсырыстарға жеткізу тегін (үлгі шарт).',
    'Жеткізу мерзімі қала мен таңдалған тәсілге байланысты болады. Нақты мерзімдер кейін көрсетіледі.'
  ] },
  payment: { title: 'Төлем', text: [
    'Тапсырыс беру кезінде үш үлгі тәсілді таңдауға болады: алған кезде қолма-қол, алған кезде банк картасымен немесе банк аударымы.',
    'Маңызды: бұл сайт демонстрациялық, сондықтан ешқандай төлем өңделмейді және банк деректері сұралмайды.',
    'Нақты онлайн төлемді қосу үшін сенімді төлем қызметін және серверлік бөлікті қосу қажет.'
  ] },
  returns: { title: 'Қайтару', text: [
    'Қайтару шарттары — үлгі мәтін. Нақты мерзімдер мен ережелерді дүкен иесі заң талаптарына сәйкес енгізеді.',
    'Үлгі шарт: тауар киілмеген, жапсырмасы мен қаптамасы сақталған болуы тиіс.',
    'Қайтару туралы өтінішті байланыс беті арқылы жіберуге болады (байланыс деректері кейін толтырылады).'
  ] },
  contacts: { title: 'Байланыс', text: [
    'Төмендегі деректер — уақытша орынтолтырғыштар. Нақты дүкен ашылғанда оларды ауыстыру керек.'
  ], contacts: true },
  privacy: { title: 'Құпиялылық саясаты', text: [
    'Бұл сайт демонстрациялық және пайдаланушы деректерін серверге жібермейді.',
    'Себет пен таңдаулылар тізімі тек сіздің браузеріңіздің localStorage жадында сақталады. Оларды браузер баптауларынан өшіруге болады.',
    'Тапсырыс формасына енгізілген деректер ешқайда жіберілмейді және сақталмайды.',
    'Нақты дүкен үшін бұл мәтінді заңгер дайындаған құжатпен ауыстыру қажет.'
  ] },
  terms: { title: 'Пайдалану шарттары', text: [
    'Сайттағы тауарлар, бағалар және суреттер — үлгі мазмұн. Олар нақты сатылымға ұсыныс болып табылмайды.',
    'Демонстрациялық тапсырыс нақты дүкенге жіберілмейді және міндеттеме тудырмайды.',
    'Нақты дүкен үшін пайдалану шарттарын заң талаптарына сәйкес дайындау қажет.'
  ] }
};

/* ============================================================
   2. КӨМЕКШІ ФУНКЦИЯЛАР
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0₸';
const getProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
const img = (photo, w) => 'https://images.unsplash.com/photo-' + photo + '?auto=format&fit=crop&w=' + w + '&q=75';
const maxQty = (p) => Math.max(0, Math.min(MAX_QTY, p.stock));
const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);

const ICON = {
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  ret: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>'
};

function loadList(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : [];
  } catch (e) { return []; }
}
function saveList(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* жад қолжетімсіз болса — үнсіз өткізу */ }
}

/* ============================================================
   3. КҮЙ (STATE)
   ============================================================ */
const state = {
  cart: [],
  fav: [],
  filters: defaultFilters(),
  route: 'home',
  order: null,
  deliveryMethod: 'courier',
  lastCatalogHash: '#/catalog',
  lastFocus: null
};

function defaultFilters() {
  return { q: '', cat: '', sizes: [], colors: [], min: '', max: '', sort: 'popular' };
}

function sanitizeCart(list) {
  const out = [];
  list.forEach((l) => {
    const p = l && getProduct(l.pid);
    if (!p || maxQty(p) < 1) return;
    const line = {
      pid: p.id,
      size: p.sizes.includes(l.size) ? l.size : p.sizes[0],
      color: p.colors.includes(l.color) ? l.color : p.colors[0],
      qty: Math.min(maxQty(p), Math.max(1, parseInt(l.qty, 10) || 1))
    };
    const ex = out.find((x) => cartKey(x) === cartKey(line));
    if (ex) ex.qty = Math.min(maxQty(p), ex.qty + line.qty);
    else out.push(line);
  });
  return out;
}
function sanitizeFav(list) {
  return Array.from(new Set(list.map(Number))).filter((id) => getProduct(id));
}
const cartKey = (l) => l.pid + '|' + l.size + '|' + l.color;
const saveCart = () => saveList(KEYS.cart, state.cart);
const saveFav = () => saveList(KEYS.fav, state.fav);
const isFav = (id) => state.fav.includes(Number(id));
const cartCount = () => state.cart.reduce((s, l) => s + l.qty, 0);
const cartSubtotal = () => state.cart.reduce((s, l) => { const p = getProduct(l.pid); return s + (p ? p.price * l.qty : 0); }, 0);

function deliveryFee(method, subtotal) {
  const m = DELIVERY[method] || DELIVERY.courier;
  if (subtotal <= 0 || m.fee === 0) return 0;
  return subtotal >= FREE_DELIVERY_FROM ? 0 : m.fee;
}
function totals(method) {
  const subtotal = cartSubtotal();
  const fee = deliveryFee(method, subtotal);
  return { subtotal, fee, total: subtotal + fee };
}

/* ============================================================
   4. ХАБАРЛАНДЫРУЛАР, ТЕРЕЗЕ, ЖАЛПЫ UI
   ============================================================ */
function toast(message, type) {
  const box = $('#toasts');
  if (!box) return;
  const t = document.createElement('div');
  t.className = 'toast ' + (type || 'ok');
  t.setAttribute('role', type === 'error' ? 'alert' : 'status');
  t.textContent = message;
  box.appendChild(t);
  while (box.children.length > 3) box.removeChild(box.firstChild);
  setTimeout(() => { t.classList.add('leave'); setTimeout(() => t.remove(), 320); }, 3200);
}

function syncScrollLock() {
  const open = $('#modalRoot').innerHTML.trim() !== '' || ($('#filters') && $('#filters').classList.contains('open'));
  document.body.classList.toggle('no-scroll', !!open);
}
function openModal(inner, label) {
  state.lastFocus = document.activeElement;
  $('#modalRoot').innerHTML = '<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(label) + '">' +
    '<button type="button" class="icon-btn modal-close" data-action="close-modal" aria-label="Жабу">✕</button>' + inner + '</div></div>';
  syncScrollLock();
  const c = $('.modal-close');
  if (c) c.focus();
}
function closeModal() {
  const root = $('#modalRoot');
  if (!root || root.innerHTML.trim() === '') return;
  root.innerHTML = '';
  syncScrollLock();
  if (state.lastFocus && state.lastFocus.focus && document.contains(state.lastFocus)) state.lastFocus.focus();
}
function closeMenu() {
  document.body.classList.remove('menu-open');
  const b = $('.menu-toggle');
  if (b) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Мәзірді ашу'); }
}
function closeFilters() {
  const f = $('#filters'), o = $('#filtersOverlay');
  if (f) f.classList.remove('open');
  if (o) o.classList.remove('show');
  syncScrollLock();
}

function updateCounters() {
  const fc = $('#favCount'), cc = $('#cartCount');
  fc.textContent = state.fav.length; fc.hidden = state.fav.length === 0;
  const n = cartCount();
  cc.textContent = n; cc.hidden = n === 0;
}
function setTitle(t) {
  document.title = t ? t + ' — ' + BRAND : BRAND + ' — әйелдерге арналған заманауи киім дүкені';
}
function setActiveNav(name) {
  const map = { home: 'home', catalog: 'catalog', product: 'catalog', categories: 'categories', about: 'about', favorites: 'favorites', cart: 'cart', checkout: 'cart' };
  const key = map[name];
  $$('[data-nav]').forEach((a) => {
    if (a.dataset.nav === key) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
function placeholder(label) {
  const t = esc(String(label || '').slice(0, 42));
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><rect width='600' height='800' fill='#e9dfcc'/>" +
    "<text x='300' y='385' text-anchor='middle' font-family='Georgia,serif' font-size='54' fill='#6b4a3a' letter-spacing='8'>Dinaraa</text>" +
    "<text x='300' y='435' text-anchor='middle' font-family='Georgia,serif' font-size='22' fill='#6f645b'>" + t + '</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function handleImageError(e) {
  const el = e.target;
  if (el && el.tagName === 'IMG' && !el.dataset.fb) {
    el.dataset.fb = '1';
    el.src = placeholder(el.alt);
  }
}

/* ============================================================
   5. БАЙЛАНЫСТЫ ШАБЛОНДАР (карточка, баға, бет тақырыбы)
   ============================================================ */
function priceHtml(p) {
  return '<span class="price-now">' + fmt(p.price) + '</span>' +
    (p.old ? '<s>' + fmt(p.old) + '</s><span class="discount">−' + discount(p) + '%</span>' : '');
}
function badgesHtml(p) {
  let h = '';
  if (p.isNew) h += '<span class="badge">Жаңа</span>';
  if (p.best) h += '<span class="badge badge-dark">Үздік сатылым</span>';
  if (p.old) h += '<span class="badge badge-sale">−' + discount(p) + '%</span>';
  return h;
}
function productCard(p, opts) {
  opts = opts || {};
  const fav = isFav(p.id);
  const cat = getCategory(p.cat);
  const label = fav ? 'Таңдаулылардан алып тастау' : 'Таңдаулыларға қосу';
  return '<article class="card">' +
    '<div class="card-media"><a href="#/product/' + p.id + '" aria-label="' + esc(p.name) + ' — толығырақ">' +
    '<img src="' + img(p.photo, 640) + '" alt="' + esc(p.name + ' — ' + (cat ? cat.name : '')) + '" loading="lazy" width="640" height="853"></a>' +
    '<div class="badges">' + badgesHtml(p) + '</div>' +
    '<button type="button" class="fav-btn' + (fav ? ' active' : '') + '" data-action="toggle-fav" data-id="' + p.id + '" aria-pressed="' + fav + '" aria-label="' + label + '">' + ICON.heart + '</button></div>' +
    '<div class="card-body"><p class="card-cat">' + esc(cat ? cat.name : '') + '</p>' +
    '<h3><a href="#/product/' + p.id + '">' + esc(p.name) + '</a></h3>' +
    '<div class="price">' + priceHtml(p) + '</div>' +
    '<div class="card-actions">' +
    '<button type="button" class="btn btn-outline" data-action="quick-add" data-id="' + p.id + '"' + (maxQty(p) < 1 ? ' disabled' : '') + '>' + (maxQty(p) < 1 ? 'Қоймада жоқ' : 'Себетке') + '</button>' +
    (opts.remove ? '<button type="button" class="btn btn-ghost" data-action="toggle-fav" data-id="' + p.id + '">Жою</button>' : '') +
    '</div></div></article>';
}
function pageHead(title, sub, crumbs) {
  let c = '<nav class="crumbs" aria-label="Бет жолы"><a href="#/">Басты бет</a>';
  (crumbs || []).forEach((x) => { c += ' / ' + (x.href ? '<a href="' + x.href + '">' + esc(x.label) + '</a>' : esc(x.label)); });
  c += ' / <span>' + esc(title) + '</span></nav>';
  return '<section class="page-head"><div class="container">' + c + '<h1>' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div></section>';
}
function emptyState(title, text, buttons, icon) {
  return '<div class="empty"><div class="empty-ico">' + (icon || ICON.bag) + '</div><h2>' + esc(title) + '</h2><p>' + esc(text) + '</p>' + (buttons || '') + '</div>';
}

/* ============================================================
   6. МАРШРУТИЗАЦИЯ
   ============================================================ */
function parseHash() {
  const raw = (location.hash || '#/').slice(1) || '/';
  const qi = raw.indexOf('?');
  const path = qi >= 0 ? raw.slice(0, qi) : raw;
  const query = qi >= 0 ? raw.slice(qi + 1) : '';
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query) };
}

function route() {
  const app = $('#app');
  const { parts, params } = parseHash();
  const name = parts[0] || 'home';
  state.route = name;
  if (name !== 'checkout') state.order = null;
  closeModal();
  closeMenu();
  closeFilters();

  switch (name) {
    case 'home': renderHome(); break;
    case 'catalog': renderCatalog(params); break;
    case 'categories': renderCategories(); break;
    case 'product': renderProduct(parts[1]); break;
    case 'favorites': renderFavorites(); break;
    case 'cart': renderCart(); break;
    case 'checkout': renderCheckout(); break;
    case 'about': renderAbout(); break;
    case 'info': renderInfo(parts[1]); break;
    default: renderNotFound();
  }
  setActiveNav(state.route);
  const search = $('#headerSearch');
  if (search && state.route !== 'catalog') search.value = '';
  window.scrollTo(0, 0);
}

function renderNotFound() {
  setTitle('Бет табылмады');
  $('#app').innerHTML = pageHead('Бет табылмады', 'Сіз ашқан мекенжай бойынша бет жоқ.') +
    '<div class="container page-body">' + emptyState('Мұндай бет жоқ', 'Сілтеме ескірген немесе қате болуы мүмкін. Басты бетке оралыңыз немесе каталогты қараңыз.',
      '<a class="btn btn-primary" href="#/">Басты бетке</a> <a class="btn btn-outline" href="#/catalog">Каталогқа өту</a>') + '</div>';
}

/* ============================================================
   7. БАСТЫ БЕТ (#/)
   ============================================================ */
function renderHome() {
  setTitle('');
  const featured = ['koylekter', 'syrt-kiim', 'toqyma', 'aksessuarlar'].map(getCategory);
  const news = PRODUCTS.filter((p) => p.isNew).sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);
  const best = PRODUCTS.filter((p) => p.best).sort((a, b) => b.pop - a.pop).slice(0, 4);
  const benefits = [
    [ICON.truck, 'Ыңғайлы жеткізу', 'Қазақстанның қалаларына жеткізу нұсқалары (үлгі шарт).'],
    [ICON.ret, 'Қайтару мүмкіндігі', 'Қайтару ережелері жеке бетте сипатталған (үлгі мәтін).'],
    [ICON.star, 'Мұқият таңдалған маталар', 'Әр тауардың материалы мен күтімі бет ішінде көрсетіледі.'],
    [ICON.chat, 'Түсінікті қолдау', 'Байланыс деректері дүкен ашылған кезде толтырылады.']
  ];
  const quotes = [
    ['Көйлектің пішіні өте ұнады, күні бойы жайлы болды.', 'Айдана, Алматы'],
    ['Таңдау оңай, сүзгілер уақытты үнемдейді. Мата туралы мәлімет айқын жазылған.', 'Динара, Астана'],
    ['Пальто түсі суреттегідей көрінді деп ойлаймын. Кейін де тапсырыс берер едім.', 'Гүлнәр, Шымкент']
  ];
  $('#app').innerHTML =
    '<section class="hero"><div class="container hero-grid">' +
    '<div class="hero-text"><p class="eyebrow">Күз–қыс топтамасы</p>' +
    '<h1>Өз стиліңді тап,<br>өзіңді жайлы сезін</h1>' +
    '<p class="lead">Күнделікті өмірге де, ерекше кездесулерге де лайық заманауи әйелдер киімі. Таза сызықтар, жұмсақ маталар және ыңғайлы пішіндер.</p>' +
    '<div class="hero-actions"><a class="btn btn-primary" href="#/catalog">Топтаманы көру</a><a class="btn btn-ghost" href="#/categories">Санаттарды қарау</a></div></div>' +
    '<div class="hero-media"><img src="' + img('1515886657613-9f3515b0c78f', 1000) + '" alt="Dinaraa топтамасындағы заманауи әйелдер киімі" width="1000" height="1150"></div>' +
    '</div></section>' +

    '<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Санаттар</p><h2>Таңдаулы санаттар</h2></div><a class="link-arrow" href="#/categories">Барлық санаттар</a></div>' +
    '<div class="cat-feature">' + featured.map((c) =>
      '<a class="cat-card" href="#/catalog?cat=' + c.id + '"><img src="' + img(c.photo, 600) + '" alt="' + esc(c.name) + ' санаты" loading="lazy"><span>' + esc(c.name) + '</span></a>').join('') + '</div></div></section>' +

    '<section class="section section-alt"><div class="container"><div class="section-head"><div><p class="eyebrow">Жаңа келгендер</p><h2>Жаңа топтама</h2></div><a class="link-arrow" href="#/catalog?sort=newest">Барлығын көру</a></div>' +
    '<div class="grid-products">' + news.map((p) => productCard(p)).join('') + '</div></div></section>' +

    '<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Таңдау</p><h2>Үздік сатылымдар</h2></div><a class="link-arrow" href="#/catalog?sort=popular">Барлығын көру</a></div>' +
    '<div class="grid-products">' + best.map((p) => productCard(p)).join('') + '</div></div></section>' +

    '<section class="section" style="padding-top:0"><div class="container"><div class="season">' +
    '<div class="season-media"><img src="' + img('1591047139829-d91aecb6caea', 1000) + '" alt="Күзгі сырт киім топтамасы" loading="lazy"></div>' +
    '<div class="season-text"><p class="eyebrow">Маусымдық топтама</p><h2>Күзгі қабаттар</h2>' +
    '<p>Тренчтер, пальтолар және жұмсақ тоқыма заттар: салқын күндерге арналған сәнді әрі жылы үйлесімдер.</p>' +
    '<a class="btn btn-light" href="#/catalog?cat=syrt-kiim">Сырт киімді көру</a></div></div></div></section>' +

    '<section class="section section-alt"><div class="container story">' +
    '<div class="story-img"><img src="' + img('1469334031218-e382a71b716b', 900) + '" alt="Dinaraa брендінің стилі" loading="lazy"></div>' +
    '<div><p class="eyebrow">Бренд туралы</p><h2>Қарапайымдылық пен сымбат</h2>' +
    '<p>Dinaraa — күнделікті өмірде жайлы, ал ерекше сәтте нәзік көрінуге мүмкіндік беретін киімдерге арналған бренд концепциясы. Біз таза пішіндерге, табиғи реңктерге және ұқыпты детальдарға сенеміз.</p>' +
    '<a class="link-arrow" href="#/about">Толығырақ оқу</a></div></div></section>' +

    '<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Артықшылықтар</p><h2>Дүкеннің ыңғайлылығы</h2></div></div>' +
    '<div class="benefits">' + benefits.map((b) => '<div class="benefit"><div class="benefit-ico">' + b[0] + '</div><h3>' + b[1] + '</h3><p>' + b[2] + '</p></div>').join('') + '</div></div></section>' +

    '<section class="section section-alt"><div class="container"><div class="section-head"><div><p class="eyebrow">Пікірлер</p><h2>Клиенттер не дейді</h2></div></div>' +
    '<p class="demo-note">Демонстрациялық мазмұн: төмендегі пікірлер нақты клиенттерден емес, дизайнды көрсету үшін жазылған үлгі мәтіндер.</p>' +
    '<div class="testimonials">' + quotes.map((q) => '<figure class="quote"><p>«' + q[0] + '»</p><figcaption><cite>' + q[1] + ' (демо)</cite></figcaption></figure>').join('') + '</div></div></section>' +

    '<section class="section newsletter"><div class="container"><p class="eyebrow">Жаңалықтар</p><h2>Жаңа топтамалардан хабардар болыңыз</h2>' +
    '<p class="demo-note" style="display:inline-block">Демо: бұл форма электрондық поштаны сақтамайды және ешқайда жібермейді.</p>' +
    '<form class="newsletter-form" id="newsletterForm" novalidate><label class="sr-only" for="nlEmail">Электрондық пошта</label>' +
    '<input type="email" id="nlEmail" placeholder="Электрондық пошта мекенжайы" autocomplete="email"><button type="submit" class="btn btn-primary">Жазылу</button></form>' +
    '<p class="form-msg" id="nlMsg" role="status"></p></div></section>';
}

/* ============================================================
   8. КАТАЛОГ (#/catalog) — іздеу, сүзгілер, сұрыптау
   ============================================================ */
function filtersFromParams(params) {
  const f = defaultFilters();
  f.q = (params.get('q') || '').slice(0, 80);
  const cat = params.get('cat') || '';
  f.cat = getCategory(cat) ? cat : '';
  const sizes = (params.get('size') || '').split(',').filter(Boolean);
  f.sizes = sizes.filter((s) => CL.concat(ONE).includes(s));
  const colors = (params.get('color') || '').split(',').filter(Boolean);
  f.colors = colors.filter((c) => COLORS[c]);
  const min = params.get('min'), max = params.get('max');
  f.min = min && !isNaN(Number(min)) && Number(min) >= 0 ? String(Number(min)) : '';
  f.max = max && !isNaN(Number(max)) && Number(max) >= 0 ? String(Number(max)) : '';
  const sort = params.get('sort');
  f.sort = SORTS[sort] ? sort : 'popular';
  return f;
}
function filtersToHash(f) {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.cat) p.set('cat', f.cat);
  if (f.sizes.length) p.set('size', f.sizes.join(','));
  if (f.colors.length) p.set('color', f.colors.join(','));
  if (f.min !== '') p.set('min', f.min);
  if (f.max !== '') p.set('max', f.max);
  if (f.sort !== 'popular') p.set('sort', f.sort);
  const s = p.toString();
  return '#/catalog' + (s ? '?' + s : '');
}
function applyFilters(list, f) {
  const q = f.q.trim().toLocaleLowerCase('kk');
  let min = f.min === '' ? null : Number(f.min);
  let max = f.max === '' ? null : Number(f.max);
  if (min !== null && max !== null && min > max) { const t = min; min = max; max = t; }
  const res = list.filter((p) => {
    if (q) {
      const cat = getCategory(p.cat);
      const hay = (p.name + ' ' + p.desc + ' ' + p.material + ' ' + (cat ? cat.name : '') + ' ' + p.colors.join(' ')).toLocaleLowerCase('kk');
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    if (f.cat && p.cat !== f.cat) return false;
    if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s))) return false;
    if (f.colors.length && !f.colors.some((c) => p.colors.includes(c))) return false;
    if (min !== null && p.price < min) return false;
    if (max !== null && p.price > max) return false;
    return true;
  });
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    newest: (a, b) => b.added.localeCompare(a.added) || b.id - a.id,
    popular: (a, b) => b.pop - a.pop
  };
  return res.sort(sorters[f.sort] || sorters.popular);
}

function filterPanelHtml(f) {
  const allSizes = CL.concat(ONE);
  return '<aside class="filters" id="filters" aria-label="Сүзгілер">' +
    '<div class="filters-head"><h2>Сүзгілер</h2><button type="button" class="icon-btn filters-close" data-action="toggle-filters" aria-label="Сүзгілерді жабу">✕</button></div>' +
    '<div class="f-group"><label for="fq">Іздеу</label><input type="search" id="fq" data-filter="q" value="' + esc(f.q) + '" placeholder="Мысалы: көйлек" autocomplete="off"></div>' +
    '<div class="f-group"><span class="f-title">Санат</span>' +
    '<label class="radio"><input type="radio" name="fcat" data-filter="cat" value=""' + (!f.cat ? ' checked' : '') + '><span>Барлық санаттар</span></label>' +
    CATEGORIES.map((c) => '<label class="radio"><input type="radio" name="fcat" data-filter="cat" value="' + c.id + '"' + (f.cat === c.id ? ' checked' : '') + '><span>' + esc(c.name) + '</span></label>').join('') + '</div>' +
    '<div class="f-group"><span class="f-title">Өлшем</span><div class="chip-row">' +
    allSizes.map((s) => '<label class="chip-check"><input type="checkbox" data-filter="size" value="' + esc(s) + '"' + (f.sizes.includes(s) ? ' checked' : '') + '><span>' + esc(s) + '</span></label>').join('') + '</div></div>' +
    '<div class="f-group"><span class="f-title">Түс</span><div class="chip-row">' +
    Object.keys(COLORS).map((c) => '<label class="swatch-check" title="' + esc(c) + '"><input type="checkbox" data-filter="color" value="' + esc(c) + '"' + (f.colors.includes(c) ? ' checked' : '') + ' aria-label="' + esc(c) + '"><span style="background:' + COLORS[c] + '"></span></label>').join('') + '</div></div>' +
    '<div class="f-group"><span class="f-title">Баға, ₸</span><div class="price-row">' +
    '<label class="sr-only" for="fmin">Ең төмен баға</label><input type="number" id="fmin" data-filter="min" min="0" step="1000" placeholder="бастап" value="' + esc(f.min) + '">' +
    '<span aria-hidden="true">—</span>' +
    '<label class="sr-only" for="fmax">Ең жоғары баға</label><input type="number" id="fmax" data-filter="max" min="0" step="1000" placeholder="дейін" value="' + esc(f.max) + '"></div></div>' +
    '<button type="button" class="btn btn-outline btn-block" data-action="clear-filters">Сүзгілерді тазалау</button>' +
    '<button type="button" class="btn btn-primary btn-block filters-apply" data-action="toggle-filters">Нәтижелерді көру</button>' +
    '</aside><div class="filters-overlay" id="filtersOverlay" data-action="toggle-filters"></div>';
}

function renderCatalog(params) {
  state.filters = filtersFromParams(params);
  const f = state.filters;
  const cat = getCategory(f.cat);
  setTitle(cat ? 'Каталог: ' + cat.name : 'Каталог');
  state.lastCatalogHash = location.hash || '#/catalog';
  $('#app').innerHTML = pageHead('Каталог', cat ? 'Санат: ' + cat.name : 'Барлық үлгі тауарлар: сүзгілер мен сұрыптауды қолданыңыз.') +
    '<div class="container page-body"><div class="catalog-layout">' + filterPanelHtml(f) +
    '<div><div class="toolbar"><p class="count" id="catalogCount" role="status" aria-live="polite"></p>' +
    '<div class="toolbar-right"><button type="button" class="btn btn-outline btn-sm filter-toggle" data-action="toggle-filters">Сүзгілер</button>' +
    '<label class="sr-only" for="fsort">Сұрыптау</label><select id="fsort" data-filter="sort">' +
    Object.keys(SORTS).map((k) => '<option value="' + k + '"' + (f.sort === k ? ' selected' : '') + '>' + SORTS[k] + '</option>').join('') + '</select></div></div>' +
    '<div class="grid-products cols-3" id="catalogResults"></div></div></div></div>';
  const hs = $('#headerSearch');
  if (hs) hs.value = f.q;
  updateCatalogResults();
}

function readFiltersFromDom() {
  const f = defaultFilters();
  f.q = $('#fq').value.trim();
  const c = $('[data-filter="cat"]:checked');
  f.cat = c ? c.value : '';
  f.sizes = $$('[data-filter="size"]:checked').map((i) => i.value);
  f.colors = $$('[data-filter="color"]:checked').map((i) => i.value);
  const min = $('#fmin').value, max = $('#fmax').value;
  f.min = min !== '' && Number(min) >= 0 ? String(Number(min)) : '';
  f.max = max !== '' && Number(max) >= 0 ? String(Number(max)) : '';
  f.sort = SORTS[$('#fsort').value] ? $('#fsort').value : 'popular';
  return f;
}
function onFilterChange() {
  state.filters = readFiltersFromDom();
  const hash = filtersToHash(state.filters);
  state.lastCatalogHash = hash;
  try { history.replaceState(null, '', hash); } catch (e) { /* file:// және ескі браузерлер */ }
  const hs = $('#headerSearch');
  if (hs) hs.value = state.filters.q;
  const cat = getCategory(state.filters.cat);
  setTitle(cat ? 'Каталог: ' + cat.name : 'Каталог');
  updateCatalogResults();
}
function updateCatalogResults() {
  const list = applyFilters(PRODUCTS, state.filters);
  $('#catalogCount').textContent = 'Табылған тауар саны: ' + list.length;
  $('#catalogResults').innerHTML = list.length
    ? list.map((p) => productCard(p)).join('')
    : emptyState('Ештеңе табылмады', 'Іздеу сөзін немесе сүзгілерді өзгертіп көріңіз.', '<button type="button" class="btn btn-primary" data-action="clear-filters">Сүзгілерді тазалау</button>', ICON.search);
}
function clearFilters() {
  state.filters = defaultFilters();
  state.lastCatalogHash = '#/catalog';
  try { history.replaceState(null, '', '#/catalog'); } catch (e) { /* ештеңе */ }
  renderCatalog(new URLSearchParams());
  toast('Сүзгілер тазаланды.', 'ok');
}

/* ============================================================
   9. САНАТТАР (#/categories)
   ============================================================ */
function renderCategories() {
  setTitle('Санаттар');
  $('#app').innerHTML = pageHead('Санаттар', 'Өзіңізге ұнайтын бағытты таңдаңыз — әр санат каталогта бөлек ашылады.') +
    '<div class="container page-body"><div class="cat-mosaic">' +
    CATEGORIES.map((c) => {
      const n = PRODUCTS.filter((p) => p.cat === c.id).length;
      return '<a class="cat-tile" href="#/catalog?cat=' + c.id + '"><img src="' + img(c.photo, 900) + '" alt="' + esc(c.name) + ' санатының фотосы" loading="lazy">' +
        '<div class="cat-tile-body"><h2>' + esc(c.name) + '</h2><p>' + esc(c.desc) + '</p><span class="cat-count">' + n + ' үлгі тауар · Каталогқа өту</span></div></a>';
    }).join('') + '</div></div>';
}

/* ============================================================
   10. ТАУАР БЕТІ (#/product/:id)
   ============================================================ */
const GALLERY_VIEWS = [{ pos: '50% 20%', z: 1 }, { pos: '50% 38%', z: 1.45 }, { pos: '50% 78%', z: 1.6 }];

function selectorHtml(p, opts) {
  const maxQ = maxQty(p);
  const sizeActive = p.sizes.length === 1 ? p.sizes[0] : null;
  return '<div class="selector" data-selector data-id="' + p.id + '" data-mode="' + opts.mode + '">' +
    '<div class="opt-group"><div class="opt-head"><span class="f-title">Өлшемі</span><span class="selector-error" hidden>Өлшемді таңдаңыз</span></div>' +
    '<div class="chips" role="group" aria-label="Өлшем">' +
    p.sizes.map((s) => '<button type="button" class="chip' + (s === sizeActive ? ' active' : '') + '" data-action="pick" data-pick="size" data-value="' + esc(s) + '" aria-pressed="' + (s === sizeActive) + '">' + esc(s) + '</button>').join('') + '</div></div>' +
    '<div class="opt-group"><div class="opt-head"><span class="f-title">Түсі: <b data-color-label>' + esc(p.colors[0]) + '</b></span></div>' +
    '<div class="swatches" role="group" aria-label="Түс">' +
    p.colors.map((c, i) => '<button type="button" class="swatch' + (i === 0 ? ' active' : '') + '" style="background:' + COLORS[c] + '" data-action="pick" data-pick="color" data-value="' + esc(c) + '" aria-label="' + esc(c) + '" aria-pressed="' + (i === 0) + '" title="' + esc(c) + '"></button>').join('') + '</div></div>' +
    (opts.qty ? '<div class="opt-group"><span class="f-title">Саны</span><div class="qty"><button type="button" data-action="qty-minus" aria-label="Азайту">−</button>' +
      '<input type="number" class="qty-input" min="1" max="' + maxQ + '" value="1" inputmode="numeric" aria-label="Саны"><button type="button" data-action="qty-plus" aria-label="Көбейту">+</button></div></div>' : '') +
    opts.actions + '</div>';
}
function readSelection(sel) {
  const s = $('[data-pick="size"].active', sel), c = $('[data-pick="color"].active', sel), q = $('.qty-input', sel);
  const qty = q ? parseInt(q.value, 10) : 1;
  return { size: s ? s.dataset.value : '', color: c ? c.dataset.value : '', qty: isNaN(qty) ? 1 : qty };
}

function stockInfo(p) {
  if (p.stock <= 0) return { cls: 'out', text: 'Қоймада жоқ (демо)' };
  if (p.stock <= 5) return { cls: 'low', text: 'Аз қалды: ' + p.stock + ' дана (демо)' };
  return { cls: '', text: 'Қоймада бар (демо)' };
}

function renderProduct(idStr) {
  const id = Number(idStr);
  const p = /^\d+$/.test(idStr || '') ? getProduct(id) : null;
  if (!p) {
    setTitle('Тауар табылмады');
    $('#app').innerHTML = pageHead('Тауар табылмады', '') +
      '<div class="container page-body">' + emptyState('Мұндай тауар жоқ', 'Тауар өшірілген немесе сілтеме қате болуы мүмкін. Каталогтан басқа тауарды таңдаңыз.',
        '<a class="btn btn-primary" href="' + esc(state.lastCatalogHash) + '">Каталогқа оралу</a>') + '</div>';
    return;
  }
  const cat = getCategory(p.cat);
  const st = stockInfo(p);
  const fav = isFav(p.id);
  setTitle(p.name);
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id)
    .concat(PRODUCTS.filter((x) => x.cat !== p.cat && x.id !== p.id).sort((a, b) => b.pop - a.pop)).slice(0, 4);
  const actions = '<div class="pdp-actions"><button type="button" class="btn btn-primary" data-action="add-selected"' + (maxQty(p) < 1 ? ' disabled' : '') + '>' + (maxQty(p) < 1 ? 'Қоймада жоқ' : 'Себетке қосу') + '</button>' +
    '<button type="button" class="btn btn-outline fav-toggle' + (fav ? ' active' : '') + '" data-action="toggle-fav" data-id="' + p.id + '" aria-pressed="' + fav + '"><span data-fav-label>' + (fav ? 'Таңдаулылардан алып тастау' : 'Таңдаулыларға қосу') + '</span></button></div>';

  $('#app').innerHTML = '<div class="container"><nav class="crumbs" style="padding:22px 0" aria-label="Бет жолы"><a href="#/">Басты бет</a> / <a href="' + esc(state.lastCatalogHash) + '">Каталог</a> / <a href="#/catalog?cat=' + p.cat + '">' + esc(cat ? cat.name : '') + '</a> / <span>' + esc(p.name) + '</span></nav></div>' +
    '<div class="container page-body"><div class="pdp">' +
    '<div class="gallery"><div class="gallery-thumbs">' +
    GALLERY_VIEWS.map((v, i) => '<button type="button" class="thumb' + (i === 0 ? ' active' : '') + '" data-action="gallery" data-i="' + i + '" aria-label="Көрініс ' + (i + 1) + '"><img src="' + img(p.photo, 200) + '" alt="' + esc(p.name) + ' — көрініс ' + (i + 1) + '" style="object-position:' + v.pos + ';transform:scale(' + v.z + ')" loading="lazy"></button>').join('') + '</div>' +
    '<div class="gallery-main"><img id="galleryImg" src="' + img(p.photo, 1100) + '" alt="' + esc(p.name + ' — ' + (cat ? cat.name : '')) + '" style="object-position:' + GALLERY_VIEWS[0].pos + '" width="1100" height="1467"></div></div>' +
    '<div class="pdp-info"><div class="badges" style="position:static;flex-direction:row;margin-bottom:12px;flex-wrap:wrap">' + badgesHtml(p) + '</div>' +
    '<h1>' + esc(p.name) + '</h1><div class="price pdp-price">' + priceHtml(p) + '</div>' +
    '<p class="stock ' + st.cls + '">' + st.text + '</p>' +
    '<p>' + esc(p.desc) + '</p>' +
    selectorHtml(p, { mode: 'page', qty: true, actions: actions }) +
    '<div class="accordion">' +
    '<details open><summary>Материал және күтім</summary><dl><dt>Материал</dt><dd>' + esc(p.material) + '</dd><dt>Күтім</dt><dd>' + esc(p.care) + '</dd></dl></details>' +
    '<details><summary>Өлшем кестесі</summary><p>Өлшемдер сантиметрмен берілген, жалпы бағдар ретінде қолданыңыз. Екі өлшемнің арасында болсаңыз, ауқымдырақ өлшемді таңдаңыз.</p><div class="table-wrap"><table class="size-table"><thead><tr><th>Өлшем</th><th>Кеуде</th><th>Бел</th><th>Жамбас</th></tr></thead><tbody>' +
    SIZE_GUIDE.map((r) => '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>').join('') + '</tbody></table></div></details>' +
    '<details><summary>Жеткізу және қайтару</summary><p>Курьермен, поштамен жеткізу немесе дүкеннен алып кету қолжетімді. 50 000 ₸-ден асатын тапсырыстарға жеткізу тегін (үлгі шарт).</p><p><a class="link-arrow" href="#/info/delivery">Жеткізу шарттары</a> · <a class="link-arrow" href="#/info/returns">Қайтару шарттары</a></p></details>' +
    '</div></div></div>' +
    '<section class="related"><div class="section-head"><h2>Осыған ұқсас тауарлар</h2></div><div class="grid-products">' + related.map((x) => productCard(x)).join('') + '</div></section></div>';
}

/* ============================================================
   11. ТАҢДАУЛЫЛАР (#/favorites)
   ============================================================ */
function renderFavorites() {
  setTitle('Таңдаулылар');
  const list = state.fav.map(getProduct).filter(Boolean);
  $('#app').innerHTML = pageHead('Таңдаулылар', list.length ? 'Сақталған тауарлар: ' + list.length : 'Ұнаған тауарларды осында сақтаңыз.') +
    '<div class="container page-body">' + (list.length
      ? '<div class="grid-products">' + list.map((p) => productCard(p, { remove: true })).join('') + '</div>'
      : emptyState('Таңдаулылар тізімі бос', 'Тауар карточкасындағы жүрекше белгісін басып, ұнаған заттарды сақтаңыз.', '<a class="btn btn-primary" href="#/catalog">Каталогқа өту</a>', ICON.heart)) + '</div>';
}

/* ============================================================
   12. СЕБЕТ (#/cart)
   ============================================================ */
function cartSummaryHtml(method, withButtons) {
  const t = totals(method);
  const m = DELIVERY[method] || DELIVERY.courier;
  const left = FREE_DELIVERY_FROM - t.subtotal;
  return '<div class="sum-row"><span>Тауарлар (' + cartCount() + ' дана)</span><span>' + fmt(t.subtotal) + '</span></div>' +
    '<div class="sum-row"><span>Жеткізу' + (withButtons ? '' : ': ' + esc(m.label)) + '</span><span>' + (t.fee === 0 ? 'Тегін' : fmt(t.fee)) + '</span></div>' +
    '<div class="sum-row total"><span>Жиыны</span><span>' + fmt(t.total) + '</span></div>' +
    '<p class="sum-note">' + (left > 0 && method !== 'pickup' ? 'Тегін жеткізуге дейін ' + fmt(left) + ' қалды (үлгі шарт).' : (method === 'pickup' ? 'Дүкеннен алып кету тегін.' : 'Тегін жеткізу қолданылды (үлгі шарт).')) + '</p>';
}

function renderCart() {
  setTitle('Себет');
  if (!state.cart.length) {
    $('#app').innerHTML = pageHead('Себет', '') + '<div class="container page-body">' +
      emptyState('Себетіңіз бос', 'Каталогтан ұнаған тауарды таңдап, себетке қосыңыз.', '<a class="btn btn-primary" href="#/catalog">Сатып алуды бастау</a> <a class="btn btn-outline" href="#/favorites">Таңдаулылар</a>') + '</div>';
    return;
  }
  const lines = state.cart.map((l) => {
    const p = getProduct(l.pid);
    const k = esc(cartKey(l));
    return '<li class="cart-line"><a class="cl-img" href="#/product/' + p.id + '"><img src="' + img(p.photo, 300) + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '<div class="cl-info"><h3><a href="#/product/' + p.id + '">' + esc(p.name) + '</a></h3>' +
      '<p class="cl-meta">Өлшемі: ' + esc(l.size) + ' · Түсі: ' + esc(l.color) + '</p>' +
      '<p class="cl-meta">Бағасы: ' + fmt(p.price) + '</p>' +
      '<button type="button" class="link-btn" data-action="cart-remove" data-key="' + k + '">Себеттен жою</button></div>' +
      '<div class="qty"><button type="button" data-action="cart-dec" data-key="' + k + '" aria-label="Азайту">−</button>' +
      '<input type="number" class="qty-input" data-key="' + k + '" min="1" max="' + maxQty(p) + '" value="' + l.qty + '" inputmode="numeric" aria-label="Саны: ' + esc(p.name) + '">' +
      '<button type="button" data-action="cart-inc" data-key="' + k + '" aria-label="Көбейту">+</button></div>' +
      '<div class="cl-total">' + fmt(p.price * l.qty) + '</div></li>';
  }).join('');
  $('#app').innerHTML = pageHead('Себет', 'Тапсырысты рәсімдеу алдында таңдалған тауарларды тексеріңіз.') +
    '<div class="container page-body"><div class="cart-layout"><div><ul class="cart-list">' + lines + '</ul>' +
    '<p style="margin-top:20px"><a class="link-arrow" href="#/catalog">← Сатып алуды жалғастыру</a></p></div>' +
    '<aside class="summary" aria-label="Тапсырыс жиыны"><h2>Тапсырыс жиыны</h2>' + cartSummaryHtml('courier', true) +
    '<p class="sum-note">Жеткізу құны курьермен жеткізу бойынша есептелген. Тәсілді келесі қадамда өзгертуге болады.</p>' +
    '<a class="btn btn-primary btn-block" href="#/checkout">Тапсырысты рәсімдеу</a>' +
    '<a class="btn btn-outline btn-block" href="#/catalog">Сатып алуды жалғастыру</a></aside></div></div>';
}

/* ============================================================
   13. ТАПСЫРЫС РӘСІМДЕУ (#/checkout)
   ============================================================ */
function summaryItemsHtml() {
  return '<div class="sum-items">' + state.cart.map((l) => {
    const p = getProduct(l.pid);
    return '<div class="sum-item"><img src="' + img(p.photo, 120) + '" alt="' + esc(p.name) + '"><div>' + esc(p.name) +
      '<small>' + esc(l.size) + ' · ' + esc(l.color) + ' · ' + l.qty + ' дана</small></div><strong>' + fmt(p.price * l.qty) + '</strong></div>';
  }).join('') + '</div>';
}
function checkoutSummaryHtml(method) {
  return '<h2>Тапсырыс жиыны</h2>' + summaryItemsHtml() + cartSummaryHtml(method, false);
}

function fieldHtml(id, label, type, extra) {
  extra = extra || {};
  return '<div class="field' + (extra.full ? ' full' : '') + '" data-field="' + id + '"><label for="' + id + '">' + label + '</label>' +
    '<input type="' + type + '" id="' + id + '" name="' + id + '" ' + (extra.attrs || '') + ' aria-describedby="err-' + id + '">' +
    '<p class="field-error" id="err-' + id + '" role="alert"></p></div>';
}

function renderCheckout() {
  if (state.order) { renderConfirmation(); return; }
  if (!state.cart.length) {
    try { history.replaceState(null, '', '#/cart'); } catch (e) { /* ештеңе */ }
    toast('Себет бос. Алдымен тауар қосыңыз.', 'error');
    route();
    return;
  }
  setTitle('Тапсырысты рәсімдеу');
  const m = state.deliveryMethod;
  $('#app').innerHTML = pageHead('Тапсырысты рәсімдеу', 'Деректерді толтырыңыз. Бұл — демонстрациялық режим.', [{ label: 'Себет', href: '#/cart' }]) +
    '<div class="container page-body"><div class="checkout-layout"><form id="checkoutForm" novalidate>' +
    '<p class="warn"><strong>Демонстрациялық режим.</strong> Тапсырыс нақты дүкенге жіберілмейді, төлем өңделмейді. Нақты тапсырыстарды өңдеу үшін серверлік бөлік немесе сыртқы сауда қызметі қажет.</p>' +

    '<section class="step"><h2><span class="step-no">1</span>Байланыс деректері</h2><div class="form-grid">' +
    fieldHtml('name', 'Аты-жөні', 'text', { full: true, attrs: 'autocomplete="name" placeholder="Мысалы: Айгүл Сәрсенова"' }) +
    fieldHtml('phone', 'Телефон нөмірі', 'tel', { attrs: 'autocomplete="tel" placeholder="+7 701 123 45 67" inputmode="tel"' }) +
    fieldHtml('email', 'Электрондық пошта', 'email', { attrs: 'autocomplete="email" placeholder="aigul@mail.kz"' }) +
    '</div></section>' +

    '<section class="step"><h2><span class="step-no">2</span>Жеткізу</h2><div class="form-grid">' +
    '<div class="field" data-field="city"><label for="city">Қала</label><select id="city" name="city" aria-describedby="err-city"><option value="">Қаланы таңдаңыз</option>' +
    CITIES.map((c) => '<option value="' + c + '">' + c + '</option>').join('') + '</select><p class="field-error" id="err-city" role="alert"></p></div>' +
    '<div class="field" data-field="address"><label for="address">Жеткізу мекенжайы</label><input type="text" id="address" name="address" autocomplete="street-address" placeholder="Көше, үй, пәтер" aria-describedby="err-address"><p class="field-error" id="err-address" role="alert"></p></div>' +
    '<div class="field full" data-field="delivery"><span class="label">Жеткізу тәсілі</span><div class="option-list">' +
    Object.keys(DELIVERY).map((k) => '<label class="option-card"><input type="radio" name="delivery" value="' + k + '"' + (k === m ? ' checked' : '') + '><span><strong>' + DELIVERY[k].label + '</strong><small>' + DELIVERY[k].note + ' · ' + (DELIVERY[k].fee ? fmt(DELIVERY[k].fee) : 'тегін') + '</small></span></label>').join('') +
    '</div><p class="field-error" id="err-delivery" role="alert"></p></div></div></section>' +

    '<section class="step"><h2><span class="step-no">3</span>Төлем және түсініктеме</h2><div class="form-grid">' +
    '<div class="field full" data-field="payment"><span class="label">Төлем тәсілі</span><div class="option-list">' +
    Object.keys(PAYMENTS).map((k, i) => '<label class="option-card"><input type="radio" name="payment" value="' + k + '"' + (i === 0 ? ' checked' : '') + '><span><strong>' + PAYMENTS[k] + '</strong><small>Демо: төлем өңделмейді</small></span></label>').join('') +
    '</div><p class="field-error" id="err-payment" role="alert"></p></div>' +
    '<div class="field full"><label for="comment">Қосымша түсініктеме (міндетті емес)</label><textarea id="comment" name="comment" maxlength="400" placeholder="Мысалы: жеткізер алдында қоңырау шалыңыз"></textarea></div>' +
    '<div class="field full" data-field="consent"><label class="consent"><input type="checkbox" id="consent" name="consent" aria-describedby="err-consent"><span>Мен <a href="#/info/privacy" target="_blank" rel="noopener" class="link-arrow">құпиялылық саясатымен</a> таныстым және деректерімді демонстрациялық тапсырысты рәсімдеуге енгізуге келісемін.</span></label><p class="field-error" id="err-consent" role="alert"></p></div>' +
    '</div></section>' +
    '<button type="submit" class="btn btn-primary btn-block">Демо-тапсырысты рәсімдеу</button></form>' +
    '<aside class="summary" id="checkoutSummary" aria-label="Тапсырыс жиыны">' + checkoutSummaryHtml(m) + '</aside></div></div>';
}

function normalizePhone(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1);
  return d;
}
function validateCheckout(form) {
  const v = {
    name: form.elements['name'].value.trim(),
    phone: form.elements['phone'].value.trim(),
    email: form.elements['email'].value.trim(),
    city: form.elements['city'].value,
    address: form.elements['address'].value.trim(),
    delivery: (form.querySelector('[name="delivery"]:checked') || {}).value || '',
    payment: (form.querySelector('[name="payment"]:checked') || {}).value || '',
    comment: form.elements['comment'].value.trim(),
    consent: form.elements['consent'].checked
  };
  const errors = {};
  if (!v.name) errors.name = 'Аты-жөніңізді енгізіңіз.';
  else if (v.name.length < 2 || !/^[\p{L}][\p{L}\s'’.\-]*$/u.test(v.name)) errors.name = 'Аты-жөніңізде тек әріптер болуы керек.';
  if (!v.phone) errors.phone = 'Телефон нөмірін енгізіңіз.';
  else if (!/^[67]\d{9}$/.test(normalizePhone(v.phone)) || !/^[+\d\s()\-]+$/.test(v.phone)) errors.phone = 'Қазақстандық нөмірді енгізіңіз, мысалы: +7 701 123 45 67.';
  if (!v.email) errors.email = 'Электрондық пошта мекенжайын енгізіңіз.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) errors.email = 'Электрондық пошта дұрыс емес. Мысалы: aigul@mail.kz';
  if (!v.city) errors.city = 'Қаланы таңдаңыз.';
  if (v.delivery !== 'pickup' && v.address.length < 6) errors.address = 'Жеткізу мекенжайын толық енгізіңіз (көше, үй, пәтер).';
  if (!DELIVERY[v.delivery]) errors.delivery = 'Жеткізу тәсілін таңдаңыз.';
  if (!PAYMENTS[v.payment]) errors.payment = 'Төлем тәсілін таңдаңыз.';
  if (!v.consent) errors.consent = 'Жалғастыру үшін келісімді растаңыз.';
  return { v, errors };
}
function showFieldErrors(form, errors) {
  ['name', 'phone', 'email', 'city', 'address', 'delivery', 'payment', 'consent'].forEach((k) => {
    const err = $('#err-' + k), wrap = $('[data-field="' + k + '"]', form);
    if (err) err.textContent = errors[k] || '';
    if (wrap) wrap.classList.toggle('invalid', !!errors[k]);
    const input = form.elements[k];
    if (input && input.setAttribute && !(input instanceof RadioNodeList)) input.setAttribute('aria-invalid', errors[k] ? 'true' : 'false');
  });
}
function generateOrderNumber() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return 'DEMO-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + String(Math.floor(1000 + Math.random() * 9000));
}
function submitCheckout(form) {
  const { v, errors } = validateCheckout(form);
  showFieldErrors(form, errors);
  const keys = Object.keys(errors);
  if (keys.length) {
    toast('Форманы тексеріңіз: ' + keys.length + ' өріс дұрыс толтырылмаған.', 'error');
    const first = form.elements[keys[0]];
    const target = first && first.focus && !(first instanceof RadioNodeList) ? first : $('[data-field="' + keys[0] + '"] input', form);
    if (target) target.focus();
    return;
  }
  if (!state.cart.length) { toast('Себет бос.', 'error'); location.hash = '#/cart'; return; }
  const items = state.cart.map((l) => { const p = getProduct(l.pid); return { name: p.name, size: l.size, color: l.color, qty: l.qty, price: p.price, photo: p.photo }; });
  state.order = { number: generateOrderNumber(), customer: v, items: items, totals: totals(v.delivery), createdAt: new Date() };
  // Демо жіберу сәтті аяқталды — енді ғана себетті тазалаймыз
  state.cart = [];
  saveCart();
  updateCounters();
  renderConfirmation();
  window.scrollTo(0, 0);
}
function renderConfirmation() {
  const o = state.order;
  setTitle('Тапсырыс қабылданды (демо)');
  $('#app').innerHTML = pageHead('Тапсырыс қабылданды (демо)', '') +
    '<div class="container page-body"><div class="confirm"><div class="confirm-ico">' + ICON.check + '</div>' +
    '<h2>Рахмет! Демо-тапсырыс рәсімделді</h2><div class="order-no" aria-label="Демо тапсырыс нөмірі">' + esc(o.number) + '</div>' +
    '<p class="warn"><strong>Маңызды:</strong> бұл демонстрациялық тапсырыс. Ол нақты дүкенге жіберілген жоқ және төлем өңделмеді. Нақты тапсырыстарды өңдеу үшін серверлік бөлік немесе сыртқы сауда қызметі қажет.</p>' +
    '<div class="confirm-box"><h3>Тапсырыс деректері</h3>' +
    '<p>' + esc(o.customer.name) + '<br>' + esc(o.customer.phone) + ' · ' + esc(o.customer.email) + '<br>' + esc(o.customer.city) + (o.customer.delivery !== 'pickup' ? ', ' + esc(o.customer.address) : '') + '</p>' +
    '<p>Жеткізу: ' + esc(DELIVERY[o.customer.delivery].label) + '<br>Төлем: ' + esc(PAYMENTS[o.customer.payment]) + (o.customer.comment ? '<br>Түсініктеме: ' + esc(o.customer.comment) : '') + '</p>' +
    '<div class="sum-items">' + o.items.map((i) => '<div class="sum-item"><img src="' + img(i.photo, 120) + '" alt="' + esc(i.name) + '"><div>' + esc(i.name) + '<small>' + esc(i.size) + ' · ' + esc(i.color) + ' · ' + i.qty + ' дана</small></div><strong>' + fmt(i.price * i.qty) + '</strong></div>').join('') + '</div>' +
    '<div class="sum-row"><span>Тауарлар</span><span>' + fmt(o.totals.subtotal) + '</span></div>' +
    '<div class="sum-row"><span>Жеткізу</span><span>' + (o.totals.fee ? fmt(o.totals.fee) : 'Тегін') + '</span></div>' +
    '<div class="sum-row total"><span>Жиыны</span><span>' + fmt(o.totals.total) + '</span></div></div>' +
    '<div class="hero-actions" style="justify-content:center;margin-top:24px"><a class="btn btn-primary" href="#/catalog">Каталогқа оралу</a><a class="btn btn-outline" href="#/">Басты бетке</a></div></div></div>';
}

/* ============================================================
   14. БІЗ ТУРАЛЫ (#/about) ЖӘНЕ АҚПАРАТТЫҚ БЕТТЕР
   ============================================================ */
function contactBoxHtml() {
  return '<div class="contact-box"><p class="demo-note" style="margin-top:0">Орынтолтырғыштар: нақты деректерді кейін ауыстырыңыз.</p><dl>' +
    '<dt>Телефон</dt><dd>[+7 705 361 76 07]</dd><dt>Электрондық пошта</dt><dd>[info@your-domain.kz]</dd>' +
    '<dt>Мекенжай</dt><dd>[Almaty, avenu Abai, 22]</dd><dt>Жұмыс уақыты</dt><dd>[Дс–Жс, 10:00–20:00]</dd><dt>Әлеуметтік желілер</dt><dd>[@brand_username]</dd></dl></div>';
}
function renderAbout() {
  setTitle('Біз туралы');
  $('#app').innerHTML = pageHead('Біз туралы', 'Dinaraa — сымбатты қарапайымдылық пен күнделікті жайлылық туралы бренд.') +
    '<div class="container page-body">' +
    '<section class="about-hero"><div><p class="eyebrow">Бренд</p><h2>Киім — өзіңізді сезінудің бір жолы</h2>' +
    '<p>Dinaraa — Қазақстандағы заманауи әйелдерге арналған киім дүкенінің концепциясы. Біз күнделікті гардеробты ұтымды әрі көркем етуге ұмтыламыз: әр зат бір-бірімен үйлесіп, күн сайын киюге жайлы болуы тиіс.</p>' +
    '<p>Бұл сайттағы тауарлар мен мәтіндер демонстрациялық мақсатта дайындалған және нақты каталогпен ауыстырылады.</p>' +
    '<a class="btn btn-primary" href="#/catalog">Каталогқа өту</a></div>' +
    '<div class="about-img"><img src="' + img('1469334031218-e382a71b716b', 900) + '" alt="Dinaraa брендінің эдиториал фотосы" loading="lazy"></div></section>' +

    '<section class="section"><div class="section-head"><div><p class="eyebrow">Құндылықтар</p><h2>Миссиямыз бен принциптеріміз</h2></div></div>' +
    '<div class="values"><div class="value"><div class="num">01</div><h3>Миссия</h3><p>Әйелдерге күнделікті өмірде өзін сенімді әрі жайлы сезінуге көмектесетін киім ұсыну.</p></div>' +
    '<div class="value"><div class="num">02</div><h3>Құндылықтар</h3><p>Ашықтық, ұқыптылық және клиентке құрмет: әр тауардың материалы мен күтімі анық жазылады.</p></div>' +
    '<div class="value"><div class="num">03</div><h3>Көзқарас</h3><p>Артық әшекейсіз, сапалы пішіндер мен табиғи реңктер арқылы уақыт өтсе де өзектілігін жоғалтпайтын гардероб құру.</p></div></div></section>' +

    '<section class="about-hero" style="margin-bottom:64px"><div class="about-img wide"><img src="' + img('1445205170230-053b83016050', 900) + '" alt="Дизайн философиясы: маталар мен пішіндер" loading="lazy"></div>' +
    '<div><p class="eyebrow">Дизайн философиясы</p><h2>Стиль, сапа және жайлылық</h2>' +
    '<p><strong>Стиль.</strong> Таза сызықтар, теңгерімді пропорциялар және бір-бірімен оңай үйлесетін түстер.</p>' +
    '<p><strong>Сапа.</strong> Маталарды таңдауға және тігіс детальдарына көңіл бөлеміз.</p>' +
    '<p><strong>Жайлылық.</strong> Киім қимылға кедергі келтірмей, күні бойы жағымды болуы керек.</p></div></section>' +

    '<section class="section section-alt" style="margin:0 -20px 64px;padding-left:20px;padding-right:20px"><div class="section-head"><div><p class="eyebrow">Артықшылықтар</p><h2>Біз не ұсынамыз</h2></div></div><div class="benefits">' +
    [[ICON.star, 'Үйлесімді топтама', 'Бір-бірімен үйлесетін заттар образ құруды жеңілдетеді.'], [ICON.check, 'Айқын ақпарат', 'Материал, күтім және өлшем кестесі әр тауар бетінде.'], [ICON.truck, 'Қолжетімді жеткізу', 'Жеткізу нұсқалары (үлгі шарт).'], [ICON.chat, 'Қарапайым қолдау', 'Байланыс деректері кейін толтырылады.']]
      .map((b) => '<div class="benefit"><div class="benefit-ico">' + b[0] + '</div><h3>' + b[1] + '</h3><p>' + b[2] + '</p></div>').join('') + '</div></section>' +

    '<section id="contacts" class="section" style="padding-top:0"><div class="section-head"><div><p class="eyebrow">Байланыс</p><h2>Бізбен байланысу</h2></div></div>' + contactBoxHtml() + '</section>' +
    '<div class="cta-band"><h2>Топтамамен танысыңыз</h2><p>Күз–қыс маусымына арналған үлгі тауарларды қараңыз.</p><a class="btn btn-light" href="#/catalog">Каталогты ашу</a></div></div>';
}
function renderInfo(slug) {
  const d = INFO[slug];
  if (!d) { renderNotFound(); return; }
  setTitle(d.title);
  $('#app').innerHTML = pageHead(d.title, '') +
    '<div class="container page-body"><div class="info-page">' + d.text.map((t) => '<p>' + esc(t) + '</p>').join('') + (d.contacts ? contactBoxHtml() : '') +
    '<div class="info-nav" aria-label="Ақпараттық беттер">' + Object.keys(INFO).map((k) => '<a href="#/info/' + k + '"' + (k === slug ? ' aria-current="page"' : '') + '>' + INFO[k].title + '</a>').join('') + '</div></div></div>';
}

/* ============================================================
   15. СЕБЕТ ЖӘНЕ ТАҢДАУЛЫЛАР ОПЕРАЦИЯЛАРЫ
   ============================================================ */
function addToCart(pid, size, color, qty) {
  const p = getProduct(pid);
  if (!p) return false;
  if (maxQty(p) < 1) { toast('Бұл тауар қазір қоймада жоқ.', 'error'); return false; }
  if (!p.sizes.includes(size)) { toast('Өлшемді таңдаңыз.', 'error'); return false; }
  if (!p.colors.includes(color)) { toast('Түсті таңдаңыз.', 'error'); return false; }
  qty = parseInt(qty, 10);
  if (isNaN(qty) || qty < 1) { toast('Санын дұрыс көрсетіңіз (кемінде 1).', 'error'); return false; }
  const line = state.cart.find((l) => cartKey(l) === pid + '|' + size + '|' + color);
  const newQty = (line ? line.qty : 0) + qty;
  if (newQty > maxQty(p)) {
    toast('Бір нұсқадан ең көбі ' + maxQty(p) + ' дана тапсыруға болады.', 'error');
    return false;
  }
  if (line) line.qty = newQty; else state.cart.push({ pid: p.id, size: size, color: color, qty: qty });
  saveCart();
  updateCounters();
  toast('«' + p.name + '» себетке қосылды (' + size + ', ' + color + ').', 'ok');
  return true;
}
function changeCartQty(key, qty) {
  const line = state.cart.find((l) => cartKey(l) === key);
  if (!line) return;
  const p = getProduct(line.pid);
  qty = parseInt(qty, 10);
  if (isNaN(qty) || qty < 1) qty = 1;
  if (qty > maxQty(p)) { qty = maxQty(p); toast('Ең көбі ' + maxQty(p) + ' дана тапсыруға болады.', 'error'); }
  line.qty = qty;
  saveCart(); updateCounters(); renderCart();
}
function removeFromCart(key) {
  const before = state.cart.length;
  state.cart = state.cart.filter((l) => cartKey(l) !== key);
  if (state.cart.length !== before) toast('Тауар себеттен алынды.', 'ok');
  saveCart(); updateCounters(); renderCart();
}
function toggleFav(id) {
  id = Number(id);
  const p = getProduct(id);
  if (!p) return;
  if (isFav(id)) { state.fav = state.fav.filter((x) => x !== id); toast('«' + p.name + '» таңдаулылардан алынды.', 'ok'); }
  else { state.fav.push(id); toast('«' + p.name + '» таңдаулыларға қосылды.', 'ok'); }
  saveFav();
  updateCounters();
  if (state.route === 'favorites') renderFavorites(); else syncFavButtons();
}
function syncFavButtons() {
  $$('[data-action="toggle-fav"]').forEach((b) => {
    const on = isFav(b.dataset.id);
    const label = on ? 'Таңдаулылардан алып тастау' : 'Таңдаулыларға қосу';
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
    const l = $('[data-fav-label]', b);
    if (l) l.textContent = label; else if (b.classList.contains('fav-btn')) b.setAttribute('aria-label', label);
  });
}
function openQuickAdd(id) {
  const p = getProduct(id);
  if (!p) return;
  if (p.sizes.length === 1 && p.colors.length === 1) { addToCart(p.id, p.sizes[0], p.colors[0], 1); return; }
  const actions = '<div class="pdp-actions"><button type="button" class="btn btn-primary" data-action="add-selected">Себетке қосу</button><a class="btn btn-outline" href="#/product/' + p.id + '">Толығырақ</a></div>';
  openModal('<div class="modal-head"><img src="' + img(p.photo, 200) + '" alt="' + esc(p.name) + '"><div><h2>' + esc(p.name) + '</h2><div class="price">' + priceHtml(p) + '</div></div></div>' +
    selectorHtml(p, { mode: 'modal', qty: false, actions: actions }), 'Себетке қосу: ' + p.name);
}

/* ============================================================
   16. ОҚИҒАЛАРДЫ ӨҢДЕУ (event delegation)
   ============================================================ */
const actions = {
  'toggle-menu': (t) => {
    const open = document.body.classList.toggle('menu-open');
    t.setAttribute('aria-expanded', String(open));
    t.setAttribute('aria-label', open ? 'Мәзірді жабу' : 'Мәзірді ашу');
  },
  'toggle-fav': (t) => toggleFav(t.dataset.id),
  'quick-add': (t) => openQuickAdd(t.dataset.id),
  'close-modal': () => closeModal(),
  'toggle-filters': () => {
    const f = $('#filters'), o = $('#filtersOverlay');
    if (!f) return;
    const open = f.classList.toggle('open');
    if (o) o.classList.toggle('show', open);
    syncScrollLock();
  },
  'clear-filters': () => clearFilters(),
  pick: (t) => {
    const sel = t.closest('[data-selector]');
    if (!sel) return;
    $$('[data-pick="' + t.dataset.pick + '"]', sel).forEach((b) => { b.classList.toggle('active', b === t); b.setAttribute('aria-pressed', String(b === t)); });
    if (t.dataset.pick === 'color') { const l = $('[data-color-label]', sel); if (l) l.textContent = t.dataset.value; }
    if (t.dataset.pick === 'size') { const e = $('.selector-error', sel); if (e) e.hidden = true; }
  },
  'qty-minus': (t) => stepQty(t, -1),
  'qty-plus': (t) => stepQty(t, 1),
  'add-selected': (t) => {
    const sel = t.closest('[data-selector]');
    const p = getProduct(sel.dataset.id);
    const s = readSelection(sel);
    if (!s.size) {
      const e = $('.selector-error', sel);
      if (e) e.hidden = false;
      toast('Алдымен өлшемді таңдаңыз.', 'error');
      return;
    }
    if (addToCart(p.id, s.size, s.color, s.qty) && sel.dataset.mode === 'modal') closeModal();
  },
  gallery: (t) => {
    const v = GALLERY_VIEWS[Number(t.dataset.i)];
    const main = $('#galleryImg');
    if (!v || !main) return;
    main.style.objectPosition = v.pos;
    main.style.transform = 'scale(' + v.z + ')';
    $$('.thumb').forEach((b) => b.classList.toggle('active', b === t));
  },
  'cart-inc': (t) => { const l = state.cart.find((x) => cartKey(x) === t.dataset.key); if (l) changeCartQty(t.dataset.key, l.qty + 1); },
  'cart-dec': (t) => { const l = state.cart.find((x) => cartKey(x) === t.dataset.key); if (l) { if (l.qty <= 1) removeFromCart(t.dataset.key); else changeCartQty(t.dataset.key, l.qty - 1); } },
  'cart-remove': (t) => removeFromCart(t.dataset.key)
};

function stepQty(btn, d) {
  const input = $('.qty-input', btn.closest('.qty'));
  const p = getProduct(btn.closest('[data-selector]').dataset.id);
  let v = (parseInt(input.value, 10) || 1) + d;
  if (v < 1) v = 1;
  if (v > maxQty(p)) { v = maxQty(p); toast('Ең көбі ' + maxQty(p) + ' дана тапсыруға болады.', 'error'); }
  input.value = v;
}

function onClick(e) {
  const t = e.target.closest('[data-action]');
  if (t && actions[t.dataset.action]) {
    if (t.tagName === 'A') e.preventDefault();
    actions[t.dataset.action](t, e);
    return;
  }
  if (e.target.classList && e.target.classList.contains('modal-backdrop')) closeModal();
}
function onChange(e) {
  const el = e.target;
  if (el.matches('[data-filter]')) { onFilterChange(); return; }
  if (el.classList.contains('qty-input')) {
    if (el.dataset.key) { changeCartQty(el.dataset.key, el.value); return; }
    const sel = el.closest('[data-selector]');
    const p = sel && getProduct(sel.dataset.id);
    let v = parseInt(el.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    if (p && v > maxQty(p)) { v = maxQty(p); toast('Ең көбі ' + maxQty(p) + ' дана тапсыруға болады.', 'error'); }
    el.value = v;
    return;
  }
  if (el.name === 'delivery' && el.closest('#checkoutForm')) {
    state.deliveryMethod = el.value;
    $('#checkoutSummary').innerHTML = checkoutSummaryHtml(el.value);
    const err = $('#err-delivery'); if (err) err.textContent = '';
  }
}
function onInput(e) {
  const el = e.target;
  if (el.matches('[data-filter="q"], [data-filter="min"], [data-filter="max"]')) { onFilterChange(); return; }
  const form = el.closest('#checkoutForm');
  if (form && el.name) {
    const err = $('#err-' + el.name);
    if (err && err.textContent) {
      err.textContent = '';
      const w = el.closest('[data-field]'); if (w) w.classList.remove('invalid');
      el.setAttribute('aria-invalid', 'false');
    }
  }
}
function onSubmit(e) {
  const f = e.target;
  if (f.id === 'searchForm') {
    e.preventDefault();
    const q = $('#headerSearch').value.trim();
    const target = q ? '#/catalog?q=' + encodeURIComponent(q) : '#/catalog';
    if (location.hash === target) route(); else location.hash = target;
  } else if (f.id === 'newsletterForm') {
    e.preventDefault();
    const email = $('#nlEmail').value.trim(), msg = $('#nlMsg');
    if (!email) { msg.textContent = 'Электрондық пошта мекенжайын енгізіңіз.'; msg.className = 'form-msg error'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = 'Электрондық пошта дұрыс емес. Мысалы: aigul@mail.kz'; msg.className = 'form-msg error'; return; }
    msg.textContent = 'Демо: мекенжай сақталған жоқ және ешқайда жіберілген жоқ.';
    msg.className = 'form-msg';
    f.reset();
    toast('Демонстрациялық режим: жазылу сақталмады.', 'ok');
  } else if (f.id === 'checkoutForm') {
    e.preventDefault();
    submitCheckout(f);
  }
}
function onKeydown(e) {
  if (e.key !== 'Escape') return;
  closeModal(); closeMenu(); closeFilters();
}
function onStorage(e) {
  if (e.key === KEYS.cart) { state.cart = sanitizeCart(loadList(KEYS.cart)); updateCounters(); if (state.route === 'cart') renderCart(); }
  if (e.key === KEYS.fav) { state.fav = sanitizeFav(loadList(KEYS.fav)); updateCounters(); if (state.route === 'favorites') renderFavorites(); else syncFavButtons(); }
}

/* ============================================================
   17. ИНИЦИАЛИЗАЦИЯ
   ============================================================ */
function init() {
  state.cart = sanitizeCart(loadList(KEYS.cart));
  state.fav = sanitizeFav(loadList(KEYS.fav));
  saveCart(); saveFav();
  updateCounters();
  document.addEventListener('click', onClick);
  document.addEventListener('change', onChange);
  document.addEventListener('input', onInput);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('error', handleImageError, true);
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', onStorage);
  route();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
