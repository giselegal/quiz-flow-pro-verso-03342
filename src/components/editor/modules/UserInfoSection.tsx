import React from 'react';
import { cn } from '@/lib/utils';
import { BaseModuleProps, withCraftjsComponent } from './types';

export interface UserInfoSectionProps extends BaseModuleProps {
    userName?: string;
    showUserName?: boolean;
    avatarUrl?: string;
    userNamePrefix?: string;
    showBadge?: boolean;
    badgeText?: string;
    [key: string]: any;
}

const UserInfoSectionComponent: React.FC<UserInfoSectionProps> = ({
    userName = 'Usuário',
    showUserName = true,
    avatarUrl = '/default-avatar.png',
    className = '',
}) => {
    // Removed useEditor for build compatibility

    return (
        <div className={cn('user-info-section flex items-center p-4', className)}>
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
            {showUserName && <span className="font-medium">{userName}</span>}
        </div>
    );
};

export const UserInfoSection = withCraftjsComponent(UserInfoSectionComponent, {});
export default UserInfoSection;