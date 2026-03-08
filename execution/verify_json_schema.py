#!/usr/bin/env python3
import sys
import json

def main():
    if len(sys.argv) < 2:
        print("Usage: python verify_json_schema.py <path_to_json_mock>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        # Basic sanity check ensuring we can parse it and it's an object/array
        if isinstance(data, (dict, list)):
            print(f"✅ JSON parsing verified for {file_path}")
            sys.exit(0)
        else:
            print("❌ File is valid JSON but not a structured object or array.")
            sys.exit(1)
            
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON detected in {file_path}: {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
