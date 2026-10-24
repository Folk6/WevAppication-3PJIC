// =====================================================================
// เชื่อมต่อ Firebase และฟังก์ชันที่ทุกหน้าใช้ร่วมกัน
// ใช้ Firebase JS SDK แบบโหลดจาก CDN (ไม่ต้องติดตั้ง npm)
// =====================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// อีเมลที่ Firebase ส่ง (เช่น ตั้งรหัสผ่านใหม่) จะเป็นภาษาไทย
auth.languageCode = "th";

// ตรวจว่าใส่ค่า config แล้วหรือยัง ถ้ายังจะแสดงคำเตือนบนหน้าเว็บ
export const configReady = !firebaseConfig.apiKey.startsWith("ใส่");

// ---------------------------------------------------------------------
// แปลงรหัสข้อผิดพลาดของ Firebase เป็นข้อความภาษาไทยที่ผู้ใช้เข้าใจ
// ---------------------------------------------------------------------
const ERRORS = {
  "auth/email-already-in-use": "อีเมลนี้มีบัญชีอยู่แล้ว ลองเข้าสู่ระบบแทน",
  "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
  "auth/weak-password": "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
  "auth/missing-password": "กรอกรหัสผ่าน",
  "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/wrong-password": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/user-not-found": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/user-disabled": "บัญชีนี้ถูกระงับการใช้งาน",
  "auth/too-many-requests": "ลองผิดหลายครั้งเกินไป รอสักครู่แล้วลองใหม่",
  "auth/network-request-failed": "เชื่อมต่ออินเทอร์เน็ตไม่ได้ ตรวจการเชื่อมต่อแล้วลองใหม่",
  "auth/popup-blocked": "เบราว์เซอร์บล็อกหน้าต่าง Google อนุญาตป๊อปอัปแล้วลองใหม่",
  "auth/popup-closed-by-user": "ปิดหน้าต่าง Google ก่อนเข้าสู่ระบบเสร็จ ลองใหม่อีกครั้ง",
  "auth/cancelled-popup-request": "ปิดหน้าต่าง Google ก่อนเข้าสู่ระบบเสร็จ ลองใหม่อีกครั้ง",
  "auth/account-exists-with-different-credential": "อีเมลนี้เคยสมัครด้วยวิธีอื่น ลองเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน",
  "auth/unauthorized-domain": "โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase (ดู README ขั้นตอนที่ 3)",
  "auth/configuration-not-found": "ยังไม่ได้เปิดวิธีเข้าสู่ระบบนี้ใน Firebase Console (ดู README ขั้นตอนที่ 3)",
  "auth/operation-not-allowed": "ยังไม่ได้เปิดวิธีเข้าสู่ระบบนี้ใน Firebase Console (ดู README ขั้นตอนที่ 3)",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "ค่า apiKey ใน js/firebase-config.js ไม่ถูกต้อง (ดู README ขั้นตอนที่ 2)",
  "permission-denied": "ไม่มีสิทธิ์เข้าถึงข้อมูล ตรวจ Firestore Rules (ดู README ขั้นตอนที่ 4)",
};
export function thaiError(err) {
  return ERRORS[err?.code] || "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง (" + (err?.code || "unknown") + ")";
}

// ---------------------------------------------------------------------
// อ่านสถานะผู้ใช้จาก Firestore: ยินยอมแล้วหรือยัง / ทำแบบประเมินแล้วหรือยัง
// เอกสารเก็บที่ users/{uid}
// ---------------------------------------------------------------------
export async function getUserState(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.exists() ? snap.data() : {};
  return {
    data,
    consented: data.consent?.agreed === true,
    hasProfile: !!data.profile,
  };
}

// ประวัติน้ำหนัก users/{uid}/weights เรียงจากล่าสุด: [{ id, kg, at: Date }]
export async function loadWeights(uid, max = 20) {
  const q = query(collection(db, "users", uid, "weights"), orderBy("at", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, kg: d.data().kg, at: d.data().at?.toDate?.() || new Date() }));
}

// พาผู้ใช้ที่ล็อกอินแล้วไปหน้าที่ถูกต้องตาม User flow
//   ยังไม่ยินยอม → consent.html | ยินยอมแล้ว → app.html (app.html จะชวนทำแบบประเมินถ้ายังไม่มีโปรไฟล์)
export async function routeSignedInUser(user) {
  const state = await getUserState(user.uid);
  window.location.replace(state.consented ? "app.html" : "consent.html");
}

// ---------------------------------------------------------------------
// ตัวช่วยหน้าตา: ปุ่มกำลังโหลด และกล่องข้อความแจ้ง
// ---------------------------------------------------------------------
export function setBusy(button, busy, busyText) {
  if (busy) {
    button.dataset.label = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + busyText;
  } else {
    button.disabled = false;
    if (button.dataset.label) button.innerHTML = button.dataset.label;
  }
}

export function showAlert(el, message, type = "error") {
  el.className = "alert alert-" + type;
  el.textContent = message;
}

export function warnIfNotConfigured(el) {
  if (!configReady) {
    showAlert(el, "ยังไม่ได้ใส่ค่า Firebase ในไฟล์ js/firebase-config.js ดูขั้นตอนใน README.md", "warn");
  }
}

// จำว่าผู้ใช้ดูทัวร์ของหน้านี้แล้ว (users/{uid}.toursSeen.<key>)
export function markTourSeen(uid, key) {
  return setDoc(doc(db, "users", uid), { toursSeen: { [key]: true } }, { merge: true }).catch(() => {});
}
