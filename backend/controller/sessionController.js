import Session from "../models/Session.js";
import { chatClient, streamClient } from "../util/stream.js";

export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if (!problem || !difficulty) {
            return res.status(400).json({ message: "Problem and difficulty are required" })
        }

        //generate unique callId for stream video call
        const callId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        let session;
        try {
            session = await Session.create({ problem, difficulty, host: userId, callId });

            //create stream video call
            await streamClient.video.call("default", callId).getOrCreate({
                data: {
                    created_by_id: clerkId,
                    custom: { problem, difficulty, sessionId: session._id.toString() },
                }
            });
            //chat message
            const channel = chatClient.channel("messaging", callId, {
                name: `${problem} Session`,
                created_by_id: clerkId,
                members: [clerkId],
            })

            await channel.create();
            res.status(201).json({ session });
        } catch (err) {
            if (session) {
                await Session.findByIdAndDelete(session._id);
            }
            throw err;
        }

    } catch (error) {
        console.error("Error in createSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getActiveSessions(req, res) {
    try {
        const sessions = await Session.find({ status: "active" })
            .populate("host", "name profileImage eamil clerkId")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error in getActiveSessions controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyRecentSessions(req, res) {
    try {
        const userId = req.user._id;
        //get session where user is host or participant
        const sessions = await Session.find({
            status: "Completed",
            $or: [{ host: userId }, { participant: userId }],
        }).sort({ createdAt: -1 }).limit(20);
        res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error in getMyRecentSessions controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getSessionById(req, res) {
    try {
        const { id } = req.params;
        const session = await Session.findById(id)
            .populate("host", "name email profileImage clerkId")
            .populate("participant", "name email profileImage clerkId");
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.status(200).json({ session });
    } catch (error) {
        console.error("Error in getSessionById controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function joinSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findOneAndUpdate(
            {
                _id: id,
                status: "active",
                participant: { $exists: false },
                host: { $ne: userId },
            },
            { participant: userId },
            { new: true }
        );

        if (!session) {
            return res.status(409).json({ message: "Session is full or unavailable" });
        }


        if (session.status !== "active") {
            return res.status(400).json({ message: "Cannot join a completed session" });
        }

        //check if the user is the host
        if (session.host.toString() === userId.toString()) {
            return res.status(400).json({ message: "Host cannot join their own session as participant" });
        }

        //check if the session is already full - has a participant
        if (session.participant) return res.status(409).json({ message: "Session is already full" });

        session.participant = userId;
        await session.save();

        //add user to stream video call
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId])
        res.status(200).json({ session });
    } catch (error) {
        console.error("Error in joinSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        //check if the user is the host
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the host can end the session" });
        }

        //check if the session is already completed
        if (session.status === "Completed") {
            return res.status(400).json({ message: "Session is already completed" });
        }

        //delete stream video call
        const call = await streamClient.video.call("default", session.callId)
        await call.delete({ hard: true });

        //delete chat channel
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();

        session.status = "Completed";
        await session.save();

        res.status(200).json({ session, message: "Session ended successfully" });
    } catch (error) {
        console.error("Error in endSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}