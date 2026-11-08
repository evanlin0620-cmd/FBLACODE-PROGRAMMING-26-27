/**
 * The printable Community Service Certificate. Used by volunteers for themselves
 * and by admins (issue for a volunteer, or verify a code someone shows them).
 */
import { Heart } from 'lucide-react'
import type { Certificate } from '@shared/types'
import { fmtDate, fmtHours } from '@/lib/format'

export function CertificateView({ cert }: { cert: Certificate }): React.JSX.Element {
  return (
    <article className="mx-auto max-w-[760px] rounded-xl border-2 border-primary/70 bg-white p-10 text-zinc-950 print:border-primary" aria-label="Community service certificate">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-[#15803d] text-white">
          <Heart className="size-[18px]" strokeWidth={2.4} aria-hidden />
        </span>
        <div className="leading-tight">
          <p className="font-semibold">{cert.organization}</p>
          <p className="text-xs text-zinc-600">via ServeHub</p>
        </div>
      </div>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight">Community Service Certificate</h2>
      <p className="mt-4 text-zinc-600">This certifies that</p>
      <p className="mt-1 text-2xl font-semibold">{cert.volunteerName}</p>
      <p className="mt-3 text-zinc-700">
        completed <strong className="tabular text-zinc-950">{fmtHours(cert.totalHours)} hours</strong> of approved volunteer service with {cert.organization}.
      </p>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-300 text-left text-zinc-600">
            <th className="py-2 font-medium">Activity</th>
            <th className="py-2 font-medium">Date</th>
            <th className="py-2 text-right font-medium">Hours</th>
          </tr>
        </thead>
        <tbody>
          {cert.activities.map((a, i) => (
            <tr key={i} className="border-b border-zinc-200">
              <td className="py-2">{a.title}</td>
              <td className="py-2 text-zinc-600">{fmtDate(a.date)}</td>
              <td className="py-2 text-right">{fmtHours(a.hours)}</td>
            </tr>
          ))}
          <tr>
            <td className="pt-3 font-semibold" colSpan={2}>
              Total
            </td>
            <td className="pt-3 text-right font-semibold">{fmtHours(cert.totalHours)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-10 flex items-end justify-between gap-6 text-sm">
        <div>
          <p className="text-zinc-600">Issued</p>
          <p className="font-medium">{fmtDate(cert.issuedAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-600">Verification code</p>
          <p className="font-mono text-lg font-semibold tracking-wider">{cert.code}</p>
          <p className="text-xs text-zinc-600">Ask {cert.organization} to confirm this code.</p>
        </div>
      </div>
    </article>
  )
}
