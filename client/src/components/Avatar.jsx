const Avatar = (props) => {
  let colors = [
    "#2196F3",
    "#32c787",
    "#00BCD4",
    "#ff5652",
    "#ffc107",
    "#ff85af",
    "#FF9800",
    "#39bbb0",
    "#7d4cdb",
    "#b55400",
    "#e64a19",
    "#ff5722",
    "#795548",
    "#ffc107",
  ];
  let name = props.name.trim().slice(0, 30);
  var hash = 0;
  for (var i = 0; i < name?.length; i++) {
    hash = 31 * hash + name?.charCodeAt(i);
  }
  var index = Math.abs(hash % colors.length);
  return (
    <div
      className={`h-10 w-10 rounded-full relative `}
      style={{
        background: colors[index],
      }}
    >
      <span className="text-white text-2xl font-semibold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {name ? name.charAt(0).toUpperCase() : "?"}
      </span>
    </div>
  );
};

export default Avatar;
