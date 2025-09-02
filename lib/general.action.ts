"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - Communication Skills
        - Technical Knowledge
        - Problem-Solving
        - Cultural & Role Fit
        - Confidence & Clarity
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    // Build feedback object
    const feedbackData = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date(),
    };

    let feedback;

    if (feedbackId) {
      // Update existing
      feedback = await prisma.feedback.update({
        where: { id: feedbackId },
        data: feedbackData,
      });
    } else {
      // Create new
      feedback = await prisma.feedback.create({
        data: feedbackData,
      });
    }

    return { success: true, feedbackId: feedback.id };
  } catch (error) {
    // console.error("Error saving feedback:", error);
    console.log(error);
    
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await prisma.interview.findUnique({
    where: { id },
  });

  if (!interview) return null;

  return {
    id: interview.id,
    role: interview.role,
    level: interview.level,
    questions: (interview.questions ?? []) as unknown as string[],
    techstack: (interview.techstack ?? []) as unknown as string[],
    createdAt: interview.createdAt.toISOString(),
    userId: interview.userId,
    type: interview.type,
    finalized: interview.finalized,
  };
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await prisma.feedback.findFirst({
    where: {
      interviewId,
      userId,
    },
  });

  if (!feedback) return null;

  return {
    id: feedback.id,
    interviewId: feedback.interviewId,
    totalScore: feedback.totalScore,
    categoryScores: (feedback.categoryScores ?? []) as unknown as {
      name: string;
      score: number;
      comment: string;
    }[],
    strengths: (feedback.strengths ?? []) as unknown as string[],
    areasForImprovement: (feedback.areasForImprovement ?? []) as unknown as string[],
    finalAssessment: feedback.finalAssessment,
    createdAt: feedback.createdAt.toISOString(),
  };
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[]> {
  const { userId, limit = 20 } = params;

  const interviews = await prisma.interview.findMany({
    where: {
      finalized: true,
      NOT: { userId },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return interviews.map((i) => ({
    id: i.id,
    role: i.role,
    level: i.level,
    questions: (i.questions ?? []) as unknown as string[],
    techstack: (i.techstack ?? []) as unknown as string[],
    createdAt: i.createdAt.toISOString(),
    userId: i.userId,
    type: i.type,
    finalized: i.finalized,
  }));
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  const interviews = await prisma.interview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return interviews.map((i) => ({
    id: i.id,
    role: i.role,
    level: i.level,
    questions: (i.questions ?? []) as unknown as string[],
    techstack: (i.techstack ?? []) as unknown as string[],
    createdAt: i.createdAt.toISOString(),
    userId: i.userId,
    type: i.type,
    finalized: i.finalized,
    coverImage: i.coverImage,
  }));
}
