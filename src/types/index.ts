import type { ReactNode } from 'react'

export type EarnCard = {
  title: string;
  yield: string;
  description: ReactNode | string;
  path: string;
  rewardsDescriprtion: string;
};

// Other vault types to be OR'd here.
export type VaultTypes = 'Autocompounder';

export type VaultDetails = {
  name: string;
  type: VaultTypes;
  address: string;
  /**
   * **NOTE**: This is the _name_ of the rToken, and not a contract address.
   */
  rToken: string;
  /**
   * Contract address of the aToken
   */
  aToken: string;
  /**
   * Long format text.
   */
  details: string;
  /**
   * String representation of multiple fee numbers separated by hyphens.
   */
  fees: string;
  /**
   * Zapper contract address.
   */
  zapper: string;
}
