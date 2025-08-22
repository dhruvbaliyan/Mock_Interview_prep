import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try {
        const {name , password, email} = await req.json();

        if(!name || !password ||!email) {
            return NextResponse.json({
                error:'Missing Fields'
            }, {status:400})
        }
        
        const user = await prisma.user.findUnique({
            where:{email}
        })
        if(user){
            return NextResponse.json({
                error:'user already exist'
            },{status:400})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const addeduser = await prisma.user.create({
            data:{
                name, password:hashedPassword, email
            }
        })
        return NextResponse.json({ user:addeduser });
    } catch (err) {
        console.log(err);
    }
}