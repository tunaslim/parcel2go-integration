// This is the root layout required by Next.js 13+ for the app directory

export const metadata = {
  title: 'Parcel2Go Integration',
  description: 'Get shipping quotes and labels easily',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <header style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
          <h1>Parcel2Go Integration</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
