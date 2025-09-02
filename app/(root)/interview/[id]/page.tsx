import { getInterviewById,getFeedbackByInterviewId } from '@/lib/general.action';
import { redirect } from 'next/navigation';
import React from 'react'
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/auth';


const page = async ({params}:RouteParams) => {
    const {id} = await  params;
    const interview = await getInterviewById(id);
    const user = await getCurrentUser();

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id!,
      });


    if(!interview) redirect('/');
 


  return (
    <> 
        <div className="flex flex-row gap-4 justify-between">
            <div className="flex flex-row gap-4 items-center max-sm:flex-col">
            <div className="flex flex-row gap-4 items-center">
                <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={40}
                height={40}
                className="rounded-full object-cover size-[40px]"
                />
                <h3 className="capitalize">{interview.role} Interview</h3>
            </div>
            </div>
            {/* <DisplayTechIcons techStack={interview.techstack} /> */}
            <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
            {interview.type}
            </p>
        </div>

        <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </>
  )
}

export default page