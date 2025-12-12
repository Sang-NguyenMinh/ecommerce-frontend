import React from 'react';

interface SectionLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
}) => {
  return (
    <section className={`w-full py-20 my-0! lg:my-12 ${className}`}>
      <div className="mx-auto px-4">
        <div className={`text-center mb-6 lg:mb-10 ${headerClassName}`}>
          <h2 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-base lg:text-lg">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
};

export default SectionLayout;
