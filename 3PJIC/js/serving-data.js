// =====================================================================
// น้ำหนักต่อหน่วยบริโภค (ใช้คำนวณแคลอรี่ต่อจาน/ต่อแก้ว)
// ใส่เฉพาะเมนูที่มีแหล่งอ้างอิง เมนูที่ไม่มีจะแสดงเฉพาะค่าต่อ 100 กรัม
// รูปแบบ: id เมนู: { serving: ข้อความหน่วย, grams: กรัม (หรือ มล. สำหรับเครื่องดื่ม), src: รหัสแหล่งด้านล่าง }
// =====================================================================
export const SERVING_SOURCES = {
  doh: { name: "กรมอนามัย (น้ำหนักอาหารจานเดียว อ้างใน Kapook Health)", url: "https://health.kapook.com/view69916.html" },
  exchange: { name: "หลักการแลกเปลี่ยนอาหาร: ผลไม้ 1 ส่วน = 60 kcal, ข้าว-แป้ง 1 ส่วน = 80 kcal (คณะแพทยศาสตร์ศิริราชพยาบาล)", url: "https://si.mahidol.ac.th/sirirajdoctor/Brochure_files/72_1tdJap.pdf" },
  dohtable: { name: "ตารางแสดงคุณค่าทางโภชนาการของอาหารไทย (กรมอนามัย 2561)", url: "https://nutrition2.anamai.moph.go.th/th/thai-food-composition-table" },
  fda445: { name: "หน่วยบริโภคอ้างอิง ประกาศกระทรวงสาธารณสุข ฉบับที่ 445 (นมและเครื่องดื่มจากนม 200 มล.)", url: "https://fdasamutsongkhram.org/wp-content/uploads/2024/03/01-%E0%B8%8A%E0%B8%B5%E0%B9%89%E0%B9%81%E0%B8%88%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8-445-448-140267.pdf" },
};

export const SERVINGS = {
  // อาหารจานเดียว น้ำหนักจากกรมอนามัย
  "kaprao-gai":    { serving: "1 จาน", grams: 265, src: "doh" },
  "khao-kha-mu":   { serving: "1 จาน", grams: 289, src: "doh" },
  "khao-mu-daeng": { serving: "1 จาน", grams: 320, src: "doh" },
  "khao-pad-mu":   { serving: "1 จาน", grams: 315, src: "doh" },
  "khao-man-gai":  { serving: "1 จาน", grams: 300, src: "doh" },
  "pad-see-ew":    { serving: "1 จาน", grams: 350, src: "doh" },
  "sandwich-ham-cheese": { serving: "1 ชิ้น", grams: 55, src: "dohtable" },
  // นม 200 มล. ตามหน่วยบริโภคอ้างอิง
  "nom-jued":  { serving: "1 กล่อง/แก้ว (200 มล.)", grams: 200, src: "fda445" },
  "nom-priao": { serving: "1 ขวด/แก้ว (200 มล.)", grams: 200, src: "fda445" },
  // ข้าวสวย 1 ทัพพี = ข้าว-แป้ง 1 ส่วน (80 kcal) และผลไม้ 1 ส่วน (60 kcal): คำนวณน้ำหนักจากพลังงานต่อ 100 กรัม
  "khao-plao-perm": { serving: "1 ทัพพี", exchangeKcal: 80, src: "exchange" },
};
// ผลไม้ทุกชนิดที่มีข้อมูลพลังงาน ใช้หน่วย "1 ส่วน" (60 kcal) อัตโนมัติ (ดูใน foods.js)
export const FRUIT_EXCHANGE_KCAL = 60;
