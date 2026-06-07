import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchRatesFromBOT, fetchHistoryFromBOT } from './services/rate'; 

// โหลดค่าจากไฟล์ .env
dotenv.config();

const app = express();
const PORT = 3000;

// อนุญาตให้แอปมือถือเรียกใช้งานได้
app.use(cors());

// สร้างเส้นทาง (Endpoint) สำหรับเรียกข้อมูลอัตราแลกเปลี่ยน (ข้อมูลวันนี้ - หน้าแรก)
app.get('/api/rates', async (req, res) => {
  try {
    const rates = await fetchRatesFromBOT();
    res.json(rates); // ส่ง JSON กลับไปให้ Frontend
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// สำหรับดึงข้อมูลย้อนหลัง 7 วัน (หน้า 2)
app.get('/api/rates/:currency/history', async (req, res) => {
  try {
    // ดึงรหัสสกุลเงินที่ส่งมาจาก URL
    const currency = req.params.currency; 
    const data = await fetchHistoryFromBOT(currency);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch historical data" });
  }
});

// สั่งให้เซิร์ฟเวอร์เริ่มทำงาน
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});