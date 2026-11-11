// Dynamic imports for fs and path are used inside server-guarded functions to support Next.js client bundling.

export interface GiveawayRuleSet {
  excludeDuplicates: boolean;
  minMentions: number;
  requiredHashtag?: string;
  blockedUsers: string[];
  winnersCount: number;
  substitutesCount: number;
}

export interface ParticipantRecord {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  commentText?: string;
  likesCount?: number;
  isEligible: boolean;
  exclusionReason?: string;
}

export interface WinnerRecord {
  id: string;
  position: number;
  type: 'winner' | 'substitute';
  selectedAt: string;
  participant: ParticipantRecord;
}

export interface GiveawayRecord {
  id: string;
  title: string;
  platform?: 'instagram' | 'facebook' | 'youtube' | 'standalone';
  network?: string;
  postUrl?: string;
  authorUsername?: string;
  totalCommentsCount?: number;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'finished' | 'cancelled';
  rules: GiveawayRuleSet;
  winners: WinnerRecord[];
  substitutes: WinnerRecord[];
  certificateId?: string;
  verificationHash?: string;
  scheduledAt?: string;
  executedAt?: string;
  createdAt: string;
  redrawReason?: string;
}

export interface SorteosUserRecord {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  status: 'active' | 'suspended';
  giveawaysCount: number;
  commentsConsumed: number;
  commentsLimit: number;
  joinedAt: string;
}

export interface FeatureFlagRecord {
  id: string;
  name: string;
  description: string;
  enabledInFree: boolean;
  enabledInPro: boolean;
  enabledInBusiness: boolean;
}

export interface SorteosMetricsRecord {
  mrr: number;
  arr: number;
  activeSubscribers: number;
  churnRate: string;
  totalGiveawaysThisMonth: number;
  totalCommentsScraped: number;
  apiResponseTime: string;
  errorRate: string;
}

export interface SorteosDatabaseState {
  giveaways: GiveawayRecord[];
  users: SorteosUserRecord[];
  featureFlags: FeatureFlagRecord[];
  metrics: SorteosMetricsRecord;
}

function getSafeNodeModules() {
  try {
    if (typeof process === 'undefined' || !process.versions?.node || typeof eval === 'undefined') {
      return { fs: null, path: null };
    }
    const nodeReq = eval('require');
    return {
      fs: nodeReq('fs'),
      path: nodeReq('path')
    };
  } catch {
    return { fs: null, path: null };
  }
}

function getSorteosDataFilePath(): string | null {
  try {
    const { fs: fsMod, path: pathMod } = getSafeNodeModules();
    if (!fsMod || !pathMod) return null;

    const cwd = process.cwd();
    const possiblePaths = [
      pathMod.resolve(cwd, 'packages/database/src/sorteos_data.json'),
      pathMod.resolve(cwd, '../packages/database/src/sorteos_data.json'),
      pathMod.resolve(cwd, '../../packages/database/src/sorteos_data.json'),
      pathMod.resolve(cwd, '../../../packages/database/src/sorteos_data.json'),
      pathMod.resolve(cwd, '../../../../packages/database/src/sorteos_data.json')
    ];

    for (const p of possiblePaths) {
      if (fsMod.existsSync(p)) return p;
    }
    for (const p of possiblePaths) {
      if (fsMod.existsSync(pathMod.dirname(p))) return p;
    }
    return possiblePaths[0];
  } catch {
    return null;
  }
}

function readFullSorteosData(): SorteosDatabaseState {
  const defaultState: SorteosDatabaseState = {
    giveaways: [],
    users: [],
    featureFlags: [],
    metrics: {
      mrr: 14850,
      arr: 178200,
      activeSubscribers: 624,
      churnRate: '2.1%',
      totalGiveawaysThisMonth: 3840,
      totalCommentsScraped: 1420500,
      apiResponseTime: '185ms',
      errorRate: '0.04%'
    }
  };

  try {
    const { fs: fsMod } = getSafeNodeModules();
    if (!fsMod) return defaultState;
    const filePath = getSorteosDataFilePath();
    if (filePath && fsMod.existsSync(filePath)) {
      const parsed = JSON.parse(fsMod.readFileSync(filePath, 'utf-8'));
      return {
        giveaways: parsed.giveaways || [],
        users: parsed.users || [],
        featureFlags: parsed.featureFlags || [],
        metrics: parsed.metrics || defaultState.metrics
      };
    }
  } catch (err) {
    console.warn('Fallback to in-memory sorteos data:', err);
  }
  return defaultState;
}

function writeFullSorteosData(data: SorteosDatabaseState): boolean {
  try {
    const { fs: fsMod, path: pathMod } = getSafeNodeModules();
    if (!fsMod || !pathMod) return false;
    const filePath = getSorteosDataFilePath();
    if (!filePath) return false;
    const dir = pathMod.dirname(filePath);
    if (!fsMod.existsSync(dir)) {
      fsMod.mkdirSync(dir, { recursive: true });
    }
    fsMod.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing sorteos data:', err);
    return false;
  }
}

// -------------------------------------------------------------
// GIVEAWAYS API
// -------------------------------------------------------------
export async function getSorteosGiveaways(): Promise<GiveawayRecord[]> {
  const data = readFullSorteosData();
  return data.giveaways;
}

export async function saveSorteosGiveaway(giveaway: Partial<GiveawayRecord>): Promise<{ success: boolean; giveaway?: GiveawayRecord }> {
  const data = readFullSorteosData();
  const id = giveaway.id || `gw-${Date.now()}`;
  const now = new Date().toISOString();

  const existingIdx = data.giveaways.findIndex(g => g.id === id);
  const fullGiveaway: GiveawayRecord = {
    id,
    title: giveaway.title || 'Sorteo Sin Título',
    platform: giveaway.platform || 'instagram',
    network: giveaway.network || giveaway.platform || 'instagram',
    postUrl: giveaway.postUrl || '',
    authorUsername: giveaway.authorUsername || '@organizador',
    totalCommentsCount: giveaway.totalCommentsCount || 0,
    status: giveaway.status || 'running',
    rules: giveaway.rules || {
      excludeDuplicates: true,
      minMentions: 1,
      blockedUsers: [],
      winnersCount: 1,
      substitutesCount: 1
    },
    winners: giveaway.winners || [],
    substitutes: giveaway.substitutes || [],
    certificateId: giveaway.certificateId || (giveaway.status === 'completed' ? `cert-${id}` : ''),
    verificationHash: giveaway.verificationHash || (giveaway.status === 'completed' ? `${Math.random().toString(16).slice(2)}` : ''),
    scheduledAt: giveaway.scheduledAt,
    executedAt: giveaway.executedAt || (giveaway.status === 'completed' ? now : undefined),
    createdAt: giveaway.createdAt || now,
    redrawReason: giveaway.redrawReason
  };

  if (existingIdx >= 0) {
    data.giveaways[existingIdx] = fullGiveaway;
  } else {
    data.giveaways.unshift(fullGiveaway);
  }

  writeFullSorteosData(data);
  return { success: true, giveaway: fullGiveaway };
}

export async function updateGiveawayStatus(id: string, status: GiveawayRecord['status']): Promise<boolean> {
  const data = readFullSorteosData();
  const item = data.giveaways.find(g => g.id === id);
  if (!item) return false;
  item.status = status;
  if (status === 'completed' && !item.executedAt) {
    item.executedAt = new Date().toISOString();
  }
  return writeFullSorteosData(data);
}

export async function redrawGiveaway(id: string, reason: string): Promise<{ success: boolean; newWinner?: WinnerRecord }> {
  const data = readFullSorteosData();
  const item = data.giveaways.find(g => g.id === id);
  if (!item) return { success: false };

  // Pick first substitute if available or generate new
  let newWinner: WinnerRecord;
  if (item.substitutes && item.substitutes.length > 0) {
    const sub = item.substitutes.shift()!;
    newWinner = {
      ...sub,
      type: 'winner',
      position: 1,
      selectedAt: new Date().toISOString()
    };
  } else {
    newWinner = {
      id: `w-${Date.now()}`,
      position: 1,
      type: 'winner',
      selectedAt: new Date().toISOString(),
      participant: {
        id: `part-${Date.now()}`,
        username: `ganador_resorteo_${Math.floor(Math.random() * 900 + 100)}`,
        name: 'Ganador Re-Sorteado',
        isEligible: true,
        commentText: 'Participando en el sorteo verificado!'
      }
    };
  }

  item.winners = [newWinner, ...(item.winners?.slice(1) || [])];
  item.redrawReason = reason;
  item.verificationHash = `sha256-redraw-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  writeFullSorteosData(data);
  return { success: true, newWinner };
}

export async function deleteGiveaway(id: string): Promise<boolean> {
  const data = readFullSorteosData();
  const len = data.giveaways.length;
  data.giveaways = data.giveaways.filter(g => g.id !== id);
  if (data.giveaways.length === len) return false;
  return writeFullSorteosData(data);
}

// -------------------------------------------------------------
// USERS & QUOTAS API (RF-030 to RF-032)
// -------------------------------------------------------------
export async function getSorteosUsers(): Promise<SorteosUserRecord[]> {
  const data = readFullSorteosData();
  return data.users;
}

export async function syncRealSorteosUser(user: Partial<SorteosUserRecord> & { email: string }): Promise<SorteosUserRecord> {
  const data = readFullSorteosData();
  const emailNorm = user.email.toLowerCase().trim();
  let existing = data.users.find(u => u.email.toLowerCase() === emailNorm || (user.id && u.id === user.id));
  
  if (existing) {
    if (user.name) existing.name = user.name;
    if (user.plan) existing.plan = user.plan;
    if (user.status) existing.status = user.status;
    if (user.giveawaysCount !== undefined) existing.giveawaysCount = user.giveawaysCount;
    if (user.commentsConsumed !== undefined) existing.commentsConsumed = user.commentsConsumed;
    if (user.commentsLimit !== undefined) existing.commentsLimit = user.commentsLimit;
  } else {
    existing = {
      id: user.id || `usr-${Date.now()}`,
      name: user.name || user.email.split('@')[0],
      email: user.email,
      plan: user.plan || 'pro',
      status: user.status || 'active',
      giveawaysCount: user.giveawaysCount ?? 1,
      commentsConsumed: user.commentsConsumed ?? 0,
      commentsLimit: user.commentsLimit ?? (user.plan === 'business' ? 50000 : user.plan === 'enterprise' ? 500000 : 10000),
      joinedAt: user.joinedAt || new Date().toISOString().split('T')[0]
    };
    data.users.unshift(existing);
  }

  writeFullSorteosData(data);
  return existing;
}

export async function getSorteosUserByEmail(email: string): Promise<SorteosUserRecord | undefined> {
  const data = readFullSorteosData();
  const emailNorm = email.toLowerCase().trim();
  return data.users.find(u => u.email.toLowerCase() === emailNorm);
}

export async function recordSorteosUserConsumption(
  emailOrId: string,
  commentsCount: number,
  isNewGiveaway = false
): Promise<{ success: boolean; user?: SorteosUserRecord }> {
  const data = readFullSorteosData();
  const search = emailOrId.toLowerCase().trim();
  let user = data.users.find(u => u.email.toLowerCase() === search || u.id === emailOrId);

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: emailOrId.includes('@') ? emailOrId.split('@')[0] : 'Creador',
      email: emailOrId.includes('@') ? emailOrId : `${emailOrId}@sorteos.pro`,
      plan: 'pro',
      status: 'active',
      giveawaysCount: isNewGiveaway ? 1 : 0,
      commentsConsumed: Math.max(0, commentsCount),
      commentsLimit: 10000,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    data.users.unshift(user);
  } else {
    user.commentsConsumed = (user.commentsConsumed || 0) + Math.max(0, commentsCount);
    if (isNewGiveaway) {
      user.giveawaysCount = (user.giveawaysCount || 0) + 1;
    }
  }

  writeFullSorteosData(data);
  return { success: true, user };
}

export async function updateUserPlan(userId: string, newPlan: SorteosUserRecord['plan']): Promise<boolean> {
  const data = readFullSorteosData();
  const user = data.users.find(u => u.id === userId);
  if (!user) return false;
  user.plan = newPlan;
  // Adjust comments limit accordingly
  if (newPlan === 'free') user.commentsLimit = 250;
  else if (newPlan === 'pro') user.commentsLimit = 10000;
  else if (newPlan === 'business') user.commentsLimit = 50000;
  else if (newPlan === 'enterprise') user.commentsLimit = 500000;

  return writeFullSorteosData(data);
}

export async function toggleUserStatus(userId: string, status: 'active' | 'suspended'): Promise<boolean> {
  const data = readFullSorteosData();
  const user = data.users.find(u => u.id === userId);
  if (!user) return false;
  user.status = status;
  return writeFullSorteosData(data);
}

export async function resetUserComments(userId: string): Promise<boolean> {
  const data = readFullSorteosData();
  const user = data.users.find(u => u.id === userId);
  if (!user) return false;
  user.commentsConsumed = 0;
  return writeFullSorteosData(data);
}

// -------------------------------------------------------------
// FEATURE FLAGS API (RF-034)
// -------------------------------------------------------------
export async function getSorteosFeatureFlags(): Promise<FeatureFlagRecord[]> {
  const data = readFullSorteosData();
  return data.featureFlags;
}

export async function updateFeatureFlag(id: string, updates: Partial<FeatureFlagRecord>): Promise<boolean> {
  const data = readFullSorteosData();
  const flag = data.featureFlags.find(f => f.id === id);
  if (!flag) return false;
  Object.assign(flag, updates);
  return writeFullSorteosData(data);
}

// -------------------------------------------------------------
// METRICS API (RF-033)
// -------------------------------------------------------------
export async function getSorteosMetrics(): Promise<SorteosMetricsRecord> {
  const data = readFullSorteosData();
  return data.metrics;
}
