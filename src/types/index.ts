import type { ReactNode } from 'react'

export type EarnCard = {
  title: string;
  yield: string;
  description: ReactNode | string;
  path: string;
  rewardsDescriprtion: string;
};
