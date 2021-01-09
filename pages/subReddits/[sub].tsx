import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { User } from "@prisma/client";
import { useSession } from "next-auth/client";
// import Moment from "react-moment";
// import "moment-timezone";
// import SubredditPost from "../../components/subredditPost";
import useSWR from "swr";
import { fetchData } from "../../utils/utils";

const SubReddit = (props) => {
  const router = useRouter();
  const { sub } = router.query;
  //   const [session] = useSession();

  //   const subUrl = `/api/subreddit/findSubreddit?name=${sub}`;

  //   const { data: fullSub, error } = useSWR(subUrl, fetchData, {
  //     initialData: props.fullSub,
  //   });

  //   console.log("do we have votes?", fullSub);

  // has the user joined the subreddit?
  //   const joined =
  //     fullSub.joinedUsers.filter((user: User) => user.name === session?.user.name)
  //       .length > 0;

  //   if (error) {
  //     return (
  //       <Layout>
  //         <h1>{error.message}</h1>
  //       </Layout>
  //     );
  //   }
  return (
    <Layout>
      <h1>{sub}</h1>
    </Layout>
  );
};

// export async function getServerSideProps(ctx) {
//   const url = `${process.env.NEXTAUTH_URL}/api/subreddit/findSubreddit?name=${ctx.query.sub}`;
//   const fullSub = await fetchData(url);

//   return {
//     props: {
//       fullSub,
//     },
//   };
// }

export default SubReddit;
