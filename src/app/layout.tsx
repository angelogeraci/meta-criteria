import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meta Criteria',
  description: 'Trouvez les meilleures correspondances pour vos critères avec l\'API Marketing de Meta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-meta-blue">Meta Criteria</h1>
            <p className="text-gray-600">Trouvez les meilleures correspondances pour vos critères</p>
          </header>
          {children}
        </main>
      </body>
    </html>
  )
}