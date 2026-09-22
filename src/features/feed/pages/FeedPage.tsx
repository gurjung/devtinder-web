import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "@/store/slices/feedSlice";
import { feedService } from "../services/feedService";
import UserCard from "@/components/common/UserCard";
import type { RootState } from "@/store/store";

export const FeedPage = () => {
  const feed = useSelector((store: RootState) => store.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFeed = async () => {
      if (feed !== null) return;
      try {
        const users = await feedService.getFeed();
        dispatch(addFeed(users));
      } catch (err) {
        console.error("Failed to load feed:", err);
      }
    };

    fetchFeed();
  }, [dispatch, feed]);

  if (feed === null) {
    return (
      <div className="flex justify-center my-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  if (feed.length === 0 || !feed[0]) {
    return (
      <div className="flex flex-col items-center justify-center my-20 text-center">
        <span className="text-5xl mb-4">✨</span>
        <h2 className="text-2xl font-bold">No new developers found!</h2>
        <p className="text-base-content/70 mt-2">
          Check back later for new profiles to connect with.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10 px-4">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default FeedPage;
