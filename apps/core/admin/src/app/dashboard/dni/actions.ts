'use server';

import { 
  getSubdomainConfig, 
  saveSubdomainConfig, 
  SubdomainConfig 
} from '@atpdev/database';
import { revalidatePath } from 'next/cache';

export async function fetchDniConfigAction(): Promise<SubdomainConfig> {
  return getSubdomainConfig('dni');
}

export async function saveDniConfigAction(updates: Partial<SubdomainConfig>): Promise<{ success: boolean; config: SubdomainConfig }> {
  try {
    const res = saveSubdomainConfig('dni', updates);
    revalidatePath('/dashboard/dni');
    return res;
  } catch (err: any) {
    console.error('Error saving dni config:', err);
    return { success: false, config: getSubdomainConfig('dni') };
  }
}
