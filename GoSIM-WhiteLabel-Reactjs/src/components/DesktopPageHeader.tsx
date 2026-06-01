import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface DesktopPageHeaderProps {
  title: string;
  showArrow?: boolean;
  backRoute?: string | null;
  customBackAction?: (() => void) | null;
  children?: React.ReactNode;
}

export const DesktopPageHeader: React.FC<DesktopPageHeaderProps> = ({
  title,
  showArrow = true,
  backRoute = null,
  customBackAction = null,
  children,
}) => {
  const navigate = useNavigate();
  const { language } = useApp();

  const goBack = () => {
    if (customBackAction) {
      customBackAction();
    } else if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="hidden md:block my-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showArrow && (
            <button
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <i className={`fa-solid fa-angle-left text-2xl ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </div>
  );
};
