import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProfileFilters {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
  min_gender_probability?: number;
  min_country_probability?: number;
  sort_by?: 'age' | 'created_at' | 'gender_probability';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const getProfiles = async (filters: ProfileFilters) => {
  const {
    gender,
    age_group,
    country_id,
    min_age,
    max_age,
    min_gender_probability,
    min_country_probability,
    sort_by = 'created_at',
    order = 'desc',
    page = 1,
    limit = 10,
  } = filters;

  const where: Prisma.ProfileWhereInput = {};

  if (gender) where.gender = gender;
  if (age_group) where.age_group = age_group;
  if (country_id) where.country_id = country_id;
  
  if (min_age !== undefined || max_age !== undefined) {
    where.age = {
      gte: min_age,
      lte: max_age,
    };
  }

  if (min_gender_probability !== undefined) {
    where.gender_probability = { gte: min_gender_probability };
  }

  if (min_country_probability !== undefined) {
    where.country_probability = { gte: min_country_probability };
  }

  const skip = (page - 1) * limit;
  const take = Math.min(limit, 50);

  const [data, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      orderBy: { [sort_by]: order },
      skip,
      take,
    }),
    prisma.profile.count({ where }),
  ]);

  return {
    status: 'success',
    page,
    limit: take,
    total,
    data,
  };
};
