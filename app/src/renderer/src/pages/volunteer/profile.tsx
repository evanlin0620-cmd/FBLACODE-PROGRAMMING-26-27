/** Volunteer profile: contact info, skills, interests, weekly availability, and hour goal. */
import { useEffect, useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup } from '@/components/ui/field'
import { Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { FormField, numberValue } from '@/components/form'
import { useMutation, useQuery } from '@/lib/hooks'
import { ACTIVITY_TYPES, WEEKDAYS, type ActivityType, type AvailabilityBlock, type Profile, type Skill } from '@shared/types'

/** A wrap of checkbox chips for picking several items. */
function ChipChecks<T extends string | number>({
  legend,
  options,
  selected,
  onChange,
  error
}: {
  legend: string
  options: { value: T; label: string }[]
  selected: T[]
  onChange: (next: T[]) => void
  error?: string
}): React.JSX.Element {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = selected.includes(o.value)
          return (
            <label
              key={o.value}
              className="flex h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground"
            >
              <Checkbox checked={checked} onCheckedChange={(c) => onChange(c ? [...selected, o.value] : selected.filter((v) => v !== o.value))} />
              {o.label}
            </label>
          )
        })}
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </fieldset>
  )
}

function ProfileForm({ profile, skills, onSaved }: { profile: Profile; skills: Skill[]; onSaved: (p: Profile) => void }): React.JSX.Element {
  const save = useMutation('profile.update', { success: 'Profile saved.' })
  const [fullName, setFullName] = useState(profile.fullName)
  const [phone, setPhone] = useState(profile.phone)
  const [bio, setBio] = useState(profile.bio)
  const [hourGoal, setHourGoal] = useState(String(profile.hourGoal))
  const [interests, setInterests] = useState<ActivityType[]>(profile.interests)
  const [skillIds, setSkillIds] = useState<number[]>(profile.skills.map((s) => s.id))
  const [availability, setAvailability] = useState<AvailabilityBlock[]>(profile.availability)
  const e = save.fieldErrors

  const setBlock = (i: number, patch: Partial<AvailabilityBlock>): void => {
    setAvailability(availability.map((b, j) => (j === i ? { ...b, ...patch } : b)))
    save.clearField('availability')
  }

  const submit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault()
    const p = await save.run({ fullName, phone, bio, hourGoal: numberValue(hourGoal), interests, skillIds, availability })
    if (p) onSaved(p)
  }

  // Errors for one availability row arrive as "availability.0.end"
  const blockError = (i: number): string | undefined => e[`availability.${i}.end`] ?? e[`availability.${i}.start`]

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 lg:grid-cols-[2fr_3fr]">
      <Panel title="About you">
        <FieldGroup className="gap-4">
          <FormField label="Full name" error={e.fullName}>
            {(p) => <Input {...p} value={fullName} onChange={(ev) => setFullName(ev.target.value)} autoComplete="name" />}
          </FormField>
          <FormField label="Email">
            {(p) => <Input {...p} value={profile.email} readOnly disabled />}
          </FormField>
          <FormField label="Phone (optional)" error={e.phone}>
            {(p) => <Input {...p} type="tel" value={phone} onChange={(ev) => setPhone(ev.target.value)} placeholder="(555) 123-4567" autoComplete="tel" />}
          </FormField>
          <FormField label="Short bio (optional)" error={e.bio}>
            {(p) => <Textarea {...p} rows={3} maxLength={500} value={bio} onChange={(ev) => setBio(ev.target.value)} />}
          </FormField>
          <FormField label="Hour goal" error={e.hourGoal} hint="Shown as a progress bar on your dashboard.">
            {(p) => <Input {...p} type="number" min={1} max={1000} className="w-28 tabular" value={hourGoal} onChange={(ev) => setHourGoal(ev.target.value)} />}
          </FormField>
        </FieldGroup>
      </Panel>

      <div className="space-y-5">
        <Panel title="Skills and interests" description="Used to recommend shifts and to help coordinators find you.">
          <div className="space-y-5">
            <ChipChecks legend="Skills" options={skills.map((s) => ({ value: s.id, label: s.name }))} selected={skillIds} onChange={setSkillIds} error={e.skillIds} />
            <ChipChecks legend="Interests" options={ACTIVITY_TYPES.map((t) => ({ value: t, label: t }))} selected={interests} onChange={setInterests} />
          </div>
        </Panel>

        <Panel
          title="When you’re free"
          description="Add the weekly times you can usually volunteer."
          action={
            <Button type="button" variant="outline" size="sm" onClick={() => setAvailability([...availability, { weekday: 6, start: '09:00', end: '12:00' }])}>
              <Plus aria-hidden /> Add time
            </Button>
          }
        >
          {availability.length === 0 ? (
            <p className="text-sm text-muted-foreground">No times added yet.</p>
          ) : (
            <ul className="space-y-2">
              {availability.map((b, i) => (
                <li key={i}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={String(b.weekday)} onValueChange={(v) => setBlock(i, { weekday: Number(v) })}>
                      <SelectTrigger className="w-[140px]" aria-label={`Day for time ${i + 1}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WEEKDAYS.map((d, n) => (
                          <SelectItem key={d} value={String(n)}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="time" className="w-[136px] tabular" aria-label={`Start time ${i + 1}`} value={b.start} onChange={(ev) => setBlock(i, { start: ev.target.value })} />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input type="time" className="w-[136px] tabular" aria-label={`End time ${i + 1}`} value={b.end} onChange={(ev) => setBlock(i, { end: ev.target.value })} />
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove time ${i + 1}`} onClick={() => setAvailability(availability.filter((_, j) => j !== i))}>
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                  {blockError(i) && <p className="mt-1 text-sm text-destructive">{blockError(i)}</p>}
                </li>
              ))}
            </ul>
          )}
          {e.availability && <p className="mt-2 text-sm text-destructive">{e.availability}</p>}
        </Panel>

        <div className="flex justify-end">
          <Button type="submit" disabled={save.pending}>
            {save.pending ? 'Saving…' : 'Save profile'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export function ProfilePage(): React.JSX.Element {
  const profile = useQuery('profile.get')
  const skills = useQuery('skills.list')
  const [version, setVersion] = useState(0)
  useEffect(() => setVersion((v) => v + 1), [profile.data])
  const both = {
    data: profile.data && skills.data ? { profile: profile.data, skills: skills.data } : undefined,
    error: profile.error ?? skills.error,
    loading: profile.loading || skills.loading,
    reload: () => {
      profile.reload()
      skills.reload()
    }
  }
  return (
    <>
      <PageHeader title="My profile" subtitle="Keep this up to date so we can match you with the right shifts." />
      <PageBody>
        <Loader query={both} skeleton="form">
          {(d) => <ProfileForm key={version} profile={d.profile} skills={d.skills} onSaved={() => profile.reload()} />}
        </Loader>
      </PageBody>
    </>
  )
}
