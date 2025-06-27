// Mock for tailwind-merge
// This mock simulates the twMerge function which combines and deduplicates Tailwind CSS classes

/**
 * Mock implementation of twMerge from tailwind-merge package
 * In tests, we don't need the actual class merging logic,
 * we just need to return a combined string for component testing
 */
export function twMerge(...classLists) {
  // Flatten all arguments and filter out falsy values
  const classes = classLists
    .flat()
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter(Boolean);

  // Remove duplicates (simple deduplication for testing)
  const uniqueClasses = [...new Set(classes)];
  
  return uniqueClasses.join(' ');
}

// Default export for compatibility
export default twMerge;
