"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

interface Props {
  children: ReactNode;
}

export default function ThemeClientProvider({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AntdRegistry>{children}</AntdRegistry>
    </ThemeProvider>
  );
}
