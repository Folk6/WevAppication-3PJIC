// =====================================================================
// ส่วนคำนวณของ 3PJIC (หัวใจของระบบ)
// แยกไว้ไฟล์เดียว เพื่อให้หน้าแบบประเมินและหน้าหลักใช้สูตรเดียวกัน
// ไม่มีการเชื่อม Firebase ในไฟล์นี้ ทดสอบได้ง่าย
// =====================================================================

// ตัวเลือกในแบบประเมิน (ใช้ทั้งแสดงผลและคำนวณ)
export const ACTIVITY = {
  "1.2":   "นั่งเกือบทั้งวัน",
  "1.375": "ขยับบ้าง",
  "1.55":  "ออกกำลังกายประจำ",
  "1.725": "หนักมาก",
};
export const GOALS = {
  lose:   { label: "ลดน้ำหนัก",          adj: -500, tip: "เน้นโปรตีนและผักให้อิ่มนาน ลดของหวานและของทอดก่อนเป็นอันดับแรก" },
  keep:   { label: "คุมน้ำหนักให้คงที่",   adj: 0,    tip: "กินครบ 3 มื้อตามสัดส่วนจาน 2:1:1 (ผัก : ข้าวแป้ง : โปรตีน)" },
  gain:   { label: "เพิ่มน้ำหนัก",         adj: 300,  tip: "เพิ่มมื้อว่างที่มีประโยชน์ เช่น นม กล้วย ถั่ว แทนการเพิ่มของทอด" },
  muscle: { label: "เพิ่มกล้ามเนื้อ",      adj: 200,  tip: "กระจายโปรตีนให้มีทุกมื้อ เช่น ไข่ อกไก่ ปลา เต้าหู้" },
  health: { label: "กินให้สุขภาพดีขึ้น",   adj: 0,    tip: "ลดหวาน มัน เค็ม และกินผักผลไม้ให้หลากสี" },
};
export const CONDITIONS = {
  diabetes:     { label: "เบาหวาน",          tip: "จำกัดน้ำตาลและเครื่องดื่มหวาน เลือกข้าวกล้องหรือข้าวไม่ขัดสี กินผักให้ได้ครึ่งจาน" },
  hypertension: { label: "ความดันโลหิตสูง",   tip: "ลดเค็ม ระวังน้ำปลา ซอสปรุงรส ของหมักดอง และน้ำซุปบะหมี่กึ่งสำเร็จรูป" },
  lipid:        { label: "ไขมันในเลือดสูง",   tip: "เลี่ยงของทอดและหนังสัตว์ เลือกปลา เต้าหู้ และเมนูต้ม นึ่ง ย่าง" },
  gout:         { label: "เกาต์",             tip: "เลี่ยงเครื่องในสัตว์และน้ำซุปกระดูก ดื่มน้ำเปล่าให้เพียงพอ" },
  kidney:       { label: "โรคไต",             tip: null }, // ไม่ให้คำแนะนำเอง ส่งต่อแพทย์
};
// อาหารที่แพ้ 8 กลุ่ม (key ต้องสะกดตรงกับ allergens ใน foods.js)
export const ALLERGIES = [
  { key: "นมวัว", hint: "นม เนย ชีส" },
  { key: "ไข่", hint: "ไข่ไก่ ไข่เป็ด" },
  { key: "อาหารทะเลมีเปลือก", hint: "กุ้ง ปู หอย หมึก แมงกะพรุน กะปิ" },
  { key: "ปลา", hint: "ปลาทะเล ปลาน้ำจืด น้ำปลา" },
  { key: "ข้าวสาลี", hint: "แป้งสาลี กลูเตน ขนมปัง" },
  { key: "ถั่วเหลือง", hint: "เต้าหู้ น้ำเต้าหู้ ซีอิ๊ว" },
  { key: "ถั่วลิสง", hint: "ถั่วป่น ถั่วคั่ว" },
  { key: "ถั่วเปลือกแข็ง", hint: "อัลมอนด์ มะม่วงหิมพานต์ วอลนัท" },
];
// ตัวเลือกแบบเก่า (ก่อนแยกกลุ่ม) → กลุ่มใหม่ เพื่อให้ผู้ใช้เดิมยังถูกตัดเมนูถูกต้อง
const OLD_ALLERGY = { "ถั่ว": ["ถั่วเหลือง", "ถั่วลิสง", "ถั่วเปลือกแข็ง"], "อาหารทะเล": ["อาหารทะเลมีเปลือก", "ปลา"], "แป้งสาลี": ["ข้าวสาลี"] };
export function normAllergies(list) {
  const out = [];
  (list || []).forEach((a) => (OLD_ALLERGY[a] || [a]).forEach((x) => { if (!out.includes(x)) out.push(x); }));
  return out;
}
// คำที่ผู้ใช้พิมพ์เอง เช่น "มะม่วง, กะทิ" → ["มะม่วง", "กะทิ"]
export function splitWords(text) {
  return String(text || "").split(/[,，、\n]+|\s{2,}| และ /).map((w) => w.trim()).filter((w) => w.length >= 2).slice(0, 10);
}

// ดัชนีมวลกาย เกณฑ์สำหรับคนเอเชีย
export function bmiOf(weightKg, heightCm) {
  return weightKg / (heightCm / 100) ** 2;
}
export function bmiInfo(bmi) {
  if (bmi < 18.5) return { label: "น้ำหนักน้อย", level: "warn" };
  if (bmi < 23)   return { label: "ปกติ",        level: "good" };
  if (bmi < 25)   return { label: "น้ำหนักเกิน",  level: "warn" };
  if (bmi < 30)   return { label: "อ้วนระดับ 1",  level: "bad" };
  return            { label: "อ้วนระดับ 2",  level: "bad" };
}

// พลังงานที่ร่างกายใช้ต่อวัน: สูตร Mifflin-St Jeor × ระดับกิจกรรม
export function tdeeOf(p) {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161);
  return Math.round(bmr * Number(p.activity));
}

// สรุปผลทั้งหมดจากโปรไฟล์ 1 ชุด
// คืนค่า: bmi, ป้าย BMI, พลังงานที่ใช้ (tdee), พลังงานเป้าหมาย (target หรือ null), รายการคำแนะนำ
export function analyze(p) {
  const bmi = bmiOf(p.weight, p.height);
  const info = bmiInfo(bmi);
  const notes = [];
  let tdee = null, target = null;

  const minor = p.age < 18;
  const refer = p.pregnant || p.conditions.includes("kidney");

  if (minor) {
    notes.push({ type: "info", title: "อายุต่ำกว่า 18 ปี", text: "ร่างกายยังเจริญเติบโต 3PJIC จะไม่ตั้งเป้าลดพลังงาน และจะแนะนำตามหลักธงโภชนาการแทน" });
  } else if (refer) {
    notes.push({ type: "warn", title: "ควรปรึกษาแพทย์ก่อน", text: p.pregnant
      ? "ช่วงตั้งครรภ์และให้นมบุตรต้องการสารอาหารเฉพาะ ควรให้แพทย์หรือนักกำหนดอาหารวางแผนให้"
      : "ผู้ที่เป็นโรคไตต้องคุมโปรตีน โพแทสเซียม และฟอสฟอรัสตามผลเลือด ควรให้แพทย์กำหนดปริมาณ" });
  } else {
    tdee = tdeeOf(p);
    const floor = p.sex === "m" ? 1500 : 1200; // ไม่ต่ำกว่าขั้นต่ำที่ปลอดภัย
    if (p.goal === "lose" && bmi < 18.5) {
      target = tdee;
      notes.push({ type: "warn", title: "ไม่แนะนำให้ลดน้ำหนัก", text: "ดัชนีมวลกายของคุณต่ำกว่าเกณฑ์แล้ว จึงตั้งพลังงานไว้ที่ระดับคงน้ำหนัก" });
    } else {
      target = Math.max(floor, tdee + GOALS[p.goal].adj);
    }
    if (p.age >= 60) notes.push({ type: "info", title: "วัย 60 ปีขึ้นไป", text: "เน้นโปรตีนและแคลเซียม เลือกอาหารนิ่ม เคี้ยวง่าย และดื่มน้ำสม่ำเสมอ" });
  }

  notes.push({ type: "", title: "เป้าหมายของคุณ", text: GOALS[p.goal].tip });
  p.conditions.forEach((c) => {
    if (CONDITIONS[c]?.tip) notes.push({ type: "", title: CONDITIONS[c].label, text: CONDITIONS[c].tip });
  });
  const al = normAllergies(p.allergies);
  if (al.length) notes.push({ type: "warn", title: "แพ้อาหาร", text: "จะตัดเมนูที่มี " + al.join(", ") + " ออกจากคำแนะนำ และเตือนเมนูที่อาจมีในเครื่องปรุง เช่น น้ำปลา ซีอิ๊ว ซอสหอยนางรม" });
  if (p.allergyOther) notes.push({ type: "warn", title: "แพ้อย่างอื่น: " + p.allergyOther, text: "3PJIC ตรวจได้จากชื่อเมนูเท่านั้น ส่วนผสมแต่ละร้านต่างกัน ควรถามร้านทุกครั้ง" });
  if (p.conditionOther) notes.push({ type: "warn", title: "โรคประจำตัวอื่น: " + p.conditionOther, text: "3PJIC ยังไม่ได้ปรับคำแนะนำตามโรคนี้ ควรปรึกษาแพทย์หรือนักกำหนดอาหารเรื่องอาหารและการออกกำลังกายที่เหมาะสม" });

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiLabel: info.label,
    bmiLevel: info.level,
    tdee,
    target,
    waterL: Math.round(p.weight * 0.033 * 10) / 10,
    special: minor ? "minor" : refer ? "refer" : null,
    notes,
  };
}
