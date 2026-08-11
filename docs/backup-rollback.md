# Backup, Migration, and Rollback Notes

## Backup

Before every production migration:

```bash
mysqldump --single-transaction --routines --triggers "$DATABASE_URL" > backup.sql
```

For managed MySQL, prefer provider-native snapshots plus a logical dump for portability.

## Migration

Run:

```bash
npm run db:deploy
```

Review generated SQL in `prisma/migrations` before deployment. Avoid destructive migrations without a tested data backfill and rollback plan.

## Rollback

1. Stop traffic or enable maintenance mode.
2. Revert to the previous application artifact.
3. Restore from the pre-migration database backup if the migration changed data destructively.
4. Re-run health checks, auth, checkout, webhook, and member dashboard smoke tests.

Webhook processing is idempotent by provider event ID, so replaying provider events after rollback should not duplicate paid memberships when the database is restored consistently.
