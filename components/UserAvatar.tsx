"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

const UserAvatar = ({ user }: { user: User  }) => {
    return (
        <div>
            <Avatar>
                <AvatarImage src={user?.imageUrl} alt={user?.name} />
                <AvatarFallback>{user ? user.name : ""}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">
                {user ? user.name : "Unassigned"}
            </span>
        </div>
    );
};

export default UserAvatar;
