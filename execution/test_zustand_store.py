#!/usr/bin/env python3
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_zustand_store.py <path_to_store_ts>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            
        checks = [
            ("import { create }", "Zustand create import missing"),
            ("export const use", "Store is not exported properly (should start with use)"),
        ]
        
        errors = []
        for check, err_msg in checks:
            if check not in content:
                errors.append(err_msg)
                
        if errors:
            print(f"❌ Zustand Store Check Failed for {file_path}")
            for e in errors:
                print(e)
            sys.exit(1)
            
        print(f"✅ Zustand Store Basic Syntax Check Passed for {file_path}")
        sys.exit(0)
        
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
