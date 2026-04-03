import { redirect } from 'next/navigation'

/**
 * Alias route: profile UI lives under route group `(dashboard)` at `/profile`, not under `/dashboard/*`.
 * Users/bookmarks expecting `/dashboard/profile` are sent to the canonical URL.
 */
export default function DashboardProfileAliasPage(): never {
  redirect('/profile')
}
