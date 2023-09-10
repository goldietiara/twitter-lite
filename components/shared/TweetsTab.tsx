import { fetchUserMedia, fetchUserPosts } from "@/lib/actions/user.actions";
import TweetCard from "../cards/TweetCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { TbCameraSelfie, TbMessageChatbot } from "react-icons/tb";

type TweetsTabProps = {
  currentUserId: string;
  accountId: string;
  accountType: string;
  userInfoId: string;
};

export default async function TweetsTab({
  currentUserId,
  accountId,
  accountType,
  userInfoId,
}: TweetsTabProps) {
  let result: any;
  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else if (accountType === "User") {
    result = await fetchUserPosts(accountId);
    if (!result || result.tweets.length < 1)
      return (
        <span className="flex flex-col gap-3 justify-center mt-10 items-center m-auto text-light-2/80">
          <TbMessageChatbot className=" text-[100px]" />
          <p>When you post a tweet, they will show up here.</p>
        </span>
      );
  } else {
    result = await fetchUserMedia(accountId);
    if (!result || result.tweets.length < 1)
      return (
        <span className="flex flex-col gap-3 justify-center mt-10 items-center m-auto text-light-2/80">
          <TbCameraSelfie className=" text-[100px]" />
          <p>When you post photos or videos, they will show up here.</p>
        </span>
      );
  }

  return (
    <section className=" mt-9 flex flex-col gap-10">
      {result.tweets.map((v: any) => (
        <TweetCard
          key={v._id}
          id={v._id}
          currentUserId={currentUserId}
          parentId={v.parentId}
          content={v.text}
          author={
            accountType == "Community"
              ? {
                  id: v.author.id,
                  name: v.author.name,
                  username: v.author.username,
                  image: v.author.image,
                }
              : {
                  id: result.id,
                  name: result.name,
                  username: result.username,
                  image: result.image,
                }
          }
          community={v.community}
          createdAt={v.createdAt}
          comments={v.children}
          image={v.image}
          likes={v.likes}
          userInfoId={userInfoId}
        />
      ))}
    </section>
  );
}
