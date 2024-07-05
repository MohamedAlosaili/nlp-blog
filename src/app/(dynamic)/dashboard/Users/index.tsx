import { Avatar } from "@/components/ui/avatar";
import * as userRepo from "@/repos/users";
import { IDashboardUser, IUser } from "@/types";
import { getProfileImage } from "@/utils/images";
import { UserStatusButtons } from "./UserStatusButtons";

export const Users = async ({ user }: { user: IUser }) => {
  const users = await userRepo.getAllUsers({ currentUserId: user.id });

  if (users.length === 0) {
    return <div>لا يوجد مستخدمين</div>;
  }

  return (
    <div>
      {users.map(user => (
        <User key={user.id} user={user} />
      ))}
    </div>
  );
};

const User = ({ user }: { user: IDashboardUser }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between py-4 border-b-2 border-slate-200/80 last:border-b-0 sm:items-center gap-6">
      <div className="flex items-center gap-2">
        <Avatar
          src={user.photo && getProfileImage(user.photo)}
          alt={user.name}
          size={40}
          className="h-10 w-10"
        />
        <div>
          <p>{user.name}</p>
          <p className="text-slate-600 text-xs">{user.email}</p>
        </div>
      </div>
      <UserStatusButtons user={user} />
    </div>
  );
};
