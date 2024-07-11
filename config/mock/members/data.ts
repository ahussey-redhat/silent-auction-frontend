import Chance from 'chance';
import { generateAccount } from '../account';
import { planMembers, plans } from '../plans';
import type { Member, MemberPlan, Plan } from '@/types';

const chance = new Chance();
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const members: Member[] = [];
let _memberPlans: MemberPlan[] = [];

const generateMemberPlans = (
  memberId: Member['id'],
  plan: Plan,
  minJoinDate: Date,
  maxJoinDate: Date,
) => {
  const memberPlans = chance.pickset(plans, chance.integer({ min: 0, max: 5 }));

  if (!memberPlans.some(({ id }) => id === plan.id)) {
    memberPlans.push(plan);
    memberPlans.reverse();
  }

  return memberPlans.map(plan =>
    generateMemberPlan(memberId, plan, minJoinDate, maxJoinDate),
  );
};

const generateMemberPlan = (
  memberId: Member['id'],
  plan: Plan,
  minJoinDate: Date,
  maxJoinDate: Date,
): MemberPlan => {
  const joinDate = chance.date({
    min: minJoinDate,
    max: maxJoinDate,
  }) as Date;

  const activeLikelihood =
    ((joinDate.getFullYear() - minJoinDate.getFullYear()) /
      (maxJoinDate.getFullYear() - minJoinDate.getFullYear())) *
    100;

  return {
    ...plan,
    id: chance.guid(),
    memberId,
    planId: plan.id,
    active: chance.bool({
      likelihood: activeLikelihood,
    }),
    joinDate: [
      joinDate.getDate(),
      joinDate.getMonth() + 1,
      joinDate.getFullYear(),
    ].join('/'),
    account: generateAccount(joinDate, maxJoinDate),
  };
};

export const generateMemberData = (plan: Plan): [Member, MemberPlan[]] => {
  const memberId = chance.guid();
  const gender = chance.gender() as Member['gender'];
  const genderOption = gender.toLowerCase() as Lowercase<Member['gender']>;
  const surname = chance.last();
  const givenNames = chance.name({ gender: genderOption });
  const dateOfBirth = chance.birthday({
    year: chance.year({ min: currentYear - 100, max: currentYear - 18 }),
  }) as Date;
  const eighteenthBirthday = new Date(
    dateOfBirth.getFullYear() + 18,
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  );
  const eightiethBirthday = new Date(
    dateOfBirth.getFullYear() + 80,
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  );
  const isHighRisk = chance.bool({ likelihood: 10 });
  const otherRisk = chance.bool() ? 'medium' : 'low';

  const memberPlans: MemberPlan[] = generateMemberPlans(
    memberId,
    plan,
    eighteenthBirthday > currentDate ? currentDate : eighteenthBirthday,
    eightiethBirthday > currentDate ? currentDate : eightiethBirthday,
  );

  const member: Member = {
    id: memberId,
    memberNumber: chance.integer({ min: 10000000, max: 99999999 }).toString(),
    customerReference: chance
      .integer({ min: 10000000, max: 99999999 })
      .toString(),
    surname,
    givenNames,
    title: chance.prefix({
      gender: genderOption,
      full: true,
    }) as Member['title'],
    gender,
    dateOfBirth: [
      dateOfBirth.getDate(),
      dateOfBirth.getMonth() + 1,
      dateOfBirth.getFullYear(),
    ].join('/'),
    active: memberPlans.some(({ active }) => active),
    risk: isHighRisk ? 'high' : otherRisk,
  };

  memberPlans.forEach(memberPlan => {
    planMembers.push({
      ...member,
      id: chance.guid(),
      planId: memberPlan.planId,
      memberId: memberPlan.memberId,
      active: memberPlan.active,
      joinDate: memberPlan.joinDate,
    });
  });

  return [member, memberPlans];
};

plans.forEach(plan => {
  for (let i = 0; i < chance.integer({ min: 1, max: 2 }); i++) {
    const [member, memberPlans] = generateMemberData(plan);
    members.push(member);
    _memberPlans = _memberPlans.concat(memberPlans);
  }
});

const memberPlans = _memberPlans;

export { members, memberPlans };
