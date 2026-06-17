export interface Translations {
  heroTagline: string;
  heroSub: string;
  navHome: string;
  navMenu: string;
  navReservation: string;
  navSettings: string;
  searchPlaceholder: string;
  filterAll: string;
  filterVegetarian: string;
  filterSpicy: string;
  catAll: string;
  catAppetizer: string;
  catMain: string;
  catDessert: string;
  catDrink: string;
  resTitle: string;
  resSubtitle: string;
  resName: string;
  resEmail: string;
  resDate: string;
  resTime: string;
  resGuests: string;
  resNotes: string;
  resSubmit: string;
  resSuccess: string;
  settingsTitle: string;
  settingsLanguage: string;
  settingsTheme: string;
  settingsThemeDark: string;
  settingsThemeLight: string;
  contactTitle: string;
  contactAddress: string;
  contactHours: string;
  contactHoursWeek: string;
  contactHoursWeekend: string;
  spicyLevel: string;
  vegOnly: string;
  close: string;
  backToTop: string;
  brandStoryTitle: string;
  brandStoryText: string;
}

export type Language = 'hr' | 'en' | 'zh';

export const translations: Record<Language, Translations> = {
  hr: {
    heroTagline: "Okusi Vatre i Dalmatinske Tradicije",
    heroSub: "U srcu Zagreba, spajamo strast domaće kuhinje s modernim kulinarskim umijećem.",
    navHome: "Početna",
    navMenu: "Jelovnik",
    navReservation: "Rezervacije",
    navSettings: "Postavke",
    searchPlaceholder: "Pretraži jela...",
    filterAll: "Sva jela",
    filterVegetarian: "Vegetarijansko",
    filterSpicy: "Ljutkasto",
    catAll: "Sve",
    catAppetizer: "Predjela",
    catMain: "Glavna jela",
    catDessert: "Deserti",
    catDrink: "Pića",
    resTitle: "Rezervirajte Stol",
    resSubtitle: "Osigurajte svoje mjesto u gastronomskom srcu Hrvatske",
    resName: "Ime i prezime",
    resEmail: "E-mail adresa",
    resDate: "Datum posjeta",
    resTime: "Vrijeme",
    resGuests: "Broj gostiju",
    resNotes: "Posebne napomene",
    resSubmit: "Rezerviraj stol",
    resSuccess: "Rezervacija uspješna! Veselimo se Vašem dolasku u Srce Vatreno.",
    settingsTitle: "Postavke",
    settingsLanguage: "Jezik / Language",
    settingsTheme: "Tema / Appearance",
    settingsThemeDark: "Tamna",
    settingsThemeLight: "Svijetla",
    contactTitle: "Kontakt & Lokacija",
    contactAddress: "Ulica Vatrenih Srca 45, 10000 Zagreb, Hrvatska",
    contactHours: "Radno Vrijeme",
    contactHoursWeek: "Pon - Pet: 12:00 - 23:00",
    contactHoursWeekend: "Sub - Ned: 12:00 - 00:00",
    spicyLevel: "Razina ljutine",
    vegOnly: "Samo vegetarijansko",
    close: "Zatvori",
    backToTop: "Natrag na vrh",
    brandStoryTitle: "Naša Priča",
    brandStoryText: "Nazvan po vatrenom duhu hrvatskog naroda i našoj strasti prema domaćoj kulinarskoj tradiciji, 'Srce Vatreno' slavi bogatstvo jadranskih plodova mora i rustikalnih jela iz svih regija Hrvatske. Od dalmatinske peke do slavonskog kulena, svako jelo priprema se s ljubavlju i autentičnim lokalnim namirnicama."
  },
  en: {
    heroTagline: "Flavors of Fire and Dalmatian Tradition",
    heroSub: "In the heart of Zagreb, we blend the passion of home-style cooking with modern culinary craftsmanship.",
    navHome: "Home",
    navMenu: "Menu",
    navReservation: "Reservations",
    navSettings: "Settings",
    searchPlaceholder: "Search dishes...",
    filterAll: "All Dishes",
    filterVegetarian: "Vegetarian",
    filterSpicy: "Spicy",
    catAll: "All",
    catAppetizer: "Appetizers",
    catMain: "Mains",
    catDessert: "Desserts",
    catDrink: "Drinks",
    resTitle: "Book a Table",
    resSubtitle: "Secure your place in the culinary heart of Croatia",
    resName: "Full name",
    resEmail: "Email address",
    resDate: "Date of visit",
    resTime: "Time slot",
    resGuests: "Number of guests",
    resNotes: "Special notes / requests",
    resSubmit: "Book Table",
    resSuccess: "Reservation successful! We look forward to welcoming you at Srce Vatreno.",
    settingsTitle: "Settings",
    settingsLanguage: "Language",
    settingsTheme: "Appearance",
    settingsThemeDark: "Dark Theme",
    settingsThemeLight: "Light Theme",
    contactTitle: "Contact & Location",
    contactAddress: "Fire Hearts Street 45, 10000 Zagreb, Croatia",
    contactHours: "Opening Hours",
    contactHoursWeek: "Mon - Fri: 12:00 PM - 11:00 PM",
    contactHoursWeekend: "Sat - Sun: 12:00 PM - 12:00 AM",
    spicyLevel: "Spiciness Level",
    vegOnly: "Vegetarian Only",
    close: "Close",
    backToTop: "Back to Top",
    brandStoryTitle: "Our Story",
    brandStoryText: "Named after the fiery spirit of the Croatian people and our passion for culinary heritage, 'Srce Vatreno' (Fiery Heart) celebrates the abundance of Adriatic seafood and rustic inland dishes. From Dalmatian peka cooked under the bell to Slavonian kulen sausage, every plate is prepared with devotion and authentic local ingredients."
  },
  zh: {
    heroTagline: "烈火与达尔马提亚传统之风味",
    heroSub: "坐落于萨格勒布市中心，我们将家常菜肴的烹饪热情与现代厨艺完美融合。",
    navHome: "首页",
    navMenu: "美味菜单",
    navReservation: "预约订座",
    navSettings: "设置",
    searchPlaceholder: "搜索菜品...",
    filterAll: "全部菜品",
    filterVegetarian: "素食",
    filterSpicy: "香辣",
    catAll: "全部",
    catAppetizer: "精美前菜",
    catMain: "经典主菜",
    catDessert: "美味甜点",
    catDrink: "醇香饮品",
    resTitle: "预约您的餐桌",
    resSubtitle: "在克罗地亚的美食中心锁定您的席位",
    resName: "姓名",
    resEmail: "电子邮箱",
    resDate: "用餐日期",
    resTime: "具体时间",
    resGuests: "用餐人数",
    resNotes: "特殊要求/备注",
    resSubmit: "立即预约",
    resSuccess: "预约成功！期待您光临“烈火之心”（Srce Vatreno）。",
    settingsTitle: "个性化设置",
    settingsLanguage: "语言选择",
    settingsTheme: "主题界面",
    settingsThemeDark: "暗黑模式",
    settingsThemeLight: "明亮模式",
    contactTitle: "联系我们 & 地理位置",
    contactAddress: "克罗地亚萨格勒布, 烈火之心街 45号 (邮编 10000)",
    contactHours: "营业时间",
    contactHoursWeek: "周一至周五：中午 12:00 - 晚上 23:00",
    contactHoursWeekend: "周六至周日：中午 12:00 - 半夜 00:00",
    spicyLevel: "辣度等级",
    vegOnly: "仅看素食",
    close: "关闭",
    backToTop: "返回顶部",
    brandStoryTitle: "品牌故事",
    brandStoryText: "“烈火之心”（Srce Vatreno）源于克罗地亚人民坚韧热烈的精神以及对悠久饮食文化的热爱。我们致力于呈献亚得里亚海鲜的鲜美以及内陆乡村菜肴的质朴与丰盛。从在圆铁罩下焖烤而成的传统达尔马提亚“佩卡”（Peka），到风味醇厚的斯拉沃尼亚“库伦”（Kulen）香肠，每一道佳肴均精选当地原生食材，倾注十二分的热情制作而成。"
  }
};
