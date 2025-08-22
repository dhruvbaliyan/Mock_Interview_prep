import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { prisma } from "@/lib/prisma";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, techstack, level, userid, amount } = await request.json();

  try {
    // ✅ Generate questions
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });

    // ✅ Save to DB (connect user relation)
    const interview = await prisma.interview.create({
      data: {
        role,
        type,
        level,
        techstack: techstack.split(","),        // store as JSON
        questions: JSON.parse(questions),       // parse AI output into JSON
        finalized: true,
        coverImage: getRandomInterviewCover(),
        user: {
          connect: { id: userid },              // 🔑 connect to existing user
        },
      },
    });
    // console.log(userid , type);
    
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return Response.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank You" }, { status: 200 });
}
