// =====================================================================
// ไอคอนเมนูของ 3PJIC (วาดเองทั้งหมดด้วย SVG ไม่ใช้รูปจากที่อื่น)
// แต่ละเมนูประกอบจาก "ภาชนะ" + "อาหารข้างใน" + "ของตกแต่ง"
// ปรับสีหรือของตกแต่งได้ที่ตาราง ICONS ด้านล่าง
// =====================================================================

// ---------- สีพื้นฐาน ----------
const C = {
  plate: "#ffffff", plateRim: "#e4e9e5", shadow: "#cfd8d2",
  bowl: "#ffffff", bowlBand: "#e9eef0",
  clay: "#b8653a", clayDark: "#93502d",
  rice: "#fbf8ef", riceShade: "#eae3cf",
  leaf: "#3f9d4a", leafDark: "#2c7a37", chili: "#e0442c", lime: "#9ccc3c", limeIn: "#d9ef8f",
  egg: "#fffdf6", yolk: "#f7b52c", glass: "#e8f3f7", glassEdge: "#b9d4de", ice: "#ffffff",
};

// ---------- ชิ้นส่วนย่อย ----------
const shadow = (cx = 60, cy = 80, rx = 44) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="6" fill="${C.shadow}" opacity=".55"/>`;
const plate = () => `${shadow(60, 78, 50)}<ellipse cx="60" cy="68" rx="52" ry="16" fill="${C.plateRim}"/><ellipse cx="60" cy="66" rx="52" ry="15" fill="${C.plate}"/><ellipse cx="60" cy="66" rx="38" ry="10" fill="#f6f8f6"/>`;
const smallPlate = () => `${shadow(60, 80, 40)}<ellipse cx="60" cy="72" rx="42" ry="12" fill="${C.plateRim}"/><ellipse cx="60" cy="70" rx="42" ry="11" fill="${C.plate}"/>`;
// ชาม: soup = สีน้ำซุปที่ผิวด้านบน
const bowl = (soup, inner = "") => `${shadow(60, 82, 42)}
  <path d="M14 42 Q16 78 60 80 Q104 78 106 42 Z" fill="${C.bowl}"/>
  <path d="M22 62 Q60 74 98 62 L96 66 Q60 78 24 66 Z" fill="${C.bowlBand}"/>
  <ellipse cx="60" cy="42" rx="46" ry="11" fill="${C.bowlBand}"/>
  <ellipse cx="60" cy="42" rx="42" ry="9" fill="${soup}"/>${inner}`;
const clayBowl = (soup, inner = "") => `${shadow(60, 82, 40)}
  <path d="M16 40 Q20 78 60 80 Q100 78 104 40 Z" fill="${C.clay}"/>
  <path d="M30 70 Q60 80 90 70" stroke="${C.clayDark}" stroke-width="3" fill="none" opacity=".5"/>
  <ellipse cx="60" cy="40" rx="44" ry="10" fill="${C.clayDark}"/>
  <ellipse cx="60" cy="40" rx="40" ry="8" fill="${soup}"/>${inner}`;
// แก้ว: drink = สีเครื่องดื่ม, top = สีชั้นบน (เช่น นม), extra = ไข่มุก/น้ำแข็ง
const glass = (drink, { top = null, pearls = false, straw = "#e0442c", cream = false, ice = true } = {}) => `${shadow(60, 84, 26)}
  <path d="M38 14 L82 14 L76 80 L44 80 Z" fill="${C.glass}" stroke="${C.glassEdge}" stroke-width="2"/>
  <path d="M40.5 26 L79.5 26 L75.6 78 L44.4 78 Z" fill="${drink}"/>
  ${top ? `<path d="M40.5 26 L79.5 26 L78.3 40 L41.7 40 Z" fill="${top}"/>` : ""}
  ${ice ? `<rect x="48" y="30" width="11" height="10" rx="2" fill="${C.ice}" opacity=".55" transform="rotate(-12 53 35)"/><rect x="62" y="36" width="10" height="9" rx="2" fill="${C.ice}" opacity=".5" transform="rotate(10 67 40)"/>` : ""}
  ${pearls ? [0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${48 + (i % 4) * 7.5}" cy="${73 - Math.floor(i / 4) * 6}" r="3.4" fill="#3a2516"/>`).join("") : ""}
  ${cream ? `<path d="M38 16 Q44 4 52 10 Q58 0 66 9 Q74 3 82 16 Z" fill="#fffaf2"/>` : ""}
  ${straw ? `<rect x="64" y="0" width="5" height="44" rx="2" fill="${straw}" transform="rotate(14 66 22)"/>` : ""}
  <path d="M42 18 L46 76" stroke="#ffffff" stroke-width="3" opacity=".45"/>`;
const cup = (drink) => `${shadow(60, 84, 30)}
  <path d="M30 34 L90 34 L84 78 Q60 84 36 78 Z" fill="#ffffff"/>
  <ellipse cx="60" cy="34" rx="30" ry="7" fill="${C.bowlBand}"/><ellipse cx="60" cy="34" rx="27" ry="5.5" fill="${drink}"/>
  <path d="M88 42 Q102 44 98 56 Q94 64 85 62" stroke="#ffffff" stroke-width="6" fill="none"/>`;

// อาหารบนจาน
const riceMound = (x = 60, y = 58, w = 26) => `<ellipse cx="${x}" cy="${y + 4}" rx="${w}" ry="10" fill="${C.riceShade}"/><path d="M${x - w} ${y + 4} Q${x - w + 4} ${y - 16} ${x} ${y - 18} Q${x + w - 4} ${y - 16} ${x + w} ${y + 4} Z" fill="${C.rice}"/>`
  + [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${x - 14 + i * 7}" cy="${y - 6 + (i % 2) * 6}" rx="2.4" ry="1.2" fill="${C.riceShade}"/>`).join("");
const mound = (color, x = 60, y = 60, w = 30, h = 18, dark) => `<path d="M${x - w} ${y + 4} Q${x - w + 6} ${y - h} ${x} ${y - h - 2} Q${x + w - 6} ${y - h} ${x + w} ${y + 4} Q${x} ${y + 12} ${x - w} ${y + 4} Z" fill="${color}"/>`
  + (dark ? [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${x - 18 + i * 7}" cy="${y - 4 + ((i * 5) % 9)}" r="2.6" fill="${dark}"/>`).join("") : "");
const noodles = (color, x = 60, y = 60, w = 34, edge) => `<path d="M${x - w} ${y + 4} Q${x} ${y - 24} ${x + w} ${y + 4} Q${x} ${y + 12} ${x - w} ${y + 4} Z" fill="${color}"/>`
  + [0, 1, 2, 3, 4].map((i) => `<path d="M${x - w + 6 + i * 6} ${y + 4} Q${x - 10 + i * 6} ${y - 18 + i * 2} ${x + 10 + i * 4} ${y + 2}" stroke="${edge}" stroke-width="2" fill="none" opacity=".7"/>`).join("");
const leaf = (x, y, r = 0, s = 1, col = C.leaf) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 Q7 -9 14 0 Q7 9 0 0 Z" fill="${col}"/><path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M1 0 L13 0" stroke="${C.leafDark}" stroke-width="1"/>`;
const leaves = (x, y) => leaf(x, y, -30) + leaf(x + 6, y - 2, 20, 0.9) + leaf(x - 4, y + 4, 160, 0.8);
const chili = (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${C.chili}"/><circle cx="${x + 7}" cy="${y + 3}" r="2.2" fill="${C.chili}"/>`;
const limeWedge = (x, y) => `<path d="M${x} ${y} A12 12 0 0 1 ${x + 22} ${y} Z" fill="${C.lime}"/><path d="M${x + 2.5} ${y - 0.5} A9 9 0 0 1 ${x + 19.5} ${y - 0.5} Z" fill="${C.limeIn}"/>`;
const friedEgg = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0 Q-16 -10 -4 -11 Q6 -15 13 -6 Q18 4 6 7 Q-10 10 -14 0 Z" fill="${C.egg}"/><path d="M-14 0 Q-16 -10 -4 -11" stroke="#e9c48a" stroke-width="2" fill="none"/><circle cx="0" cy="-3" r="5.5" fill="${C.yolk}"/><circle cx="-1.5" cy="-4.5" r="1.6" fill="#ffd977"/></g>`;
const halfEgg = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="9" ry="7" fill="${C.egg}"/><circle cx="0" cy="0" r="4.2" fill="${C.yolk}"/></g>`;
const shrimp = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 Q-2 -12 10 -12 Q18 -10 16 -2 Q14 4 8 2 Q12 -4 8 -6 Q4 -6 4 0 Z" fill="#f2784b"/><path d="M5 -10 L5 -3 M10 -11 L9 -4" stroke="#ffd2bd" stroke-width="1.4"/></g>`;
const slices = (color, x, y, n = 3, edge) => [...Array(n)].map((_, i) => `<path d="M${x + i * 12} ${y} q6 -8 12 0 l-2 4 q-4 -4 -8 0 Z" fill="${color}" ${edge ? `stroke="${edge}" stroke-width="1"` : ""}/>`).join("");
const cucumber = (x, y) => [0, 1].map((i) => `<circle cx="${x + i * 9}" cy="${y}" r="4.6" fill="#7bb661"/><circle cx="${x + i * 9}" cy="${y}" r="3.2" fill="#d8efc0"/>`).join("");
const skewer = (balls, color, x = 60) => `${smallPlate()}<rect x="${x - 40}" y="56" width="80" height="2.4" rx="1" fill="#c99a5b" transform="rotate(-8 ${x} 57)"/>`
  + [...Array(balls)].map((_, i) => `<circle cx="${x - 22 + i * 14}" cy="${60 - i * 2}" r="7" fill="${color}"/><circle cx="${x - 24 + i * 14}" cy="${57 - i * 2}" r="2" fill="#fff" opacity=".35"/>`).join("");

// ผลไม้
const fruit = {
  banana: () => `${shadow(60, 78, 40)}<path d="M18 50 Q40 82 92 60 Q104 52 100 44 Q96 52 84 54 Q48 64 26 42 Z" fill="#f6d34a"/><path d="M26 44 Q46 62 84 54" stroke="#e2b52b" stroke-width="2" fill="none"/><rect x="96" y="40" width="7" height="6" rx="1" fill="#6b5a2a" transform="rotate(30 99 43)"/>`,
  mango: () => `${shadow(60, 80, 34)}<path d="M30 60 Q24 30 52 22 Q84 16 94 42 Q100 70 70 76 Q40 80 30 60 Z" fill="#ffc53d"/><path d="M40 34 Q56 24 76 28" stroke="#ffe08a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M78 22 Q82 12 92 12 Q88 22 78 22 Z" fill="${C.leaf}"/>`,
  durian: () => `${shadow(60, 82, 38)}<ellipse cx="60" cy="52" rx="34" ry="28" fill="#9db53b"/>` + [...Array(14)].map((_, i) => { const a = (i / 14) * Math.PI * 2, x = 60 + Math.cos(a) * 30, y = 52 + Math.sin(a) * 24; return `<path d="M${x} ${y} l3 -7 l3 7 Z" fill="#7f9a2b" transform="rotate(${(a * 180) / Math.PI + 90} ${x} ${y})"/>`; }).join("") + `<path d="M44 50 Q60 34 76 50 Q72 66 60 68 Q48 66 44 50 Z" fill="#ffe17a"/><rect x="57" y="18" width="6" height="10" rx="2" fill="#6b5a2a"/>`,
  tangerine: () => `${shadow(60, 80, 34)}<circle cx="48" cy="52" r="22" fill="#ff9a1f"/><circle cx="78" cy="56" r="19" fill="#ffa93a"/><circle cx="78" cy="56" r="14" fill="#ffd27a"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M78 56 L${78 + Math.cos(i) * 13} ${56 + Math.sin(i) * 13}" stroke="#ffa93a" stroke-width="1.5"/>`).join("") + leaf(42, 30, -40, 1.1),
  watermelon: () => `${shadow(60, 80, 44)}<path d="M14 54 A46 46 0 0 0 106 54 Z" fill="#3e8f3a"/><path d="M19 54 A41 41 0 0 0 101 54 Z" fill="#f4f8e8"/><path d="M23 54 A37 37 0 0 0 97 54 Z" fill="#f2545b"/>` + [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${36 + i * 12}" cy="${62 + (i % 2) * 6}" rx="1.8" ry="3" fill="#2a1d1a"/>`).join(""),
  guava: () => `${shadow(60, 80, 34)}<circle cx="60" cy="50" r="28" fill="#9fd15a"/><ellipse cx="60" cy="52" rx="20" ry="20" fill="#f2f7df"/><circle cx="60" cy="52" r="10" fill="#e9efc4"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${60 + Math.cos(i) * 6}" cy="${52 + Math.sin(i) * 6}" r="1.5" fill="#c6b37c"/>`).join(""),
  papaya: () => `${shadow(60, 80, 44)}<path d="M14 52 Q20 30 60 30 Q100 30 106 52 Q100 74 60 74 Q20 74 14 52 Z" fill="#7cae3c"/><path d="M18 52 Q24 34 60 34 Q96 34 102 52 Q96 70 60 70 Q24 70 18 52 Z" fill="#ff8c42"/><path d="M36 52 Q44 44 60 44 Q76 44 84 52 Q76 60 60 60 Q44 60 36 52 Z" fill="#e8722c"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${44 + i * 6}" cy="${52 + (i % 2) * 2 - 1}" r="2.3" fill="#2a1d1a"/>`).join(""),
  pineapple: () => `${smallPlate()}` + [0, 1, 2].map((i) => `<path d="M${26 + i * 24} 70 L${34 + i * 24} 46 L${48 + i * 24} 46 L${50 + i * 24} 70 Z" fill="#ffd24a"/><path d="M${30 + i * 24} 66 L${48 + i * 24} 66" stroke="#f2b72a" stroke-width="2"/>`).join(""),
  pomelo: () => `${smallPlate()}` + [0, 1, 2].map((i) => `<path d="M${22 + i * 26} 68 Q${34 + i * 26} 40 ${50 + i * 26} 52 Q${46 + i * 26} 70 ${22 + i * 26} 68 Z" fill="#f7a1a0"/><path d="M${26 + i * 26} 66 Q${36 + i * 26} 48 ${46 + i * 26} 54" stroke="#ffd0cf" stroke-width="2" fill="none"/>`).join(""),
  // ผลไม้กลม: สีเปลือก + สีเนื้อด้านในของลูกที่ผ่าครึ่ง
  round: (skin, flesh, seed, n = 2, extra = "") => `${shadow(60, 80, 36)}<circle cx="44" cy="54" r="20" fill="${skin}"/><circle cx="38" cy="48" r="5" fill="#ffffff" opacity=".3"/>`
    + `<circle cx="78" cy="58" r="17" fill="${skin}"/><circle cx="78" cy="58" r="13" fill="${flesh}"/>` + (seed ? `<ellipse cx="78" cy="58" rx="${n}" ry="${n + 2}" fill="${seed}"/>` : "") + extra,
  longan: () => `${smallPlate()}` + [[40, 62], [56, 58], [72, 62], [48, 50], [64, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#c8a06a"/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#e3c89a"/>`).join("") + `<circle cx="84" cy="64" r="8" fill="#f3efe2"/><circle cx="84" cy="64" r="3.4" fill="#3a2516"/>`,
};

// ---------- ตารางไอคอนของแต่ละเมนู ----------
export const ICONS = {
  "kaprao-gai-kap": () => plate() + mound("#8b5a2b", 60, 60, 30, 16, "#6c4320") + leaves(52, 46) + leaves(70, 50) + chili(42, 56) + chili(76, 60),
  "burger-gai": () => smallPlate() + `<path d="M28 50 Q30 26 60 26 Q90 26 92 50 Z" fill="#e8a24a"/><ellipse cx="48" cy="36" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="60" cy="32" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="72" cy="36" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="54" cy="42" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="68" cy="42" rx="2" ry="1.2" fill="#fff4d6"/><path d="M26 52 Q40 46 52 52 Q66 46 80 52 Q90 48 94 52 L94 55 L26 55 Z" fill="${C.leaf}"/><rect x="26" y="54" width="68" height="8" rx="4" fill="#b8692c"/><path d="M28 63 L92 63 Q92 70 60 70 Q28 70 28 63 Z" fill="#e8a24a"/>`,
  "burger-nuea": () => smallPlate() + `<path d="M28 50 Q30 26 60 26 Q90 26 92 50 Z" fill="#e8a24a"/><ellipse cx="48" cy="36" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="60" cy="32" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="72" cy="36" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="54" cy="42" rx="2" ry="1.2" fill="#fff4d6"/><ellipse cx="68" cy="42" rx="2" ry="1.2" fill="#fff4d6"/><path d="M26 52 Q40 46 52 52 Q66 46 80 52 Q90 48 94 52 L94 55 L26 55 Z" fill="${C.leaf}"/><rect x="26" y="54" width="68" height="8" rx="4" fill="#6b3f22"/><path d="M28 63 L92 63 Q92 70 60 70 Q28 70 28 63 Z" fill="#e8a24a"/>`,
  "sandwich-gai": () => smallPlate() + `<path d="M24 66 L60 30 L96 66 Z" fill="#f5deb0"/><path d="M28 62 L60 34 L92 62" stroke="#e9c08a" stroke-width="5" fill="none"/><path d="M32 60 L60 38 L88 60" stroke="${C.leaf}" stroke-width="3" fill="none"/><path d="M24 66 L60 30 L96 66" stroke="#c99a5b" stroke-width="2.5" fill="none"/>`,
  "sandwich-pla": () => smallPlate() + `<path d="M24 66 L60 30 L96 66 Z" fill="#f5deb0"/><path d="M28 62 L60 34 L92 62" stroke="#f0d9a8" stroke-width="5" fill="none"/><path d="M32 60 L60 38 L88 60" stroke="#f6d04a" stroke-width="3" fill="none"/><path d="M24 66 L60 30 L96 66" stroke="#c99a5b" stroke-width="2.5" fill="none"/>`,
  "roti": () => smallPlate() + `<rect x="34" y="40" width="52" height="30" rx="4" fill="#efc777" transform="rotate(-6 60 55)"/><path d="M38 50 L82 46 M38 60 L82 56" stroke="#d9a248" stroke-width="2"/>`,
  "french-fries": () => `${shadow(60, 84, 30)}` + [...Array(7)].map((_, i) => `<rect x="${38 + i * 6.5}" y="${18 + (i % 3) * 5}" width="5" height="40" rx="1.5" fill="#f6c94a" transform="rotate(${(i - 3) * 4} ${40 + i * 6.5} 50)"/>`).join("") + `<path d="M34 42 L86 42 L80 82 L40 82 Z" fill="#e0442c"/><path d="M34 42 Q60 52 86 42" fill="#c63a25"/>`,
  // อาหาร
  "kaprao-gai": () => plate() + riceMound(48, 60, 24) + mound("#8b5a2b", 74, 60, 22, 14, "#6c4320") + leaves(70, 46) + friedEgg(48, 48, 0.9) + chili(84, 54),
  "khao-man-gai": () => plate() + riceMound(56, 60, 28) + slices("#fff4e1", 44, 52, 3, "#e8c99a") + cucumber(84, 62) + `<circle cx="30" cy="62" r="6" fill="#7a5a3a"/>`,
  "khao-kha-mu": () => plate() + riceMound(54, 60, 28) + slices("#7a3f22", 40, 52, 3) + halfEgg(84, 58) + `<path d="M24 66 q6 -6 12 0" stroke="#4f8c3a" stroke-width="4" fill="none"/>`,
  "khao-mu-daeng": () => plate() + riceMound(54, 60, 28) + slices("#c8372d", 38, 52, 3) + `<path d="M30 62 Q60 72 86 60" stroke="#b5452a" stroke-width="4" fill="none" opacity=".7"/>` + halfEgg(86, 56, 0.9) + cucumber(26, 60),
  "khao-pad-mu": () => plate() + mound("#e8c56d", 60, 60, 34, 18, "#c58b4a") + cucumber(28, 66) + limeWedge(76, 66) + `<path d="M50 44 l4 -6 l4 6" fill="${C.leaf}"/>`,
  "khao-khai-jiao": () => plate() + riceMound(46, 60, 24) + `<path d="M58 56 Q60 38 80 40 Q98 44 94 58 Q86 68 70 66 Q58 64 58 56 Z" fill="#f4c542"/><path d="M64 52 Q74 44 86 50" stroke="#d99f2b" stroke-width="2" fill="none"/>` + chili(84, 66),
  "khao-tom-mu": () => bowl("#f2ead6", `<circle cx="48" cy="42" r="4" fill="#d9a77b"/><circle cx="62" cy="40" r="4" fill="#d9a77b"/><circle cx="72" cy="44" r="3" fill="#d9a77b"/>` + leaf(52, 38, -20, 0.7) + `<path d="M76 38 l6 2" stroke="#e8d27a" stroke-width="2"/>`),
  "jok-mu": () => bowl("#efe6d0", `<circle cx="60" cy="42" r="5" fill="${C.yolk}"/><circle cx="46" cy="44" r="3" fill="#c98f62"/><circle cx="74" cy="40" r="3" fill="#c98f62"/>` + leaf(66, 36, 10, 0.6) + `<path d="M40 38 l8 0 M72 46 l8 -1" stroke="#7bb661" stroke-width="2"/>`),
  "kuay-tiew-nam-sai": () => bowl("#f6efe0", `<path d="M30 42 Q45 36 60 42 T90 42" stroke="#fff8ea" stroke-width="3" fill="none"/>` + slices("#d7a07a", 40, 42, 2) + `<circle cx="78" cy="42" r="4" fill="#efe8dc"/>` + leaf(56, 36, 0, 0.7)),
  "kuay-tiew-tom-yum": () => bowl("#e9893c", `<path d="M30 42 Q45 36 60 42 T90 42" stroke="#fff3df" stroke-width="3" fill="none"/>` + `<circle cx="44" cy="40" r="4" fill="#efe8dc"/><circle cx="74" cy="42" r="3" fill="#d7a07a"/>` + chili(60, 38) + leaf(66, 44, 30, 0.6)),
  "yen-ta-fo": () => bowl("#e8657a", `<path d="M30 42 Q45 36 60 42 T90 42" stroke="#fff3df" stroke-width="3" fill="none"/><rect x="40" y="36" width="8" height="8" rx="2" fill="#f0c98a"/><circle cx="70" cy="40" r="4" fill="#efe8dc"/>` + leaf(56, 44, 0, 0.6)),
  "ba-mi-mu-daeng": () => bowl("#f0dba6", `<path d="M30 42 Q45 34 60 42 T90 42 M34 46 Q50 38 66 46" stroke="#f2c74a" stroke-width="3" fill="none"/>` + slices("#c8372d", 46, 40, 2) + leaf(74, 38, -20, 0.7)),
  "pad-thai-goong": () => plate() + noodles("#e8b968", 58, 60, 34, "#d0974a") + shrimp(44, 48, -10) + shrimp(64, 46, 10) + limeWedge(84, 64) + `<path d="M26 66 l8 -10 M30 68 l10 -8" stroke="#e9f2d0" stroke-width="2.5"/>`,
  "pad-see-ew": () => plate() + noodles("#8a5a33", 58, 60, 34, "#6c4320") + `<path d="M40 50 Q48 40 58 48" stroke="${C.leaf}" stroke-width="5" fill="none"/><path d="M62 48 Q72 40 80 50" stroke="${C.leaf}" stroke-width="5" fill="none"/>` + `<circle cx="56" cy="44" r="4" fill="${C.yolk}" opacity=".85"/>`,
  "rad-na-mu": () => plate() + noodles("#fbf3e3", 58, 60, 32, "#e8dcc2") + `<path d="M28 62 Q58 40 90 62 Q60 74 28 62 Z" fill="#8a5a33" opacity=".75"/>` + `<path d="M44 52 Q50 44 58 50 M62 50 Q70 44 76 52" stroke="${C.leaf}" stroke-width="5" fill="none"/>`,
  "som-tam-thai": () => plate() + `<path d="M28 62 Q32 36 60 34 Q88 36 92 62 Q60 72 28 62 Z" fill="#cfe7a0"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${34 + i * 9} 60 Q${40 + i * 8} 44 ${46 + i * 7} 40" stroke="#a9cf6a" stroke-width="2" fill="none"/>`).join("") + `<circle cx="48" cy="50" r="5" fill="#e9483b"/><circle cx="72" cy="52" r="5" fill="#e9483b"/>` + chili(58, 44) + `<circle cx="64" cy="58" r="2" fill="#c98f4a"/><circle cx="54" cy="60" r="2" fill="#c98f4a"/>`,
  "gai-yang": () => plate() + `<path d="M30 60 Q30 40 52 38 Q76 36 86 50 Q92 62 76 66 Q50 72 30 60 Z" fill="#c9762f"/><path d="M38 52 L74 48 M40 58 L80 56" stroke="#8f4a1c" stroke-width="3" opacity=".7"/>` + leaf(84, 64, 0, 0.8),
  "tom-yum-goong": () => clayBowl("#ef7a2d", shrimp(42, 42, -10) + shrimp(66, 40, 15) + `<circle cx="56" cy="44" r="4" fill="#f5efe2"/>` + leaf(76, 42, -30, 0.7) + chili(48, 36)),
  "kaeng-khiao-wan-gai": () => bowl("#a9c46a", `<circle cx="46" cy="42" r="5" fill="#f3ead8"/><circle cx="68" cy="40" r="5" fill="#f3ead8"/><circle cx="58" cy="45" r="3" fill="#6fae4a"/>` + leaf(74, 44, -20, 0.7) + chili(52, 37)),
  "kaeng-jued-tao-hu": () => bowl("#f4ecd4", `<rect x="40" y="38" width="9" height="8" rx="1.5" fill="#fffdf2" stroke="#e7dfc6"/><rect x="66" y="37" width="9" height="8" rx="1.5" fill="#fffdf2" stroke="#e7dfc6"/><circle cx="56" cy="44" r="3" fill="#c98f62"/>` + leaf(56, 36, 10, 0.6) + leaf(76, 44, 170, 0.6)),
  "pla-nueng-manao": () => plate() + `<path d="M24 60 Q40 42 70 46 L92 36 L90 56 L92 76 L70 64 Q40 76 24 60 Z" fill="#b9c4c6"/><circle cx="34" cy="56" r="2.4" fill="#2a1d1a"/>` + limeWedge(48, 54) + chili(66, 52) + leaf(78, 58, 10, 0.7),
  "suki-nam-gai": () => clayBowl("#e9a24a", `<path d="M30 40 Q45 34 60 40 T90 40" stroke="#f7f2e6" stroke-width="3" fill="none"/>` + `<path d="M40 44 Q48 36 56 44" stroke="#6fae4a" stroke-width="5" fill="none"/>` + halfEgg(72, 40, 0.8)),
  "tom-lued-mu": () => bowl("#e9dcb8", `<rect x="40" y="37" width="9" height="8" rx="1.5" fill="#6b2b23"/><rect x="66" y="38" width="9" height="7" rx="1.5" fill="#6b2b23"/><circle cx="57" cy="44" r="3" fill="#c98f62"/>` + leaf(54, 36, 0, 0.6)),
  "yum-woon-sen": () => plate() + noodles("#eef0ea", 58, 60, 32, "#d9dfd2") + shrimp(46, 48, -10) + `<circle cx="70" cy="52" r="4" fill="#d58c6b"/>` + chili(64, 44) + `<path d="M78 58 l8 -6" stroke="#7bb661" stroke-width="3"/>`,
  "khai-pa-lo": () => plate() + riceMound(44, 60, 24) + `<path d="M56 60 Q60 48 78 48 Q96 48 98 60 Q78 68 56 60 Z" fill="#7a4a28"/>` + halfEgg(70, 54, 0.9) + halfEgg(86, 56, 0.85) + leaf(60, 52, 0, 0.6),

  // ขนม
  "khanom-khrok": () => smallPlate() + [[36, 64], [54, 60], [72, 64], [45, 54], [63, 52], [84, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#e8a64a"/><circle cx="${x}" cy="${y - 1}" r="6.5" fill="#fff6dc"/><circle cx="${x - 1}" cy="${y - 2}" r="1.6" fill="#8fbf5a"/>`).join(""),
  "pa-tong-go": () => smallPlate() + `<g transform="rotate(-20 60 58)"><rect x="30" y="50" width="60" height="9" rx="4.5" fill="#d9903a"/><rect x="30" y="58" width="60" height="9" rx="4.5" fill="#c97f2c"/></g><g transform="rotate(25 60 60)"><rect x="34" y="54" width="56" height="8" rx="4" fill="#e3a24a"/></g>`,
  "salapao-mu-sap": () => smallPlate() + [[44, 58], [76, 58]].map(([x, y]) => `<path d="M${x - 16} ${y + 8} Q${x - 18} ${y - 14} ${x} ${y - 16} Q${x + 18} ${y - 14} ${x + 16} ${y + 8} Z" fill="#fffaf0"/><path d="M${x - 5} ${y - 12} Q${x} ${y - 4} ${x + 5} ${y - 12}" stroke="#e6dcc6" stroke-width="2" fill="none"/>`).join(""),
  "roti-kluay-khai": () => smallPlate() + `<path d="M26 66 L60 40 L94 66 Z" fill="#efc777"/><path d="M34 62 L60 46 L86 62" stroke="#d9a248" stroke-width="2" fill="none"/>` + [0, 1, 2, 3].map((i) => `<path d="M${36 + i * 13} 58 q4 4 8 0" stroke="#fffaf0" stroke-width="2.5" fill="none"/>`).join(""),
  "khanom-jeeb": () => smallPlate() + [[40, 60], [60, 56], [80, 60]].map(([x, y]) => `<path d="M${x - 10} ${y + 6} L${x - 8} ${y - 8} L${x + 8} ${y - 8} L${x + 10} ${y + 6} Z" fill="#f6e3b8"/><ellipse cx="${x}" cy="${y - 8}" rx="8" ry="3" fill="#e79a7a"/><circle cx="${x}" cy="${y - 9}" r="1.8" fill="#f2b234"/>`).join(""),
  "look-chin-ping": () => skewer(4, "#d9b48a"),
  "khanom-buang": () => smallPlate() + [[40, 62], [62, 58], [84, 62]].map(([x, y]) => `<path d="M${x - 12} ${y + 2} Q${x} ${y - 18} ${x + 12} ${y + 2} Z" fill="#e7a94e"/><path d="M${x - 8} ${y} Q${x} ${y - 12} ${x + 8} ${y}" fill="#fffaf0"/><circle cx="${x - 2}" cy="${y - 4}" r="1.6" fill="#f08a3a"/><circle cx="${x + 3}" cy="${y - 2}" r="1.6" fill="#f08a3a"/>`).join(""),
  "khao-niao-mu-ping": () => skewer(4, "#a8552c") + `<path d="M74 66 Q80 52 94 56 Q100 66 90 72 Q78 74 74 66 Z" fill="${C.rice}"/>`,

  // ของหวาน
  "bua-loi": () => bowl("#fbf6ea", [[44, 42, "#f7a8c6"], [56, 39, "#ffffff"], [66, 43, "#9ed99a"], [76, 39, "#f6d36a"], [50, 46, "#b9a2e6"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}" stroke="#e8dfcd" stroke-width=".8"/>`).join("")),
  "khao-niao-mamuang": () => plate() + riceMound(42, 60, 20) + `<path d="M58 66 Q56 42 76 40 Q96 42 96 60 Q90 70 74 70 Q62 70 58 66 Z" fill="#ffc53d"/>` + [0, 1, 2].map((i) => `<path d="M${64 + i * 9} 46 L${62 + i * 9} 66" stroke="#f2aa1f" stroke-width="2"/>`).join("") + `<path d="M28 50 Q42 42 56 52" stroke="#fffaf0" stroke-width="5" fill="none"/>` + leaf(36, 46, -20, 0.6),
  "lod-chong": () => bowl("#f5f1e6", [...Array(10)].map((_, i) => `<path d="M${32 + i * 6} ${40 + (i % 3)} q2 -3 4 0" stroke="#4fb35a" stroke-width="2.5" fill="none"/>`).join("") + `<rect x="54" y="36" width="8" height="6" fill="#ffffff" opacity=".8" transform="rotate(15 58 39)"/>`),
  "tub-tim-krob": () => bowl("#f8f3ea", [...Array(9)].map((_, i) => `<rect x="${36 + (i % 5) * 9}" y="${36 + Math.floor(i / 5) * 6}" width="6" height="5" rx="1.5" fill="#e23b55"/>`).join("") + `<rect x="68" y="42" width="8" height="6" fill="#ffffff" opacity=".8"/>`),
  "khao-niao-tua-dam": () => bowl("#f8f2e3", `<path d="M30 42 Q60 34 90 42" stroke="#4a2d3f" stroke-width="7" fill="none" opacity=".6"/>` + [...Array(8)].map((_, i) => `<ellipse cx="${36 + i * 7}" cy="${42 + (i % 2) * 2}" rx="2.6" ry="1.8" fill="#2a1d24"/>`).join("")),
  "itim-kati": () => cup("#fff8ec") + `<circle cx="60" cy="26" r="16" fill="#fffaf1"/><circle cx="54" cy="20" r="4" fill="#ffffff"/>` + `<path d="M64 14 l4 -8" stroke="#b07a3c" stroke-width="3"/><circle cx="50" cy="30" r="2" fill="#7bb661"/><circle cx="66" cy="32" r="2" fill="#f2b234"/>`,
  "tao-huay-nam-khing": () => bowl("#e7c37a", `<ellipse cx="58" cy="42" rx="18" ry="5" fill="#fffdf4"/><path d="M70 38 l8 -2 M72 44 l9 1" stroke="#d9a248" stroke-width="2.5"/>`),

  // ผลไม้
  "kluay-hom": fruit.banana, "mamuang-suk": fruit.mango, durian: fruit.durian, "som-khiao-wan": fruit.tangerine,
  "taeng-mo": fruit.watermelon, farang: fruit.guava, "malako-suk": fruit.papaya, sapparod: fruit.pineapple,
  "som-o": fruit.pomelo, lamyai: fruit.longan,
  linchi: () => fruit.round("#d8434f", "#f8f4ec", "#5a3a2a", 4) + [0, 1, 2, 3, 4].map((i) => `<circle cx="${34 + i * 5}" cy="${48 + (i % 2) * 8}" r="1.2" fill="#a52c37"/>`).join(""),
  ngo: () => fruit.round("#e2463a", "#f6f1e6", "#8a6a4a", 4) + [...Array(12)].map((_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${44 + Math.cos(a) * 20} ${54 + Math.sin(a) * 20} q${Math.cos(a) * 6} ${Math.sin(a) * 6 - 3} ${Math.cos(a) * 8} ${Math.sin(a) * 8}" stroke="#4f9a3a" stroke-width="2" fill="none"/>`; }).join(""),
  "kaeo-mangkon": () => fruit.round("#e2477f", "#fbfaf7", null, 0, [...Array(14)].map((_, i) => `<circle cx="${70 + (i % 5) * 4}" cy="${51 + Math.floor(i / 5) * 6}" r="1" fill="#2a1d1a"/>`).join("") + `<path d="M30 40 q-6 -6 -2 -12 M54 38 q6 -6 4 -12" stroke="#7cc04a" stroke-width="4" fill="none"/>`),
  "apple-daeng": () => fruit.round("#d8323c", "#fbf3d9", "#5a3a2a", 2) + `<rect x="43" y="30" width="3" height="8" rx="1" fill="#6b4a2a"/>` + leaf(46, 32, -30, 0.8),
  "apple-khiao": () => fruit.round("#8cc63f", "#f6f4d6", "#5a3a2a", 2) + `<rect x="43" y="30" width="3" height="8" rx="1" fill="#6b4a2a"/>` + leaf(46, 32, -30, 0.8),
  sala: () => fruit.round("#8a4a2a", "#f3e7c6", "#3a2516", 3) + [...Array(10)].map((_, i) => `<path d="M${32 + (i % 5) * 6} ${44 + Math.floor(i / 5) * 10} l2 -3 l2 3" stroke="#5a2e1a" stroke-width="1.2" fill="none"/>`).join(""),
  "a-ngun-dam": () => `${shadow(60, 82, 30)}` + [[50, 30], [62, 30], [74, 30], [44, 42], [56, 42], [68, 42], [80, 42], [50, 54], [62, 54], [74, 54], [56, 66], [68, 66], [62, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#4a2a5a"/><circle cx="${x - 2}" cy="${y - 2}" r="1.8" fill="#8a6aa0"/>`).join("") + `<path d="M62 22 q2 -10 10 -14" stroke="#6b4a2a" stroke-width="3" fill="none"/>` + leaf(64, 14, -20, 1),
  "noi-na": () => fruit.round("#9cc46a", "#fbf8ef", "#2a1d1a", 3) + [...Array(9)].map((_, i) => `<circle cx="${34 + (i % 3) * 10}" cy="${44 + Math.floor(i / 3) * 10}" r="4.5" fill="none" stroke="#7aa34a" stroke-width="1.4"/>`).join(""),
  cantaloupe: () => `${shadow(60, 80, 44)}<path d="M16 54 A44 44 0 0 0 104 54 Z" fill="#c9cfa0"/><path d="M21 54 A39 39 0 0 0 99 54 Z" fill="#b9e08a"/><path d="M34 54 A26 26 0 0 0 86 54 Z" fill="#e8f2c4"/>` + [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${44 + i * 8}" cy="${58 + (i % 2) * 2}" rx="1.6" ry="3" fill="#f2f0d8" stroke="#c9c38e" stroke-width=".6"/>`).join(""),
  cherry: () => `${shadow(60, 82, 30)}<path d="M48 56 Q56 24 72 14 M74 58 Q74 30 72 14" stroke="#5a7a2a" stroke-width="3" fill="none"/><circle cx="46" cy="62" r="14" fill="#b3162b"/><circle cx="76" cy="64" r="14" fill="#c41f34"/><circle cx="41" cy="57" r="3.5" fill="#ffffff" opacity=".35"/><circle cx="71" cy="59" r="3.5" fill="#ffffff" opacity=".35"/>` + leaf(72, 14, -10, 1.1),
  thapthim: () => fruit.round("#c8283a", "#f9e3df", null, 0, [...Array(15)].map((_, i) => `<circle cx="${70 + (i % 5) * 4}" cy="${50 + Math.floor(i / 5) * 6}" r="2" fill="#d6283e"/>`).join("") + `<path d="M40 34 l4 -6 l4 6 l4 -6 l2 6" fill="#a51f2e"/>`),

  // เครื่องดื่ม
  "cha-yen": () => glass("#e88a3c", { top: "#f6d7b0" }),
  "cha-nom-khai-muk": () => glass("#d9b48a", { pearls: true, straw: "#3a2516" }),
  "kafae-yen": () => glass("#9a6a44", { top: "#e9d3b5" }),
  "americano-yen": () => glass("#3d2a1f", { straw: "#3f9d4a" }),
  "nam-tao-hu": () => cup("#f1e2bd"),
  "nam-ad-lom": () => glass("#5a2e22", { straw: "#e0442c" }) + [0, 1, 2].map((i) => `<circle cx="${52 + i * 8}" cy="${60 - i * 6}" r="1.6" fill="#ffffff" opacity=".6"/>`).join(""),
  "cha-manao": () => glass("#e8742c", { straw: "#3f9d4a" }) + `<circle cx="78" cy="18" r="9" fill="${C.lime}"/><circle cx="78" cy="18" r="6.5" fill="${C.limeIn}"/>`,
  "nam-maprao": () => `${shadow(60, 84, 34)}<path d="M26 48 Q26 18 60 16 Q94 18 94 48 Q94 80 60 82 Q26 80 26 48 Z" fill="#7cae3c"/><ellipse cx="60" cy="24" rx="20" ry="6" fill="#f4f1e2"/><rect x="58" y="0" width="5" height="26" rx="2" fill="#e0442c" transform="rotate(12 60 13)"/>`,
  "nom-jued": () => `${shadow(60, 84, 24)}<path d="M40 30 L60 18 L80 30 L80 80 L40 80 Z" fill="#ffffff" stroke="#d6e4ea" stroke-width="2"/><path d="M40 30 L80 30" stroke="#d6e4ea" stroke-width="2"/><rect x="40" y="46" width="40" height="18" fill="#4a8fd8"/><path d="M48 58 Q54 50 60 56 Q66 50 72 58" stroke="#ffffff" stroke-width="2.5" fill="none"/>`,
  "cocoa-yen": () => glass("#6b3f26", { cream: true, straw: "#e0442c" }),

  // ร้านสะดวกซื้อ
  "sandwich-ham-cheese": () => smallPlate() + `<path d="M24 66 L60 30 L96 66 Z" fill="#f5deb0"/><path d="M28 62 L60 34 L92 62" stroke="#e6a8a8" stroke-width="4" fill="none"/><path d="M32 60 L60 38 L88 60" stroke="#f6d04a" stroke-width="3" fill="none"/><path d="M24 66 L60 30 L96 66" stroke="#c99a5b" stroke-width="2.5" fill="none"/>`,
  "kaprao-frozen": () => `${shadow(60, 82, 46)}<rect x="16" y="34" width="88" height="46" rx="8" fill="#2f2f33"/><rect x="20" y="38" width="80" height="38" rx="6" fill="#3c3c42"/>` + riceMound(44, 62, 18) + mound("#8b5a2b", 76, 62, 18, 12, "#6c4320") + leaf(72, 50, -20, 0.7) + `<rect x="16" y="28" width="88" height="8" rx="3" fill="#e9f3f7" opacity=".8"/>`,
  "khai-tom": () => smallPlate() + `<ellipse cx="44" cy="56" rx="14" ry="17" fill="#f6eee0"/>` + halfEgg(76, 62, 1.25),
  "ok-gai": () => `${shadow(60, 82, 40)}<rect x="22" y="28" width="76" height="52" rx="10" fill="#ffffff" stroke="#d6e4ea" stroke-width="2"/><rect x="30" y="38" width="60" height="22" rx="6" fill="#f3dfc2"/><path d="M36 44 L84 52 M36 52 L84 46" stroke="#e1b98a" stroke-width="2"/><rect x="30" y="64" width="36" height="6" rx="3" fill="${C.leaf}"/>`,
  "nom-priao": () => `${shadow(60, 84, 22)}<path d="M46 28 Q44 22 50 20 L70 20 Q76 22 74 28 L78 80 L42 80 Z" fill="#ffffff" stroke="#d6e4ea" stroke-width="2"/><rect x="48" y="10" width="24" height="10" rx="3" fill="#e0442c"/><rect x="44" y="44" width="32" height="22" rx="3" fill="#f2a1b8"/><circle cx="60" cy="55" r="5" fill="#ffffff"/>`,

  // ท็อปปิ้ง
  "khai-dao": () => smallPlate() + friedEgg(60, 62, 1.6),
  "khao-plao-perm": () => bowl("#fbf8ef", `<path d="M22 42 Q60 14 98 42 Q60 50 22 42 Z" fill="${C.rice}"/>` + [0, 1, 2, 3].map((i) => `<ellipse cx="${44 + i * 10}" cy="${36 - (i % 2) * 4}" rx="2.4" ry="1.2" fill="${C.riceShade}"/>`).join("")),
  "khai-muk": () => bowl("#f3ece0", [...Array(12)].map((_, i) => `<circle cx="${36 + (i % 6) * 9}" cy="${40 + Math.floor(i / 6) * 5}" r="3.6" fill="#3a2516"/>`).join("")),
  "nom-khon-wan": () => `${shadow(60, 84, 30)}<rect x="32" y="26" width="56" height="54" rx="4" fill="#d6dde0"/><ellipse cx="60" cy="26" rx="28" ry="6" fill="#c2cbcf"/><rect x="32" y="40" width="56" height="26" fill="#3f78c4"/><path d="M42 54 Q52 46 60 54 Q68 46 78 54" stroke="#ffffff" stroke-width="3" fill="none"/>`,
};

// สร้าง SVG ของเมนู (ถ้าไม่มีในตาราง ใช้จานเปล่า + สีตามหมวด)
const FALLBACK = { food: "#e8c56d", snack: "#e8a64a", dessert: "#f7a8c6", fruit: "#ffc53d", drink: "#e88a3c", store: "#9fb7c9", topping: "#f2d48a" };
export function iconSVG(food) {
  const body = ICONS[food.id] ? ICONS[food.id]() : plate() + mound(FALLBACK[food.cat] || "#e8c56d");
  return `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${food.name.replace(/"/g, "")}">${body}</svg>`;
}
