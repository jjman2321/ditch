// The category chips above the service list (onboarding and Add).

import { CATEGORIES, type Category } from './services';

export type Filter = 'Popular' | Category;
export const FILTERS: Filter[] = ['Popular', ...CATEGORIES];
/** Short chip names, so the first four fit on an iPhone 12 (design/v12 render 02). */
export const CHIP: Partial<Record<Filter, string>> = {
  'Music & audio': 'Music',
  'News & reading': 'News',
  'Shopping & food': 'Shopping',
  'Cloud & security': 'Cloud',
  'Health & fitness': 'Fitness',
};
