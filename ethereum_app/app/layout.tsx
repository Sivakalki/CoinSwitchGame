// app/layout.tsx
import './globals.css'; // Import your global styles
import { Inter } from 'next/font/google'; // Import any fonts or other global imports
import { ReactNode } from 'react';
import { ConfigProvider } from 'antd'; // Import Ant Design ConfigProvider if needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My App',
  description: 'My awesome app description',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
