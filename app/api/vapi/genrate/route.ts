import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { prisma } from "@/lib/prisma";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, techstack, level, userid, amount } = await request.json();

  try {
    // ✅ Generate questions
    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        Return the questions formatted like this:
        ["Question 1", "Question 2"]
      `,
    });

    // ✅ Safely parse AI output
    let questions: string[] = [];
    try {
      questions = JSON.parse(rawQuestions);
    } catch {
      // fallback: split by new lines
      questions = rawQuestions.split("\n").filter(Boolean);
    }

    // ✅ Handle techstack as string OR array
    const stack = Array.isArray(techstack)
      ? techstack
      : String(techstack).split(",").map((s) => s.trim());

    // ✅ Prepare data object
    const data: any = {
      role,
      type,
      level,
      techstack: stack,
      questions,
      finalized: true,
      coverImage: getRandomInterviewCover(),
    };
    console.log(data);
    
    // ✅ Only connect user if userid exists
    if (userid) {
      data.user = { connect: { id: userid } };
    }

    // ✅ Save to DB
    const interview = await prisma.interview.create({ data });

    return Response.json({ success: true, interview }, { status: 200 });
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
