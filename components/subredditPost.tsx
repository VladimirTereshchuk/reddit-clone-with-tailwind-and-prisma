import React from "react";
import { Prisma } from "@prisma/client";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mutate } from "swr";

// type FullPost = Prisma.PostGetPayload<{
//   include: { user: true; subreddit: true; votes: true };
// }>;

// type SubWithPosts = Prisma.SubredditGetPayload<{
//   include: {
//     posts: { include: { user: true; subreddit: true; votes: true } };
//     joinedUsers: true;
//   };
// }>;

// interface Props {
//   post: FullPost;
//   subUrl: string;
//   fullSub: SubWithPosts;
// }

export const SubredditPost = ({ post }) => {
  return (
    <div className="w-full bg-white  rounded-md p-4 mt-4 ">
      <div className="flex">
        <div className="flex flex-col mr-6 items-center">
          <FontAwesomeIcon
            icon={faThumbsUp}
            className="cursor-pointer text-gray-600 hover:text-red-500"
            // onClick={() => upvotePost("UPVOTE")}
          />
          <p>{post.votes.length || 1}</p>
          <FontAwesomeIcon
            icon={faThumbsDown}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">Posted by u/{post.user.name}</p>
          <p className="text-2xl text-gray-900">{post.title}</p>
          <p className="text-md text-gray-900">{post.body}</p>
          <div>
            <p>
              {/*comment icon */} {/*comment count*/} comments
            </p>
            <p>Share</p>
          </div>
        </div>
      </div>
    </div>
  );
};
