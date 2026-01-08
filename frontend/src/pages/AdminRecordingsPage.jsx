import { useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAllRecordings } from "../hooks/useRecordings";
import Navbar from "../components/navbar";
import { Loader2Icon, DownloadIcon, VideoIcon, CalendarIcon, UserIcon, AlertCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { getDifficultyBadgeClass } from "../util/utils";

function AdminRecordingsPage() {
  const { user } = useUser();
  const { data, isLoading, error } = useAllRecordings();

  // Filter sessions where current user is the host AND have recordings
  const userRecordedSessions = useMemo(() => {
    if (!data || !user) return [];

    return data.sessionsWithRecordings.filter(
      (session) => session.host?.clerkId === user.id
    );
  }, [data, user]);

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "recording.mp4";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">My Session Recordings</h1>
          <p className="text-base-content/60">View and download recordings from sessions you hosted</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
              <p className="text-lg">Loading recordings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <AlertCircleIcon className="w-6 h-6" />
            <span>Failed to load recordings. You may need admin permissions.</span>
          </div>
        ) : (
          <>
            {/* Stats Card */}
            <div className="stats shadow mb-6 w-full">
              <div className="stat">
                <div className="stat-title">Total Recordings</div>
                <div className="stat-value text-primary">{userRecordedSessions.length}</div>
                <div className="stat-desc">
                  {userRecordedSessions.reduce((total, session) => total + session.recordings.length, 0)} video file(s)
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              {userRecordedSessions.length === 0 ? (
                <div className="card bg-base-200">
                  <div className="card-body text-center">
                    <VideoIcon className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
                    <h3 className="text-xl font-semibold">No recordings found</h3>
                    <p className="text-base-content/60">
                      You don't have any recorded sessions yet. Start a session and click the Record button to create recordings!
                    </p>
                  </div>
                </div>
              ) : (
                userRecordedSessions.map((session) => (
                  <div key={session.sessionId} className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="card-title">{session.problem}</h2>
                            <span className={`badge ${getDifficultyBadgeClass(session.difficulty)}`}>
                              {session.difficulty}
                            </span>
                            {session.hasRecordings && (
                              <span className="badge badge-success gap-1">
                                <VideoIcon className="w-3 h-3" />
                                {session.recordings.length} recording(s)
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-4 h-4" />
                              <span>Host: {session.host?.name || "Unknown"}</span>
                            </div>
                            {session.participant && (
                              <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                <span>Participant: {session.participant?.name || "Unknown"}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{format(new Date(session.createdAt), "PPp")}</span>
                            </div>
                          </div>

                          {session.error && (
                            <div className="alert alert-warning mt-2">
                              <AlertCircleIcon className="w-4 h-4" />
                              <span className="text-sm">{session.error}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recordings List */}
                      {session.recordings && session.recordings.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h3 className="font-semibold text-sm text-base-content/70">Recordings:</h3>
                          {session.recordings.map((recording, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-base-300 p-3 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <VideoIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium">{recording.filename || `Recording ${idx + 1}`}</p>
                                  <p className="text-xs text-base-content/60">
                                    {recording.start_time &&
                                      format(new Date(recording.start_time), "PPp")}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleDownload(
                                    recording.url,
                                    recording.filename || `${session.problem}-recording-${idx + 1}.mp4`
                                  )
                                }
                                className="btn btn-primary btn-sm gap-2"
                              >
                                <DownloadIcon className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminRecordingsPage;
