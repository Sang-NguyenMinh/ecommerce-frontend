'use client';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div>
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
          >
            {child}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
