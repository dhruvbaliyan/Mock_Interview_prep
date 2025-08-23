import Agent from '@/components/Agent'
import {getCurrentUser} from '@/lib/auth';

const page = () => {
  // const user = await getCurrentUser();
  return (
    <>
        <h3>Interview Generation</h3>
        {/* <Agent 
        userName={user?.name}
        userId={user?.id}
        type="generate"/> */}
    </>
  )
}

export default page