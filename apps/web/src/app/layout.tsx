import './globals.css';

export const metadata = {
  title: 'MinPractice THPT',
  description: 'Luyen de thi THPT voi workflow lam bai hoan chinh.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
