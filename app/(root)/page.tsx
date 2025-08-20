import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";


const page = () => {
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
          {dummyInterviews.map((interview)=>(
            <InterviewCard 
              {...interview} 
              key={interview.id}/>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">  
        <h2>Take Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview)=>(
            <InterviewCard 
              {...interview}
              key={interview.id}/>
          ))}
        </div>
      </section>

    </>
  )
}

export default page;