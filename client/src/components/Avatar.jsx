import "./Avatar.css";

const Avatar = ({ user, className }) => {
  if (!user) return null;

  return (
    <div className={className}>
      <img className="user-img" src={user.avatar_url} alt={user.username} />
    </div>
  );
};

export default Avatar;
