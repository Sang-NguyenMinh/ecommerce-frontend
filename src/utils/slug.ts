export const createSlug = (name: string, id: string): string => {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Remove consecutive -

  return `${slug}-${id}`;
};

export const extractIdFromSlug = (slug: string): string => {
  return slug.split('-').pop() || '';
};
