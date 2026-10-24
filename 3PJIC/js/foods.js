// =====================================================================
// ฐานข้อมูลเมนู 3PJIC (ฉบับเริ่มต้น)
//
// วิธีเพิ่ม/แก้เมนู: คัดลอกเมนูที่มีอยู่ 1 ก้อน แล้วแก้ค่า
//   id        รหัสภาษาอังกฤษไม่ซ้ำกัน (ใช้ในลิงก์ food.html?id=...)
//   name      ชื่อที่แสดง
//   aliases   ชื่ออื่นที่คนพิมพ์ค้นหา
//   cat       หมวด: food | snack | dessert | fruit | drink | store | topping
//   meals     มื้อที่เหมาะ: breakfast | lunch | snack | dinner
//   serving   หน่วยบริโภค เช่น "1 จาน"   grams = น้ำหนักต่อหน่วย (กรัม) หรือ null ถ้ายังไม่ได้ชั่ง
//   tags      ป้ายสำหรับกฎแนะนำ: sugar | sodium | fat | purine
//   allergens ต้องสะกดตรงกับ ALLERGIES ใน nutrition.js (ตั้งค่าจริงในตาราง ALLERGEN_TABLE ด้านล่าง)
//   alt       ทางเลือก/วิธีสั่งที่ดีต่อสุขภาพกว่า
//   n         สารอาหารต่อ 100 กรัม { kcal, p, f, c, sugar, fiber, na } หรือ null ถ้ายังไม่มีแหล่งอ้างอิง
//   src       แหล่งที่มาของตัวเลข { name, url } และ checkedBy = ชื่อคนในทีมที่ตรวจแล้ว
//   img       (ไม่บังคับ) ชื่อไฟล์รูปถ่ายในโฟลเดอร์ img/foods/ ถ้าไม่ใส่ จะใช้ไอคอนวาดเองจาก js/food-icons.js
//
// สำคัญ: ป้ายและสารก่อภูมิแพ้ในฉบับนี้เป็น "ค่าเบื้องต้น" จากส่วนผสมทั่วไปของแต่ละเมนู
// ทีมควรตรวจอีกครั้ง และสูตรแต่ละร้านต่างกัน ส่วนตัวเลขสารอาหารยังว่างทั้งหมด
// เพราะยังไม่ได้ตัวเลขที่ตรวจแล้วจากแหล่งอ้างอิง (ดู README หัวข้อฐานข้อมูลเมนู)
// =====================================================================

import { CONDITIONS, normAllergies, splitWords } from "./nutrition.js";
import { NUTRITION, FCD_SOURCE, DOH_SOURCE, USDA_SOURCE } from "./nutrition-data.js";
import { SERVINGS, SERVING_SOURCES, FRUIT_EXCHANGE_KCAL } from "./serving-data.js";

export const CATEGORIES = {
  food:    "อาหาร",
  snack:   "ขนม",
  dessert: "ของหวาน",
  fruit:   "ผลไม้",
  drink:   "เครื่องดื่ม",
  store:   "ร้านสะดวกซื้อ",
  topping: "ท็อปปิ้ง",
};
export const MEAL_SLOTS = { breakfast: "เช้า", lunch: "กลางวัน", snack: "ว่าง", dinner: "เย็น" };
export const TAGS = { sugar: "น้ำตาลสูง", sodium: "โซเดียมสูง", fat: "ไขมันสูง", purine: "พิวรีนสูง" };

// โรคประจำตัว → ป้ายที่ต้องเลี่ยง
export const AVOID_BY_CONDITION = {
  diabetes: ["sugar"],
  hypertension: ["sodium"],
  lipid: ["fat"],
  gout: ["purine"],
  kidney: ["sodium"],
};

const F = (id, name, cat, meals, serving, tags, allergens, alt, aliases = []) =>
  ({ id, name, aliases, cat, meals, serving, grams: null, tags, allergens, alt, n: null, src: null, img: null, imgCredit: null });

export const FOODS = [
  // ---------- อาหาร ----------
  F("kaprao-gai", "ข้าวผัดกะเพราไก่", "food", ["lunch", "dinner"], "1 จาน", ["sodium"], [], "ขอน้ำมันน้อย ไม่ราดน้ำปลาพริกเพิ่ม ถ้าใส่ไข่ เลือกไข่ต้มแทนไข่ดาว", ["กระเพรา", "กะเพรา", "ผัดกะเพรา"]),
  F("khao-man-gai", "ข้าวมันไก่", "food", ["lunch", "dinner"], "1 จาน", ["fat", "sodium"], [], "เลือกเนื้ออก ลอกหนัง ขอน้ำจิ้มแยกและใช้น้อย", ["ข้าวมันไก่ต้ม"]),
  F("khao-kha-mu", "ข้าวขาหมู", "food", ["lunch", "dinner"], "1 จาน", ["fat", "sodium"], ["ไข่"], "ขอเนื้อไม่ติดมัน ไม่เอาหนัง เพิ่มผักกาดดอง/คะน้าลวก", ["ขาหมู"]),
  F("khao-mu-daeng", "ข้าวหมูแดง", "food", ["lunch", "dinner"], "1 จาน", ["sugar", "sodium"], ["ไข่"], "ขอน้ำราดน้อย ไม่เอาหมูกรอบ", ["หมูแดง"]),
  F("khao-pad-mu", "ข้าวผัดหมู", "food", ["lunch", "dinner"], "1 จาน", ["fat"], ["ไข่"], "ขอน้ำมันน้อย เพิ่มผัก กินคู่แตงกวา", ["ข้าวผัด"]),
  F("khao-khai-jiao", "ไข่เจียว", "food", ["breakfast", "lunch", "dinner"], "1 ฟอง", ["fat", "sodium"], ["ไข่"], "กินคู่ข้าวสวย 1 ทัพพี ขอเจียวน้ำมันน้อย หรือเปลี่ยนเป็นไข่ต้ม", ["ข้าวไข่เจียว", "ไข่เจียว"]),
  F("khao-tom-mu", "ข้าวต้มหมู", "food", ["breakfast", "dinner"], "1 ชาม", [], [], "เติมผักและขิง ปรุงรสน้อย", ["ข้าวต้ม"]),
  F("jok-mu", "โจ๊กหมู", "food", ["breakfast"], "1 ชาม", ["sodium"], [], "ใส่ไข่ลวกเพิ่มโปรตีน ปรุงซีอิ๊วน้อย", ["โจ๊ก"]),
  F("kuay-tiew-nam-sai", "ก๋วยเตี๋ยวเส้นเล็กแห้งหมู", "food", ["lunch", "dinner"], "1 ชาม", ["sodium"], [], "ปรุงน้อย เพิ่มผัก", ["ก๋วยเตี๋ยว", "ก๋วยเตี๋ยวหมู", "เส้นเล็กแห้ง", "ก๋วยเตี๋ยวแห้ง"]),
  F("kuay-tiew-tom-yum", "ก๋วยเตี๋ยวต้มยำ", "food", ["lunch", "dinner"], "1 ชาม", ["sodium", "sugar"], ["ถั่ว"], "ขอน้ำตาลน้อย ไม่ใส่ถั่วเพิ่ม ไม่ซดน้ำหมด", ["ต้มยำ"]),
  F("yen-ta-fo", "เย็นตาโฟ", "food", ["lunch", "dinner"], "1 ชาม", ["sodium"], ["อาหารทะเล"], "ไม่ซดน้ำหมด เพิ่มผักบุ้ง", ["เย็นตาโฟ"]),
  F("ba-mi-mu-daeng", "บะหมี่หมูแดง", "food", ["lunch", "dinner"], "1 ชาม", ["sodium"], ["แป้งสาลี", "ไข่"], "บะหมี่น้ำแทนแห้ง ไม่เติมน้ำมันกระเทียม", ["บะหมี่", "บะหมี่เกี๊ยว"]),
  F("pad-thai-goong", "ผัดไทยกุ้งสด", "food", ["lunch", "dinner"], "1 จาน", ["sugar", "fat"], ["อาหารทะเล", "ถั่ว", "ไข่"], "ขอหวานน้อย น้ำมันน้อย เพิ่มถั่วงอกและกุยช่าย", ["ผัดไทย"]),
  F("pad-see-ew", "ผัดซีอิ๊วหมู", "food", ["lunch", "dinner"], "1 จาน", ["sodium", "fat"], ["ไข่"], "ขอน้ำมันน้อย เพิ่มคะน้า", ["ผัดซีอิ๊ว"]),
  F("rad-na-mu", "ราดหน้าหมู", "food", ["lunch", "dinner"], "1 จาน", ["sodium"], [], "เส้นหมี่แทนเส้นใหญ่ทอด ไม่เติมซีอิ๊ว", ["ราดหน้า"]),
  F("som-tam-thai", "ส้มตำไทย", "food", ["lunch", "dinner"], "1 จาน", ["sodium", "sugar"], ["ถั่ว", "อาหารทะเล"], "ขอหวานน้อย ไม่ใส่กุ้งแห้งถ้าแพ้", ["ส้มตำ", "ตำไทย"]),
  F("gai-yang", "ไก่ย่าง", "food", ["lunch", "dinner"], "1 ไม้ / ครึ่งตัว", [], [], "ลอกหนังก่อนกิน กินคู่ส้มตำหรือผัก", ["ไก่ย่างข้าวเหนียว"]),
  F("tom-yum-goong", "ต้มยำกุ้งน้ำใส", "food", ["lunch", "dinner"], "1 ถ้วย", ["sodium"], ["อาหารทะเล"], "น้ำใสแทนน้ำข้น ไม่ซดน้ำหมด", ["ต้มยำกุ้ง"]),
  F("kaeng-khiao-wan-gai", "แกงเขียวหวานไก่", "food", ["lunch", "dinner"], "1 ถ้วย", ["fat"], [], "ตักเนื้อและผักมากกว่าน้ำแกง", ["แกงเขียวหวาน"]),
  F("kaeng-jued-tao-hu", "แกงจืดเต้าหู้หมูสับ", "food", ["lunch", "dinner"], "1 ถ้วย", [], ["ถั่ว"], "", ["แกงจืด"]),
  F("pla-nueng-manao", "ปลากะพงนึ่ง", "food", ["lunch", "dinner"], "1 จาน", [], ["อาหารทะเล"], "ขอน้ำราดมะนาวแยก ราดแต่น้อย", ["ปลานึ่งมะนาว", "ปลานึ่ง", "ปลากะพงนึ่งมะนาว"]),
  F("suki-nam-gai", "สุกี้น้ำไก่", "food", ["lunch", "dinner"], "1 ชาม", ["sodium"], ["ไข่"], "ใช้น้ำจิ้มสุกี้น้อย เพิ่มผัก", ["สุกี้"]),
  F("tom-lued-mu", "ต้มเลือดหมู", "food", ["breakfast", "dinner"], "1 ถ้วย", ["purine", "sodium"], [], "ผู้เป็นเกาต์ควรเลี่ยงเครื่องใน", ["เลือดหมู"]),
  F("yum-woon-sen", "ยำวุ้นเส้น", "food", ["lunch", "dinner"], "1 จาน", ["sodium"], ["อาหารทะเล"], "ขอหวานน้อย", ["ยำ"]),
  F("khai-pa-lo", "ข้าวราดไข่พะโล้", "food", ["lunch", "dinner"], "1 จาน", ["sugar", "sodium"], ["ไข่"], "ตักน้ำพะโล้น้อย", ["ไข่พะโล้", "พะโล้"]),
  F("kaprao-gai-kap", "ผัดกะเพราไก่ (เฉพาะกับข้าว)", "food", ["lunch", "dinner"], "1 ที่", ["sodium"], [], "กินคู่ข้าวสวย 1 ทัพพี ไข่ต้มแทนไข่ดาว", ["กะเพราไก่", "กระเพราไก่", "ผัดกะเพรา"]),

  // ---------- ฟาสต์ฟู้ด ----------
  F("burger-gai", "แฮมเบอร์เกอร์ไก่", "food", ["lunch", "dinner"], "1 ชิ้น", ["fat", "sodium"], ["แป้งสาลี", "ไข่", "นมวัว"], "เลือกไก่ย่างแทนไก่ทอด ไม่เพิ่มชีส กินคู่สลัดแทนเฟรนช์ฟรายส์", ["เบอร์เกอร์ไก่", "burger"]),
  F("burger-nuea", "แฮมเบอร์เกอร์เนื้อ", "food", ["lunch", "dinner"], "1 ชิ้น", ["fat", "sodium"], ["แป้งสาลี", "ไข่", "นมวัว"], "ไม่เพิ่มชีสและเบคอน เลือกขนาดเล็ก", ["เบอร์เกอร์เนื้อ", "burger"]),
  F("sandwich-gai", "แซนด์วิชไก่", "food", ["breakfast", "lunch"], "1 ชิ้น", ["fat", "sodium"], ["แป้งสาลี", "ไข่", "นมวัว"], "เลือกขนมปังโฮลวีต ซอสน้อย", ["แซนวิชไก่"]),
  F("sandwich-pla", "แซนด์วิชปลา", "food", ["breakfast", "lunch"], "1 ชิ้น", ["fat"], ["แป้งสาลี", "ไข่", "นมวัว", "อาหารทะเล"], "เลือกปลาย่างแทนปลาทอด ซอสน้อย", ["แซนวิชปลา", "ฟิชเบอร์เกอร์"]),

  // ---------- ขนม ----------
  F("khanom-khrok", "ขนมครก", "snack", ["breakfast", "snack"], "1 คู่", ["fat", "sugar"], [], "กินแค่ 2–3 คู่"),
  F("pa-tong-go", "ปาท่องโก๋", "snack", ["breakfast", "snack"], "1 คู่", ["fat"], ["แป้งสาลี"], "กินคู่น้ำเต้าหู้ไม่หวาน", ["ปาท่องโก๋"]),
  F("salapao-mu-sap", "ซาลาเปาหมูสับ", "snack", ["breakfast", "snack"], "1 ลูก", [], ["แป้งสาลี"], "", ["ซาลาเปา"]),
  F("roti-kluay-khai", "โรตีกล้วยไข่", "snack", ["snack"], "1 แผ่น", ["fat", "sugar"], ["แป้งสาลี", "ไข่", "นมวัว"], "ไม่ราดนมข้นหวาน", ["โรตี"]),
  F("khanom-jeeb", "ขนมจีบ", "snack", ["breakfast", "snack"], "4 ลูก", ["sodium"], ["แป้งสาลี"], "ใช้ซีอิ๊วจิ้มน้อย", ["ติ่มซำ"]),
  F("look-chin-ping", "ลูกชิ้นปิ้ง", "snack", ["snack"], "1 ไม้", ["sodium", "sugar"], [], "ขอน้ำจิ้มน้อย"),
  F("khanom-buang", "ขนมเบื้อง", "snack", ["snack"], "3 ชิ้น", ["sugar"], ["ไข่"], ""),
  F("khao-niao-mu-ping", "ข้าวเหนียวหมูปิ้ง", "snack", ["breakfast"], "1 ชุด (หมู 2 ไม้)", ["fat", "sugar"], [], "เลือกหมูไม่ติดมัน กินคู่ผักหรือนมจืด", ["หมูปิ้ง"]),
  F("roti", "โรตี (แผ่นเปล่า)", "snack", ["breakfast", "snack"], "1 แผ่น", ["fat"], ["แป้งสาลี", "นมวัว"], "ไม่ราดนมข้นหวาน กินแผ่นเดียว", ["โรตีเปล่า", "โรตีกรอบ"]),
  F("french-fries", "เฟรนช์ฟรายส์", "snack", ["snack"], "1 ห่อเล็ก", ["fat"], [], "สั่งขนาดเล็ก ไม่โรยเกลือเพิ่ม", ["มันฝรั่งทอด", "เฟรนฟราย"]),

  // ---------- ของหวาน ----------
  F("bua-loi", "บัวลอย", "dessert", ["snack"], "1 ถ้วย", ["sugar", "fat"], [], "บัวลอยน้ำขิง (ไม่ใส่กะทิ)", ["ขนมบัวลอย"]),
  F("khao-niao-mamuang", "ข้าวเหนียวมะม่วง", "dessert", ["snack"], "1 จาน", ["sugar", "fat"], [], "แบ่งครึ่งจาน หรือกินมะม่วงสุกอย่างเดียว"),
  F("lod-chong", "ลอดช่องน้ำกะทิ", "dessert", ["snack"], "1 ถ้วย", ["sugar", "fat"], [], "ขอน้ำเชื่อมน้อย", ["ลอดช่องสิงคโปร์"]),
  F("tub-tim-krob", "ทับทิมกรอบ", "dessert", ["snack"], "1 ถ้วย", ["sugar", "fat"], [], "ขอน้ำเชื่อมน้อย"),
  F("khao-niao-tua-dam", "สาคูถั่วดำ", "dessert", ["snack"], "1 ถ้วย", ["sugar", "fat"], [], "ขอกะทิน้อย กินครึ่งถ้วย", ["ถั่วดำ", "ข้าวเหนียวถั่วดำ", "ถั่วดำน้ำกะทิ"]),
  F("itim-kati", "ไอศกรีมกะทิ", "dessert", ["snack"], "1 ถ้วย", ["sugar", "fat"], [], "เลือก 1 สกู๊ป ไม่ใส่ท็อปปิ้งหวาน", ["ไอติมกะทิ"]),
  F("tao-huay-nam-khing", "เต้าฮวยน้ำขิง", "dessert", ["snack"], "1 ถ้วย", ["sugar"], ["ถั่ว"], "ขอน้ำขิงหวานน้อย", ["เต้าฮวย"]),

  // ---------- ผลไม้ ----------
  F("kluay-hom", "กล้วยหอม", "fruit", ["breakfast", "snack"], "1 ผลกลาง", [], [], ""),
  F("mamuang-suk", "มะม่วงสุก", "fruit", ["snack"], "½ ผล", ["sugar"], [], "กินครั้งละไม่เกิน ½ ผล", ["มะม่วงน้ำดอกไม้"]),
  F("durian", "ทุเรียน", "fruit", ["snack"], "1 พู", ["sugar", "fat"], [], "กินครั้งละ 1–2 พู", ["ทุเรียนหมอนทอง"]),
  F("som-khiao-wan", "ส้มเขียวหวาน", "fruit", ["breakfast", "snack"], "2 ผล", [], [], "", ["ส้ม"]),
  F("taeng-mo", "แตงโม", "fruit", ["snack"], "6–8 ชิ้นพอดีคำ", [], [], ""),
  F("farang", "ฝรั่ง", "fruit", ["snack"], "½ ผล", [], [], "กินแบบไม่จิ้มบ๊วยหรือน้ำตาล"),
  F("malako-suk", "มะละกอสุก", "fruit", ["breakfast", "snack"], "6–8 ชิ้นพอดีคำ", [], [], ""),
  F("sapparod", "สับปะรด", "fruit", ["snack"], "6–8 ชิ้นพอดีคำ", [], [], ""),
  F("som-o", "ส้มโอ", "fruit", ["snack"], "2–3 กลีบ", [], [], ""),
  F("lamyai", "ลำไย", "fruit", ["snack"], "6–8 ผล", ["sugar"], [], "กินพอประมาณ"),
  F("linchi", "ลิ้นจี่", "fruit", ["snack"], "6–8 ผล", [], [], "กินพอประมาณ"),
  F("ngo", "เงาะ", "fruit", ["snack"], "5–6 ผล", [], [], ""),
  F("kaeo-mangkon", "แก้วมังกร (เนื้อขาว)", "fruit", ["breakfast", "snack"], "½ ผล", [], [], "", ["แก้วมังกร"]),
  F("apple-daeng", "แอปเปิ้ลแดง", "fruit", ["breakfast", "snack"], "1 ผลเล็ก", [], [], "", ["แอปเปิ้ล", "แอปเปิล"]),
  F("apple-khiao", "แอปเปิ้ลเขียว", "fruit", ["breakfast", "snack"], "1 ผลเล็ก", [], [], "", ["แอปเปิ้ล", "แอปเปิล"]),
  F("sala", "สละ", "fruit", ["snack"], "4–5 ผล", [], [], ""),
  F("a-ngun-dam", "องุ่นดำ", "fruit", ["snack"], "10–12 ผล", [], [], "", ["องุ่น"]),
  F("noi-na", "น้อยหน่า", "fruit", ["snack"], "½ ผล", [], [], ""),
  F("cantaloupe", "แคนตาลูป", "fruit", ["breakfast", "snack"], "6–8 ชิ้นพอดีคำ", [], [], "", ["เมลอน"]),
  F("cherry", "เชอร์รี่", "fruit", ["snack"], "10 ผล", [], [], ""),
  F("thapthim", "ทับทิม", "fruit", ["snack"], "½ ผล", [], [], ""),

  // ---------- เครื่องดื่ม ----------
  F("cha-yen", "ชาเย็น", "drink", ["snack"], "1 แก้ว 16 ออนซ์", ["sugar"], ["นมวัว"], "สั่งหวาน 25% หรือชาดำเย็นไม่หวาน", ["ชานมเย็น", "ชาไทย"]),
  F("cha-nom-khai-muk", "ชานมไข่มุก", "drink", ["snack"], "1 แก้ว 16 ออนซ์", ["sugar", "fat"], ["นมวัว"], "หวาน 0–25% ไม่ใส่ไข่มุก", ["ไข่มุก", "บับเบิ้ลที"]),
  F("kafae-yen", "กาแฟเย็น", "drink", ["breakfast", "snack"], "1 แก้ว 16 ออนซ์", ["sugar"], ["นมวัว"], "อเมริกาโน่เย็น หรือหวานน้อย", ["เอสเย็น"]),
  F("americano-yen", "อเมริกาโน่เย็น", "drink", ["breakfast", "snack"], "1 แก้ว 16 ออนซ์", [], [], "", ["กาแฟดำ"]),
  F("nam-tao-hu", "น้ำเต้าหู้", "drink", ["breakfast"], "1 แก้ว", [], ["ถั่ว"], "สั่งไม่หวาน", ["นมถั่วเหลือง"]),
  F("nam-ad-lom", "น้ำอัดลม", "drink", ["snack"], "1 กระป๋อง 325 มล.", ["sugar"], [], "เลือกสูตรไม่มีน้ำตาล หรือน้ำโซดา", ["โค้ก", "น้ำหวาน"]),
  F("cha-manao", "ชามะนาว", "drink", ["snack"], "1 แก้ว 16 ออนซ์", ["sugar"], [], "หวานน้อย"),
  F("nam-maprao", "น้ำมะพร้าว", "drink", ["snack"], "1 ลูก", [], [], ""),
  F("nom-jued", "นมจืด", "drink", ["breakfast", "snack"], "1 กล่อง 200 มล.", [], ["นมวัว"], "เลือกพร่องมันเนย", ["นม"]),
  F("cocoa-yen", "โกโก้เย็น", "drink", ["snack"], "1 แก้ว 16 ออนซ์", ["sugar", "fat"], ["นมวัว"], "หวานน้อย", ["โกโก้"]),

  // ---------- ร้านสะดวกซื้อ (ใช้ฉลากโภชนาการบนห่อเป็นแหล่งข้อมูล) ----------
  F("sandwich-ham-cheese", "แซนด์วิชแฮมชีส", "store", ["breakfast"], "1 ชิ้น", ["sodium"], ["แป้งสาลี", "นมวัว"], "แซนด์วิชทูน่าหรือไข่", ["แซนวิช"]),
  F("khai-tom", "ไข่ต้ม", "store", ["breakfast", "snack"], "1 ฟอง", [], ["ไข่"], ""),
  F("nom-priao", "นมเปรี้ยว", "store", ["snack"], "1 ขวด", ["sugar"], ["นมวัว"], "โยเกิร์ตรสธรรมชาติ", ["โยเกิร์ตพร้อมดื่ม"]),

  // ---------- ท็อปปิ้ง (ใช้บวกเพิ่มกับเมนูหลัก) ----------
  F("khai-dao", "ไข่ดาว", "topping", [], "1 ฟอง", ["fat"], ["ไข่"], "ไข่ต้มแทน"),
  F("khao-plao-perm", "ข้าวสวยเพิ่ม", "topping", [], "1 ทัพพี", [], [], "ข้าวกล้องแทนข้าวขาว"),
  F("khai-muk", "ไข่มุก (ท็อปปิ้ง)", "topping", [], "1 ส่วน", ["sugar"], [], "ไม่ใส่ หรือเปลี่ยนเป็นวุ้น"),
  F("nom-khon-wan", "นมข้นหวาน", "topping", [], "1 ช้อนโต๊ะ", ["sugar"], ["นมวัว"], "ไม่ราดเพิ่ม"),
];

// ---------------------------------------------------------------------
// ใส่ตัวเลขสารอาหารจาก js/nutrition-data.js
// ผลไม้ที่มีน้ำตาล 14 กรัมขึ้นไปต่อ 100 กรัม ติดป้าย "น้ำตาลสูง" อัตโนมัติ (เกณฑ์ภายในของ 3PJIC)
// ---------------------------------------------------------------------
for (const f of FOODS) {
  const d = NUTRITION[f.id];
  if (!d || d.n.kcal == null) continue; // ไม่มีตัวเลขในฐานข้อมูล ให้คงสถานะ "รอข้อมูล"
  f.n = d.n;
  f.unit = d.unit || "ก.";
  const S = d.source === "doh" ? DOH_SOURCE : d.source === "usda" ? USDA_SOURCE : FCD_SOURCE;
  f.src = { name: S.name, url: S.url, code: d.code, item: d.fcdName, primary: true };
  if (d.basis === "serving") { f.perServingOnly = true; f.serving = d.servingText; } // ตัวเลขเป็นค่าต่อหน่วยบริโภคอยู่แล้ว
  if (f.cat === "fruit" && d.n.sugar != null && d.n.sugar >= 14 && !f.tags.includes("sugar")) f.tags.push("sugar");
}

// ---------------------------------------------------------------------
// ตรวจความสอดคล้องของตัวเลข: ok | check | need
// ---------------------------------------------------------------------
export function audit(food) {
  const n = food.n;
  if (!n) return { status: "need", issues: [], notes: [] };
  const issues = [], notes = [];
  if (n.kcal == null) issues.push("ไม่มีค่าพลังงาน");
  if (n.p == null || n.f == null || n.c == null) issues.push("ไม่มีค่าโปรตีน ไขมัน หรือคาร์โบไฮเดรตครบ");
  if (!issues.length) {
    // สูตรเดียวกับ Thai FCD: 4×โปรตีน + 9×ไขมัน + 4×คาร์โบไฮเดรต + 2×ใยอาหาร
    const est = n.p * 4 + n.f * 9 + n.c * 4 + (n.fiber || 0) * 2;
    if (Math.abs(est - n.kcal) / n.kcal > 0.15) issues.push(`พลังงานที่ระบุ ${n.kcal} kcal แต่คำนวณจากสารอาหารได้ ${Math.round(est)} kcal`);
  }
  if (n.sugar != null && n.c != null && n.sugar > n.c) {
    // ในแหล่งข้อมูลหลัก น้ำตาลกับคาร์โบไฮเดรตวัดคนละวิธี จึงอาจต่างกันเล็กน้อย บันทึกเป็นหมายเหตุ ไม่ใช่ข้อผิดพลาด
    if (food.src?.primary) notes.push("น้ำตาลวัดด้วยวิธีต่างจากคาร์โบไฮเดรต ค่าจึงอาจสูงกว่าเล็กน้อย");
    else issues.push(`น้ำตาล (${n.sugar} ก.) มากกว่าคาร์โบไฮเดรต (${n.c} ก.)`);
  }
  if (!food.src) issues.push("ยังไม่ระบุแหล่งข้อมูล");
  return { status: issues.length ? "check" : "ok", issues, notes };
}
export const STATUS_LABEL = { ok: "ตรวจแล้ว", check: "ต้องตรวจ", need: "รอข้อมูลสารอาหาร" };

// สารอาหารต่อ 1 หน่วยบริโภค (ต้องมีทั้งตัวเลขและน้ำหนัก)
// ---------------------------------------------------------------------
// น้ำหนักต่อหน่วยบริโภค จาก js/serving-data.js
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// สารก่อภูมิแพ้ 8 กลุ่ม แยก 2 ระดับ (ค่าเบื้องต้นจากส่วนผสมทั่วไป สูตรแต่ละร้านต่างกัน)
//   [มีแน่นอน, อาจมีในเครื่องปรุง/บางร้าน]
//   เครื่องปรุงที่พบบ่อย: น้ำปลา = ปลา · ซีอิ๊ว/ซอสปรุงรส = ถั่วเหลือง ข้าวสาลี · ซอสหอยนางรม/กะปิ = อาหารทะเลมีเปลือก
// ---------------------------------------------------------------------
const M = "นมวัว", E = "ไข่", SH = "อาหารทะเลมีเปลือก", FI = "ปลา", W = "ข้าวสาลี", SO = "ถั่วเหลือง", PN = "ถั่วลิสง";
const ALLERGEN_TABLE = {
  "kaprao-gai": [[], [FI, SO, W, SH]],
  "kaprao-gai-kap": [[], [FI, SO, W, SH]],
  "khao-man-gai": [[SO], [W]],
  "khao-kha-mu": [[E, SO], [W]],
  "khao-mu-daeng": [[E], [SO, W]],
  "khao-pad-mu": [[E], [FI, SO, W]],
  "khao-khai-jiao": [[E], [FI, SO]],
  "khao-tom-mu": [[], [FI, SO]],
  "jok-mu": [[], [E, SO, W]],
  "kuay-tiew-nam-sai": [[], [FI, SO, PN]],
  "kuay-tiew-tom-yum": [[PN], [FI]],
  "yen-ta-fo": [[FI, SH, SO], []],
  "ba-mi-mu-daeng": [[W, E], [SO]],
  "pad-thai-goong": [[SH, PN, E, SO], [FI]],
  "pad-see-ew": [[E, SO], [W]],
  "rad-na-mu": [[SO], [W, SH]],
  "som-tam-thai": [[PN, SH, FI], []],
  "gai-yang": [[], [SO, FI]],
  "tom-yum-goong": [[SH], [FI]],
  "kaeng-khiao-wan-gai": [[SH], [FI]],
  "kaeng-jued-tao-hu": [[SO], [FI, W]],
  "pla-nueng-manao": [[FI], []],
  "suki-nam-gai": [[E, SO], [W]],
  "tom-lued-mu": [[], [FI, SO]],
  "yum-woon-sen": [[SH, FI], [PN]],
  "khai-pa-lo": [[E, SO], [W]],
  "burger-gai": [[W, E, M], [SO]],
  "burger-nuea": [[W, E, M], [SO]],
  "sandwich-gai": [[W, E, M], [SO]],
  "sandwich-pla": [[W, E, M, FI], [SO]],
  "pa-tong-go": [[W], []],
  "salapao-mu-sap": [[W], [E, SO]],
  "roti-kluay-khai": [[W, E, M], []],
  "khanom-jeeb": [[W], [SH, SO]],
  "look-chin-ping": [[], [FI, W, SO]],
  "khanom-buang": [[E], []],
  "khao-niao-mu-ping": [[], [SO, FI, M]],
  "roti": [[W, M], []],
  "itim-kati": [[], [M, PN]],
  "tao-huay-nam-khing": [[SO], []],
  "cha-yen": [[M], []],
  "cha-nom-khai-muk": [[M], []],
  "kafae-yen": [[M], []],
  "nam-tao-hu": [[SO], []],
  "nom-jued": [[M], []],
  "cocoa-yen": [[M], []],
  "sandwich-ham-cheese": [[W, M], [E, SO]],
  "khai-tom": [[E], []],
  "nom-priao": [[M], []],
  "khai-dao": [[E], []],
  "nom-khon-wan": [[M], []],
};
for (const f of FOODS) {
  const t = ALLERGEN_TABLE[f.id] || [[], []];
  f.allergens = t[0];
  f.mayContain = t[1];
}

for (const f of FOODS) {
  let s = SERVINGS[f.id];
  if (!s && f.cat === "fruit" && f.n && f.n.kcal) s = { serving: "1 ส่วน", exchangeKcal: FRUIT_EXCHANGE_KCAL, src: "exchange" };
  if (!s) continue;
  const grams = s.grams || (s.exchangeKcal && f.n && f.n.kcal ? Math.round((s.exchangeKcal / f.n.kcal) * 100) : null);
  if (!grams) continue;
  f.grams = grams;
  f.serving = s.serving + (s.grams && /มล\./.test(s.serving) ? "" : " (~" + grams + " " + (f.unit === "มล." ? "มล." : "ก.") + ")");
  f.servingSrc = SERVING_SOURCES[s.src];
}

export function perServing(food) {
  if (food.perServingOnly && food.n && audit(food).status === "ok") return { ...food.n };
  if (!food.n || !food.grams || audit(food).status !== "ok") return null;
  const k = food.grams / 100, out = {};
  for (const key in food.n) out[key] = food.n[key] == null ? null : Math.round(food.n[key] * k * 10) / 10;
  return out;
}

export function findFood(id) { return FOODS.find((f) => f.id === id) || null; }

// ---------------------------------------------------------------------
// ตรวจว่าเมนูเหมาะกับผู้ใช้ไหม
// คืนค่า { ok, blocked, reasons[] }
//   blocked = แพ้อาหาร (ตัดออกเด็ดขาด), ok=false = มีป้ายที่ควรเลี่ยงตามโรค
// ---------------------------------------------------------------------
export function fitFor(food, profile) {
  const reasons = [];
  if (!profile) return { ok: true, blocked: false, maybe: false, reasons };
  const mine = normAllergies(profile.allergies);
  const allergic = food.allergens.filter((a) => mine.includes(a));
  allergic.forEach((a) => reasons.push(`มี${a} ซึ่งคุณแพ้`));
  // อาหารที่ผู้ใช้พิมพ์เอง: ตรวจจากชื่อเมนูและชื่ออื่นของเมนู
  const text = (food.name + " " + food.aliases.join(" ")).toLowerCase();
  const typed = splitWords(profile.allergyOther).filter((w) => text.includes(w.toLowerCase()));
  typed.forEach((w) => reasons.push(`ชื่อเมนูมี "${w}" ที่คุณระบุว่าแพ้`));
  const maybe = (food.mayContain || []).filter((a) => mine.includes(a));
  maybe.forEach((a) => reasons.push(`อาจมี${a}ในเครื่องปรุง ถามร้านก่อนสั่ง`));
  (profile.conditions || []).forEach((c) => {
    (AVOID_BY_CONDITION[c] || []).forEach((t) => {
      if (food.tags.includes(t)) reasons.push(`${TAGS[t]} ไม่เหมาะกับ${CONDITIONS[c]?.label || c}`);
    });
  });
  const blocked = allergic.length > 0 || typed.length > 0;
  return { ok: reasons.length === 0, blocked, maybe: !blocked && maybe.length > 0, reasons };
}

// ---------------------------------------------------------------------
// เลือกเมนูแนะนำรายมื้อ
// - ตัดเมนูที่แพ้และเมนูที่มีป้ายต้องเลี่ยงตามโรค
// - เป้าหมายลดน้ำหนัก: เลี่ยงไขมันสูงและน้ำตาลสูงถ้ามีตัวเลือกพอ
// - มื้อว่าง: เน้นผลไม้
// - เลือกแบบคงที่ตามวัน (วันเดียวกันได้ชุดเดิม) และกด "เปลี่ยน" เพื่อเลื่อนไปตัวถัดไป
// ---------------------------------------------------------------------
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
}
export function candidatesFor(slot, profile) {
  const cats = slot === "snack" ? ["fruit"] : slot === "breakfast" ? ["food", "snack", "store", "fruit"] : ["food", "store"];
  let list = FOODS.filter((f) => f.meals.includes(slot) && cats.includes(f.cat) && fitFor(f, profile).ok);
  if (profile && ["lose", "health"].includes(profile.goal)) {
    const lighter = list.filter((f) => !f.tags.includes("fat") && !f.tags.includes("sugar"));
    if (lighter.length >= 3) list = lighter;
  }
  // เป้าหมายเพิ่มกล้ามเนื้อ: เน้นเมนูที่มีโปรตีนตั้งแต่ 8 กรัมต่อ 100 กรัม (ตามข้อมูล Thai FCD) ถ้ามีตัวเลือกพอ
  if (profile && profile.goal === "muscle" && slot !== "snack") {
    const protein = list.filter((f) => f.n && f.n.p >= 8);
    if (protein.length >= 3) list = protein;
  }
  return list;
}
export function pickMeal(slot, profile, seedKey, shift = 0) {
  const list = candidatesFor(slot, profile);
  if (!list.length) return null;
  const rnd = seeded(seedKey + slot);
  const order = list.map((f) => [rnd(), f]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  return order[shift % order.length];
}
