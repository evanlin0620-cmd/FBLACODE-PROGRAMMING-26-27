/**
 * Help & questions: type a question in your own words and get the best matching
 * answers from the offline guide, or browse every topic for your role.
 */
import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageBody, PageHeader, Panel } from '@/components/page'
import { Pill } from '@/components/status'
import { useUser } from '@/lib/session'
import { answer, FAQS, type Faq } from '@shared/help'

const SHORTCUTS = [
  ['Jump to search', '/'],
  ['Open help', '?'],
  ['Move to the next item', 'Tab'],
  ['Close a dialog or menu', 'Esc']
]

function AnswerCard({ faq, best }: { faq: Faq; best?: boolean }): React.JSX.Element {
  return (
    <article className="rounded-xl border bg-card p-5">
      {best && <Pill tone="green">Best answer</Pill>}
      <h2 className="mt-3 text-lg font-semibold">{faq.question}</h2>
      <p className="mt-2 max-w-[65ch] leading-relaxed">{faq.answer}</p>
      {faq.link && (
        <Button variant="secondary" size="sm" className="mt-4" asChild>
          <Link to={faq.link}>
            Take me there <ArrowRight aria-hidden />
          </Link>
        </Button>
      )}
    </article>
  )
}

export function HelpPage(): React.JSX.Element {
  const user = useUser()
  const [text, setText] = useState('')
  const [asked, setAsked] = useState('')
  const results = useMemo(() => (asked ? answer(asked, user.role) : []), [asked, user.role])
  const mine = FAQS.filter((f) => f.roles.includes(user.role))
  const [best, ...related] = results

  const ask = (e?: FormEvent, q = text): void => {
    e?.preventDefault()
    setText(q)
    setAsked(q.trim())
  }

  return (
    <>
      <PageHeader title="Help & questions" subtitle="Ask in your own words. Answers come from the built-in guide and work offline." />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-5">
            <form onSubmit={ask} className="flex gap-2" role="search">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  data-page-search
                  autoFocus
                  aria-label="Ask a question"
                  className="h-10 pl-9"
                  placeholder={user.role === 'admin' ? 'e.g. how do I approve hours?' : 'e.g. how do I log my hours?'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-10">
                Ask
              </Button>
            </form>
            <div aria-live="polite" className="space-y-5">
              {asked && !best && (
                <div className="rounded-xl border border-dashed p-6">
                  <p className="font-medium">No answer matched “{asked}”.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try different words, or pick a topic from the list.</p>
                </div>
              )}
              {best && <AnswerCard faq={best} best />}
              {related.length > 0 && (
                <div>
                  <h2 className="mb-2 text-sm font-semibold">Related questions</h2>
                  <div className="flex flex-wrap gap-2">
                    {related.map((f) => (
                      <Button key={f.id} variant="outline" size="sm" onClick={() => ask(undefined, f.question)}>
                        {f.question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {!asked && (
                <p className="text-sm text-muted-foreground">
                  Try:{' '}
                  {(user.role === 'admin'
                    ? ['find a Spanish translator', 'why can’t I delete an activity', 'export a report']
                    : ['cancel a shift', 'how does the waitlist work', 'get a certificate']
                  ).map((s, i) => (
                    <span key={s}>
                      {i > 0 && ', '}
                      <button type="button" className="text-primary underline underline-offset-3" onClick={() => ask(undefined, s)}>
                        {s}
                      </button>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <Panel title="All topics">
              <ul className="-mx-2 space-y-0.5">
                {mine.map((f) => (
                  <li key={f.id}>
                    <button type="button" className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted" onClick={() => ask(undefined, f.question)}>
                      {f.question}
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Keyboard shortcuts">
              <dl className="space-y-2 text-sm">
                {SHORTCUTS.map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd>
                      <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">{key}</kbd>
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        </div>
      </PageBody>
    </>
  )
}
