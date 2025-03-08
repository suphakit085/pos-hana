import { NextRequest, NextResponse } from 'next/server';

// เก็บข้อมูลการเชื่อมต่อของลูกค้าแต่ละโต๊ะ
const clients = new Map<string, ReadableStreamController<Uint8Array>>();

// ฟังก์ชันสำหรับส่งการแจ้งเตือนไปยังลูกค้าที่เชื่อมต่ออยู่
export function sendNotification(tableId: string, message: any) {
  const controller = clients.get(tableId);
  if (controller) {
    // แปลงข้อมูลเป็น JSON string และส่งไปยังลูกค้า
    const data = `data: ${JSON.stringify(message)}\n\n`;
    controller.enqueue(new TextEncoder().encode(data));
    console.log(`Sent notification to table ${tableId}:`, message);
    return true;
  }
  return false;
}

// API สำหรับลูกค้าเชื่อมต่อเพื่อรับการแจ้งเตือน
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tableId = url.searchParams.get('tableId');
  
  if (!tableId) {
    return NextResponse.json({ error: 'Missing tableId parameter' }, { status: 400 });
  }
  
  // สร้าง ReadableStream สำหรับ SSE
  const stream = new ReadableStream({
    start(controller) {
      // เก็บ controller ไว้ใช้ส่งข้อมูลในภายหลัง
      clients.set(tableId, controller);
      
      // ส่งข้อมูลเริ่มต้นเพื่อยืนยันการเชื่อมต่อ
      const initialMessage = `data: ${JSON.stringify({ type: 'connected', message: 'Connected to notification service' })}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialMessage));
      
      console.log(`Client connected for table ${tableId}`);
    },
    cancel() {
      // ลบการเชื่อมต่อเมื่อลูกค้าตัดการเชื่อมต่อ
      clients.delete(tableId);
      console.log(`Client disconnected for table ${tableId}`);
    }
  });
  
  // ส่ง response กลับไปพร้อมกับ stream
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// API สำหรับส่งการแจ้งเตือนไปยังลูกค้า
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, message } = body;
    
    if (!tableId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // ส่งการแจ้งเตือนไปยังลูกค้า
    const sent = sendNotification(tableId, message);
    
    if (sent) {
      return NextResponse.json({ success: true, message: 'Notification sent' });
    } else {
      return NextResponse.json({ success: false, message: 'No connected client for this table' });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
} 