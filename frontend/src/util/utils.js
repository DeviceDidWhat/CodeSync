export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

export const hasParticipant = (session) => {
  const p = session?.participant;
  if (!p) return false;
  if (Array.isArray(p)) return p.filter(Boolean).length > 0;
  if (typeof p === "string") return p.length > 0;
  if (typeof p === "object") return Boolean(p._id || p.clerkId || p.id);
  return false;
};