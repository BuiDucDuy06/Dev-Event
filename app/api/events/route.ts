import Event from "@/app/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        await connectDB();

        const formData = await req.formData();

        let event;

        try{
            event = Object.fromEntries(formData.entries());
        } catch(e) {
            return NextResponse.json({message: 'Invalid JSON data format'}, {status: 400})
        }

        const createdEvent = await Event.create(event);

        return NextResponse.json({message: 'Event created Successfully', event:createdEvent}, {status: 206});
    } catch(e){
        console.error(e);
        return NextResponse.json({message: 'Event Creation failed', error: e instanceof Error ? e.message: 'Uknown'}, {status: 500})
    }
}