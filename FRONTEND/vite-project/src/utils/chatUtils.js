export const getOtherUser = (conv, currentUserId) => {
  if (!conv?.members || conv.members.length === 0) return null;

  return conv.members.find(
    (m) => m?._id?.toString() !== currentUserId?.toString()
  );
};