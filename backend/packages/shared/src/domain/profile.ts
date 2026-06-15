import type { User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { SupabaseIdentity } from '../lib/supabase';

/** Public shape of a user profile returned to clients. */
export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    defaultSplitMode: user.defaultSplitMode,
    notificationsEnabled: user.notificationsEnabled,
    googleCalendarConnected: Boolean(user.googleRefreshToken),
    createdAt: user.createdAt,
  };
}

/**
 * Ensure a local profile row exists for a Supabase-authenticated user, creating
 * it from the token's identity on first sight. Idempotent — safe to call on any
 * entry point that needs a guaranteed profile (e.g. event create from either
 * the main app or the keyboard service).
 */
export async function ensureProfile(identity: SupabaseIdentity): Promise<User> {
  const fallbackName = identity.name || identity.email.split('@')[0] || 'You';
  return prisma.user.upsert({
    where: { id: identity.userId },
    update: { email: identity.email || undefined },
    create: {
      id: identity.userId,
      email: identity.email,
      name: fallbackName,
    },
  });
}
