"use client";

import React from "react";

interface ProfileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default ProfileLayout;
