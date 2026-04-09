package com.zenith.webapp.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UsersRoleCheckConstraintMigrator {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrateUsersRoleCheckConstraint() {
        try {
            String schema = jdbcTemplate.queryForObject("SELECT DATABASE()", String.class);
            if (schema == null || schema.isBlank()) {
                return;
            }

            // Drop legacy CHECK constraints on users.role (e.g., users_chk_1 limited to 0/1).
            List<String> roleCheckConstraintNames = jdbcTemplate.query(
                    """
                    SELECT tc.CONSTRAINT_NAME
                    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                    JOIN INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
                      ON tc.CONSTRAINT_SCHEMA = cc.CONSTRAINT_SCHEMA
                     AND tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
                    WHERE tc.TABLE_SCHEMA = ?
                      AND tc.TABLE_NAME = 'users'
                      AND tc.CONSTRAINT_TYPE = 'CHECK'
                      AND LOWER(cc.CHECK_CLAUSE) LIKE '%role%'
                    """,
                    (rs, rowNum) -> rs.getString("CONSTRAINT_NAME"),
                    schema
            );

            for (String constraintName : roleCheckConstraintNames) {
                if (constraintName == null || !constraintName.matches("[A-Za-z0-9_]+")) {
                    continue;
                }
                jdbcTemplate.execute("ALTER TABLE users DROP CHECK " + constraintName);
            }

            // Recreate role constraint to allow ADMIN(0), USER(1), SUPPORT_STAFF(2).
            jdbcTemplate.execute(
                    "ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN (0, 1, 2))"
            );
        } catch (Exception ignored) {
            // Non-fatal startup patch for legacy schemas.
        }
    }
}
