import React, { FC } from 'react';

interface StatusIconProps {
  status: 'sent' | 'delivered' | 'read';
}

const StatusIcon: FC<StatusIconProps> = ({ status }) => {
    let icon = '✓';
    if (status === 'delivered') icon = '✓✓';
    if (status === 'read') return <span className="text-blue-500">✓✓</span>;
    return <span className="text-gray-500 dark:text-gray-400 -ml-1">{icon}</span>;
};

export default StatusIcon;