import { CreateOrganization, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Pagination from "@/components/shared/Pagination";
import CommunityCard from "@/components/cards/CommunityCard";
import Searchbar from "@/components/shared/SearchBar";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { Metadata } from "next";

export function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}): Metadata {
  return {
    title: `${
      searchParams.q ? `Search for ${searchParams.q}` : "Communities"
    } | Twitter by Goldie Tiara`,
  };
}

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <div className="mx-3">
      <h1 className="head-text">Communities</h1>
      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>

      <section className="mt-9 flex flex-wrap gap-9 ">
        {result.communities.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="communities"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </div>
  );
}

export default Page;
