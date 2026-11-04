/**
 * Sorteos Pro — Capa de persistencia V1 (Monolito Modular / Clean Architecture).
 *
 * Implementación actual: repositorio en memoria con semilla demo.
 * Contrato listo para migrar a PostgreSQL (multi-tenant por fila, RLS por user_id)
 * sin tocar casos de uso: basta con implementar la interfaz `Store`.
 *
 * Tablas objetivo (ver SAD §7):
 *  users, social_accounts, giveaways, participants, winners,
 *  subscriptions, usage_events, certificates, cms_posts, audit_logs
 *
 * Producción: configurar `DATABASE_URL`. El módulo de repositorio Postgres
 * reside en `@atpdev/database/store-postgres` (ver `packages/database/migrations`
 * y el script `scripts/db-migrate.ts`). Solo se conecta a Postgres cuando
 * `NODE_ENV` es dev/production y `DATABASE_URL` está definido (excluyendo tests).
 */

import type {
  Giveaway,
  GiveawayRules,
  Participant,
  Winner,
} from '@/lib/types';

export type UserStatus = 'active' | 'suspended' | 'deleted';
export type UserRole = 'user' | 'admin' | 'super-admin';
export type PlanId = 'free' | 'pro' | 'business' | 'enterprise';
export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads';
export type SocialAccountStatus = 'connected' | 'expired' | 'revoked';



export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  status: UserStatus;
  plan: PlanId;
  language: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccountRecord {
  id: string;
  userId: string;
  platform: SocialPlatform;
  name: string;
  handle: string;
  /** Token cifrado AES-256-GCM (base64). Nunca se expone al cliente. */
  encryptedToken: string;
  status: SocialAccountStatus;
  scopes: string[];
  connectedAt: string;
  expiresAt: string;
  refreshedAt?: string;
}

export interface GiveawayRecord extends Giveaway {
  userId: string;
  updatedAt: string;
  auditLog: string[];
}

export interface UsageEventRecord {
  id: string;
  userId: string;
  giveawayId: string;
  commentsProcessed: number;
  provider: string;
  latencyMs: number;
  createdAt: string;
  monthKey: string;
}

export interface CertificateRecord {
  id: string;
  giveawayId: string;
  userId: string;
  title: string;
  winnerUsername: string;
  verificationHash: string;
  logoUrl?: string;
  brandColor?: string;
  customText?: string;
  issuedAt: string;
}

export interface CmsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  status: 'draft' | 'published';
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  action: string;
  entity: string;
  entityId: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface FeatureFlagsSnapshot {
  free: boolean;
  pro: boolean;
  business: boolean;
  enterprise: boolean;
}

export interface FeatureFlags {
  [flagId: string]: FeatureFlagsSnapshot;
}

// --- Repositorio genérico (con persistencia en disco y Postgres opcional) -------------------------

function getSafeNodeModules() {
  try {
    if (typeof process === 'undefined' || !process.versions?.node) {
      return { fs: null, path: null };
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fsMod = require('node:fs') as typeof import('node:fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pathMod = require('node:path') as typeof import('node:path');
    return { fs: fsMod, path: pathMod };
  } catch {
    return { fs: null, path: null };
  }
}

function getDatabaseFilePath(): string | null {
  try {
    const { fs: fsMod, path: pathMod } = getSafeNodeModules();
    if (!fsMod || !pathMod) return null;

    const cwd = process.cwd();
    const possiblePaths = [
      pathMod.resolve(cwd, 'data/sorteos-db.json'),
      pathMod.resolve(cwd, 'apps/subdomains/web-apps/sorteos/data/sorteos-db.json'),
      pathMod.resolve(cwd, 'packages/database/src/sorteos_data.json'),
      pathMod.resolve(cwd, '../packages/database/src/sorteos_data.json'),
      pathMod.resolve(cwd, '../../packages/database/src/sorteos_data.json')
    ];

    for (const p of possiblePaths) {
      if (fsMod.existsSync(p)) return p;
    }
    
    // Default to data/sorteos-db.json in current directory
    const defaultTarget = possiblePaths[0];
    const dir = pathMod.dirname(defaultTarget);
    if (!fsMod.existsSync(dir)) {
      fsMod.mkdirSync(dir, { recursive: true });
    }
    return defaultTarget;
  } catch {
    return null;
  }
}

interface DiskSnapshot {
  users?: UserRecord[];
  socialAccounts?: SocialAccountRecord[];
  giveaways?: GiveawayRecord[];
  certificates?: CertificateRecord[];
  cms?: CmsPost[];
  flags?: FeatureFlags;
}

interface UserRepo {
  get(id: string): UserRecord | undefined;
  getByEmail(email: string): string | undefined;
  set(rec: UserRecord): void;
  has(id: string): boolean;
  list(): UserRecord[];
  count(): number;
  delete(id: string): boolean;
}

interface UserByEmailRepo {
  get(id: string): string | undefined;
  set(email: string, userId: string): void;
  has(id: string): boolean;
  list(): string[];
  count(): number;
}

interface GiveawayRepo {
  get(id: string): GiveawayRecord | undefined;
  getByUser(userId: string): GiveawayRecord[] | undefined;
  list(): GiveawayRecord[];
  set(rec: GiveawayRecord): void;
  countByUser(userId: string): number;
  get size(): number;
}

interface UsageRepo {
  push(e: UsageEventRecord): void;
  byUser(userId: string): UsageEventRecord[];
  filterUser(userId: string): UsageEventRecord[];
  sumByUser(userId: string, month: string): number;
  total(): number;
  deleteEvent(id: string): boolean;
  [Symbol.iterator](): IterableIterator<UsageEventRecord>;
  get length(): number;
}

interface CmsRepo {
  values(): CmsPost[];
  set(rec: CmsPost): void;
  listPublished(): CmsPost[];
  getBySlug(slug: string, tenantId?: string): CmsPost | undefined;
}

interface AuditRepo {
  push(e: AuditLogEntry): void;
  listByUser(userId: string): AuditLogEntry[];
  listByEntity(entity: string, entityId: string): AuditLogEntry[];
}

interface FlagsRepo {
  has(id: string): boolean;
  get(id: string): FeatureFlagsSnapshot | undefined;
  set(id: string, v: FeatureFlagsSnapshot): void;
  list(): FeatureFlagsSnapshot[];
}

interface PasswordResetRepo {
  set(key: string, v: { userId: string; expiresAt: number }): void;
  get(key: string): { userId: string; expiresAt: number } | undefined;
  delete(key: string): void;
}

interface SocialAccountRepo {
  set(rec: SocialAccountRecord): void;
  listByUser(userId: string): SocialAccountRecord[];
  get(id: string): SocialAccountRecord | undefined;
  list(): SocialAccountRecord[];
  delete(id: string): boolean;
}

interface ParticipantRepo {
  set(rec: { id: string; giveawayId: string; username: string; status: string }): void;
  get(_id: string): { id: string; giveawayId: string; username: string; status: string } | undefined;
  list(): { id: string; giveawayId: string; username: string; status: string }[];
}

interface WinnerRepo {
  set(rec: { id: string; giveawayId: string; rank: number; participantUsername: string; drawHash: string }): void;
  get(_id: string): { id: string; giveawayId: string; rank: number; participantUsername: string; drawHash: string } | undefined;
  list(): { id: string; giveawayId: string; rank: number; participantUsername: string; drawHash: string }[];
}

export interface Store {
  users: UserRepo;
  usersByEmail: UserByEmailRepo;
  socialAccounts: SocialAccountRepo;
  giveaways: GiveawayRepo;
  usage: UsageRepo;
  certificates: { get(id: string): CertificateRecord | undefined; set(rec: CertificateRecord): void; listByUser(userId: string): CertificateRecord[] };
  cms: CmsRepo;
  audit: AuditRepo;
  flags: FlagsRepo;
  passwordResets: PasswordResetRepo;
  seeded: boolean;
  participants: ParticipantRepo;
  winners: WinnerRepo;
}

function newDb(): Store {
  const users = new Map<string, UserRecord>();
  const usersByEmail = new Map<string, string>();
  const socialAccounts = new Map<string, SocialAccountRecord>();
  const giveaways = new Map<string, GiveawayRecord>();
  const certificates = new Map<string, CertificateRecord>();
  const cms = new Map<string, CmsPost>();
  const audit = new Map<string, AuditLogEntry[]>();
  const flags = new Map<string, FeatureFlagsSnapshot>();
  const passwordResets = new Map<string, { userId: string; expiresAt: number }>();

  const seedFlags: FeatureFlags = {
    'ff-multi-post': { free: false, pro: false, business: true, enterprise: true },
    'ff-custom-branding': { free: false, pro: true, business: true, enterprise: true },
    'ff-scheduled-draws': { free: false, pro: false, business: true, enterprise: true },
    'ff-advanced-filters': { free: false, pro: true, business: true, enterprise: true },
  };

  for (const [id, v] of Object.entries(seedFlags)) flags.set(id, v);

  function loadFromDisk(): boolean {
    try {
      const { fs: fsMod } = getSafeNodeModules();
      if (!fsMod) return false;
      const filePath = getDatabaseFilePath();
      if (!filePath || !fsMod.existsSync(filePath)) return false;

      const raw = fsMod.readFileSync(filePath, 'utf-8');
      const data: DiskSnapshot = JSON.parse(raw);

      if (Array.isArray(data.users)) {
        for (const u of data.users) {
          users.set(u.id, u);
          if (u.email) usersByEmail.set(u.email.toLowerCase(), u.id);
        }
      }

      if (Array.isArray(data.socialAccounts)) {
        for (const s of data.socialAccounts) socialAccounts.set(s.id, s);
      }

      if (Array.isArray(data.giveaways)) {
        for (const g of data.giveaways) giveaways.set(g.id, g);
      }

      if (Array.isArray(data.certificates)) {
        for (const c of data.certificates) certificates.set(c.id, c);
      }

      if (Array.isArray(data.cms)) {
        for (const post of data.cms) cms.set(post.slug || post.id, post);
      }

      return true;
    } catch (e) {
      console.warn('[sorteos] Failed to load disk snapshot:', e);
      return false;
    }
  }

  let saveTimer: NodeJS.Timeout | null = null;
  function persistToDisk(): void {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      try {
        const { fs: fsMod, path: pathMod } = getSafeNodeModules();
        if (!fsMod || !pathMod) return;
        const filePath = getDatabaseFilePath();
        if (!filePath) return;
        const dir = pathMod.dirname(filePath);
        if (!fsMod.existsSync(dir)) fsMod.mkdirSync(dir, { recursive: true });

        const snapshot: DiskSnapshot = {
          users: Array.from(users.values()),
          socialAccounts: Array.from(socialAccounts.values()),
          giveaways: Array.from(giveaways.values()),
          certificates: Array.from(certificates.values()),
          cms: Array.from(cms.values()),
        };

        fsMod.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
      } catch (err) {
        console.error('[sorteos] Error persisting to disk:', err);
      }
    }, 200);
  }

  loadFromDisk();

  function seedIfEmpty(): void {
    if (cms.has('guia-sorteo-instagram-2026')) return;
    const now = new Date().toISOString();
    cms.set('guia-sorteo-instagram-2026', {
      id: 'cms-1',
      slug: 'guia-sorteo-instagram-2026',
      title: 'Cómo hacer un sorteo en Instagram legal y transparente',
      excerpt: 'Normas de promoción de Meta y certificación de ganadores.',
      body: '# Guía Instagram\n\nContenido editorial gestionado sin desplegar código (RF-035).',
      category: 'Instagram & Meta',
      status: 'published',
      updatedAt: now,
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { scryptSync } = require('node:crypto') as typeof import('node:crypto');
      const salt = 'seed-admin-salt-01';
      const passwordHash = scryptSync('Admin1234!', salt, 64).toString('hex');
      const adminId = 'usr_superadmin_seed';
      if (!users.has(adminId)) {
        users.set(adminId, {
          id: adminId,
          name: 'Super Admin',
          email: 'admin@sorteos.pro',
          passwordHash,
          salt,
          role: 'super-admin',
          status: 'active',
          plan: 'enterprise',
          language: 'es',
          createdAt: now,
          updatedAt: now,
        });
        usersByEmail.set('admin@sorteos.pro', adminId);
        if (process.env.NODE_ENV === 'production') {
          console.warn('[sorteos] Seed super-admin activo en producción: cambia admin@sorteos.pro de inmediato.');
        }
      }
    } catch {
      // Sin crypto disponible: se creará al primer login demo
    }
  }

  seedIfEmpty();

  const usage = new Map<string, UsageEventRecord>();

  return {
    seeded: true,
    users: {
      get(id: string) { return users.get(id); },
      getByEmail(email: string) { return usersByEmail.get(email); },
      set(rec: UserRecord) { users.set(rec.id, rec); persistToDisk(); },
      has(id: string) { return users.has(id); },
      list() { return Array.from(users.values()); },
      count() { return users.size; },
      delete(id: string) { const res = users.delete(id); persistToDisk(); return res; },
    },
    usersByEmail: {
      get(id: string) { return usersByEmail.get(id); },
      set(email: string, userId: string) { usersByEmail.set(email, userId); },
      has(id: string) { return usersByEmail.has(id); },
      list() { return Array.from(usersByEmail.values()); },
      count() { return usersByEmail.size; },
    },
    socialAccounts: {
      set(rec: SocialAccountRecord) { socialAccounts.set(rec.id, rec); persistToDisk(); },
      listByUser(userId: string) { return Array.from(socialAccounts.values()).filter((a) => a.userId === userId); },
      get(id: string) { return socialAccounts.get(id); },
      list() { return Array.from(socialAccounts.values()); },
      delete(id: string) { const res = socialAccounts.delete(id); persistToDisk(); return res; },
    },
    giveaways: {
      get(id: string) { return giveaways.get(id); },
      getByUser(userId: string) { return Array.from(giveaways.values()).filter((g) => g.userId === userId); },
      list() { return Array.from(giveaways.values()); },
      set(rec: GiveawayRecord) { giveaways.set(rec.id, rec); persistToDisk(); },
      countByUser(userId: string) { return Array.from(giveaways.values()).filter((g) => g.userId === userId).length; },
      get size() { return giveaways.size; },
    },
    usage: {
      push(e: UsageEventRecord) { usage.set(e.id, e); },
      byUser(userId: string) { return Array.from(usage.values()).filter((u) => u.userId === userId); },
      filterUser(userId: string) { return Array.from(usage.values()).filter((u) => u.userId === userId); },
      sumByUser(userId: string, month: string) { return Array.from(usage.values()).filter((u) => u.userId === userId && u.monthKey === month).reduce((acc, u) => acc + u.commentsProcessed, 0); },
      total() { return usage.size; },
      deleteEvent(id: string) { const had = usage.has(id); usage.delete(id); return had; },
      [Symbol.iterator]() { return usage.values(); },
      get length() { return usage.size; },
    },
    certificates: {
      get(id: string) { return certificates.get(id); },
      set(rec: CertificateRecord) { certificates.set(rec.id, rec); persistToDisk(); },
      listByUser(userId: string) { return Array.from(certificates.values()).filter((c) => c.userId === userId); },
    },
    cms: {
      values() { return Array.from(cms.values()); },
      set(rec: CmsPost) { cms.set(rec.id, rec); persistToDisk(); },
      listPublished() { return Array.from(cms.values()).filter((p) => p.status === 'published'); },
      getBySlug(slug: string, tenantId?: string) { return cms.get(slug); },
    },
    audit: {
      push(e: AuditLogEntry) { const arr = audit.get(e.entityId) || []; arr.push(e); audit.set(e.entityId, arr); },
      listByUser(userId: string) { return Array.from(audit.values()).flatMap((a) => a.filter((e) => String(e.actorUserId) === userId)); },
      listByEntity(entity: string, entityId: string) { return audit.get(entityId) || []; },
    },
    flags: {
      has(id: string) { return flags.has(id); },
      get(id: string) { return flags.get(id); },
      set(id: string, v: FeatureFlagsSnapshot) { flags.set(id, v); },
      list() { return Array.from(flags.values()); },
    },
    passwordResets: {
      set(key: string, v: { userId: string; expiresAt: number }) { passwordResets.set(key, v); },
      get(key: string) { return passwordResets.get(key); },
      delete(key: string) { return passwordResets.delete(key); },
    },
    participants: {
      set(rec: { id: string; giveawayId: string; username: string; status: string }) { /* empty in memory mode */ },
      get(_id: string) { return undefined; },
      list() { return []; },
    },
    winners: {
      set(rec: { id: string; giveawayId: string; rank: number; participantUsername: string; drawHash: string }) { /* empty in memory mode */ },
      get(_id: string) { return undefined; },
      list() { return []; },
    },
  };
}

const globalForStore = globalThis as unknown as { __sorteos_db?: Store };
export const db: Store = globalForStore.__sorteos_db ?? (globalForStore.__sorteos_db = newDb());

export function monthKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const store = db;

// Re-export types used by routes
export type { GiveawayRules, Participant, Winner };
