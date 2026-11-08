/** Creates a certificate on request and lets the volunteer save it as a PDF. */
import { useState } from 'react'
import { Link } from 'react-router'
import { Award, ArrowLeft, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { EmptyState, PageBody, PageHeader } from '@/components/page'
import { CertificateView } from '@/components/certificate-view'
import { useMutation } from '@/lib/hooks'
import type { Certificate } from '@shared/types'

export function CertificatePage(): React.JSX.Element {
  const issue = useMutation('certificates.issue')
  const save = useMutation('reports.savePdf')
  const [cert, setCert] = useState<Certificate | null>(null)

  const savePdf = async (): Promise<void> => {
    if (!cert) return
    const r = await save.run({ suggestedName: `certificate-${cert.volunteerName}-${cert.code}` })
    if (r?.saved) toast.success('Certificate saved as a PDF.')
  }

  return (
    <>
      <PageHeader
        title="Community service certificate"
        subtitle="A summary of your approved hours with a code anyone can ask us to verify."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/hours">
                <ArrowLeft aria-hidden /> My hours
              </Link>
            </Button>
            {cert && (
              <Button onClick={savePdf} disabled={save.pending}>
                <Download aria-hidden /> Save as PDF
              </Button>
            )}
          </>
        }
      />
      <PageBody>
        {cert ? (
          <CertificateView cert={cert} />
        ) : (
          <EmptyState
            icon={<Award />}
            title="Create your certificate"
            description="It lists every shift with approved hours. Pending hours aren’t included until they’re approved."
            action={
              <Button
                onClick={async () => {
                  const c = await issue.run(undefined)
                  if (c) setCert(c)
                }}
                disabled={issue.pending}
              >
                {issue.pending ? 'Creating…' : 'Create certificate'}
              </Button>
            }
          />
        )}
      </PageBody>
    </>
  )
}
