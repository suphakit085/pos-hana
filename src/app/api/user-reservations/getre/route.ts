import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export async function GET(request: Request) {
    try {
        // Get the customer ID from the URL query parameters
        const { searchParams } = new URL(request.url);
        const customerID = searchParams.get('customerID');
        
        // If no customer ID is provided, return an error
        if (!customerID) {
            return NextResponse.json(
                { message: 'กรุณาระบุรหัสลูกค้า' },
                { status: 400 }
            );
        }

        // Convert customerID to number
        const customerIDNum = parseInt(customerID);

        // Find reservations for the specific customer
        const reservations = await prisma.reservations.findMany({
            where: {
                Customer_customerID: customerIDNum
            },
            include: {
                table: {
                    select: {
                        tabID: true,
                        tabTypes: true
                    }
                }
            },
            orderBy: {
                resCreatedAt: 'desc'
            }
        });

        // Transform the data to include proper table names
        const formattedReservations = reservations.map(res => {
            // สร้างชื่อโต๊ะที่เหมาะสม
            let tableName = `โต๊ะ ${res.table.tabID}`;
            if (res.table.tabTypes === 'VIP') {
                tableName = 'ห้อง VIP';
            }

            return {
                ...res,
                table: {
                    ...res.table,
                    tableName: tableName
                }
            };
        });

        return NextResponse.json(formattedReservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
            { status: 500 }
        );
    }
}