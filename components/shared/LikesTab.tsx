import TweetCard from "../cards/TweetCard";
import { fetchLikedPosts } from "@/lib/actions/like.actions";
import { TbMessage2Heart } from "react-icons/tb";

type TweetsTabProps = {
  accountId: string;
  userInfoId: string;
  isDelete: string;
};

export default async function LikesTab({
  accountId,
  userInfoId,
  isDelete,
}: TweetsTabProps) {
  const result = await fetchLikedPosts(accountId);

  if (!result || result.length < 1)
    return (
      <span className="flex flex-col gap-3 justify-center mt-10 items-center m-auto text-light-2/80 mx-5 text-[12px] md:text-base-regular">
        <TbMessage2Heart className=" text-[70px] md:text-[100px]" />
        <p>
          You haven't like any a tweet, once you have they will show up here.
        </p>
      </span>
    );

  return (
    <section className=" flex flex-col">
      {result.map((v: any) => (
        <TweetCard
          key={v._id}
          id={v._id}
          currentUserId={v.author.id}
          parentId={v.parentId}
          content={v.text}
          author={{
            name: v.author.name,
            image: v.author.image,
            id: v.author._id,
            username: v.author.username,
          }}
          community={v.community}
          createdAt={v.createdAt}
          comments={v.children}
          image={v.image}
          userInfoId={userInfoId}
          likes={v.likes}
          isDelete={isDelete}
        />
      ))}
    </section>
  );
}
