import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/auth";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/general.action";

const page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);
  // console.log(userInterviews);
  
  const hasUpcomingInterviews = allInterview?.length > 0;
  const hasPastInterviews = userInterviews?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h3>Get Interview Ready with AI powered Practice & Feedback</h3>
          <p className="text-lg">
            Practice real interview question & get instant Feedback
          </p>

          <Button asChild className='btn-primary max-sm:w-full'>
          <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image 
          src='/robot.png'
          alt='robot'
          height={400}
          width={400}
          className='max-sm:hidden'
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {
            hasPastInterviews 
            ?
              userInterviews.map((interview)=>(
                <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                // coverImage={interview.coverImage}
              />
              ))
            : 
            <p className="text-center text-lg">No interviews found</p>
          }
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">  
        <h2>Take Interview</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>

    </>
  )
}

export default page;