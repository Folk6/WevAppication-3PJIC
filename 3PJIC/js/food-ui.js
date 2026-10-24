// =====================================================================
// ชิ้นส่วนหน้าตาของเมนูที่ใช้ร่วมกัน (การ์ดเมนู, รูปย่อ, ป้าย)
// =====================================================================
import { CATEGORIES, TAGS, fitFor, perServing } from "./foods.js";
import { el } from "./shell.js";
import { iconSVG } from "./food-icons.js";

// รูปเมนู: ใช้ไอคอนที่วาดเอง (js/food-icons.js) ถ้ามีรูปถ่ายของทีมใน img/foods/ จะใช้รูปถ่ายแทน
export function thumb(food, cls = "thumb") {
  const t = el("div", cls + " " + food.cat);
  if (food.img) {
    const img = document.createElement("img");
    img.src = "img/foods/" + food.img; img.alt = food.name; img.loading = "lazy";
    img.onerror = () => { t.innerHTML = iconSVG(food); };
    t.append(img);
  } else {
    t.innerHTML = iconSVG(food); // SVG สร้างจากโค้ดของเราเอง ไม่มีข้อมูลจากผู้ใช้
  }
  return t;
}

// ป้ายบนการ์ด: เตือนสำหรับผู้ใช้คนนี้ก่อน แล้วค่อยป้ายทั่วไป
export function badges(food, profile, { compact = false } = {}) {
  const box = el("div", "badges");
  const fit = fitFor(food, profile);
  if (fit.blocked) box.append(el("span", "badge al", "คุณแพ้"));
  else if (fit.maybe) box.append(el("span", "badge al", "อาจมีสิ่งที่คุณแพ้"));
  else if (!fit.ok) box.append(el("span", "badge warn", "ควรเลี่ยง"));
  else if (profile) box.append(el("span", "badge good", "เหมาะกับคุณ"));
  if (!compact) food.tags.forEach((t) => box.append(el("span", "badge tag", TAGS[t])));
  return box;
}

export function foodCard(food, profile) {
  const a = el("a", "food-card");
  a.href = "food.html?id=" + encodeURIComponent(food.id);
  const fit = fitFor(food, profile);
  if (!fit.ok) a.classList.add("unfit");
  const ps = perServing(food);
  const meta = CATEGORIES[food.cat] + " · " + (ps ? Math.round(ps.kcal) + " kcal/" + food.serving.replace(/ \(.*\)$/, "") : food.serving);
  a.append(thumb(food), el("span", "cat", meta), el("span", "name", food.name), badges(food, profile));
  return a;
}
