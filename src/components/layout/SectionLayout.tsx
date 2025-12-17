import React from 'react';

interface SectionLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  enableHorizontalScroll?: boolean;
  showViewAllButton?: boolean;
  viewAllText?: string;
  onViewAllClick?: () => void;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
  enableHorizontalScroll = false,
  showViewAllButton = false,
  viewAllText = 'Xem Tất Cả',
  onViewAllClick,
}) => {
  return (
    <section className={`w-full py-8 lg:py-20 ${className}`}>
      <div className="mx-auto px-4">
        <div className={`text-center mb-6 lg:mb-10 ${headerClassName}`}>
          <h2 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-base lg:text-lg">{subtitle}</p>
          )}
        </div>

        <div className={enableHorizontalScroll ? 'lg:overflow-visible' : ''}>
          {enableHorizontalScroll ? (
            <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible">
              <div className="inline-flex lg:flex lg:flex-wrap lg:justify-start  gap-4 lg:gap-10 pb-4 lg:px-6 lg:pb-0">
                {children}
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {showViewAllButton && (
          <div className="text-center mt-6 lg:mt-8">
            <button
              onClick={onViewAllClick}
              className="px-8 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-base font-medium"
            >
              {viewAllText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionLayout;
