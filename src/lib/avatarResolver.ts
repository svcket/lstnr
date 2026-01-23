/**
 * Deterministic Avatar Resolver
 * Ensures that the same entity always resolves to the same visual identity.
 */

// Stable color palette for backgrounds
const AVATAR_COLORS = [
    '000000', // Black
    '1a1a1a', // Dark Gray
    '333333', // Medium Gray
    '004d40', // Teal
    '1a237e', // Indigo
    '311b92', // Deep Purple
    '880e4f', // Pink
    'b71c1c', // Red
    '3e2723', // Brown
    '0d47a1', // Blue
];

/**
 * Generates a stable background color index based on the ID.
 */
const getColorIndex = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % AVATAR_COLORS.length;
};

/**
 * Returns a stable, deterministic avatar URL for an entity.
 * Priority: 
 * 1. Provided imageUrl
 * 2. Deterministic ui-avatar based on name and id
 */
export const getDeterministicAvatar = (name: string, id: string, imageUrl?: string): string => {
    if (imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('background=random')) {
        return imageUrl;
    }

    const color = AVATAR_COLORS[getColorIndex(id)];
    const sanitizedName = encodeURIComponent(name);
    
    // Using ui-avatars.com for stable, high-quality initials-based avatars
    return `https://ui-avatars.com/api/?name=${sanitizedName}&background=${color}&color=fff&size=256&bold=true`;
};
