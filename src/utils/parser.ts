import { ProfileFilters } from '../services/profile.service';

export const parseNLQuery = (q: string): ProfileFilters | null => {
  const query = q.toLowerCase();
  const filters: ProfileFilters = {};
  let interpreted = false;

  // Gender
  if (/\bmales?\b/.test(query)) {
    filters.gender = 'male';
    interpreted = true;
  } else if (/\bfemales?\b/.test(query)) {
    filters.gender = 'female';
    interpreted = true;
  }

  // Age related
  if (/\byoung\b/.test(query)) {
    filters.min_age = 16;
    filters.max_age = 24;
    interpreted = true;
  }

  const aboveMatch = query.match(/above (\d+)/);
  if (aboveMatch) {
    filters.min_age = parseInt(aboveMatch[1]) + 1;
    interpreted = true;
  }

  // Age groups
  if (/\bchild(ren)?\b/.test(query)) {
    filters.age_group = 'child';
    interpreted = true;
  }
  if (/\bteenagers?\b/.test(query)) {
    filters.age_group = 'teenager';
    interpreted = true;
  }
  if (/\badults?\b/.test(query)) {
    filters.age_group = 'adult';
    interpreted = true;
  }
  if (/\bseniors?\b/.test(query)) {
    filters.age_group = 'senior';
    interpreted = true;
  }

  // Country
  // Simple mapping for common countries in the task
  const countryMap: { [key: string]: string } = {
    'nigeria': 'NG',
    'angola': 'AO',
    'kenya': 'KE',
    'tanzania': 'TZ',
    'uganda': 'UG',
    'sudan': 'SD',
    'united states': 'US',
    'madagascar': 'MG',
    'united kingdom': 'GB',
    'india': 'IN',
    'cameroon': 'CM',
    'cape verde': 'CV',
    'benin': 'BJ'
  };

  for (const [name, id] of Object.entries(countryMap)) {
    if (query.includes(name)) {
      filters.country_id = id;
      interpreted = true;
      break;
    }
  }

  // Handle "from [country_id]" e.g. "from NG"
  const fromCountryMatch = query.match(/from ([a-z]{2})\b/);
  if (fromCountryMatch) {
    filters.country_id = fromCountryMatch[1].toUpperCase();
    interpreted = true;
  }

  return interpreted ? filters : null;
};
