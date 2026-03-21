import { Music } from 'lucide-react'

export function Header() {
  return (
    <header className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
        <Music className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Convert M4A to MP3
      </h1>
      <p className="mt-1.5 text-sm text-gray-400">
        Fast, private conversion right in your browser. No uploads, no sign-ups.
      </p>
    </header>
  )
}
