import { describe, it, expect } from 'vitest';
import { isSelfDeactivation, isAdminPromotion, removesActiveAdmin } from '@/lib/reviewerGuards';

describe('isSelfDeactivation', () => {
  it('blocks deactivating your own account', () => {
    expect(isSelfDeactivation('me', 'me', { isActive: false })).toBe(true);
  });
  it('allows changing your own role (isActive not set to false)', () => {
    expect(isSelfDeactivation('me', 'me', { role: 'observer' })).toBe(false);
    expect(isSelfDeactivation('me', 'me', { isActive: true })).toBe(false);
  });
  it('does not fire when deactivating someone else', () => {
    expect(isSelfDeactivation('other', 'me', { isActive: false })).toBe(false);
  });
});

describe('isAdminPromotion', () => {
  it('is true only when promoting a non-admin to admin', () => {
    expect(isAdminPromotion({ role: 'validator', isActive: true }, { role: 'admin' })).toBe(true);
  });
  it('is false when the target is already admin or the target role is not admin', () => {
    expect(isAdminPromotion({ role: 'admin', isActive: true }, { role: 'admin' })).toBe(false);
    expect(isAdminPromotion({ role: 'validator', isActive: true }, { role: 'observer' })).toBe(false);
    expect(isAdminPromotion({ role: 'validator', isActive: true }, {})).toBe(false);
  });
});

describe('removesActiveAdmin (last-admin gate trigger)', () => {
  const activeAdmin = { role: 'admin', isActive: true };

  it('fires when demoting an active admin away from admin', () => {
    expect(removesActiveAdmin(activeAdmin, { role: 'validator' })).toBe(true);
  });
  it('fires when deactivating an active admin', () => {
    expect(removesActiveAdmin(activeAdmin, { isActive: false })).toBe(true);
  });
  it('does NOT fire when the admin stays an active admin', () => {
    expect(removesActiveAdmin(activeAdmin, { role: 'admin' })).toBe(false);
    expect(removesActiveAdmin(activeAdmin, { isActive: true })).toBe(false);
    expect(removesActiveAdmin(activeAdmin, {})).toBe(false);
  });
  it('does NOT fire for a non-admin or an already-inactive admin (nothing to protect)', () => {
    expect(removesActiveAdmin({ role: 'validator', isActive: true }, { isActive: false })).toBe(false);
    expect(removesActiveAdmin({ role: 'admin', isActive: false }, { role: 'validator' })).toBe(false);
  });
});
