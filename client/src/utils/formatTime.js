export const calculateTimeDifference = (epochTimestamp) => {
  // Chuyển epoch timestamp thành milliseconds (đơn vị mili giây)
  const epochMillis = epochTimestamp * 1000;

  // Tạo một đối tượng Date từ epoch milliseconds
  const convertedDate = new Date(epochMillis);

  // Lấy thời gian hiện tại (milliseconds từ epoch)
  const currentTime = Date.now();

  // Tính thời gian chênh lệch
  const timeDifference = currentTime - epochMillis;

  // Chuyển đổi thời gian chênh lệch thành ngày, giờ, phút, giây
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
