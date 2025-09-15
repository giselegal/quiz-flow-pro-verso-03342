import React from 'react';
import { useEditor } from '@craftjs/core';
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
    const { connectors: { connect } } = useEditor();

    return (
        <div ref={(ref) => { if (ref) connect(ref as HTMLElement); }} className={cn('user-info-section flex items-center p-4', className)}>
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
            {showUserName && <span className="font-medium">{userName}</span>}
        </div>
    );
};

export const UserInfoSection = withCraftjsComponent(UserInfoSectionComponent);
export default UserInfoSection;