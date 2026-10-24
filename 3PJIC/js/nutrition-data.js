// =====================================================================
// ตัวเลขสารอาหารต่อ 100 กรัม (ส่วนที่กินได้) จากฐานข้อมูลองค์ประกอบอาหารไทย (Thai FCD)
// สถาบันโภชนาการ มหาวิทยาลัยมหิดล ไฟล์ PDF/ตารางที่ค้นมาอยู่ในโฟลเดอร์ ข้อมูล/<หมวด>
// รูปแบบ: id เมนู: { code: รหัสใน Thai FCD, fcdName: ชื่อรายการ, n: { kcal, p, f, c, sugar, fiber, na } }
// unit: "มล." = ค่าต่อ 100 มิลลิลิตร (เครื่องดื่ม) ถ้าไม่มี = ต่อ 100 กรัม
// ค่า null = ฐานข้อมูลไม่มีค่านี้
// =====================================================================
export const FCD_SOURCE = { name: "ฐานข้อมูลองค์ประกอบอาหารไทย (Thai FCD) สถาบันโภชนาการ ม.มหิดล", url: "https://inmu2.mahidol.ac.th/thaifcd/" };
// ตารางแสดงคุณค่าทางโภชนาการของอาหารไทย (กรมอนามัย 2561): รายการที่มี source: "doh"
//   basis: "serving" = ตัวเลขเป็นค่าต่อ 1 หน่วยบริโภค (servingText) ไม่ใช่ต่อ 100 กรัม
export const DOH_SOURCE = { name: "ตารางแสดงคุณค่าทางโภชนาการของอาหารไทย (สำนักโภชนาการ กรมอนามัย 2561)", url: "https://nutrition2.anamai.moph.go.th/th/thai-food-composition-table" };
// USDA FoodData Central (กระทรวงเกษตรสหรัฐฯ): รายการที่มี source: "usda" ใช้กับของที่สูตรเหมือนกันทั่วโลก
export const USDA_SOURCE = { name: "USDA FoodData Central", url: "https://fdc.nal.usda.gov/" };
export const NUTRITION = {
 "thapthim": {"source": "usda", "code": "FDC 169134", "fcdName": "Pomegranates, raw (คาร์โบไฮเดรตหักใยอาหารแล้ว)", "n": {"kcal": 83, "p": 1.67, "f": 1.17, "c": 14.7, "sugar": 13.7, "fiber": 4.0, "na": 3}},
 "nam-ad-lom": {"source": "usda", "code": "FDC 174852", "fcdName": "Beverages, carbonated, cola, regular", "n": {"kcal": 42, "p": 0, "f": 0.25, "c": 10.4, "sugar": 9.94, "fiber": 0, "na": 3}},
 "nom-khon-wan": {"source": "usda", "code": "FDC 171275", "fcdName": "Milk, canned, condensed, sweetened", "n": {"kcal": 321, "p": 7.91, "f": 8.7, "c": 54.4, "sugar": 54.4, "fiber": 0, "na": 127}},
 "cha-nom-khai-muk": {"source": "usda", "code": "FDC 2710508", "fcdName": "Tea, bubble (คาร์โบไฮเดรตหักใยอาหารแล้ว)", "n": {"kcal": 55, "p": 0.39, "f": 1.39, "c": 10.25, "sugar": 3.5, "fiber": 0.1, "na": 9}},
 "kuay-tiew-tom-yum": {"source": "doh", "code": "11014", "fcdName": "ก๋วยเตี๋ยวเส้นเล็ก, หมู, ต้มยำ", "n": {"kcal": 117, "p": 5.4, "f": 5.08, "c": 12.47, "sugar": null, "fiber": null, "na": 572}},
 "kaeng-jued-tao-hu": {"source": "doh", "code": "11060", "fcdName": "ข้าวราดต้มจืดเต้าหู้ หมูสับ", "n": {"kcal": 56, "p": 4.49, "f": 1.84, "c": 5.29, "sugar": null, "fiber": null, "na": 271}},
 "suki-nam-gai": {"source": "doh", "code": "11091", "fcdName": "สุกี้, ไก่, น้ำ", "n": {"kcal": 47, "p": 3.76, "f": 1.1, "c": 5.49, "sugar": null, "fiber": null, "na": 656}},
 "tom-lued-mu": {"source": "doh", "code": "11104", "fcdName": "ต้มเลือดหมู", "n": {"kcal": 36, "p": 5.05, "f": 1.3, "c": 1.04, "sugar": null, "fiber": null, "na": 335}},
 "khai-dao": {"source": "doh", "code": "14011", "fcdName": "ไข่ดาว (Egg, hen, sunny side up)", "n": {"kcal": 266, "p": 12.75, "f": 22.76, "c": 2.46, "sugar": null, "fiber": null, "na": null}},
 "sandwich-ham-cheese": {"source": "doh", "code": "12050", "fcdName": "แซนด์วิช, แฮมชีส", "n": {"kcal": 294, "p": 10.15, "f": 13.52, "c": 32.82, "sugar": null, "fiber": null, "na": null}},
 "kafae-yen": {"source": "doh", "code": "14051", "fcdName": "กาแฟเย็นสูตรโบราณ", "basis": "serving", "servingText": "1 แก้ว (20 ออนซ์)", "n": {"kcal": 311, "p": 3.71, "f": 9.03, "c": 53.69, "sugar": 37.27, "fiber": null, "na": null}},
 "americano-yen": {"source": "doh", "code": "14053", "fcdName": "กาแฟเย็นอเมริกาโน", "basis": "serving", "servingText": "1 แก้ว (16 ออนซ์)", "n": {"kcal": 9, "p": 0.75, "f": 0.18, "c": 1.07, "sugar": 0.0, "fiber": null, "na": null}},
 "cha-yen": {"source": "doh", "code": "14057", "fcdName": "ชาเย็น", "basis": "serving", "servingText": "1 แก้ว (20 ออนซ์)", "n": {"kcal": 215, "p": 2.67, "f": 7.34, "c": 34.71, "sugar": 26.57, "fiber": null, "na": null}},
 "khai-pa-lo": {"code": "T44", "fcdName": "ข้าวราดไข่พะโล้", "n": {"kcal": 156, "p": 5.66, "f": 6.45, "c": 16.14, "sugar": null, "fiber": 5.3, "na": 305}},
 "khao-khai-jiao": {"code": "H4", "fcdName": "ไข่ไก่, เจียว (เติมน้ำปลา)", "n": {"kcal": 361, "p": 13.98, "f": 32.89, "c": 2.37, "sugar": null, "fiber": 0.0, "na": 591}},
 "kuay-tiew-nam-sai": {"code": "T111", "fcdName": "เส้นเล็ก, หมู, แห้ง", "n": {"kcal": 209, "p": 7.86, "f": 10.39, "c": 21.0, "sugar": null, "fiber": null, "na": 311}},
 "pla-nueng-manao": {"code": "G27", "fcdName": "ปลากะพงขาว, นึ่ง", "n": {"kcal": 126, "p": 22.92, "f": 3.19, "c": 1.43, "sugar": null, "fiber": 0.0, "na": 71}},
 "khao-niao-tua-dam": {"code": "T280", "fcdName": "สาคูถั่วดำ", "n": {"kcal": 138, "p": 2.25, "f": 5.08, "c": 19.61, "sugar": 13.2, "fiber": 2.5, "na": 138}},
 "roti": {
  "code": "S32",
  "fcdName": "Roti",
  "n": {
   "kcal": 359,
   "p": 7.37,
   "f": 13.3,
   "c": 52.37,
   "sugar": null,
   "fiber": 0,
   "na": 334
  }
 },
 "burger-gai": {
  "code": "S34",
  "fcdName": "Hamburger, chicken",
  "n": {
   "kcal": 294,
   "p": 13.29,
   "f": 15.99,
   "c": 23.07,
   "sugar": null,
   "fiber": 2.3,
   "na": 515
  }
 },
 "burger-nuea": {
  "code": "S35",
  "fcdName": "Hamburger, beef",
  "n": {
   "kcal": 254,
   "p": 12.58,
   "f": 12.75,
   "c": 21.4,
   "sugar": null,
   "fiber": 1.4,
   "na": 442
  }
 },
 "french-fries": {
  "code": "S37",
  "fcdName": "French fries",
  "n": {
   "kcal": 345,
   "p": 4.11,
   "f": 19.25,
   "c": 36.13,
   "sugar": null,
   "fiber": 5.3,
   "na": 339
  }
 },
 "sandwich-gai": {
  "code": "S6",
  "fcdName": "Sandwiches, chicken",
  "n": {
   "kcal": 271,
   "p": 12.27,
   "f": 14.34,
   "c": 22.44,
   "sugar": null,
   "fiber": 1.6,
   "na": 372
  }
 },
 "sandwich-pla": {
  "code": "S7",
  "fcdName": "Sandwiches, fish",
  "n": {
   "kcal": 294,
   "p": 10.46,
   "f": 15.84,
   "c": 27.47,
   "sugar": null,
   "fiber": null,
   "na": null
  }
 },
 "kaprao-gai-kap": {
  "code": "T174",
  "fcdName": "Kra-pao-gai (Chicken, stir fried with chilli and basil, Thai style)",
  "n": {
   "kcal": 155,
   "p": 21.94,
   "f": 6.72,
   "c": 1.06,
   "sugar": 1.05,
   "fiber": 1.2,
   "na": 314
  }
 },
 "kluay-hom": {
  "code": "E8",
  "fcdName": "Banana, Hom variety, ripe",
  "n": {
   "kcal": 98,
   "p": 1.18,
   "f": 0.11,
   "c": 22.41,
   "sugar": 19.16,
   "fiber": 1.5,
   "na": 4
  }
 },
 "mamuang-suk": {
  "code": "E69",
  "fcdName": "Mango, Num-dok-mai variety, ripe",
  "n": {
   "kcal": 73,
   "p": 0.65,
   "f": 0.23,
   "c": 16.64,
   "sugar": 14.66,
   "fiber": 1.1,
   "na": 3
  }
 },
 "durian": {
  "code": "E35",
  "fcdName": "Durian, Mawn-tong variety",
  "n": {
   "kcal": 140,
   "p": 2.26,
   "f": 3.34,
   "c": 23.81,
   "sugar": 14.75,
   "fiber": 2.8,
   "na": 11
  }
 },
 "som-khiao-wan": {
  "code": "E115",
  "fcdName": "Tangelo / Tangerine / Mandarin",
  "n": {
   "kcal": 41,
   "p": 0.84,
   "f": 0.17,
   "c": 8.18,
   "sugar": 11,
   "fiber": 1.6,
   "na": 28
  }
 },
 "taeng-mo": {
  "code": "E30",
  "fcdName": "Watermelon, red fresh variety",
  "n": {
   "kcal": 37,
   "p": 0.81,
   "f": 0.07,
   "c": 8.07,
   "sugar": 8.15,
   "fiber": 0.3,
   "na": 4
  }
 },
 "farang": {
  "code": "E39",
  "fcdName": "Guava, common, different varieties",
  "n": {
   "kcal": 39,
   "p": 0.55,
   "f": 0.08,
   "c": 7.13,
   "sugar": 6.23,
   "fiber": 3.7,
   "na": 9
  }
 },
 "malako-suk": {
  "code": "E82",
  "fcdName": "Papaya, ripe",
  "n": {
   "kcal": 37,
   "p": 0.59,
   "f": 0.08,
   "c": 7.44,
   "sugar": 9.2,
   "fiber": 1.9,
   "na": 21
  }
 },
 "sapparod": {
  "code": "E120",
  "fcdName": "Pineapple, different varieties",
  "n": {
   "kcal": 51,
   "p": 0.5,
   "f": 0.05,
   "c": 11.38,
   "sugar": 12.83,
   "fiber": 1.6,
   "na": 3
  }
 },
 "som-o": {
  "code": "E119",
  "fcdName": "Pomelo, different varieties",
  "n": {
   "kcal": 42,
   "p": 0.92,
   "f": 0.12,
   "c": 8.49,
   "sugar": 10.2,
   "fiber": 1.5,
   "na": 5
  }
 },
 "lamyai": {
  "code": "E98",
  "fcdName": "Longan",
  "n": {
   "kcal": 77,
   "p": 1.17,
   "f": 0.11,
   "c": 17.35,
   "sugar": null,
   "fiber": 1,
   "na": 6
  }
 },
 "linchi": {
  "code": "E100",
  "fcdName": "Litchi / Lychee, Thai variety",
  "n": {
   "kcal": 63,
   "p": 0.96,
   "f": 0.16,
   "c": 13.9,
   "sugar": 17.95,
   "fiber": 1.2,
   "na": 1
  }
 },
 "cherry": {
  "code": "E122",
  "fcdName": "Wild cherry",
  "n": {
   "kcal": 142,
   "p": 1.1,
   "f": 0.6,
   "c": 32,
   "sugar": 11,
   "fiber": 2.3,
   "na": 4
  }
 },
 "kaeo-mangkon": {
  "code": "E13",
  "fcdName": "Dragon fruit, white",
  "n": {
   "kcal": 56,
   "p": 1.3,
   "f": 0.7,
   "c": 10.3,
   "sugar": 9.3,
   "fiber": 1.9,
   "na": 4
  }
 },
 "apple-daeng": {
  "code": "E132",
  "fcdName": "Apple, red variety",
  "n": {
   "kcal": 55,
   "p": 0.2,
   "f": 0.14,
   "c": 12,
   "sugar": 10.09,
   "fiber": 2.3,
   "na": 58
  }
 },
 "sala": {
  "code": "E151",
  "fcdName": "Salacca",
  "n": {
   "kcal": 72,
   "p": 0.4,
   "f": 0.1,
   "c": 16.49,
   "sugar": 17.39,
   "fiber": 1.7,
   "na": 6
  }
 },
 "a-ngun-dam": {
  "code": "E156",
  "fcdName": "Grapes, black, Thai variety",
  "n": {
   "kcal": 45,
   "p": 0.5,
   "f": 0.1,
   "c": 10.2,
   "sugar": 12,
   "fiber": 0.8,
   "na": 4
  }
 },
 "ngo": {
  "code": "E17",
  "fcdName": "Rambutan",
  "n": {
   "kcal": 77,
   "p": 0.97,
   "f": 0.14,
   "c": 17.92,
   "sugar": null,
   "fiber": null,
   "na": 14
  }
 },
 "apple-khiao": {
  "code": "E200",
  "fcdName": "Apple, green variety",
  "n": {
   "kcal": 48,
   "p": 0.2,
   "f": 0.2,
   "c": 9.68,
   "sugar": 8.99,
   "fiber": 3.2,
   "na": 2
  }
 },
 "noi-na": {
  "code": "E36",
  "fcdName": "Sugar apple",
  "n": {
   "kcal": 100,
   "p": 1.32,
   "f": 0.2,
   "c": 21.84,
   "sugar": 17.23,
   "fiber": 2.8,
   "na": 4
  }
 },
 "cantaloupe": {
  "code": "E76",
  "fcdName": "Cantaloupe, green fresh, ripe",
  "n": {
   "kcal": 29,
   "p": 0.5,
   "f": 0,
   "c": 6.5,
   "sugar": 6,
   "fiber": 0.6,
   "na": 4
  }
 },
 "kaprao-gai": {
  "code": "T54",
  "fcdName": "ข้าวราดไก่ผัดใบกะเพรา",
  "n": {
   "kcal": 188,
   "p": 8.61,
   "f": 6.55,
   "c": 23.6,
   "sugar": null,
   "fiber": null,
   "na": null
  }
 },
 "khao-kha-mu": {
  "code": "T48",
  "fcdName": "ข้าวขาหมู",
  "n": {
   "kcal": 161,
   "p": 7.19,
   "f": 5.93,
   "c": 19.34,
   "sugar": null,
   "fiber": 1,
   "na": 324
  }
 },
 "khao-mu-daeng": {
  "code": "T64",
  "fcdName": "ข้าวหมูแดง",
  "n": {
   "kcal": 154,
   "p": 6.29,
   "f": 4.18,
   "c": 22.72,
   "sugar": null,
   "fiber": 0.2,
   "na": 284
  }
 },
 "khao-pad-mu": {
  "code": "T56",
  "fcdName": "ข้าวผัดหมู",
  "n": {
   "kcal": 144,
   "p": 5.75,
   "f": 6.34,
   "c": 15.9,
   "sugar": null,
   "fiber": null,
   "na": 141
  }
 },
 "khao-tom-mu": {
  "code": "T51",
  "fcdName": "ข้าวต้มหมู",
  "n": {
   "kcal": 65,
   "p": 4.19,
   "f": 1.09,
   "c": 9.58,
   "sugar": null,
   "fiber": 0,
   "na": 226
  }
 },
 "jok-mu": {
  "code": "T68",
  "fcdName": "โจ๊ก, หมู",
  "n": {
   "kcal": 57,
   "p": 1.56,
   "f": 2.63,
   "c": 6.85,
   "sugar": null,
   "fiber": 0,
   "na": null
  }
 },
 "yen-ta-fo": {
  "code": "T10",
  "fcdName": "ก๋วยเตี๋ยวเส้นใหญ่, น้ำ, เย็นตาโฟ",
  "n": {
   "kcal": 70,
   "p": 3.05,
   "f": 2.67,
   "c": 8.23,
   "sugar": null,
   "fiber": 0.4,
   "na": 239
  }
 },
 "ba-mi-mu-daeng": {
  "code": "T92",
  "fcdName": "บะหมี่, หมูแดง, น้ำ",
  "n": {
   "kcal": 102,
   "p": 4.4,
   "f": 8.6,
   "c": 1.4,
   "sugar": null,
   "fiber": 0.9,
   "na": 338
  }
 },
 "pad-thai-goong": {
  "code": "T9",
  "fcdName": "ก๋วยเตี๋ยว, ผัดไทย",
  "n": {
   "kcal": 171,
   "p": 6.83,
   "f": 6.33,
   "c": 20.67,
   "sugar": 9.97,
   "fiber": 2,
   "na": 445
  }
 },
 "pad-see-ew": {
  "code": "T11",
  "fcdName": "ก๋วยเตี๋ยวเส้นใหญ่, ผัดซี่อิ้ว, หมู",
  "n": {
   "kcal": 221,
   "p": 6.83,
   "f": 12.32,
   "c": 20.72,
   "sugar": null,
   "fiber": null,
   "na": 382
  }
 },
 "rad-na-mu": {
  "code": "T13",
  "fcdName": "ก๋วยเตี๋ยวเส้นใหญ่, ราดหน้า, ไก่/หมู",
  "n": {
   "kcal": 111,
   "p": 2.95,
   "f": 5.55,
   "c": 12.3,
   "sugar": null,
   "fiber": null,
   "na": null
  }
 },
 "som-tam-thai": {
  "code": "T231",
  "fcdName": "ส้มตำ, ไทย",
  "n": {
   "kcal": 105,
   "p": 4.29,
   "f": 2.65,
   "c": 14.34,
   "sugar": null,
   "fiber": 3.3,
   "na": 627
  }
 },
 "tom-yum-goong": {
  "code": "T212",
  "fcdName": "ต้มยำ, กุ้ง",
  "n": {
   "kcal": 44,
   "p": 4.67,
   "f": 1.43,
   "c": 2.86,
   "sugar": 2.08,
   "fiber": 0.7,
   "na": 521
  }
 },
 "kaeng-khiao-wan-gai": {
  "code": "T184",
  "fcdName": "แกงเขียวหวาน, ไก่",
  "n": {
   "kcal": 101,
   "p": 7.9,
   "f": 6.05,
   "c": 3.03,
   "sugar": 1.45,
   "fiber": 1.4,
   "na": 420
  }
 },
 "khao-man-gai": {
  "code": "T59",
  "fcdName": "ข้าวมัน, ไก่ต้ม",
  "n": {
   "kcal": 198,
   "p": 6.75,
   "f": 9.25,
   "c": 21.25,
   "sugar": null,
   "fiber": 1.5,
   "na": null
  }
 },
 "gai-yang": {
  "code": "F111",
  "fcdName": "ไก่, ย่าง",
  "n": {
   "kcal": 184,
   "p": 29.65,
   "f": 6.95,
   "c": 0.45,
   "sugar": null,
   "fiber": 0.7,
   "na": 546
  }
 },
 "khanom-khrok": {
  "code": "T238",
  "fcdName": "ขนมครก",
  "n": {
   "kcal": 94,
   "p": 1.43,
   "f": 2.9,
   "c": 15.47,
   "sugar": null,
   "fiber": 0,
   "na": 75
  }
 },
 "pa-tong-go": {
  "code": "T156",
  "fcdName": "ปาท่องโก๋",
  "n": {
   "kcal": 436,
   "p": 4.38,
   "f": 25.67,
   "c": 46.28,
   "sugar": null,
   "fiber": 0.9,
   "na": null
  }
 },
 "khanom-jeeb": {
  "code": "T243",
  "fcdName": "ขนมจีบ, หมูสับ",
  "n": {
   "kcal": 119,
   "p": 5.43,
   "f": 6.85,
   "c": 8.38,
   "sugar": null,
   "fiber": 1.2,
   "na": 253
  }
 },
 "look-chin-ping": {
  "code": "F182",
  "fcdName": "ลูกชิ้น, วัว, ปิ้ง",
  "n": {
   "kcal": 163,
   "p": 17.76,
   "f": 3.09,
   "c": 15.91,
   "sugar": null,
   "fiber": 0.3,
   "na": null
  }
 },
 "khanom-buang": {
  "code": "T252",
  "fcdName": "ขนมเบื้องไทย, ไส้เค็ม",
  "n": {
   "kcal": 382,
   "p": 7.57,
   "f": 20.9,
   "c": 40.78,
   "sugar": null,
   "fiber": null,
   "na": 244
  }
 },
 "bua-loi": {
  "code": "T249",
  "fcdName": "ขนมบัวลอย",
  "n": {
   "kcal": 145,
   "p": 1.25,
   "f": 2.4,
   "c": 29.35,
   "sugar": null,
   "fiber": 0.6,
   "na": 266
  }
 },
 "lod-chong": {
  "code": "T163",
  "fcdName": "ลอดช่องน้ำกะทิ",
  "n": {
   "kcal": 130,
   "p": 0.79,
   "f": 3.64,
   "c": 22.68,
   "sugar": null,
   "fiber": 1.5,
   "na": null
  }
 },
 "tao-huay-nam-khing": {
  "code": "T319",
  "fcdName": "เต้าฮวย",
  "n": {
   "kcal": 74,
   "p": 1.74,
   "f": 3.02,
   "c": 9.98,
   "sugar": null,
   "fiber": null,
   "na": 52
  }
 },
 "nam-tao-hu": {
  "code": "Q10",
  "fcdName": "นมถั่วเหลือง, ยูเอชที, ต่อ 100 มล.",
  "n": {
   "kcal": 79,
   "p": 2.9,
   "f": 3.34,
   "c": 8.98,
   "sugar": 8.3,
   "fiber": 0.7,
   "na": 35
  },
  "unit": "มล."
 },
 "nam-maprao": {
  "code": "Q20",
  "fcdName": "น้ำมะพร้าว, ต่อ 100 มล.",
  "n": {
   "kcal": 28,
   "p": 0.09,
   "f": 0.1,
   "c": 6.62,
   "sugar": 5.77,
   "fiber": 0.1,
   "na": 19
  },
  "unit": "มล."
 },
 "nom-jued": {
  "code": "J39",
  "fcdName": "นมพาสเจอร์ไรส์, รสธรรมชาติ, ต่อ 100 มล.",
  "n": {
   "kcal": 67,
   "p": 3.11,
   "f": 3.78,
   "c": 5.21,
   "sugar": 3.7,
   "fiber": 0,
   "na": 45
  },
  "unit": "มล."
 },
 "khai-tom": {
  "code": "H18",
  "fcdName": "ไข่ไก่, ต้ม, 10 นาที",
  "n": {
   "kcal": 138,
   "p": 13.15,
   "f": 8.31,
   "c": 2.73,
   "sugar": null,
   "fiber": 0,
   "na": 139
  }
 },
 "nom-priao": {
  "code": "J25",
  "fcdName": "นมเปรี้ยว, พร้อมดื่ม, พาสเจอร์ไรส์, รสต่างๆ ต่อ 100 มล.",
  "n": {
   "kcal": 87,
   "p": 1.55,
   "f": 1.56,
   "c": 16.7,
   "sugar": 15.47,
   "fiber": 0,
   "na": 36
  },
  "unit": "มล."
 },
 "khao-plao-perm": {
  "code": "A11",
  "fcdName": "ข้าวเจ้า, สุก",
  "n": {
   "kcal": 136,
   "p": 2.28,
   "f": 0.24,
   "c": 31.1,
   "sugar": 0,
   "fiber": null,
   "na": 20
  }
 }
};
