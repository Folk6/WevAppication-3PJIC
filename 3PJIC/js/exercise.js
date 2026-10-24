// =====================================================================
// โปรแกรมออกกำลังกายตามเป้าหมายและสุขภาพ
// - โปรแกรมหลักเลือกจาก "เป้าหมาย" ในแบบประเมิน
// - ปรับตามโรคประจำตัวและอายุ (เบาหวาน ความดันสูง ไขมันสูง เกาต์ อายุ 60+ อายุต่ำกว่า 18)
// - ตั้งครรภ์ / โรคไต: ไม่จัดโปรแกรม แนะนำให้ปรึกษาแพทย์
// อ้างอิง: WHO Guidelines on Physical Activity and Sedentary Behaviour (2020)
// เก็บใน Firestore:
//   users/{uid}.exercise = { equip: "none"|"bottle"|"gym", days: 3|4|5, startAt, swaps: { "<วันจันทร์ YYYY-MM-DD>": [[จาก, ไป], ...] } }
//   users/{uid}/workouts/{YYYY-MM-DD} = { date, day, kind, title, minutes, sets, status: "done"|"short"|"skipped", reason?, at }
// ไม่มีการเชื่อม Firebase ในไฟล์นี้
// =====================================================================

export const WHO_SOURCE = { label: "WHO Guidelines on Physical Activity and Sedentary Behaviour (2020)", url: "https://www.who.int/publications/i/item/9789240015128" };

export const EQUIP = {
  none:   { label: "ไม่มีอุปกรณ์", sub: "ใช้น้ำหนักตัว" },
  bottle: { label: "ขวดน้ำ / ดัมเบล", sub: "ถือเพิ่มน้ำหนักได้" },
  gym:    { label: "เข้ายิม", sub: "ใช้เครื่องเล่นได้" },
};
export const DAY_CHOICES = [3, 4, 5];
export const DAY_SHORT = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
export const DAY_FULL = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
export const KIND = {
  cardio:   { label: "คาร์ดิโอ", short: "คาร์ดิโอ" },
  strength: { label: "ฝึกกล้าม", short: "กล้าม" },
  mix:      { label: "กล้าม + คาร์ดิโอ", short: "ผสม" },
  rest:     { label: "พัก", short: "พัก" },
};

// วันที่ฝึกในสัปดาห์ (0 = จันทร์) ตามจำนวนวันที่ว่าง
const LAYOUT = { 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 4, 5] };

// ---------------------------------------------------------------------
// คลังท่า: แต่ละท่ามีชื่อตามอุปกรณ์ วิธีทำ 3 ขั้น และจุดที่ต้องระวัง
// fig = ชื่อรูปท่า (วาดใน exercise-ui.js)
// ---------------------------------------------------------------------
export const MOVES = {
  squat: { fig: "squat", name: { none: "สควอต", bottle: "สควอตถือขวดน้ำ", gym: "สควอต / เลกเพรส" },
    steps: ["ยืนเท้ากว้างเท่าไหล่ ปลายเท้าชี้ออกเล็กน้อย", "ดันสะโพกไปด้านหลัง ย่อลงเหมือนนั่งเก้าอี้ ลงเท่าที่ไหว", "ดันส้นเท้าลุกขึ้น หายใจออกตอนลุก"],
    avoid: "เข่าไม่บิดเข้าด้านใน · ส้นเท้าไม่ลอย · หลังไม่งอ" },
  chairStand: { fig: "chair", name: { none: "ลุกนั่งเก้าอี้", bottle: "ลุกนั่งเก้าอี้", gym: "ลุกนั่งเก้าอี้" },
    steps: ["นั่งริมเก้าอี้ที่ไม่มีล้อ เท้าวางราบกับพื้น", "โน้มตัวไปข้างหน้าเล็กน้อย แล้วลุกขึ้นยืน หายใจออก", "ค่อย ๆ นั่งลงช้า ๆ ใช้มือช่วยได้ถ้าจำเป็น"],
    avoid: "ใช้เก้าอี้ที่มั่นคง ชิดผนัง · ไม่ทิ้งตัวลงนั่ง" },
  pushup: { fig: "pushup", name: { none: "วิดพื้น (คุกเข่าได้)", bottle: "วิดพื้น (คุกเข่าได้)", gym: "วิดพื้น / เชสต์เพรส" },
    steps: ["วางมือกว้างกว่าไหล่เล็กน้อย ลำตัวตรงตั้งแต่หัวถึงเข่าหรือเท้า", "งอศอกลดตัวลงจนอกเกือบถึงพื้น", "ดันตัวขึ้น หายใจออก"],
    avoid: "สะโพกไม่ตก ไม่โก่ง · ศอกไม่กางออกข้างมากเกินไป" },
  wallPush: { fig: "wallpush", name: { none: "ดันผนัง", bottle: "ดันผนัง", gym: "ดันผนัง" },
    steps: ["ยืนห่างผนังประมาณหนึ่งช่วงแขน วางมือที่ผนังระดับไหล่", "งอศอกให้ตัวเข้าหาผนังช้า ๆ", "ดันกลับ หายใจออกตอนดัน"],
    avoid: "ลำตัวตรง ไม่แอ่นหลัง" },
  row: { fig: "row", name: { none: "ซูเปอร์แมน (นอนคว่ำยกแขนขา)", bottle: "ดึงขวดน้ำ (โรว์)", gym: "ดึงขวดน้ำ / แลตพูลดาวน์" },
    steps: ["ก้มตัวไปข้างหน้า หลังตรง มือจับขวดน้ำหรือดัมเบล", "ดึงข้อศอกไปด้านหลังให้ชิดลำตัว บีบสะบัก", "ค่อย ๆ ลดแขนลง"],
    stepsNone: ["นอนคว่ำ แขนเหยียดไปข้างหน้า", "ยกแขน อก และขาขึ้นจากพื้นพร้อมกันเล็กน้อย ค้าง 2 วินาที", "ค่อย ๆ วางลง"],
    avoid: "หลังไม่งอ · ไม่กระชากแขน", avoidNone: "ยกแค่เล็กน้อย ไม่แอ่นหลังมาก · มองพื้นไว้" },
  lunge: { fig: "lunge", name: { none: "ลันจ์สลับขา", bottle: "ลันจ์ถือขวดน้ำ", gym: "ลันจ์ถือดัมเบล" },
    steps: ["ยืนตรง ก้าวขาหนึ่งไปข้างหน้ายาวกว่าปกติ", "ย่อตัวลงจนเข่าหลังเกือบแตะพื้น", "ดันเท้าหน้ากลับมายืน แล้วสลับขา"],
    avoid: "เข่าหน้าไม่เลยปลายเท้า · ลำตัวตั้งตรง" },
  bridge: { fig: "bridge", name: { none: "สะพานโค้ง (ยกสะโพก)", bottle: "สะพานโค้ง (วางขวดบนสะโพก)", gym: "สะพานโค้ง / ฮิปทรัสต์" },
    steps: ["นอนหงาย ชันเข่า เท้าวางราบ", "บีบก้นแล้วยกสะโพกขึ้นจนลำตัวเป็นเส้นตรง ค้าง 1 วินาที", "ค่อย ๆ ลดสะโพกลง"],
    avoid: "ไม่แอ่นหลังส่วนล่าง ใช้ก้นออกแรง" },
  press: { fig: "press", name: { none: "ยกแขนดันขึ้นเหนือศีรษะ", bottle: "ยกขวดน้ำเหนือศีรษะ", gym: "ยกดัมเบลเหนือศีรษะ" },
    steps: ["ยืนตรง ถือขวดน้ำไว้ระดับไหล่", "ดันขึ้นเหนือศีรษะจนแขนเกือบตึง หายใจออก", "ค่อย ๆ ลดลงมาที่ไหล่"],
    avoid: "ไม่แอ่นหลัง เกร็งหน้าท้องไว้" },
  calf: { fig: "calf", name: { none: "เขย่งปลายเท้า", bottle: "เขย่งปลายเท้าถือขวดน้ำ", gym: "เขย่งปลายเท้า" },
    steps: ["ยืนตรง มือจับพนักเก้าอี้หรือผนัง", "เขย่งปลายเท้าขึ้นให้สูงที่สุด ค้าง 1 วินาที", "ค่อย ๆ ลดส้นเท้าลง"],
    avoid: "ไม่โยกตัว" },
  plank: { fig: "plank", name: { none: "แพลงก์ (คุกเข่าได้)", bottle: "แพลงก์ (คุกเข่าได้)", gym: "แพลงก์" },
    steps: ["วางศอกใต้ไหล่ ยกตัวขึ้นให้ลำตัวตรง", "เกร็งหน้าท้องและก้น หายใจตามปกติ", "ค้างไว้ตามเวลา แล้ววางเข่าลงพัก"],
    avoid: "สะโพกไม่ตกหรือยกสูง · ไม่กลั้นหายใจ" },
  deadbug: { fig: "deadbug", name: { none: "เดดบัก (นอนหงายยืดแขนขาสลับ)", bottle: "เดดบัก", gym: "เดดบัก" },
    steps: ["นอนหงาย ยกแขนชี้เพดาน งอเข่า 90 องศา", "เหยียดแขนซ้ายและขาขวาออกช้า ๆ หายใจออก", "กลับมาท่าเดิม แล้วสลับข้าง"],
    avoid: "หลังส่วนล่างแนบพื้นตลอด" },
  balance: { fig: "balance", name: { none: "ยืนขาเดียว (จับเก้าอี้)", bottle: "ยืนขาเดียว (จับเก้าอี้)", gym: "ยืนขาเดียว (จับเก้าอี้)" },
    steps: ["ยืนข้างเก้าอี้ มือจับพนักไว้", "ยกเท้าข้างหนึ่งขึ้นจากพื้น ค้างไว้", "สลับข้าง เมื่อมั่นใจแล้วลองจับด้วยนิ้วเดียว"],
    avoid: "ทำข้างเก้าอี้หรือผนังเสมอ ใส่รองเท้าพื้นไม่ลื่น" },
};


// ---------------------------------------------------------------------
// ท่าเสริม (ชื่อเดียวกันทุกอุปกรณ์) — อบอุ่น/คลายกล้ามเนื้อ, ยืดคลายออฟฟิศ, คาร์ดิโอในบ้าน,
// ท่ายากขึ้นระดับ 2, เครื่องในยิม, ทรงตัวสำหรับวัย 60+, กระโดดเสริมกระดูกสำหรับวัยรุ่น
// ---------------------------------------------------------------------
const X = (fig, name, steps, avoid) => ({ fig, name: { none: name, bottle: name, gym: name }, steps, avoid });
Object.assign(MOVES, {
  // อบอุ่นร่างกาย
  march: X("march", "ย่ำเท้าแกว่งแขน", ["ยืนตรง ย่ำเท้าอยู่กับที่", "ยกเข่าสูงขึ้นเรื่อย ๆ แกว่งแขนตาม", "หายใจตามปกติ ให้ตัวเริ่มอุ่น"], "ไม่ต้องเร็ว แค่ให้ตัวอุ่น"),
  armCircle: X("armcircle", "หมุนแขน", ["กางแขนออกข้างระดับไหล่", "หมุนแขนเป็นวงเล็ก ๆ ไปข้างหน้า แล้วค่อย ๆ ขยายวง", "หมุนกลับทางเดิม"], "ไม่เหวี่ยงแรง"),
  hipCircle: X("hipcircle", "หมุนสะโพก", ["ยืนเท้ากว้างเท่าไหล่ มือเท้าเอว", "หมุนสะโพกเป็นวงกลมช้า ๆ", "สลับทิศทาง"], "หมุนช้า ๆ ไม่ให้ปวดหลัง"),
  // คลายกล้ามเนื้อ
  quadStretch: X("quad", "ยืดต้นขาด้านหน้า", ["ยืนจับผนังหรือเก้าอี้", "งอเข่า จับข้อเท้าดึงส้นเท้าเข้าหาก้น", "ค้างไว้ แล้วสลับข้าง"], "เข่าชิดกัน ไม่แอ่นหลัง"),
  hamStretch: X("ham", "ยืดต้นขาด้านหลัง", ["ยืนวางส้นเท้าข้างหนึ่งไปข้างหน้า ปลายเท้าชี้ขึ้น", "พับตัวจากสะโพกไปข้างหน้า หลังตรง", "ค้างไว้ แล้วสลับข้าง"], "ไม่กดเข่า ไม่เด้งตัว"),
  chestStretch: X("chest", "ยืดอกและไหล่", ["ประสานมือไว้ด้านหลัง", "ยืดแขนลงและเปิดอกขึ้น", "หายใจลึก ๆ ค้างไว้"], "ไม่แอ่นคอ"),
  calfStretch: X("calfst", "ยืดน่อง", ["ยืนหันหน้าเข้าผนัง ก้าวขาหนึ่งไปด้านหลัง", "ส้นเท้าหลังแนบพื้น ดันสะโพกไปข้างหน้า", "ค้างไว้ แล้วสลับข้าง"], "ส้นเท้าหลังไม่ยก"),
  // ยืดคลายสำหรับคนนั่งนาน
  neck: X("neck", "ยืดคอด้านข้าง", ["นั่งหลังตรง", "เอียงศีรษะไปทางไหล่ขวา ใช้มือช่วยกดเบา ๆ", "ค้างไว้ แล้วสลับข้าง"], "กดเบา ๆ ไม่หมุนคอแรง"),
  shoulderRoll: X("shoulder", "หมุนไหล่", ["นั่งหรือยืนตรง", "ยกไหล่ขึ้นหาหู แล้วหมุนไปด้านหลังและลง", "ทำช้า ๆ ต่อเนื่อง"], "ไม่ยกไหล่ค้างนาน"),
  twist: X("twist", "บิดลำตัวบนเก้าอี้", ["นั่งเต็มเก้าอี้ เท้าวางราบ", "บิดลำตัวไปด้านขวา มือจับพนักเก้าอี้", "ค้างไว้ แล้วสลับข้าง"], "บิดเท่าที่สบาย หลังตรง"),
  hipFlexor: X("hipflex", "ยืดสะโพกด้านหน้า", ["ก้าวขาไปข้างหน้า คุกเข่าหลังลงพื้น", "ดันสะโพกไปข้างหน้าเบา ๆ จนรู้สึกตึงหน้าสะโพก", "ค้างไว้ แล้วสลับข้าง"], "ลำตัวตั้งตรง ไม่แอ่นหลัง"),
  catCow: X("catcow", "แมว-วัว (ยืดหลัง)", ["คลานสี่ขา มือใต้ไหล่ เข่าใต้สะโพก", "หายใจเข้า แอ่นหลังเงยหน้า", "หายใจออก โก่งหลังก้มหน้า สลับช้า ๆ"], "ทำช้า ๆ ตามลมหายใจ"),
  // คาร์ดิโอในบ้าน (มีแรงกระแทก)
  jumpingJack: X("jack", "กระโดดตบ", ["ยืนตรง แขนแนบลำตัว", "กระโดดกางขา พร้อมยกแขนขึ้นเหนือศีรษะ", "กระโดดกลับท่าเดิม ทำต่อเนื่อง"], "ลงเบา ๆ ด้วยปลายเท้า"),
  highKnee: X("highknee", "วิ่งยกเข่าอยู่กับที่", ["ยืนตรง", "วิ่งอยู่กับที่ ยกเข่าสูงระดับสะโพก", "แกว่งแขนตาม"], "ลำตัวตั้งตรง ลงเบา ๆ"),
  climber: X("climber", "ปีนเขา (Mountain climber)", ["ตั้งท่าวิดพื้น แขนตรง", "ดึงเข่าเข้าหาอกสลับซ้ายขวาเร็ว ๆ", "สะโพกอยู่ระดับเดียวกับไหล่"], "ไม่ยกก้นสูง"),
  // คาร์ดิโอในบ้าน (ไม่กระแทก)
  stepJack: X("stepjack", "ก้าวแตะข้างยกแขน", ["ยืนตรง แขนแนบลำตัว", "ก้าวเท้าออกด้านข้าง พร้อมยกแขนขึ้นเหนือศีรษะ", "ก้าวกลับ แล้วสลับข้าง"], "ไม่ต้องกระโดด"),
  kneeMarch: X("march", "ย่ำยกเข่าสูง", ["ยืนตรง จับเก้าอี้ได้ถ้าต้องการ", "ยกเข่าขึ้นสลับซ้ายขวาให้สูงเท่าที่ไหว", "แกว่งแขนตาม"], "ลำตัวตั้งตรง"),
  punch: X("punch", "ชกลม", ["ยืนเท้ากว้างเท่าไหล่ ย่อเข่าเล็กน้อย", "ชกแขนไปข้างหน้าสลับซ้ายขวาเร็ว ๆ", "บิดลำตัวตามแรงชก"], "ไม่เหยียดศอกสุดแรง"),
  sideStep: X("sidestep", "ก้าวข้างย่อตัว", ["ยืนย่อเข่าเล็กน้อย", "ก้าวไปทางขวา 2 ก้าว แล้วกลับทางซ้าย 2 ก้าว", "ทำต่อเนื่อง แกว่งแขนตาม"], "ไม่ลากเท้า"),
  // ระดับ 2 (เพิ่มกล้าม)
  pushupFull: X("pushup", "วิดพื้นเต็มตัว", ["วางมือกว้างกว่าไหล่ เหยียดขาตรง ปลายเท้าแตะพื้น", "ลดตัวลงจนอกเกือบถึงพื้น", "ดันขึ้น หายใจออก"], "ลำตัวตรงตั้งแต่หัวถึงส้นเท้า"),
  splitSquat: X("split", "สปลิตสควอต (เท้าหลังพาดเก้าอี้)", ["ยืนหันหลังให้เก้าอี้ วางหลังเท้าข้างหนึ่งบนเก้าอี้", "ย่อตัวลงจนต้นขาหน้าขนานพื้น", "ดันส้นเท้าหน้าขึ้น ทำครบแล้วสลับข้าง"], "เข่าหน้าไม่เลยปลายเท้า · ทรงตัวให้ดี"),
  singleBridge: X("bridge", "สะพานโค้งขาเดียว", ["นอนหงาย ชันเข่า ยกขาข้างหนึ่งเหยียดตรง", "ยกสะโพกขึ้นด้วยขาที่เหลือ ค้าง 1 วินาที", "ลดลง ทำครบแล้วสลับข้าง"], "สะโพกไม่เอียง"),
  // เครื่องในยิม
  legPress: X("legpress", "เลกเพรส (Leg press)", ["นั่งพิงเบาะ วางเท้าบนแป้นกว้างเท่าไหล่", "งอเข่าลดแป้นลงช้า ๆ", "ดันแป้นกลับ ไม่ล็อกเข่า"], "หลังและก้นแนบเบาะ · ปรับน้ำหนักให้ทำครบจำนวนครั้งได้"),
  chestPress: X("chestpress", "เชสต์เพรส (Chest press)", ["ปรับเบาะให้มือจับอยู่ระดับอก", "ดันมือจับออกไปข้างหน้า หายใจออก", "ค่อย ๆ กลับ"], "ไม่ล็อกศอก · หลังแนบเบาะ"),
  latPulldown: X("lat", "แลตพูลดาวน์ (Lat pulldown)", ["นั่งล็อกเข่าใต้เบาะ จับบาร์กว้างกว่าไหล่", "ดึงบาร์ลงมาที่อกบน บีบสะบัก", "ปล่อยขึ้นช้า ๆ"], "ไม่เอนตัวไปด้านหลังมาก · ไม่ดึงลงหลังคอ"),
  shoulderPress: X("press", "ชอลเดอร์เพรส (เครื่อง)", ["นั่งหลังพิงเบาะ จับมือจับระดับไหล่", "ดันขึ้นเหนือศีรษะ หายใจออก", "ค่อย ๆ ลดลง"], "ไม่แอ่นหลัง"),
  // ทรงตัว (60+)
  heelToe: X("heeltoe", "เดินต่อส้นเท้า", ["ยืนข้างผนัง มือแตะผนังไว้", "ก้าวเท้าให้ส้นเท้าหน้าชิดปลายเท้าหลัง", "เดินไปข้างหน้า 10 ก้าว แล้วเดินกลับ"], "ทำข้างผนังเสมอ มองไปข้างหน้า"),
  sideLeg: X("sideleg", "ยกขาด้านข้าง (จับเก้าอี้)", ["ยืนข้างเก้าอี้ มือจับพนัก", "ยกขาข้างไกลเก้าอี้ออกด้านข้างช้า ๆ", "ลดลง ทำครบแล้วสลับข้าง"], "ลำตัวตรง ไม่เอียงตัว"),
  // กระโดดเสริมกระดูก (วัยรุ่น)
  jumpRope: X("rope", "กระโดดเชือก (หรือกระโดดเบา ๆ อยู่กับที่)", ["ยืนตรง ศอกชิดลำตัว", "กระโดดเบา ๆ ด้วยปลายเท้า หมุนข้อมือ", "ลงเบา ๆ ทำต่อเนื่อง"], "ลงด้วยปลายเท้า งอเข่าเล็กน้อย"),
  hop: X("hop", "กระโดดซ้าย-ขวา", ["ยืนเท้าชิด", "กระโดดข้ามเส้นสมมติไปทางซ้าย แล้วกลับทางขวา", "ทำต่อเนื่อง"], "ลงเบา ๆ เข่างอเล็กน้อย"),
});
MOVES.pushup.next = "pushupFull";
MOVES.squat.next = "splitSquat";
MOVES.bridge.next = "singleBridge";
const GYM = { squat: "legPress", pushup: "chestPress", row: "latPulldown", press: "shoulderPress" };

// ชุดอบอุ่น/คลายกล้ามเนื้อ/ยืดคลาย และคาร์ดิโอในบ้าน
const WARMUP = [["march", "1 นาที"], ["armCircle", "30 วินาที"], ["hipCircle", "30 วินาที"], ["march", "1 นาที เร็วขึ้น"]];
const COOLDOWN = [["quadStretch", "20 วินาที/ข้าง"], ["hamStretch", "20 วินาที/ข้าง"], ["chestStretch", "20 วินาที"], ["calfStretch", "20 วินาที/ข้าง"]];
const DESK = [["neck", "20 วินาที/ข้าง"], ["shoulderRoll", "10 ครั้ง"], ["twist", "20 วินาที/ข้าง"], ["hipFlexor", "30 วินาที/ข้าง"], ["catCow", "10 ครั้ง"], ["hamStretch", "20 วินาที/ข้าง"]];
const CIRCUIT_IMPACT = ["jumpingJack", "highKnee", "climber", "punch"];
const CIRCUIT_LOW = ["stepJack", "kneeMarch", "punch", "sideStep"];
export function simpleMove(id, dose) {
  const m = MOVES[id];
  return { id, fig: m.fig, name: m.name.none, dose, steps: m.steps, avoid: m.avoid };
}

// ชุดท่าของแต่ละวัน (ก่อนปรับตามสุขภาพ)
const SESSIONS = {
  A:     { title: "ฝึกกล้ามทั้งตัว A", moves: ["squat", "pushup", "row", "bridge", "plank"] },
  B:     { title: "ฝึกกล้ามทั้งตัว B", moves: ["lunge", "pushup", "row", "press", "deadbug"] },
  upper: { title: "ฝึกกล้ามช่วงบน", moves: ["pushup", "row", "press", "plank"] },
  lower: { title: "ฝึกกล้ามช่วงล่าง", moves: ["squat", "lunge", "bridge", "calf"] },
};

// ---------------------------------------------------------------------
// วันที่
// ---------------------------------------------------------------------
const pad = (n) => String(n).padStart(2, "0");
export const isoDate = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
export const dayIndex = (d = new Date()) => (d.getDay() + 6) % 7; // 0 = จันทร์
export function mondayOf(d = new Date()) {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - dayIndex(m));
  return m;
}
export function weekDates(d = new Date()) {
  const m = mondayOf(d);
  return [...Array(7)].map((_, i) => { const x = new Date(m); x.setDate(m.getDate() + i); return x; });
}
const toDate = (v) => (v?.toDate ? v.toDate() : v instanceof Date ? v : v ? new Date(v) : null);

// ---------------------------------------------------------------------
// ใครได้โปรแกรมแบบไหน
// ---------------------------------------------------------------------
export function exerciseBlocked(profile) {
  if (profile.pregnant) return { title: "ควรให้แพทย์แนะนำการออกกำลังกาย", text: "ช่วงตั้งครรภ์และให้นมบุตร การออกกำลังกายที่เหมาะสมขึ้นกับอายุครรภ์และสุขภาพของแต่ละคน ควรปรึกษาแพทย์ที่ฝากครรภ์ก่อน" };
  if ((profile.conditions || []).includes("kidney")) return { title: "ควรให้แพทย์แนะนำการออกกำลังกาย", text: "ผู้ที่เป็นโรคไต ความหนักของการออกกำลังกายขึ้นกับระยะของโรคและผลเลือด ควรให้แพทย์ประเมินก่อน" };
  return null;
}
// ระหว่างรอแพทย์: คำแนะนำทั่วไป ไม่ใช่โปรแกรม
export const BLOCKED_TIPS = ["ลุกเดินหรือขยับตัวทุก 1 ชั่วโมง ลดการนั่งนาน", "เดินช้า ๆ หรือยืดเหยียดเบา ๆ เท่าที่สบายตัว", "หยุดทันทีถ้าเวียนหัว เจ็บหน้าอก หายใจไม่ทัน หรือมีอาการผิดปกติ"];

function track(profile) {
  if (profile.age < 18) return "youth";
  if (profile.goal === "lose") return "lose";
  if (profile.goal === "muscle" || profile.goal === "gain") return "muscle";
  return "health";
}
const TRACK_NAME = { lose: "ลดน้ำหนัก", muscle: "เพิ่มกล้ามเนื้อ", health: "สุขภาพแข็งแรง", youth: "วัยรุ่นแข็งแรง" };

export function defaultSettings(profile) {
  const t = track(profile);
  return { equip: "none", days: t === "muscle" ? 3 : 5 };
}

// สัปดาห์ที่เท่าไรของโปรแกรม (เริ่ม 1)
export function weekNo(settings, now = new Date()) {
  const s = toDate(settings && settings.startAt);
  if (!s) return 1;
  return Math.max(1, Math.floor((mondayOf(now) - mondayOf(s)) / (7 * 86400000)) + 1);
}

// ---------------------------------------------------------------------
// สร้างโปรแกรม 1 สัปดาห์
//   คืนค่า { blocked } หรือ { name, why[], target, notes[], days[7], level, week }
//   days[i] = { kind, title, detail, minutes, cardioMin, moves[{ id, name, dose, sets, reps, secs, rest, steps, avoid, fig }], restTip }
// ---------------------------------------------------------------------
export function buildProgram(profile, settings, now = new Date()) {
  const blocked = exerciseBlocked(profile);
  if (blocked) return { blocked };

  const st = Object.assign(defaultSettings(profile), settings || {});
  const t = track(profile);
  const cond = profile.conditions || [];
  const senior = profile.age >= 60;
  const hyper = cond.includes("hypertension");
  const diabetes = cond.includes("diabetes");
  const gout = cond.includes("gout");
  const lipid = cond.includes("lipid");
  const gentle = senior || hyper; // ใช้ท่าเบาและเลี่ยงการเกร็งค้าง
  const bmi = profile.weight && profile.height ? profile.weight / (profile.height / 100) ** 2 : 0;
  const lowImpact = senior || gout || bmi >= 30; // ไม่กระโดด ลดแรงกระแทกข้อเข่า
  const sedentary = String(profile.activity) === "1.2";
  const week = weekNo(st, now);
  const fit = Number(profile.activity) >= 1.55;
  const level = week >= 5 || fit ? 2 : 1; // ทำครบ 4 สัปดาห์ หรือออกกำลังกายประจำอยู่แล้ว = ระดับ 2
  const days = LAYOUT[st.days] || LAYOUT[5];

  // ---- ชนิดของแต่ละวันฝึก ----
  let plan;
  if (t === "youth") {
    plan = st.days === 3 ? ["mixA", "mixB", "mixA"] : st.days === 4 ? ["mixA", "cardio", "mixB", "mixA"] : ["mixA", "cardio", "mixB", "cardio", "mixA"];
  } else if (t === "muscle") {
    plan = st.days === 3 ? (week % 2 ? ["A", "B", "A"] : ["B", "A", "B"]) : st.days === 4 ? ["upper", "lower", "upper", "lower"] : ["upper", "lower", "cardio", "upper", "lower"];
  } else {
    plan = st.days === 3 ? ["mixA", "cardio", "mixB"] : st.days === 4 ? ["cardio", "A", "cardio", "B"] : ["cardio", "A", "cardio", "B", "cardio"];
  }

  // ---- นาทีคาร์ดิโอต่อสัปดาห์ (WHO: ผู้ใหญ่ 150–300 นาที, วัยรุ่น 60 นาที/วัน) ----
  const weekly = t === "lose" ? (week >= 9 ? 250 : week >= 5 ? 200 : 150) : t === "muscle" ? 60 : t === "youth" ? 300 : 150;
  const nCardio = plan.filter((x) => x === "cardio").length;
  const nMix = plan.filter((x) => x.startsWith("mix")).length;
  const mixCardio = 30;
  const r5 = (x) => Math.round(x / 5) * 5;
  const cardioMin = nCardio ? Math.min(60, Math.max(20, r5((weekly - nMix * mixCardio) / nCardio))) : 0;

  // ---- ขนาดของเซต ----
  const dose = t === "muscle"
    ? { sets: level === 2 ? 3 : 2, reps: "8–12", rest: 75, hold: level === 2 ? 40 : 30 }
    : { sets: level === 2 ? 3 : 2, reps: "12–15", rest: 45, hold: level === 2 ? 30 : 20 };
  if (gentle) { dose.sets = 2; dose.reps = "10–15"; dose.rest = 60; dose.hold = 20; }
  if (t === "youth") { dose.reps = "10–15"; }

  // ---- ปรับท่าตามสุขภาพ ----
  function swapMove(id) {
    if (senior && id === "squat") return "chairStand";
    if (senior && id === "lunge") return "calf";
    if (senior && id === "pushup") return "wallPush";
    if (senior && id === "plank") return "balance";
    if (hyper && id === "plank") return "deadbug"; // เลี่ยงการเกร็งค้าง
    if (hyper && id === "press") return "row";      // เลี่ยงยกเหนือศีรษะ
    if (gout && id === "lunge") return "bridge";    // ลดแรงกระแทกที่ข้อเท้า/เข่า
    if (st.equip === "gym" && !senior && GYM[id]) return GYM[id]; // ใช้เครื่องจริงในยิม
    if (t === "muscle" && level === 2 && !gentle && st.equip !== "gym" && MOVES[id].next) return MOVES[id].next; // ระดับ 2: ท่ายากขึ้น
    return id;
  }
  const eq = st.equip;
  function moveList(ids) {
    const seen = new Set();
    const out = [];
    ids.map(swapMove).forEach((id) => {
      if (seen.has(id)) return; seen.add(id);
      const m = MOVES[id];
      const timed = id === "plank" || id === "balance";
      const each = ["lunge", "balance", "deadbug", "splitSquat", "singleBridge", "sideLeg"].includes(id) ? "/ข้าง" : "";
      const reps = timed ? dose.hold + " วินาที" + each : dose.reps + " ครั้ง" + each;
      out.push({ id, fig: id === "row" && eq === "none" ? "superman" : m.fig, name: m.name[eq], sets: dose.sets, reps, rest: dose.rest, dose: dose.sets + " เซต × " + reps,
        steps: id === "row" && eq === "none" ? m.stepsNone : m.steps, avoid: id === "row" && eq === "none" ? m.avoidNone : m.avoid });
    });
    const extra = (id, sets, reps, rest) => { if (seen.has(id)) return; seen.add(id); const m = MOVES[id]; out.push({ id, fig: m.fig, name: m.name[eq], sets, reps, rest, dose: sets + " เซต × " + reps, steps: m.steps, avoid: m.avoid }); };
    // วัย 60+: ฝึกทรงตัวทุกครั้ง (WHO แนะนำ 3 วัน/สัปดาห์ขึ้นไป)
    if (senior) { extra("balance", 2, "20 วินาที/ข้าง", 30); extra(ids.includes("lunge") ? "heelToe" : "sideLeg", 2, ids.includes("lunge") ? "10 ก้าว ไป-กลับ" : "10 ครั้ง/ข้าง", 30); }
    // วัยรุ่น: กระโดดเสริมความแข็งแรงของกระดูก (WHO แนะนำ 3 วัน/สัปดาห์)
    if (t === "youth" && !lowImpact) { extra("jumpRope", 2, "45 วินาที", 45); extra("hop", 2, "20 ครั้ง", 45); }
    return out;
  }

  const cardioIdeas = gout || senior ? "เดินเร็ว ปั่นจักรยาน หรือว่ายน้ำ (แรงกระแทกต่ำ)" : t === "youth" ? "เล่นกีฬา วิ่ง ปั่นจักรยาน เต้น หรือว่ายน้ำ" : "เดินเร็ว ปั่นจักรยาน เต้นแอโรบิก หรือว่ายน้ำ";
  const restTip = diabetes ? "เดินหลังอาหารเย็น 10–15 นาที ช่วยคุมน้ำตาลหลังมื้อ" : t === "youth" ? "ออกไปเล่นหรือเดินเล่น ลดเวลาหน้าจอ" : "พักให้กล้ามเนื้อฟื้นตัว เดินเล่นหรือยืดเหยียดเบา ๆ ได้";

  const warmup = WARMUP.map(([id, d]) => simpleMove(id, d));
  const cooldown = COOLDOWN.map(([id, d]) => simpleMove(id, d));
  const circuitIds = lowImpact || hyper ? CIRCUIT_LOW : CIRCUIT_IMPACT;
  const circuit = (min) => ({ moves: circuitIds.map((id) => simpleMove(id, "40 วินาที")), work: 40, rest: 20, rounds: Math.min(6, Math.max(2, Math.round(min / circuitIds.length))), low: circuitIds === CIRCUIT_LOW });
  const desk = DESK.map(([id, d]) => simpleMove(id, d));
  const restDay = () => sedentary
    ? { kind: "rest", title: "พัก + ยืดคลายกล้ามเนื้อ", detail: "คุณนั่งนานเกือบทั้งวัน ลองยืดคอ บ่า หลัง สะโพก 6 ท่า ประมาณ 10 นาที" + (diabetes ? " และเดินหลังอาหารเย็น 10–15 นาที" : ""), minutes: 0, cardioMin: 0, moves: [], stretch: desk, restTip }
    : { kind: "rest", title: "พัก", detail: restTip, minutes: 0, cardioMin: 0, moves: [], restTip };
  const week7 = [...Array(7)].map(restDay);
  days.forEach((d, i) => {
    const p = plan[i];
    if (p === "cardio") {
      week7[d] = { kind: "cardio", title: "คาร์ดิโอ", detail: cardioMin + " นาที · " + cardioIdeas + " หรือทำชุดคาร์ดิโอในบ้าน", minutes: cardioMin, cardioMin, moves: [], ideas: cardioIdeas, circuit: circuit(cardioMin), warmup, cooldown };
    } else if (p.startsWith("mix")) {
      const ses = SESSIONS[p === "mixA" ? "A" : "B"];
      const moves = moveList(ses.moves);
      const sMin = r5(moves.length * dose.sets * 1.5 + 5);
      week7[d] = { kind: "mix", title: ses.title + " + คาร์ดิโอ", detail: moves.length + " ท่า × " + dose.sets + " เซต แล้วต่อด้วยคาร์ดิโอ " + mixCardio + " นาที", minutes: sMin + mixCardio, cardioMin: mixCardio, moves, ideas: cardioIdeas, circuit: circuit(mixCardio), warmup, cooldown };
    } else {
      const ses = SESSIONS[p];
      const moves = moveList(ses.moves);
      const sMin = r5(moves.length * dose.sets * (dose.rest / 60 + 1) + 10);
      week7[d] = { kind: "strength", title: ses.title, detail: moves.length + " ท่า × " + dose.sets + " เซต · ประมาณ " + sMin + " นาที", minutes: sMin, cardioMin: 0, moves, warmup, cooldown };
    }
  });

  // ---- เหตุผลและข้อควรระวัง ----
  const why = [];
  why.push(t === "youth" ? "อายุต่ำกว่า 18 ปี WHO แนะนำให้ขยับร่างกายวันละ 60 นาที และฝึกกล้ามเนื้อ 3 วันต่อสัปดาห์"
    : "เป้าหมายในแบบประเมินคือ \"" + { lose: "ลดน้ำหนัก", muscle: profile.goal === "gain" ? "เพิ่มน้ำหนัก" : "เพิ่มกล้ามเนื้อ", health: profile.goal === "keep" ? "คุมน้ำหนักให้คงที่" : "สุขภาพดีขึ้น" }[t] + "\"");
  why.push("ระดับ " + level + (level === 1 ? " (เริ่มต้น) จะขยับเป็นระดับ 2 หลังทำครบ 4 สัปดาห์" : " เพิ่มจำนวนเซตแล้ว"));
  why.push("ทุกวันฝึกมีอบอุ่นร่างกาย 3 นาทีก่อนเริ่ม และยืดเหยียด 3 นาทีหลังจบ");
  why.push("ว่าง " + st.days + " วันต่อสัปดาห์ · " + EQUIP[eq].label);
  const cardioTotal = nCardio * cardioMin + nMix * mixCardio;
  if (t !== "muscle" && t !== "youth" && cardioTotal < 150) why.push("ถ้าว่างเพิ่มเป็น 5 วัน จะได้คาร์ดิโอครบ 150 นาทีต่อสัปดาห์ตามคำแนะนำของ WHO");
  if (senior) why.push("อายุ 60 ปีขึ้นไป เพิ่มท่าทรงตัวและใช้เก้าอี้ช่วยทุกท่า");
  if (t === "youth" && !lowImpact) why.push("เพิ่มท่ากระโดดเบา ๆ ช่วยเสริมความแข็งแรงของกระดูกตามคำแนะนำของ WHO");
  if (lowImpact && !senior) why.push(bmi >= 30 ? "ดัชนีมวลกายตั้งแต่ 30 ขึ้นไป เลือกคาร์ดิโอแบบไม่กระแทกเพื่อถนอมข้อเข่า" : "เลือกคาร์ดิโอแบบไม่กระแทกเพื่อถนอมข้อ");
  if (sedentary) why.push("นั่งเกือบทั้งวัน วันพักจึงมีท่ายืดคลาย คอ บ่า หลัง สะโพก");
  if (t === "muscle" && level === 2 && !gentle && st.equip !== "gym") why.push("ระดับ 2 เปลี่ยนเป็นท่าที่ยากขึ้น เช่น วิดพื้นเต็มตัว สปลิตสควอต");
  if (st.equip === "gym" && !senior) why.push("เข้ายิม ใช้เครื่องเล่น เช่น เลกเพรส เชสต์เพรส แลตพูลดาวน์");

  const notes = [];
  if (diabetes) notes.push({ title: "เบาหวาน", text: "พกลูกอมหรือน้ำผลไม้ติดตัว ถ้าใจสั่น เหงื่อออก ตาลาย ให้หยุดและกินทันที ไม่ควรหยุดออกกำลังกายเกิน 2 วันติด และตรวจดูเท้าหลังออกกำลังกาย" });
  if (hyper) notes.push({ title: "ความดันโลหิตสูง", text: "หายใจออกตอนออกแรงทุกครั้ง ห้ามกลั้นหายใจเบ่ง ไม่ยกของหนัก ถ้าปวดหัวมากหรือแน่นหน้าอกให้หยุดทันที" });
  if (lipid) notes.push({ title: "ไขมันในเลือดสูง", text: "คาร์ดิโอสม่ำเสมอทุกสัปดาห์ช่วยเพิ่มไขมันดี (HDL) ทำต่อเนื่องสำคัญกว่าทำหนัก" });
  if (gout) notes.push({ title: "เกาต์", text: "เลือกท่าที่แรงกระแทกต่ำ ช่วงที่ข้ออักเสบ บวม แดง ร้อน ให้พักจนหาย และดื่มน้ำมาก ๆ" });
  if (profile.conditionOther) notes.push({ title: "โรคประจำตัวอื่น: " + profile.conditionOther, text: "แอปยังไม่ได้ปรับโปรแกรมตามโรคนี้ ควรถามแพทย์ก่อนว่าออกกำลังกายระดับไหนปลอดภัย แล้วเริ่มจากเบา ๆ" });
  if (senior) notes.push({ title: "วัย 60 ปีขึ้นไป", text: "ทำข้างเก้าอี้หรือผนังเสมอ ใส่รองเท้าพื้นไม่ลื่น ค่อย ๆ ลุกเพื่อกันหน้ามืด" });

  const strengthDays = week7.filter((d) => d.kind === "strength" || d.kind === "mix").length;
  const target = t === "muscle"
    ? "ฝึกกล้าม " + strengthDays + " วัน × " + dose.sets + " เซต × " + dose.reps + " ครั้ง · พักเซต " + dose.rest + " วินาที"
    : "คาร์ดิโอรวม " + cardioTotal + " นาที/สัปดาห์ + ฝึกกล้าม " + strengthDays + " วัน";

  return { name: TRACK_NAME[t] + " · ระดับ " + level, track: t, why, target, notes, days: week7, level, week, settings: st };
}

// สลับวันตามที่ผู้ใช้เลื่อนไว้ (เฉพาะสัปดาห์นี้)
export function applySwaps(days, settings, now = new Date()) {
  const key = isoDate(mondayOf(now));
  const list = (settings && settings.swaps && settings.swaps[key]) || [];
  const out = days.slice();
  // ใช้เฉพาะการเลื่อนที่ยังถูกต้อง (ย้ายวันฝึกไปวันพัก) เผื่อผู้ใช้เปลี่ยนจำนวนวันภายหลัง
  list.forEach(([a, b]) => { if (!out[a] || !out[b] || out[a].kind === "rest" || out[b].kind !== "rest") return; const t = out[a]; out[a] = out[b]; out[b] = t; });
  return out;
}

// วันพักถัดไปในสัปดาห์นี้ (สำหรับ "เลื่อน")
export function nextRestDay(days, from) {
  for (let i = from + 1; i < 7; i++) if (days[i].kind === "rest") return i;
  return -1;
}

// สรุปสัปดาห์จากบันทึก: logs = { "YYYY-MM-DD": { status, minutes } }
export function weekSummary(days, logs, now = new Date()) {
  const dates = weekDates(now).map(isoDate);
  const planned = days.map((d, i) => (d.kind !== "rest" ? i : -1)).filter((i) => i >= 0);
  let done = 0, minutes = 0;
  dates.forEach((iso) => {
    const l = logs[iso];
    if (l && (l.status === "done" || l.status === "short")) { minutes += l.minutes || 0; }
  });
  planned.forEach((i) => { const l = logs[dates[i]]; if (l && (l.status === "done" || l.status === "short")) done++; });
  return { planned: planned.length, done, minutes, pct: planned.length ? Math.round((done / planned.length) * 100) : 0 };
}

// นับสัปดาห์ติดต่อกันที่ทำได้อย่างน้อย 80% ของแผน (ไม่นับสัปดาห์นี้ถ้ายังไม่จบ)
export function streakWeeks(days, logsAll, now = new Date()) {
  let n = 0;
  for (let w = 1; w <= 52; w++) {
    const d = new Date(mondayOf(now)); d.setDate(d.getDate() - 7 * w);
    const s = weekSummary(days, logsAll, d);
    if (s.planned && s.done / s.planned >= 0.8) n++; else break;
  }
  const cur = weekSummary(days, logsAll, now);
  if (cur.planned && cur.done >= cur.planned) n++;
  return n;
}
