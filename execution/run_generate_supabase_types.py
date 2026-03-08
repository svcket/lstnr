#!/usr/bin/env python3
import subprocess
import sys
import os
import argparse

def run_command(command, shell=True):
    try:
        result = subprocess.run(
            command,
            shell=shell,
            check=True,
            text=True,
            capture_output=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"ERROR executing: {command}", file=sys.stderr)
        print(f"STDOUT: {e.stdout}", file=sys.stderr)
        print(f"STDERR: {e.stderr}", file=sys.stderr)
        sys.exit(e.returncode)

def main():
    parser = argparse.ArgumentParser(description="Generate Supabase TypeScript definitions.")
    parser.add_argument("--project-id", type=str, help="Remote Supabase project ID (optional)")
    args = parser.parse_args()

    output_file = "src/types/supabase.ts"

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    if args.project_id:
        print(f"Generating types from remote project: {args.project_id}...")
        command = f"npx supabase gen types typescript --project-id {args.project_id} > {output_file}"
    else:
        print("Generating types from local Supabase instance...")
        command = f"npx supabase gen types typescript --local > {output_file}"

    run_command(command)
    print(f"Successfully generated Typescript definitions to {output_file}")

if __name__ == "__main__":
    main()
