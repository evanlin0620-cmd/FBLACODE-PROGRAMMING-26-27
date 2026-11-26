import { describe, expect, it } from 'vitest'
import { makeWorld, type World } from './helpers'
import type { SessionUser } from '../../src/shared/types'
import { run } from '../../src/main/db'
import { inviteVolunteer, suggestVolunteers } from '../../src/main/services/profiles'
import { cancelActivity } from '../../src/main/services/activities'
import { signUp } from '../../src/main/services/signups'
import { myNotifications } from '../../src/main/services/log'

describe('fill-a-shift assist', () => {
  function setup(): { w: World; id: number; medic: SessionUser; medic2: SessionUser; other: SessionUser } {
    const w = makeWorld()
    const firstAid = w.skill('First aid')
    const id = w.activity({ title: 'Health Fair', capacity: 2 })
    run(w.db, 'INSERT INTO activity_skills (activity_id, skill_id) VALUES (?, ?)', id, firstAid)
    const [medic, medic2, other] = [
      w.volunteer('Ana Medic'),
      w.volunteer('Ben Medic'),
      w.volunteer('Cy Other')
    ]
    for (const v of [medic, medic2])
      run(w.db, 'INSERT INTO volunteer_skills (user_id, skill_id) VALUES (?, ?)', v.id, firstAid)
    return { w, id, medic, medic2, other }
  }

  it('suggests matching volunteers who are not signed up, best first, with the reason', () => {
    const { w, id, medic, medic2 } = setup()
    signUp(w.as(medic2), id)
    const s = suggestVolunteers(w.as(w.admin), id)
    expect(s.map((x) => x.fullName)).toEqual(['Ana Medic']) // Ben is signed up; Cy lacks the skill (under 50%)
    expect(s[0]).toMatchObject({
      userId: medic.id,
      score: 50,
      invited: false,
      note: 'Uses your skill: First aid'
    })
  })

  it('invites once, notifies the volunteer, and refuses repeat, full, cancelled and non-admin invites', () => {
    const { w, id, medic, medic2, other } = setup()
    inviteVolunteer(w.as(w.admin), { activityId: id, userId: medic.id })
    expect(
      myNotifications(w.as(medic)).some(
        (n) => n.type === 'shift_invite' && n.subject === 'You’re invited: Health Fair'
      )
    ).toBe(true)
    expect(suggestVolunteers(w.as(w.admin), id)[0]!.invited).toBe(true)

    expect(() => inviteVolunteer(w.as(w.admin), { activityId: id, userId: medic.id })).toThrow(
      /already been invited/
    )
    expect(() => inviteVolunteer(w.as(medic), { activityId: id, userId: medic2.id })).toThrow(
      /Only administrators/
    )

    signUp(w.as(medic2), id)
    signUp(w.as(other), id)
    expect(() =>
      inviteVolunteer(w.as(w.admin), { activityId: id, userId: w.volunteer().id })
    ).toThrow(/already full/)

    cancelActivity(w.as(w.admin), id)
    expect(() =>
      inviteVolunteer(w.as(w.admin), { activityId: id, userId: w.volunteer().id })
    ).toThrow(/cancelled/)
  })
})
