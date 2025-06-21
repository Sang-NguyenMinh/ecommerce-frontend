interface SectionProps {
  heading: string;
  title?: string;
  className?: string;
  headingClassName?: string;
  titleClassName?: string;
  containerClassName?: string;
  showHeader?: boolean;
  headerAlignment?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  heading,
  title,
  className = '',
  headingClassName = '',
  titleClassName = '',
  containerClassName = '',
  showHeader = true,
  headerAlignment = 'center',
  children,
}) => {
  const getAlignmentClass = () => {
    switch (headerAlignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  return (
    <section className={`py-10 px-4 lg:px-8 bg-gray-50 ${className}`}>
      <div className={`w-[80%] mx-auto ${containerClassName}`}>
        {showHeader && (
          <div className={`mb-12 ${getAlignmentClass()}`}>
            <h2
              className={`text-3xl lg:text-4xl font-bold mb-4 ${headingClassName}`}
            >
              {heading}
            </h2>
            {title && (
              <p className={`text-gray-600 text-lg ${titleClassName}`}>
                {title}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
};

export default Section;
