import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771176905956 implements MigrationInterface {
    name = 'Init1771176905956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "post" (
                "id" varchar PRIMARY KEY NOT NULL,
                "title" varchar(120) NOT NULL,
                "content" varchar(280) NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "authorId" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fba5ccb4d382c7136e013a5875" ON "post" ("authorId", "createdAt")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fb91bea2d37140a877b775e6b2" ON "post" ("createdAt")
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" varchar PRIMARY KEY NOT NULL,
                "username" varchar NOT NULL,
                "email" varchar NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "avatarUrl" varchar,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_fba5ccb4d382c7136e013a5875"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_fb91bea2d37140a877b775e6b2"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_post" (
                "id" varchar PRIMARY KEY NOT NULL,
                "title" varchar(120) NOT NULL,
                "content" varchar(280) NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "authorId" varchar NOT NULL,
                CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_post"(
                    "id",
                    "title",
                    "content",
                    "createdAt",
                    "updatedAt",
                    "authorId"
                )
            SELECT "id",
                "title",
                "content",
                "createdAt",
                "updatedAt",
                "authorId"
            FROM "post"
        `);
        await queryRunner.query(`
            DROP TABLE "post"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_post"
                RENAME TO "post"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fba5ccb4d382c7136e013a5875" ON "post" ("authorId", "createdAt")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fb91bea2d37140a877b775e6b2" ON "post" ("createdAt")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_fb91bea2d37140a877b775e6b2"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_fba5ccb4d382c7136e013a5875"
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
                RENAME TO "temporary_post"
        `);
        await queryRunner.query(`
            CREATE TABLE "post" (
                "id" varchar PRIMARY KEY NOT NULL,
                "title" varchar(120) NOT NULL,
                "content" varchar(280) NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "authorId" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "post"(
                    "id",
                    "title",
                    "content",
                    "createdAt",
                    "updatedAt",
                    "authorId"
                )
            SELECT "id",
                "title",
                "content",
                "createdAt",
                "updatedAt",
                "authorId"
            FROM "temporary_post"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_post"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fb91bea2d37140a877b775e6b2" ON "post" ("createdAt")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fba5ccb4d382c7136e013a5875" ON "post" ("authorId", "createdAt")
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_fb91bea2d37140a877b775e6b2"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_fba5ccb4d382c7136e013a5875"
        `);
        await queryRunner.query(`
            DROP TABLE "post"
        `);
    }

}
