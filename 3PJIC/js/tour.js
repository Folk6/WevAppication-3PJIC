// =====================================================================
// ทัวร์แนะนำการใช้งาน (แสดงครั้งแรกหลังทำแบบประเมิน และกดปุ่ม ? เพื่อดูซ้ำ)
// ส่องไฟทีละส่วน: แผนของคุณ → เมนูแนะนำ → เป้าหมาย → ติดตามผล
// =====================================================================

const HOME_STEPS = [
  { sel: "#planHero", title: "นี่คือแผนของคุณ", text: "พลังงานที่เหมาะกับคุณต่อวัน คำนวณจากอายุ น้ำหนัก ส่วนสูง และเป้าหมายที่กรอกไว้ในแบบประเมิน" },
  { sel: ["#meals", "#meals > :first-child"], title: "เมนูแนะนำวันนี้", text: "เลือกให้ตามโรคประจำตัวและอาหารที่คุณแพ้ กดที่เมนูเพื่อดูสารอาหาร หรือกด \"เปลี่ยน\" ถ้าอยากได้เมนูอื่น" },
  { sel: '[data-nav="goal"]', title: "ตั้งเป้าหมาย", text: "อยากลดน้ำหนักหรือเพิ่มกล้ามภายในกี่สัปดาห์ ตั้งได้ที่นี่ 3PJIC จะเช็กให้ว่าปลอดภัยไหม" },
  { sel: '[data-nav="track"]', title: "ติดตามผล", text: "บันทึกน้ำหนักสัปดาห์ละครั้ง และดูโปรแกรมออกกำลังกายที่จัดให้ตามเป้าหมายและสุขภาพของคุณ" },
];

const HEART = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z"/></svg>';

// ตัวเลือกส่วนที่จะส่องไฟ (ถ้าส่วนใหญ่สูงเกินจนวางกล่องคำอธิบายไม่ได้ จะลองส่วนย่อยถัดไป)
function candidates(s) {
  return (Array.isArray(s.sel) ? s.sel : [s.sel]).map((q) => document.querySelector(q)).filter((t) => t && t.getClientRects().length);
}

function make(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export function startTour({ onFinish, steps, intro = true, outro = true } = {}) {
  if (document.querySelector(".tour-root")) return;
  // ใช้เฉพาะขั้นที่มีส่วนนั้นอยู่ในหน้าตอนนี้
  const STEPS = (steps || HOME_STEPS).filter((s) => candidates(s).length);
  if (!STEPS.length) return;
  const root = make("div", "tour-root");
  document.body.append(root);
  const opener = document.activeElement;
  let step = 0; // 0 = ต้อนรับ, 1–4 = ส่องไฟ, 5 = ปิดท้าย
  let finished = false;

  function close() {
    if (finished) return;
    finished = true;
    root.remove();
    window.removeEventListener("resize", place);
    window.removeEventListener("scroll", place, true);
    document.removeEventListener("keydown", onKey);
    if (opener && opener.focus) opener.focus();
    if (onFinish) onFinish();
  }

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "Tab") { // วนโฟกัสอยู่ในกล่องทัวร์
      const f = [...root.querySelectorAll("button")];
      if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  }

  function button(cls, text, fn) { const b = make("button", cls, text); b.type = "button"; b.onclick = fn; return b; }

  function centerCard(welcome) {
    root.replaceChildren();
    root.append(make("div", "tour-dim"));
    const card = make("div", "tour-center");
    card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true"); card.setAttribute("aria-labelledby", "tourTitle");
    const ic = make("div", "badge-ic"); ic.innerHTML = HEART; // ไอคอนคงที่ของเราเอง
    const h = make("h2", null, welcome ? "ยินดีต้อนรับสู่ 3PJIC" : "พร้อมแล้ว!"); h.id = "tourTitle";
    const p = make("p", null, welcome ? "แผนของคุณพร้อมแล้ว มาดูวิธีใช้กัน 4 ขั้น ใช้เวลาไม่ถึงนาที" : "ถ้าลืม กดปุ่ม ? ที่หน้าหลัก หรือ \"ดูวิธีใช้งานอีกครั้ง\" ในหน้าโปรไฟล์ได้ตลอด");
    const main = button("btn btn-primary", welcome ? "เริ่มดูวิธีใช้" : "เริ่มใช้งาน", welcome ? () => go(1) : close);
    card.append(ic, h, p, main);
    if (welcome) card.append(button("skip", "ข้ามไปก่อน", close));
    root.append(card);
    main.focus();
  }

  let spot, tip, target;

  // ตัวเลือกส่วนที่จะส่องไฟ (ถ้าส่วนใหญ่สูงเกินจนวางกล่องคำอธิบายไม่ได้ จะลองส่วนย่อยถัดไป)

  function stepCard() {
    const s = STEPS[step - 1];
    const cands = candidates(s);
    if (!cands.length) { go(step + 1); return; } // ข้ามส่วนที่ไม่มีในหน้า
    root.replaceChildren();
    spot = make("div", "tour-spot");
    tip = make("div", "tour-tip");
    tip.setAttribute("role", "dialog"); tip.setAttribute("aria-modal", "true"); tip.setAttribute("aria-labelledby", "tourTitle");
    const top = make("div", "tour-top");
    top.append(make("span", null, "ขั้นที่ " + step + " จาก " + STEPS.length));
    const dots = make("span", "tour-dots"); dots.setAttribute("aria-hidden", "true");
    STEPS.forEach((_, i) => dots.append(make("i", (i < step ? "on" : "") + (i === step - 1 ? " cur" : ""))));
    top.append(dots);
    const h = make("h2", null, s.title); h.id = "tourTitle";
    const actions = make("div", "tour-actions");
    actions.append(button("skip", "ข้าม", close));
    if (step > 1) actions.append(button("btn btn-outline", "ย้อนกลับ", () => go(step - 1)));
    const next = button("btn btn-primary", step === STEPS.length ? (outro ? "ถัดไป" : "เข้าใจแล้ว") : "ถัดไป", () => go(step + 1));
    actions.append(next);
    tip.append(top, h, make("p", null, s.text), actions);
    root.append(spot, tip);
    for (const c of cands) {
      target = c;
      if (!c.closest("#appNav")) window.scrollBy({ top: c.getBoundingClientRect().top - 80, behavior: "instant" });
      if (place()) break;
    }
    next.focus({ preventScroll: true });
  }

  // วางกรอบส่องไฟและกล่องคำอธิบายตามตำแหน่งจริงของส่วนนั้น
  function place() {
    if (step < 1 || step > STEPS.length || !spot || !target) return false;
    const r = target.getBoundingClientRect(), pad = 6, gap = 14;
    Object.assign(spot.style, { top: r.top - pad + "px", left: r.left - pad + "px", width: r.width + pad * 2 + "px", height: r.height + pad * 2 + "px" });
    const vw = window.innerWidth, vh0 = window.innerHeight;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    // แถบเมนูด้านล่างบนมือถือบังพื้นที่ล่างสุด ยกเว้นตอนส่องไฟที่แถบเมนูเอง
    const navR = document.getElementById("appNav")?.getBoundingClientRect();
    const vh = navR && navR.top > vh0 / 2 && !target.closest("#appNav") ? navR.top : vh0;
    let top, left, fits = true;
    if (r.bottom + pad + gap + th <= vh - 8) { top = r.bottom + pad + gap; left = r.left; }          // ด้านล่าง
    else if (r.top - pad - gap - th >= 8) { top = r.top - pad - gap - th; left = r.left; }         // ด้านบน
    else if (r.right + pad + gap + tw <= vw - 8) { top = r.top; left = r.right + pad + gap; }       // ด้านขวา (แถบเมนูบนคอม)
    else if (r.left - pad - gap - tw >= 8) { top = r.top; left = r.left - pad - gap - tw; }         // ด้านซ้าย
    else { top = Math.max(8, (vh - th) / 2); left = (vw - tw) / 2; fits = false; }
    left = Math.min(Math.max(16, left), vw - tw - 16);
    top = Math.min(Math.max(8, top), vh - th - 8);
    Object.assign(tip.style, { top: top + "px", left: left + "px" });
    return fits;
  }

  function go(n) {
    step = n;
    if (step === 0) { if (intro) centerCard(true); else go(1); }
    else if (step > STEPS.length) { if (outro) centerCard(false); else close(); }
    else stepCard();
  }

  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, true);
  document.addEventListener("keydown", onKey);
  go(0);
}

// ---------------------------------------------------------------------
// ทัวร์ประจำหน้า: ขึ้นเองครั้งแรกที่เข้าหน้านั้น และเพิ่มปุ่ม ? ไว้ดูซ้ำ
//   key = ชื่อหน้า (เก็บใน users/{uid}.toursSeen.<key>)
// ---------------------------------------------------------------------
const HELP_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.7-2.5 2-2.5 4"/><path d="M12 17h.01"/></svg>';
export function pageTour(key, steps, { data, save }) {
  const head = document.querySelector(".page-head");
  let btn = document.querySelector(".help-btn[data-page-tour]");
  const run = () => startTour({ steps, intro: false, outro: false, onFinish: () => save(key) });
  if (head && !btn) {
    btn = make("button", "help-btn");
    btn.type = "button"; btn.dataset.pageTour = key;
    btn.setAttribute("aria-label", "ดูวิธีใช้หน้านี้"); btn.title = "ดูวิธีใช้หน้านี้";
    btn.innerHTML = HELP_ICON; // ไอคอนคงที่ของเราเอง
    // รวมปุ่มด้านขวาของหัวหน้าไว้ด้วยกัน
    const right = make("div", "page-head-actions");
    [...head.children].slice(1).forEach((c) => right.append(c));
    right.append(btn);
    head.append(right);
  }
  if (btn) btn.onclick = run;
  if (data.toursSeen && data.toursSeen[key]) return;
  // รอให้หน้าแสดงผลและโหลดข้อมูลเสร็จก่อน แล้วค่อยเริ่มทัวร์
  const t0 = Date.now();
  (function wait() {
    const page = document.getElementById("page");
    if (page && !page.hidden) setTimeout(run, 500);
    else if (Date.now() - t0 < 8000) setTimeout(wait, 150);
  })();
}

// คำอธิบายของแต่ละหน้า
export const PAGE_STEPS = {
  exercise: [
    { sel: ".ex-hero", title: "โปรแกรมของคุณ", text: "แอปจัดให้อัตโนมัติจากเป้าหมาย อายุ และโรคประจำตัวในแบบประเมิน แถบนี้บอกว่าสัปดาห์นี้ทำไปแล้วกี่วัน" },
    { sel: ["#grid", "#grid > :first-child"], title: "ตาราง 7 วัน", text: "สีบอกประเภทของวัน: ส้ม = คาร์ดิโอ เขียว = ฝึกกล้าม เทา = พัก กดที่วันไหนเพื่อดูว่าวันนั้นต้องทำอะไร" },
    { sel: ["#panel", "#panel .btn"], title: "เริ่มออกกำลังกาย", text: "กด \"ดูท่าและเริ่ม\" เพื่อดูท่าและจำนวนเซต ถ้าวันนี้ไม่ว่างหรือไม่สบาย กด \"วันนี้ทำไม่ได้\" เพื่อเลื่อนหรือข้ามได้" },
    { sel: 'a[href="exercise-setup.html"]', title: "ปรับโปรแกรม", text: "เปลี่ยนอุปกรณ์ที่มี หรือจำนวนวันที่ว่างต่อสัปดาห์ได้ที่นี่" },
  ],
  workout: [
    { sel: ".move-top .how", title: "ดูวิธีทำท่า", text: "ไม่แน่ใจว่าทำยังไง กดที่นี่ จะมีวิธีทำทีละขั้นและจุดที่ต้องระวัง" },
    { sel: ".sets", title: "กดเมื่อทำเสร็จแต่ละเซต", text: "ทำครบ 1 เซตแล้วกดเลขนั้น แอปจะนับเวลาพักให้ก่อนเริ่มเซตถัดไป" },
    { sel: "#cTime", title: "จับเวลาคาร์ดิโอ", text: "กดเริ่มจับเวลาตอนเริ่มเดินหรือปั่น หยุดชั่วคราวได้" },
    { sel: "#finish", title: "เสร็จแล้วกดบันทึก", text: "แอปจะบันทึกลงตารางสัปดาห์ และแนะนำเมนูที่ควรกินหลังออกกำลังกาย" },
  ],
  weights: [
    { sel: "#weightForm", title: "บันทึกน้ำหนัก", text: "ชั่งสัปดาห์ละครั้ง ตอนเช้าก่อนกินอาหาร แล้วพิมพ์ตัวเลขกดบันทึก" },
    { sel: [".chart-box", "#chart"], title: "กราฟน้ำหนัก", text: "ดูว่าน้ำหนักขึ้นหรือลงแค่ไหน ถ้าตั้งเป้าหมายไว้ จะมีเส้นประบอกเป้าด้วย" },
    { sel: ".tabs2", title: "ดูโปรแกรมออกกำลังกาย", text: "กดแท็บ \"ออกกำลังกาย\" เพื่อดูโปรแกรมที่จัดให้ตามเป้าหมายของคุณ" },
  ],
  goal: [
    { sel: ".seg", title: "เลือกเป้าหมาย", text: "อยากลดน้ำหนัก หรืออยากเพิ่มกล้ามเนื้อ เลือกก่อนเป็นอย่างแรก" },
    { sel: [".weight-input", "#target"], title: "ใส่น้ำหนักที่อยากได้", text: "พิมพ์น้ำหนักเป้าหมาย แอปจะบอกว่าต้องลดหรือเพิ่มกี่กิโล" },
    { sel: "#weekChips", title: "เลือกระยะเวลา", text: "ถ้าเร็วเกินไปจนไม่ปลอดภัย แอปจะเตือนและเสนอทางเลือกที่ปลอดภัยกว่าให้" },
    { sel: ".goal-hero", title: "ความคืบหน้า", text: "ทำไปแล้วกี่เปอร์เซ็นต์ และเร็วหรือช้ากว่าแผน อัปเดตทุกครั้งที่บันทึกน้ำหนัก" },
    { sel: ["#goalChart", ".chart-box"], title: "น้ำหนักจริงเทียบแผน", text: "เส้นทึบคือน้ำหนักจริง เส้นประคือแผน ยิ่งใกล้กันยิ่งดี" },
  ],
  menu: [
    { sel: "#q", title: "ค้นหาเมนู", text: "พิมพ์ชื่ออาหาร เช่น กะเพรา หรือ ชานม" },
    { sel: "#tabs", title: "เลือกหมวด", text: "อาหาร ของว่าง เครื่องดื่ม ผลไม้ และอื่น ๆ" },
    { sel: 'label[for="onlyFit"]', title: "เฉพาะเมนูที่เหมาะกับคุณ", text: "ติ๊กเพื่อซ่อนเมนูที่คุณแพ้ หรือไม่เหมาะกับโรคประจำตัว" },
    { sel: "#grid > :first-child", title: "ดูสารอาหาร", text: "กดที่เมนูเพื่อดูพลังงาน โปรตีน น้ำตาล โซเดียม และแหล่งที่มาของข้อมูล" },
  ],
};

