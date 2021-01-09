import React from "react";
import { Prisma } from "@prisma/client";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mutate } from "swr";

type FullPost = Prisma.PostGetPayload<{
  include: { user: true; subreddit: true; votes: true };
}>;

type SubWithPosts = Prisma.SubredditGetPayload<{
  include: {
    posts: { include: { user: true; subreddit: true; votes: true } };
    joinedUsers: true;
  };
}>;

interface Props {
  post: FullPost;
  subUrl: string;
  fullSub: SubWithPosts;
}

export const SubredditPost = ({ post, subUrl, fullSub }: Props) => {
  const [session, loading] = useSession();
  const router = useRouter();

  const hasVoted = post.votes.find((vote) => vote.userId === session.userId);

  const upvotePost = async (type) => {
    // if the user is not logged in - redirect to a login page
    if (!session && !loading) {
      router.push("/login");
      return;
    }
    if (hasVoted) {
      // check if the vote type is the same ase the already existing one
      console.log("in general has voted the has voted object", hasVoted);
      if (hasVoted.voteType !== type) {
        console.log("in has voted type changed - so swap upvote with downvote");
        mutate(
          subUrl,
          async (state = fullSub) => {
            return {
              ...state,
              posts: state.posts.map((currentPost) => {
                if (currentPost.id === post.id) {
                  return {
                    ...currentPost,
                    votes: currentPost.votes.map((vote) => {
                      if (vote.userId === session.userId) {
                        return {
                          ...vote,
                          voteType: type,
                        };
                      } else {
                        return vote;
                      }
                    }),
                  };
                } else {
                  return currentPost;
                }
              }),
            };
          },
          false
        );
      } else {
        console.log("in has voted type is the same - so remove the vote");

        mutate(
          subUrl,
          async (state = fullSub) => {
            return {
              ...state,
              posts: state.posts.map((currentPost) => {
                if (currentPost.id === post.id) {
                  const test = currentPost.votes.filter(
                    (vote) => vote.userId !== session.userId
                  );
                  console.log("filtered out votes: ", test);
                  return {
                    ...currentPost,
                    votes: test,
                  };
                } else {
                  return currentPost;
                }
              }),
            };
          },
          false
        );
      }
    } else {
      console.log("has not vote - create a new vote");
      mutate(
        subUrl,
        async (state = fullSub) => {
          return {
            ...state,
            posts: state.posts.map((currentPost) => {
              if (currentPost.id === post.id) {
                return {
                  ...currentPost,
                  votes: [
                    ...currentPost.votes,
                    {
                      voteType: type,
                      userId: session.userId,
                      postId: currentPost.id,
                    },
                  ],
                };
              } else {
                return currentPost;
              }
            }),
          };
        },
        false
      );
    }

    await fetch("/api/post/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: post.id, type }),
    });
  };

  return (
    <div className="w-full bg-white  rounded-md p-4 mt-4 ">
      <div className="flex">
        <div className="flex flex-col mr-6 items-center">
          <FontAwesomeIcon
            icon={faThumbsUp}
            className="cursor-pointer text-gray-600 hover:text-red-500"
            onClick={() => upvotePost("UPVOTE")}
          />
          <p>{post.votes.length || 0}</p>
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
