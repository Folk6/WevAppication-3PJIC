// =====================================================================
// ระบบเป้าหมาย: ตั้งเป้าน้ำหนัก + ระยะเวลา ตรวจความปลอดภัย และคำนวณความคืบหน้า
// เก็บใน Firestore ที่ users/{uid}.goal
//   { type: "lose" | "muscle", startKg, targetKg, weeks, startAt, endAt, status: "active" | "done" | "cancelled" }
// ไม่มีการเชื่อม Firebase ในไฟล์นี้ ทดสอบได้ง่าย
// =====================================================================
import { analyze, tdeeOf, bmiOf } from "./nutrition.js";

export const GOAL_TYPES = {
  lose:   { label: "ลดน้ำหนัก",     verb: "ลด",   safe: 1.0,  pace: 0.75, kcalPerKg: 1100, protein: 1.2 },
  muscle: { label: "เพิ่มกล้ามเนื้อ", verb: "เพิ่ม", safe: 0.5,  pace: 0.35, surplus: 250,  protein: 1.6 },
};
export const WEEK_CHOICES = [2, 4, 8, 12];
export const weeksLabel = (w) => (w === 4 ? "1 เดือน" : w === 8 ? "2 เดือน" : w === 12 ? "3 เดือน" : w + " สัปดาห์");

const r1 = (x) => Math.round(x * 10) / 10;
const DAY = 86400000;

// ผู้ใช้กลุ่มนี้ตั้งเป้าแบบมีตัวเลขไม่ได้ (ตามกฎความปลอดภัยของแอป)
export function goalBlocked(profile) {
  const r = analyze(profile);
  if (r.special === "minor") return "อายุต่ำกว่า 18 ปี ร่างกายยังเจริญเติบโต 3PJIC จึงไม่ตั้งเป้าน้ำหนักแบบมีตัวเลข ใช้คำแนะนำตามธงโภชนาการแทน";
  if (r.special === "refer") return "ช่วงตั้งครรภ์ ให้นมบุตร หรือมีโรคไต ควรให้แพทย์หรือนักกำหนดอาหารวางเป้าหมายให้";
  return null;
}

// ตรวจเป้าหมาย คืนผลทั้งหมดที่หน้าตั้งเป้าต้องใช้
//   input: { type, currentKg, targetKg, weeks, profile }
export function checkGoal({ type, currentKg, targetKg, weeks, profile }) {
  const g = GOAL_TYPES[type];
  const h = profile.height / 100;
  const minKg = r1(18.5 * h * h);
  const out = { type, error: null, fast: false, ok: false, diff: 0, rate: 0, minKg };
  if (targetKg == null || isNaN(targetKg)) { out.error = { title: "ใส่น้ำหนักเป้าหมาย", text: "พิมพ์เป็นตัวเลข เช่น 58.0" }; return out; }
  const diff = r1(type === "lose" ? currentKg - targetKg : targetKg - currentKg);
  out.diff = diff;
  if (diff <= 0) {
    out.error = type === "lose"
      ? { title: "เป้าหมายต้องน้อยกว่าน้ำหนักตอนนี้", text: "ถ้าอยากคงน้ำหนัก แก้เป้าหมายในแบบประเมินเป็น \"คุมน้ำหนักให้คงที่\" แทน" }
      : { title: "เป้าหมายต้องมากกว่าน้ำหนักตอนนี้", text: "การเพิ่มกล้ามเนื้อทำให้น้ำหนักขึ้นเล็กน้อย" };
    return out;
  }
  if (type === "lose" && bmiOf(currentKg, profile.height) < 18.5) {
    out.error = { title: "ไม่แนะนำให้ลดน้ำหนัก", text: "ดัชนีมวลกายของคุณต่ำกว่าเกณฑ์อยู่แล้ว" }; return out;
  }
  if (type === "lose" && targetKg < minKg) {
    out.error = { title: "น้ำหนักนี้ต่ำกว่าเกณฑ์", text: "ที่ส่วนสูงของคุณ น้ำหนักไม่ควรต่ำกว่า " + minKg.toFixed(1) + " กก. (BMI 18.5)" }; return out;
  }
  if (diff > 30) { out.error = { title: "เป้าหมายห่างเกินไป", text: "ลองตั้งเป้าย่อยก่อน เช่น 5–10 กก. แล้วค่อยตั้งใหม่เมื่อถึง" }; return out; }

  const rate = diff / weeks;
  out.rate = rate;
  out.fast = rate > g.safe + 1e-9;
  out.ok = !out.fast;
  // ทางเลือกเมื่อเร็วเกินไป: (A) เป้าเดิมใช้เวลานานขึ้น (B) เวลาเดิมลดเป้าลง
  out.suggestA = { weeks: Math.ceil(diff / g.pace), targetKg: r1(targetKg) };
  const amtB = r1(g.pace * weeks);
  out.suggestB = { weeks, targetKg: r1(type === "lose" ? currentKg - amtB : currentKg + amtB), amount: amtB };
  Object.assign(out, planFor(type, rate, currentKg, profile));
  return out;
}

// แผนต่อวัน: พลังงานและโปรตีน
export function planFor(type, rate, kg, profile) {
  const g = GOAL_TYPES[type];
  const tdee = tdeeOf({ ...profile, weight: kg });
  const floor = profile.sex === "m" ? 1500 : 1200;
  let kcal;
  if (type === "lose") {
    const deficit = Math.min(1000, Math.round((rate * g.kcalPerKg) / 10) * 10);
    kcal = Math.max(floor, tdee - deficit);
  } else {
    kcal = tdee + g.surplus;
  }
  return { tdee, kcal, floor, protein: Math.round(kg * g.protein) };
}

// สร้างเอกสารเป้าหมายสำหรับบันทึก
export function makeGoal(type, currentKg, targetKg, weeks, now = new Date()) {
  return {
    type, startKg: r1(currentKg), targetKg: r1(targetKg), weeks,
    startAt: now, endAt: new Date(now.getTime() + weeks * 7 * DAY), status: "active",
  };
}

// แปลงค่า Timestamp ของ Firestore เป็น Date
export const toDate = (v) => (v?.toDate ? v.toDate() : v instanceof Date ? v : new Date(v));

// ความคืบหน้า: เทียบน้ำหนักล่าสุดกับเส้นแผน (ลดหรือเพิ่มแบบเส้นตรง)
export function progressOf(goal, latestKg, now = new Date()) {
  const start = toDate(goal.startAt), end = toDate(goal.endAt);
  const dir = goal.type === "lose" ? -1 : 1;
  const total = Math.abs(goal.targetKg - goal.startKg);
  const done = r1(Math.max(0, (latestKg - goal.startKg) * dir));
  const pct = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  const span = end - start;
  const t = Math.max(0, Math.min(1, (now - start) / span));
  const expectedKg = r1(goal.startKg + dir * total * t);
  const gap = r1((latestKg - expectedKg) * dir); // บวก = เร็วกว่าแผน
  const daysLeft = Math.max(0, Math.ceil((end - now) / DAY));
  const weekNo = Math.min(goal.weeks, Math.floor((now - start) / (7 * DAY)) + 1);
  const weekTargetKg = r1(goal.startKg + dir * total * Math.min(1, weekNo / goal.weeks));
  let status = "on", statusLabel = "ตามแผน";
  if (gap < -0.5) { status = "behind"; statusLabel = "ช้ากว่าแผน"; }
  else if (gap > 0.5) { status = "ahead"; statusLabel = "เร็วกว่าแผน"; }
  const reached = pct >= 100;
  const expired = now >= end;
  return { start, end, total: r1(total), done, pct, expectedKg, gap, daysLeft, weeksLeft: Math.ceil(daysLeft / 7), weekNo, weekTargetKg, status, statusLabel, reached, expired, milestone: Math.floor(pct / 25) * 25 };
}

// ข้อความสถานะสำหรับผู้ใช้
export function progressMessage(goal, p) {
  const v = GOAL_TYPES[goal.type].verb;
  if (p.reached) return "ถึงเป้าหมายแล้ว ยินดีด้วย!";
  if (p.expired) return "ครบกำหนดแล้ว " + v + "ไป " + p.done.toFixed(1) + " จาก " + p.total.toFixed(1) + " กก.";
  if (p.status === "behind") return "ช้ากว่าแผน " + Math.abs(p.gap).toFixed(1) + " กก. ไม่เป็นไร ค่อย ๆ ทำต่อ หรือขยายเวลาได้";
  if (p.status === "ahead" && goal.type === "lose") return "เร็วกว่าแผน " + p.gap.toFixed(1) + " กก. อย่าลดอาหารลงอีก ลดเร็วเกินไปไม่ดีต่อสุขภาพ";
  if (p.status === "ahead") return "เร็วกว่าแผน " + p.gap.toFixed(1) + " กก. ถ้ารอบเอวเพิ่มด้วย อาจเป็นไขมันมากกว่ากล้าม";
  return "เดินตามแผนได้ดี ทำแบบนี้ต่อไป";
}

// เป้าหมายที่กำลังทำอยู่ (หรือ null)
export function activeGoal(data) {
  const g = data && data.goal;
  return g && g.status === "active" ? g : null;
}

// แผนต่อวันของเป้าหมายที่กำลังทำ คิดจากน้ำหนักล่าสุด
export function goalPlan(goal, profile, kg) {
  const rate = Math.abs(goal.targetKg - goal.startKg) / goal.weeks;
  return planFor(goal.type, rate, kg, profile);
}
