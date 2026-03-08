#!/usr/bin/env python3
import sys
import re

def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_sql_migration.py <path_to_sql_file>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    
    try:
        with open(file_path, 'r') as f:
            content = f.read().lower()
            
        errors = []
        
        # Check for dangerous non-idempotent table creations
        if "create table" in content and "create table if not exists" not in content:
            errors.append("❌ Non-idempotent CREATE TABLE detected. Please use IF NOT EXISTS.")
            
        # Check for naive column additions
        if "add column" in content and "if not exists" not in content:
             errors.append("❌ Non-idempotent ADD COLUMN detected. Please use IF NOT EXISTS.")

        if errors:
            print("❌ Migration Validation Failed")
            for e in errors:
                print(e)
            sys.exit(1)
            
        print(f"✅ SQL Migration Safety Checks Passed for {file_path}")
        sys.exit(0)
        
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
