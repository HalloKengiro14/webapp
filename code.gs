function doGet() {
  // สร้าง HTML Output จากไฟล์ 'Index' เพื่อใช้เป็นหน้าเว็บใน Web App
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('WebApp Sign Tax') // ตั้งชื่อหน้าต่างของเว็บแอป
    .setWidth(1024) // กำหนดความกว้างของหน้าต่างแสดงผล
    .setHeight(768); // กำหนดความสูงของหน้าต่างแสดงผล
}

function calculateTax(data) {
  // ดึงค่าจากวัตถุข้อมูลที่ส่งเข้ามา
  const { width, height, type, subType, month } = data;
  
  // คำนวณพื้นที่ป้าย (กว้าง * ยาว)
  const area = width * height;
  // คำนวณจำนวนหน่วยของพื้นที่ป้าย (500 ตร.ซม.ต่อหน่วย)
  const unitArea = Math.ceil(area / 500); 
  let taxRate; // ตัวแปรสำหรับเก็บอัตราภาษี

  // กำหนดอัตราภาษีตามประเภทและลักษณะของป้าย
  if (type === '1') {
    taxRate = subType === 'a' ? 10 : 5; // ประเภท 1: ย่อย 'a' = 10, อื่น ๆ = 5
  } else if (type === '2') {
    taxRate = subType === 'a' ? 52 : 26; // ประเภท 2: ย่อย 'a' = 52, อื่น ๆ = 26
  } else if (type === '3') {
    taxRate = subType === 'a' ? 52 : 50; // ประเภท 3: ย่อย 'a' = 52, อื่น ๆ = 50
  }

  // คำนวณภาษีโดยใช้อัตราภาษีและจำนวนหน่วยของพื้นที่ป้าย
  let tax = unitArea * taxRate;

  // ลดหย่อนภาษีตามจำนวนเดือนที่ติดตั้ง
  const monthFactor = month <= 3 ? 1 : month <= 6 ? 0.75 : month <= 9 ? 0.5 : 0.25;
  tax *= monthFactor;

  // ส่งผลลัพธ์กลับไปเป็นวัตถุที่ประกอบด้วยข้อมูลต่าง ๆ
  return {
    area: area, // พื้นที่ป้าย
    unitArea: unitArea, // จำนวนหน่วยพื้นที่
    taxRate: taxRate, // อัตราภาษี
    tax: tax.toFixed(2) // ภาษีที่คำนวณได้ (ปัดเศษทศนิยม 2 ตำแหน่ง)
  };
}
