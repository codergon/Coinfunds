import Topbar from "@/components/shared/Topbar";

interface PageProps {
  children: React.ReactNode;
}

function Profile({ children }: PageProps) {
  return (
    <div className="profile">
      <Topbar title="" />
      <div className="profile__content">{children}</div>
    </div>
  );
}

export default Profile;
