import './styles.css';

export const metadata = {
  title: 'Parcel2Go Integration',
  description: 'Get shipping quotes and labels easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>Parcel2Go Integration</h1>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
