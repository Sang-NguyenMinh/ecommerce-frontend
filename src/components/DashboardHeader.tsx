'use client';

import { Layout } from 'antd';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

function AppHeader() {
  const router = useRouter();

  return (
    <>
      {/* Banner thông báo */}
      <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-xs sm:text-sm px-4 py-2 text-center">
        Dashboard hiện đang trong quá trình phát triển. Một số chức năng và giao
        diện chỉ mang tính minh họa.
        <span className="ml-1 font-medium">Xin cảm ơn!</span>
      </div>

      {/* Header chính */}
      <Header className="!bg-white border-b border-[#f1f1f1] flex items-center justify-between sticky top-0 z-10">
        <div
          onClick={() => router.push('/')}
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black tracking-wider cursor-pointer"
        >
          ✓ NMS
        </div>
      </Header>
    </>
  );
}

export default AppHeader;
