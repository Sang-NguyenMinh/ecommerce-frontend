import React from 'react';
import { Skeleton } from 'antd';

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
  isLoading?: boolean;
  skeletonCount?: number;
  skeletonType?: 'product' | 'category' | 'custom';
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
  isLoading = false,
  skeletonCount = 5,
  skeletonType = 'product',
}) => {
  const ProductSkeleton = () => (
    <div className="inline-block" style={{ width: 280 }}>
      <Skeleton.Image
        active
        style={{ width: 280, height: 350, borderRadius: 12 }}
      />
      <div className="mt-3 space-y-2">
        <Skeleton.Input active style={{ width: '100%', height: 20 }} />
        <Skeleton.Input active style={{ width: '60%', height: 24 }} />
        <Skeleton.Button active style={{ width: '40%', height: 20 }} />
      </div>
    </div>
  );

  const CategorySkeleton = () => (
    <div className="flex flex-col items-center gap-3">
      <Skeleton.Avatar active size={150} shape="circle" />
      <Skeleton.Input active style={{ width: 120, height: 20 }} />
    </div>
  );

  const renderSkeleton = () => {
    const skeletons = Array.from({ length: skeletonCount }, (_, i) => (
      <React.Fragment key={i}>
        {skeletonType === 'product' && <ProductSkeleton />}
        {skeletonType === 'category' && <CategorySkeleton />}
      </React.Fragment>
    ));

    if (enableHorizontalScroll) {
      return (
        <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible">
          <div className="inline-flex lg:flex lg:flex-wrap lg:justify-start gap-4 lg:gap-10 pb-4 lg:px-6 lg:pb-0">
            {skeletons}
          </div>
        </div>
      );
    }

    if (skeletonType === 'category') {
      return (
        <div className="max-w-[85%] mx-auto">
          <div className="flex gap-10 overflow-hidden">{skeletons}</div>
        </div>
      );
    }

    return skeletons;
  };

  return (
    <section className={`w-full mr-auto! py-8 lg:py-20 ${className}`}>
      <div className="mx-auto! px-4">
        <div className={`text-center mb-6 lg:mb-10 ${headerClassName}`}>
          <h2 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-base lg:text-lg">{subtitle}</p>
          )}
        </div>

        <div className={enableHorizontalScroll ? 'lg:overflow-visible' : ''}>
          {isLoading ? (
            renderSkeleton()
          ) : enableHorizontalScroll ? (
            <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible">
              <div className="inline-flex lg:flex lg:flex-wrap lg:justify-start gap-4 lg:gap-10 pb-4 lg:px-6 lg:pb-0">
                {children}
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {showViewAllButton && !isLoading && (
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
