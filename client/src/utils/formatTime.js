export const calculateTimeDifference = (epochTimestamp) => {
  const epochMillis = epochTimestamp * 1000;
  const convertedDate = new Date(epochMillis);
  const currentTime = Date.now();
  const timeDifference = currentTime - epochMillis;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesDifference = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );

  if (daysDifference > 0) {
    return `${daysDifference} d ago`;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} h ago`;
  } else if (minutesDifference > 1) {
    return `${minutesDifference} m ago`;
  } else {
    return "now";
  }
};

export const formatMessageTime = (timeObject) => {
  const { daysDifference, hoursDifference, minutesDifference } = timeObject;
};
