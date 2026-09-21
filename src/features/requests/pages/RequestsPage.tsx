import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "@/store/slices/requestSlice";
import { requestService } from "../services/requestService";
import type { RootState } from "@/store/store";

export const RequestsPage = () => {
  const requests = useSelector((store: RootState) => store.requests);
  const dispatch = useDispatch();
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestService.getReceivedRequests();
        dispatch(addRequests(data));
      } catch (err) {
        console.error("Failed to load requests:", err);
      }
    };

    fetchRequests();
  }, [dispatch]);

  const handleReview = async (status: "accepted" | "rejected", requestId: string) => {
    setActingId(requestId);
    try {
      await requestService.reviewRequest(status, requestId);
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(`Failed to ${status} request:`, err);
    } finally {
      setActingId(null);
    }
  };

  if (requests === null) {
    return (
      <div className="flex justify-center my-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 text-center">
        <span className="text-5xl mb-4">📬</span>
        <h2 className="text-2xl font-bold">No Connection Requests</h2>
        <p className="text-base-content/70 mt-2">
          You have responded to all received connection requests.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Connection Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => {
          const sender = request.fromUserId;
          if (!sender) return null;

          const isActing = actingId === request._id;

          return (
            <div
              key={request._id}
              className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-base-300 shadow-md border border-base-200 gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring-2 ring-primary/20">
                    <img
                      alt={`${sender.firstName}'s photo`}
                      src={sender.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {sender.firstName} {sender.lastName}
                  </h2>
                  {sender.age && sender.gender && (
                    <p className="text-xs opacity-75 capitalize">
                      {sender.age}, {sender.gender}
                    </p>
                  )}
                  {sender.about && (
                    <p className="text-sm line-clamp-2 mt-1 opacity-90">{sender.about}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  disabled={isActing}
                  className="btn btn-outline btn-error btn-sm"
                  onClick={() => handleReview("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={isActing}
                  className="btn btn-primary btn-sm"
                  onClick={() => handleReview("accepted", request._id)}
                >
                  {isActing ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestsPage;
