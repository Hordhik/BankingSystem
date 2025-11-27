package com.bankingapp.Server.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("SchemaFixer: Attempting to fix schema issues...");
        try {
            // Make duplicate columns nullable to avoid "Field doesn't have a default value" errors
            // Using MySQL syntax
            jdbcTemplate.execute("ALTER TABLE cards MODIFY COLUMN account_ref_id BIGINT NULL");
            jdbcTemplate.execute("ALTER TABLE cards MODIFY COLUMN user_ref_id BIGINT NULL");
            jdbcTemplate.execute("ALTER TABLE cards MODIFY COLUMN account_id BIGINT NULL");
            jdbcTemplate.execute("ALTER TABLE cards MODIFY COLUMN user_id BIGINT NULL");
            System.out.println("SchemaFixer: Successfully made columns nullable.");
        } catch (Exception e) {
            System.out.println("SchemaFixer: Error executing SQL (this is expected if columns don't exist): " + e.getMessage());
        }
    }
}
