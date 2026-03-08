#!/usr/bin/env python3
import argparse
import os
import sys

BOILERPLATE = """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '{theme_import}';

interface {component_name}Props {{
  title?: string;
}}

export const {component_name} = ({{ title }}: {component_name}Props) => {{
  return (
    <View style={{styles.container}}>
      {{title && <Text style={{styles.title}}>{{title}}</Text>}}
    </View>
  );
}};

const styles = StyleSheet.create({{
  container: {{
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
  }},
  title: {{
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.sm,
  }},
}});
"""

INDEX_BOILERPLATE = """export * from './{component_name}';
"""

def get_relative_theme_path(component_path):
    """
    Given a path like 'src/components/common/MyComponent', returns the relative 
    path to 'src/theme/theme.ts' (e.g. '../../../theme/theme').
    Assuming theme is at `src/theme/theme.ts`. If not, we adjust here.
    """
    # Simply count directory depth.
    depth = component_path.count('/')
    if depth == 0:
        return "./theme"
    if component_path.startswith("src/"):
        # src/components -> theme is at ../theme/theme
        # src/components/common -> theme is at ../../theme/theme
        up = "../" * (depth - 1)
        return f"{up}theme/theme"
    return "src/theme/theme"

def main():
    parser = argparse.ArgumentParser(description="Scaffold a new React Native component adhering to LSTNR Theme.")
    parser.add_argument("name", type=str, help="Name of the Component (e.g. CreatorCard)")
    parser.add_argument("--dir", type=str, default="src/components", help="Directory to place the component")
    args = parser.parse_args()

    component_name = args.name
    base_dir = args.dir

    folder_path = os.path.join(base_dir, component_name)
    os.makedirs(folder_path, exist_ok=True)

    file_path = os.path.join(folder_path, f"{component_name}.tsx")
    index_path = os.path.join(folder_path, "index.ts")

    theme_import = get_relative_theme_path(folder_path)

    # Write Component
    with open(file_path, "w") as f:
        f.write(BOILERPLATE.format(
            component_name=component_name,
            theme_import=theme_import
        ))
    
    # Write Index
    with open(index_path, "w") as f:
        f.write(INDEX_BOILERPLATE.format(
            component_name=component_name
        ))

    print(f"✅ Successfully created {component_name} at {folder_path}")

if __name__ == "__main__":
    main()
