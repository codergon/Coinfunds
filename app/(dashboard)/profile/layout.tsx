import Topbar from "@/components/shared/Topbar";

interface Props {
  children: React.ReactNode;
}

function Profile({ children }: Props) {
  return (
    <div className="profile">
      <Topbar title="" />
      <div className="profile__content">{children}</div>
    </div>
  );
}

export default Profile;
