import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(){
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.email)   return null;
        const user = await prisma.user.findUnique({
            where:{email:session?.user?.email}
        })
        return user;
    } catch (error) {
        console.log(error);
    }
}

