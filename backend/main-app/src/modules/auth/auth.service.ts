import {
  prisma,
  supabaseAdmin,
  notFound,
  logger,
  ensureProfile,
  toPublicUser,
  type SupabaseIdentity,
} from '@zenemic/shared';

// `ensureProfile` + `toPublicUser` are shared domain helpers (event creation in
// both services relies on `ensureProfile`). Re-export them so any importer of
// this module keeps working.
export { ensureProfile, toPublicUser };

/** GET /me — syncs + returns the profile (the client calls this after login). */
export async function getMe(identity: SupabaseIdentity) {
  return toPublicUser(await ensureProfile(identity));
}

export async function updateSettings(
  userId: string,
  input: {
    name?: string;
    defaultSplitMode?: 'EVEN' | 'BY_SHARE' | 'BY_ITEM';
    notificationsEnabled?: boolean;
    expoPushToken?: string | null;
  },
) {
  const user = await prisma.user.update({ where: { id: userId }, data: input }).catch(() => {
    throw notFound('Profile not found — call GET /me first');
  });
  return toPublicUser(user);
}

/**
 * Delete the account: remove the local profile (cascades events, splits, chat,
 * etc.) AND delete the Supabase Auth user so the login can't be reused.
 */
export async function deleteAccount(userId: string): Promise<void> {
  await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) logger.warn({ err: error, userId }, 'failed to delete Supabase auth user');
}
