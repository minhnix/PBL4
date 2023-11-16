export const formatMessageTime = (timestamp) => {
  // Calculate time difference
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - timestamp;

  // Format time based on the difference
  if (timeDifference < 60000) {
    return "Now";
  } else if (timeDifference < 3600000) {
    const minutes = Math.floor(timeDifference / 60000);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDifference < 86400000) {
    const hours = Math.floor(timeDifference / 3600000);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(timeDifference / 86400000);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};
