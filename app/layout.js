import './globals.css';
import { Inter } from 'next/font/google';
import { MotionConfig } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dashboard App',
  description: 'User Management Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}