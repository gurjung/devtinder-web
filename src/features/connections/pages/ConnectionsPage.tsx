import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "@/store/slices/connectionsSlice";
import { connectionService } from "../services/connectionService";
import type { RootState } from "@/store/store";

export const ConnectionsPage = () => {
  const connections = useSelector((store: RootState) => store.connections);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await connectionService.getConnections();
        dispatch(addConnections(data));
      } catch (err) {
        console.error("Failed to load connections:", err);
      }
    };

    fetchConnections();
  }, [dispatch]);

  if (connections === null) {
    return (
      <div className="flex justify-center my-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 text-center">
        <span className="text-5xl mb-4">🤝</span>
        <h2 className="text-2xl font-bold">No Connections Found</h2>
        <p className="text-base-content/70 mt-2">
          Explore the feed to connect with developers around you.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">My Connections</h1>

      <div className="space-y-4">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

          return (
            <div
              key={_id}
              className="flex items-center p-4 rounded-xl bg-base-300 shadow-md border border-base-200 gap-4 transition hover:bg-base-200"
            >
              <div className="avatar">
                <div className="w-16 h-16 rounded-full ring-2 ring-primary/20">
                  <img
                    alt={`${firstName}'s photo`}
                    src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-xs opacity-75 capitalize">
                    {age}, {gender}
                  </p>
                )}
                {about && <p className="text-sm line-clamp-2 mt-1 opacity-90">{about}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionsPage;
