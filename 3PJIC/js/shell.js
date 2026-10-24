// =====================================================================
// โครงหน้าในแอป (ใช้ร่วมกันทุกหน้าหลังล็อกอิน)
// - ตรวจสิทธิ์: ต้องล็อกอิน + ยินยอม (+ มีโปรไฟล์ ถ้าหน้านั้นต้องการ)
// - สร้างแถบเมนู: คอม = แถบด้านซ้าย, มือถือ = แถบด้านล่าง (ตามดีไซน์)
// =====================================================================
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { auth, getUserState } from "./firebase.js";

const ICONS = {
  home: '<path d="M4 11l8-7 8 7v9H4z"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
  track: '<path d="M4 18l5-6 4 3 7-9"/>',
  goal: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-5 8-5s6.5 1 8 5"/>',
};
// soon: true = ยังไม่ได้ทำ (แสดงแต่กดไม่ได้)
const NAV = [
  { key: "home", label: "หน้าหลัก", href: "app.html" },
  { key: "search", label: "ค้นหาเมนู", short: "เมนู", href: "menu.html" },
  { key: "goal", label: "เป้าหมาย", href: "goal.html" },
  { key: "track", label: "ติดตามผล", href: "weights.html" },
  { key: "profile", label: "โปรไฟล์", href: "profile.html" },
];

function icon(name) {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
}

// วาดแถบเมนูลงใน <nav id="appNav"> และใส่ชื่อผู้ใช้ด้านล่างแถบ (เฉพาะจอคอม)
export function renderNav(active, user) {
  const nav = document.getElementById("appNav");
  const links = NAV.map((n) => {
    const cur = n.key === active ? ' aria-current="page"' : "";
    const soon = n.soon ? ' aria-disabled="true" title="เร็ว ๆ นี้"' : "";
    return `<a class="nav-link" data-nav="${n.key}" href="${n.href}"${cur}${soon}>${icon(n.key)}<span class="long">${n.label}</span><span class="short">${n.short || n.label}</span></a>`;
  }).join("");
  nav.innerHTML = `<span class="brand nav-brand"><img src="img/favicon.svg" alt="" width="36" height="36">3PJIC</span><div class="nav-links">${links}</div>
    <div class="nav-user"><span class="avatar" aria-hidden="true"></span><span class="who"><strong></strong><small></small></span></div>`;
  const name = user.displayName || user.email || "";
  nav.querySelector(".avatar").textContent = name.trim().charAt(0).toUpperCase();
  nav.querySelector(".who strong").textContent = name;
  nav.querySelector(".who small").textContent = user.email || "";
}

// ตรวจสิทธิ์ก่อนแสดงหน้า แล้วเรียก onReady(user, state)
// needProfile: true = ถ้ายังไม่ได้ทำแบบประเมิน จะพาไปทำก่อน
export function guard({ active, needProfile = false }, onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return window.location.replace("login.html");
    let state;
    try {
      state = await getUserState(user.uid);
    } catch (err) {
      document.getElementById("loading").textContent = "โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง";
      return;
    }
    if (!state.consented) return window.location.replace("consent.html");
    if (needProfile && !state.hasProfile) return window.location.replace("app.html");
    renderNav(active, user);
    await onReady(user, state);
    document.getElementById("loading").hidden = true;
    document.getElementById("page").hidden = false;
  });
}

// ตัวช่วยสร้าง element โดยไม่ใช้ innerHTML กับข้อมูลผู้ใช้ (กันการแทรกโค้ด)
export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export function thaiDate(d, opts = { day: "numeric", month: "short", year: "numeric" }) {
  return d.toLocaleDateString("th-TH", opts);
}
export function daysSince(d) {
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}
