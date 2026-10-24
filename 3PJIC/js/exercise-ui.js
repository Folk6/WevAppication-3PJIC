// =====================================================================
// ส่วนแสดงผลที่ใช้ร่วมกันของหน้าออกกำลังกาย: รูปท่า โหลด/บันทึกข้อมูล กล่องดูวิธีทำ
// =====================================================================
import { doc, setDoc, getDocs, collection, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { el } from "./shell.js";
import { buildProgram, applySwaps, isoDate, weekDates } from "./exercise.js";

// รูปท่าแบบเส้น (ข้อความคงที่ของเราเอง ไม่ใช่ข้อมูลผู้ใช้)
const FIG = {
  squat: '<circle cx="24" cy="12" r="5" class="f"/><path d="M24 18l4 12M27 22l12-2M28 30l-10 4 6 12M28 30h10l2 16"/>',
  chair: '<path d="M38 22v28M38 34h12v16M50 34V22" class="g"/><circle cx="22" cy="10" r="5" class="f"/><path d="M22 16v18M22 22l14 4M22 34l-2 16M22 34l6 16"/>',
  pushup: '<circle cx="10" cy="26" r="5" class="f"/><path d="M15 29l32 10M20 31l-2 14M47 39l2 7M4 46h50"/>',
  wallpush: '<path d="M48 4v48" class="g"/><circle cx="20" cy="14" r="5" class="f"/><path d="M22 20l-6 26M20 26l26-4M18 34l26-2M16 46h6"/>',
  row: '<circle cx="18" cy="12" r="5" class="f"/><path d="M20 18l12 14M32 32l-4 16M32 32l8 16M24 23l10 6v8"/><rect x="31" y="36" width="9" height="7" rx="2" class="f"/>',
  superman: '<circle cx="9" cy="34" r="5" class="f"/><path d="M14 36l24 4M14 34l-2-8-6-4M38 40l12-6M4 46h50"/>',
  lunge: '<circle cx="26" cy="9" r="5" class="f"/><path d="M26 15v17M26 22l-7 6M26 22l7 6M26 32l-12 6v10M26 32l12 4v12"/>',
  bridge: '<circle cx="8" cy="42" r="5" class="f"/><path d="M13 42l18-10M31 32l10 14M41 46h6M14 46h8M4 50h50"/>',
  press: '<circle cx="28" cy="16" r="5" class="f"/><path d="M28 22v16M28 26l-8-4-2-14M28 26l8-4 2-14M28 38l-6 12M28 38l6 12"/><rect x="13" y="3" width="10" height="5" rx="2" class="f"/><rect x="33" y="3" width="10" height="5" rx="2" class="f"/>',
  calf: '<path d="M44 20v30" class="g"/><circle cx="26" cy="8" r="5" class="f"/><path d="M26 14v20M26 20l16 4M26 34l-3 12 2 4M26 34l3 12 2 4"/>',
  plank: '<circle cx="12" cy="30" r="5" class="f"/><path d="M17 32l32 6M20 33v12M20 45h6M49 38v8"/>',
  deadbug: '<circle cx="8" cy="40" r="5" class="f"/><path d="M13 42h22M18 42l-2-20M24 42l14-14M35 42l4-10 8 0M4 50h50"/>',
  balance: '<path d="M44 22v28M44 34h8v16" class="g"/><circle cx="26" cy="9" r="5" class="f"/><path d="M26 15v19M26 21l16 6M26 21l-8 8M26 34v16M26 34l8 4-2 8"/>',

  march: '<circle cx="28" cy="9" r="5" class="f"/><path d="M28 15v18M28 20l-8 8M28 20l8-4M28 33l10-2v10M28 33l-2 16"/>',
  armcircle: '<circle cx="28" cy="12" r="5" class="f"/><path d="M28 18v18M28 22H10M28 22h18M28 36l-6 14M28 36l6 14"/><circle cx="8" cy="22" r="5" class="g"/><circle cx="48" cy="22" r="5" class="g"/>',
  hipcircle: '<circle cx="28" cy="9" r="5" class="f"/><path d="M28 15v17M28 20l-6 10 4 2M28 20l6 10-4 2M28 32l-7 16M28 32l7 16"/><ellipse cx="28" cy="32" rx="11" ry="4" class="g"/>',
  quad: '<path d="M46 10v40" class="g"/><circle cx="26" cy="8" r="5" class="f"/><path d="M26 14v18M26 20l18 0M26 32v18M26 32l-6 10 6-14"/>',
  ham: '<circle cx="14" cy="18" r="5" class="f"/><path d="M18 21l14 9M24 25l2 14M32 30l-2 18M32 30l14 14 4-4"/>',
  chest: '<circle cx="28" cy="10" r="5" class="f"/><path d="M28 16v18M28 20l-6 10 6 6M28 20l6 10-6 6M28 34l-6 16M28 34l6 16"/>',
  calfst: '<path d="M50 6v44" class="g"/><circle cx="34" cy="12" r="5" class="f"/><path d="M33 18l-6 14M31 22l17 2M27 32l10 6v10M27 32l-14 16"/>',
  neck: '<circle cx="24" cy="14" r="5" class="f"/><path d="M28 18l-1 16M27 21l-4-10M27 34l-6 4v10M27 34l8 2v12M14 38h24"/>',
  shoulder: '<circle cx="28" cy="10" r="5" class="f"/><path d="M28 16v18M22 20h12M22 20l-4 12M34 20l4 12M28 34l-6 16M28 34l6 16"/><path d="M14 16a6 6 0 016-6M42 16a6 6 0 00-6-6" class="g"/>',
  twist: '<path d="M40 22v28M30 38h14v12" class="g"/><circle cx="28" cy="10" r="5" class="f"/><path d="M28 16v20M28 22l12 2M28 22l-6 8M28 36l-10 2v12"/>',
  hipflex: '<circle cx="24" cy="8" r="5" class="f"/><path d="M24 14v18M24 20l-4 10M24 32l14 2v14M24 32l-12 10 -4 6M4 50h50"/>',
  catcow: '<circle cx="10" cy="24" r="5" class="f"/><path d="M15 26q12-8 26 0M16 28v20M40 26v22M4 50h50"/>',
  jack: '<circle cx="28" cy="9" r="5" class="f"/><path d="M28 15v18M28 20l-12-12M28 20l12-12M28 33l-12 16M28 33l12 16"/>',
  highknee: '<circle cx="26" cy="8" r="5" class="f"/><path d="M26 14v18M26 20l-8 8M26 20l8 4 2-8M26 32l12-2 0 10M26 32l-2 18"/>',
  climber: '<circle cx="10" cy="22" r="5" class="f"/><path d="M15 25l30 10M18 26v20M45 35l5 12M28 30l-2 10 8 2M4 48h50"/>',
  stepjack: '<circle cx="28" cy="9" r="5" class="f"/><path d="M28 15v18M28 20l-10-12M28 20l10-12M28 33l-3 16M28 33l14 14"/>',
  punch: '<circle cx="22" cy="10" r="5" class="f"/><path d="M22 16v18M22 21h22M22 23l-6 6 6 2M22 34l-8 15M22 34l8 15"/>',
  sidestep: '<circle cx="28" cy="10" r="5" class="f"/><path d="M28 16v16M28 21l-8 8M28 21l8 8M28 32l-14 4v12M28 32l10 4v12M48 42l4 0M44 38l8 4-8 4"/>',
  split: '<path d="M40 34h14v16M44 34v16" class="g"/><circle cx="20" cy="8" r="5" class="f"/><path d="M20 14v18M20 20l-6 8M20 20l6 8M20 32l-6 6v10M20 32l14 2 8 0"/>',
  legpress: '<path d="M6 46l18-20M40 6l12 12" class="g"/><circle cx="12" cy="30" r="5" class="f"/><path d="M15 34l12 4M20 36l14-10 10 -10M27 38l14-6"/>',
  chestpress: '<path d="M10 10v40M6 50h12" class="g"/><circle cx="14" cy="14" r="5" class="f"/><path d="M14 20v18M14 24h30M14 30h30M14 38h14v12M44 20v14" />',
  lat: '<path d="M10 4h36M28 4v8" class="g"/><circle cx="28" cy="22" r="5" class="f"/><path d="M28 28v14M28 30l-10-12-6-14M28 30l10-12 6-14M28 42h-10v8M28 42h10v8M14 42h28" />',
  heeltoe: '<path d="M50 6v44" class="g"/><circle cx="26" cy="8" r="5" class="f"/><path d="M26 14v18M26 20l-10 4M26 20l10 4M26 32l-2 16M26 32l4 16M4 50h50M18 50h8M28 50h8"/>',
  sideleg: '<path d="M44 22v28M44 34h8v16" class="g"/><circle cx="24" cy="9" r="5" class="f"/><path d="M24 15v19M24 21l18 6M24 21l-8 8M24 34l2 16M24 34l-14 10"/>',
  rope: '<circle cx="28" cy="9" r="5" class="f"/><path d="M28 15v18M28 20l-8 8M28 20l8 8M28 33l-5 13M28 33l5 13M4 52h48"/><path d="M20 28q-14 26 8 26 22 0 8-26" class="g"/>',
  hop: '<circle cx="30" cy="8" r="5" class="f"/><path d="M30 14v16M30 19l-8 6M30 19l8 6M30 30l-6 8 2 6M30 30l6 8-2 6M4 52h50M10 46l-6 4 6 4"/>',
  cardio: '<circle cx="32" cy="9" r="5" class="f"/><path d="M30 16l-4 16M29 20l-9 4M29 20l10 6M26 32l-10 6-4 10M26 32l10 6v12"/>',
};
export function figure(name, size = 56) {
  const s = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 56 56" aria-hidden="true" class="ex-fig">' + (FIG[name] || FIG.cardio) + "</svg>";
  const span = el("span", "ex-fig-box");
  span.innerHTML = s; // รูปคงที่จากโค้ดของเรา
  return span;
}

// ---------------------------------------------------------------------
// โหลด/บันทึก
// ---------------------------------------------------------------------
// บันทึกการออกกำลังกายล่าสุด 60 รายการ คืนเป็น { "YYYY-MM-DD": data }
export async function loadLogs(uid) {
  const snap = await getDocs(query(collection(db, "users", uid, "workouts"), orderBy("at", "desc"), limit(60)));
  const out = {};
  snap.docs.forEach((d) => { out[d.id] = d.data(); });
  return out;
}
export async function saveLog(uid, iso, data) {
  await setDoc(doc(db, "users", uid, "workouts", iso), Object.assign({ date: iso, at: serverTimestamp() }, data));
}
// ครั้งแรกที่เปิดหน้าออกกำลังกาย: เริ่มนับสัปดาห์ของโปรแกรม
export async function ensureSettings(uid, data) {
  if (data.exercise && data.exercise.startAt) return data.exercise;
  const ex = Object.assign({}, data.exercise || {}, { startAt: new Date() });
  await setDoc(doc(db, "users", uid), { exercise: ex }, { merge: true });
  return ex;
}

// โปรแกรมสัปดาห์นี้ (รวมการเลื่อนวัน) + วันที่ของแต่ละช่อง
export function thisWeek(profile, settings, now = new Date()) {
  const prog = buildProgram(profile, settings, now);
  if (prog.blocked) return prog;
  prog.days = applySwaps(prog.days, settings, now);
  prog.dates = weekDates(now).map(isoDate);
  return prog;
}

// ---------------------------------------------------------------------
// กล่องดูวิธีทำท่า (บนมือถือเลื่อนขึ้นจากด้านล่าง บนคอมอยู่กลางจอ)
// ---------------------------------------------------------------------
export function openMoveSheet(move, label) {
  const opener = document.activeElement;
  const back = el("div", "sheet-back");
  const box = el("div", "sheet");
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "sheetTitle");
  const close = () => { back.remove(); document.removeEventListener("keydown", onKey); if (opener && opener.focus) opener.focus(); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  back.addEventListener("click", (e) => { if (e.target === back) close(); });
  document.addEventListener("keydown", onKey);

  const x = el("button", "sheet-x", "×"); x.type = "button"; x.setAttribute("aria-label", "ปิด"); x.onclick = close;
  const h = el("h2", null, move.name); h.id = "sheetTitle";
  const head = el("div", "sheet-head"); head.append(el("small", null, label), h);
  const pic = el("div", "sheet-fig"); pic.append(figure(move.fig, 110));
  const ol = el("ol", "sheet-steps");
  move.steps.forEach((t) => ol.append(el("li", null, t)));
  const warn = el("p", "alert alert-warn"); warn.append(el("strong", null, "ระวัง "), document.createTextNode(move.avoid));
  box.append(x, head, pic, ol, warn);
  const ok = el("button", "btn btn-primary", "เข้าใจแล้ว"); ok.type = "button"; ok.onclick = close;
  box.append(ok);
  back.append(box);
  document.body.append(back);
  ok.focus();
}

// กล่องยืนยันทั่วไป (ใช้กับ "วันนี้ทำไม่ได้")
export function openSheet(build) {
  const opener = document.activeElement;
  const back = el("div", "sheet-back");
  const box = el("div", "sheet");
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "sheetTitle");
  const close = () => { back.remove(); document.removeEventListener("keydown", onKey); if (opener && opener.focus) opener.focus(); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  back.addEventListener("click", (e) => { if (e.target === back) close(); });
  document.addEventListener("keydown", onKey);
  build(box, close);
  back.append(box);
  document.body.append(back);
  const f = box.querySelector("button");
  if (f) f.focus();
}
