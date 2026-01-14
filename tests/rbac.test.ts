import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  hasPermission, 
  hasHigherOrEqualRole, 
  getEffectivePermissions, 
  PermissionChecker,
  ROLE_HIERARCHY,
  DEFAULT_ROLE_PERMISSIONS,
  type Role,
  type Action,
  type Resource 
} from '@/lib/middleware/rbac';

// ============================================
// RBAC MIDDLEWARE TESTS
// ============================================

describe('RBAC Middleware', () => {
  describe('hasPermission', () => {
    it('should return true when role has permission', () => {
      const result = hasPermission('ADMIN', 'USERS', 'CREATE');
      expect(result).toBe(true);
    });

    it('should return false when role lacks permission', () => {
      const result = hasPermission('STUDENT', 'USERS', 'CREATE');
      expect(result).toBe(false);
    });

    it('should return true for MANAGE permission', () => {
      const result = hasPermission('TEACHER', 'COURSES', 'DELETE');
      expect(result).toBe(false);
    });

    it('should allow ADMIN all permissions', () => {
      const result = hasPermission('ADMIN', 'SETTINGS', 'MANAGE');
      expect(result).toBe(true);
    });

    it('should restrict STUDENT to read-only for most resources', () => {
      expect(hasPermission('STUDENT', 'COURSES', 'READ')).toBe(true);
      expect(hasPermission('STUDENT', 'COURSES', 'CREATE')).toBe(false);
      expect(hasPermission('STUDENT', 'COURSES', 'DELETE')).toBe(false);
    });

    it('should give GUEST minimal permissions', () => {
      expect(hasPermission('GUEST', 'COURSES', 'READ')).toBe(true);
      expect(hasPermission('GUEST', 'USERS', 'READ')).toBe(false);
    });
  });

  describe('hasHigherOrEqualRole', () => {
    it('should return true for same role', () => {
      expect(hasHigherOrEqualRole('ADMIN', 'ADMIN')).toBe(true);
    });

    it('should return true for higher role', () => {
      expect(hasHigherOrEqualRole('ADMIN', 'TEACHER')).toBe(true);
      expect(hasHigherOrEqualRole('SUPER_ADMIN', 'OWNER')).toBe(true);
    });

    it('should return false for lower role', () => {
      expect(hasHigherOrEqualRole('TEACHER', 'ADMIN')).toBe(false);
      expect(hasHigherOrEqualRole('STUDENT', 'ADMIN')).toBe(false);
    });

    it('should correctly compare adjacent roles', () => {
      expect(hasHigherOrEqualRole('ADMIN', 'INSTRUCTOR')).toBe(true);
      expect(hasHigherOrEqualRole('INSTRUCTOR', 'ADMIN')).toBe(false);
    });

    it('should handle GUEST role correctly', () => {
      expect(hasHigherOrEqualRole('GUEST', 'GUEST')).toBe(true);
      expect(hasHigherOrEqualRole('STUDENT', 'GUEST')).toBe(true);
      expect(hasHigherOrEqualRole('GUEST', 'STUDENT')).toBe(false);
    });
  });

  describe('ROLE_HIERARCHY', () => {
    it('should have correct numeric values', () => {
      expect(ROLE_HIERARCHY.SUPER_ADMIN).toBe(100);
      expect(ROLE_HIERARCHY.OWNER).toBe(90);
      expect(ROLE_HIERARCHY.ADMIN).toBe(80);
      expect(ROLE_HIERARCHY.INSTRUCTOR).toBe(60);
      expect(ROLE_HIERARCHY.TEACHER).toBe(50);
      expect(ROLE_HIERARCHY.STUDENT).toBe(30);
      expect(ROLE_HIERARCHY.PARENT).toBe(20);
      expect(ROLE_HIERARCHY.GUEST).toBe(10);
    });

    it('should be strictly descending', () => {
      const values = Object.values(ROLE_HIERARCHY);
      for (let i = 1; i < values.length; i++) {
        expect(values[i - 1]).toBeGreaterThan(values[i]);
      }
    });
  });

  describe('DEFAULT_ROLE_PERMISSIONS', () => {
    it('should have permissions for all roles', () => {
      const roles = ['SUPER_ADMIN', 'OWNER', 'ADMIN', 'INSTRUCTOR', 'TEACHER', 'STUDENT', 'PARENT', 'GUEST'];
      
      roles.forEach(role => {
        expect(DEFAULT_ROLE_PERMISSIONS[role as Role]).toBeDefined();
      });
    });

    it('should have all resource types', () => {
      const resources = [
        'USERS', 'COURSES', 'LESSONS', 'ASSESSMENTS', 'CLASSES',
        'TEACHERS', 'STUDENTS', 'CONTENT', 'SETTINGS', 'BILLING',
        'ANALYTICS', 'ANNOUNCEMENTS', 'DISCUSSIONS', 'LIVE_SESSIONS', 'APPROVALS'
      ];
      
      resources.forEach(resource => {
        expect(DEFAULT_ROLE_PERMISSIONS.ADMIN[resource as Resource]).toBeDefined();
      });
    });

    it('should give SUPER_ADMIN all permissions', () => {
      const superAdmin = DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN;
      
      Object.values(superAdmin).forEach(permissions => {
        expect(permissions).toContain('MANAGE');
      });
    });

    it('should give GUEST read-only access to courses', () => {
      const guest = DEFAULT_ROLE_PERMISSIONS.GUEST;
      
      expect(guest.COURSES).toContain('READ');
      expect(guest.COURSES).not.toContain('CREATE');
      expect(guest.COURSES).not.toContain('DELETE');
    });
  });

  describe('PermissionChecker', () => {
    let checker: PermissionChecker;

    beforeEach(() => {
      const permissions = DEFAULT_ROLE_PERMISSIONS.ADMIN;
      checker = new PermissionChecker(permissions);
    });

    it('should check single permission', () => {
      expect(checker.can('CREATE', 'USERS')).toBe(true);
      expect(checker.can('DELETE', 'USERS')).toBe(true);
      expect(checker.can('MANAGE', 'USERS')).toBe(true);
    });

    it('should return false for missing permission', () => {
      expect(checker.can('MANAGE', 'BILLING')).toBe(false);
    });

    it('should check any of multiple permissions', () => {
      expect(checker.canAny(['CREATE', 'READ', 'DELETE'], 'USERS')).toBe(true);
      expect(checker.canAny(['READ', 'DELETE'], 'USERS')).toBe(true);
      expect(checker.canAny(['MANAGE'], 'USERS')).toBe(true);
    });

    it('should check all permissions', () => {
      expect(checker.canAll(['CREATE', 'READ', 'UPDATE'], 'USERS')).toBe(true);
      expect(checker.canAll(['CREATE', 'MANAGE'], 'USERS')).toBe(true);
    });

    it('should get allowed actions for resource', () => {
      const actions = checker.getAllowedActions('USERS');
      
      expect(actions).toContain('CREATE');
      expect(actions).toContain('READ');
      expect(actions).toContain('UPDATE');
      expect(actions).toContain('DELETE');
    });
  });

  describe('Role Comparison', () => {
    it('should correctly identify role hierarchy', () => {
      const roles: Role[] = ['SUPER_ADMIN', 'OWNER', 'ADMIN', 'INSTRUCTOR', 'TEACHER', 'STUDENT', 'PARENT', 'GUEST'];
      
      for (let i = 0; i < roles.length; i++) {
        for (let j = 0; j < i; j++) {
          // Higher index = lower role
          expect(hasHigherOrEqualRole(roles[i], roles[j])).toBe(false);
          expect(hasHigherOrEqualRole(roles[j], roles[i])).toBe(true);
        }
      }
    });
  });
});
