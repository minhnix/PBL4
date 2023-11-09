export const calculateTimeDifference = (epochTimestamp) => {
  const epochMillis = convertToEpochMillis(epochTimestamp);
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
    return `${daysDifference} d `;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} h `;
  } else if (minutesDifference > 1) {
    return `${minutesDifference} m `;
  } else {
    return "now";
  }
};

function convertToEpochMillis(input) {
  if (typeof input === "number") {
    return input * 1000;
  } else if (typeof input === "string") {
    var dateObj = new Date(input);
    return dateObj.getTime();
  } else {
    return null;
  }
}

export const formatMessageTime = (timeObject) => {
  const { daysDifference, hoursDifference, minutesDifference } = timeObject;
};
