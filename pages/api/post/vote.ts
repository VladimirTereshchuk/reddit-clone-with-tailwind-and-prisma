import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  //get post id and type from the req body
  const { postId, type } = req.body;
  const session = await getSession({ req });

  // if we don't have a session we return an error
  if (!session) {
    return res.status(500).json({ error: "You have to be logged in." });
  }
  // first get all the votes from the user
  try {
    const votes = await prisma.vote.findMany({
      where: {
        userId: session.userId,
      },
    });
    // check if the user has voted on this  post
    const hasVoted = votes.find((vote) => vote.postId === postId);
    console.log("has the user voted: ", hasVoted);

    if (hasVoted) {
      // if user hasVoted and the vote type is not the same - we change the type

      if (hasVoted.voteType !== type) {
        const updatedVote = await prisma.vote.update({
          where: {
            id: Number(hasVoted.id),
          },
          data: {
            voteType: type,
          },
        });

        console.log("updated vote", updatedVote);

        return res.json(updatedVote);
      }
      // if the user has voted - remove the vote and return the removed vote
      const deletedVote = await prisma.vote.delete({
        where: {
          id: Number(hasVoted.id),
        },
      });

      console.log("deleted vote", deletedVote);
      return res.json(deletedVote);
    }
    // otherwise just create a new vote and return it

    const newVote = await prisma.vote.create({
      data: {
        voteType: type,
        user: {
          connect: { id: Number(session.userId) },
        },
        post: {
          connect: { id: Number(postId) },
        },
      },
    });
    console.log("new vote: ", newVote);
    return res.json(newVote);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
