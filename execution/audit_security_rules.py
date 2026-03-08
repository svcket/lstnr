#!/usr/bin/env python3
import sys
import os

def main():
    print("Starting Security & Env Audit...")
    
    env_file = ".env"
    required_keys = [
        "EXPO_PUBLIC_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY"
    ]
    
    if not os.path.exists(env_file):
        print(f"❌ Error: {env_file} does not exist.")
        sys.exit(1)
        
    try:
        with open(env_file, 'r') as f:
            content = f.read()
            
        missing = []
        for key in required_keys:
            if f"{key}=" not in content:
                missing.append(key)
                
        if missing:
            print("❌ Security Audit Failed: Missing required environment variables:")
            for m in missing:
                print(f"  - {m}")
            sys.exit(1)
            
        print("✅ Environment Security Check Passed. Core integration keys are present.")
        sys.exit(0)
        
    except Exception as e:
        print(f"❌ Error reading {env_file}: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
