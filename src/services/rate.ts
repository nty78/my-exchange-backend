import axios from 'axios';

// ดึงข้อมูลวันนี้ (สำหรับหน้าแรก)
export const fetchRatesFromBOT = async () => {
  const date = new Date();
  const day = date.getDay(); // 0 = อาทิตย์, 6 = เสาร์
  
  // ถัาวันหยุด ให้ถอยไปวันศุกร์
  if (day === 6) {
    date.setDate(date.getDate() - 1); // วันเสาร์ ถอย 1 วัน
  } else if (day === 0) {
    date.setDate(date.getDate() - 2); // วันอาทิตย์ ถอย 2 วัน
  }

  const targetDate = date.toISOString().split('T')[0];
  const clientId = process.env.BOT_CLIENT_ID;

  if (!clientId) {
    throw new Error("Missing BOT_CLIENT_ID in .env file");
  }

  try {
    const response = await axios.get(
      `https://gateway.api.bot.or.th/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?start_period=${targetDate}&end_period=${targetDate}`,
      { 
        headers: { 
          'Authorization': clientId 
        } 
      }
    );
    
    return response.data.result.data.data_detail;
  } catch (error) {
    console.error("Error fetching from BOT:", error);
    throw new Error("Failed to fetch data from BOT API");
  }
};

//  ดึงข้อมูลย้อนหลัง 7 วัน (สำหรับหน้า 2)
export const fetchHistoryFromBOT = async (currency: string) => {
  const endDate = new Date();
  const startDate = new Date();
  // ถอยหลังไปเผื่อวันหยุด 15 วัน
  startDate.setDate(endDate.getDate() - 15); 

  const endStr = endDate.toISOString().split('T')[0];
  const startStr = startDate.toISOString().split('T')[0];
  const clientId = process.env.BOT_CLIENT_ID;

  if (!clientId) throw new Error("Missing BOT_CLIENT_ID");

  try {
    const response = await axios.get(
      `https://gateway.api.bot.or.th/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?start_period=${startStr}&end_period=${endStr}&currency=${currency}`,
      { headers: { 'Authorization': clientId } }
    );
    return response.data.result.data.data_detail;
  } catch (error) {
    console.error(`Error fetching history for ${currency}:`, error);
    throw new Error("Failed to fetch history data");
  }
};