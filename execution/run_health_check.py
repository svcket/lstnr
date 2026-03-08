#!/usr/bin/env python3
import subprocess
import sys

def run_step(name, command):
    print(f"\n--- {name} ---")
    try:
        # We use shell=True to easily call npx/npm
        result = subprocess.run(
            command,
            shell=True,
            check=False,  # We capture output manually
            text=True,
            capture_output=True
        )
        
        if result.returncode == 0:
            print(f"✅ PASSED: {name}")
            return True
        else:
            print(f"❌ FAILED: {name}")
            print("Output:")
            print(result.stdout)
            if result.stderr:
                print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ ERROR running {name}: {str(e)}")
        return False

def main():
    print("Starting LSTNR Code Health Check...")
    
    steps = [
        ("Typecheck", "npx tsc --noEmit"),
        ("Linting", "npx eslint . --ext .js,.jsx,.ts,.tsx"),
        ("Unit Tests", "npm run test:ci")
    ]
    
    passed_all = True
    for name, command in steps:
        success = run_step(name, command)
        if not success:
            passed_all = False
            
    print("\n====================")
    if passed_all:
        print("✅ ALL HEALTH CHECKS PASSED.")
        sys.exit(0)
    else:
        print("❌ SOME HEALTH CHECKS FAILED. See output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
