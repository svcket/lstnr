#!/usr/bin/env python3
import sys
import re

def main():
    if len(sys.argv) < 2:
        print("Usage: python verify_ui_theme.py <path_to_tsx_file>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            
        # Regex to find hardcoded hex colors or rgb/rgba (a common UI violation in LSTNR)
        hex_pattern = re.compile(r'#([0-9a-fA-F]{3,8})')
        rgb_pattern = re.compile(r'rgba?\(')
        
        errors = []
        
        for i, line in enumerate(content.split('\n')):
            if hex_pattern.search(line) or rgb_pattern.search(line):
                # Ignore SVG files or svg string definitions usually safe
                if "<Svg" not in line and "fill=" not in line:
                    errors.append(f"Line {i+1}: Hardcoded color found '{line.strip()}'. Use `theme.colors` instead.")
                    
        if errors:
            print("❌ UI Theme Verification Failed!")
            for e in errors:
                print(e)
            sys.exit(1)
            
        print(f"✅ UI Theme Verification Passed for {file_path}")
        sys.exit(0)
        
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
