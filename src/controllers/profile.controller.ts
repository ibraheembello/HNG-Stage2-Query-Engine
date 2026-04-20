import { Request, Response } from 'express';
import * as profileService from '../services/profile.service';
import { parseNLQuery } from '../utils/parser';
import { AppError, handleError } from '../utils/errors';

export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const {
      gender,
      age_group,
      country_id,
      min_age,
      max_age,
      min_gender_probability,
      min_country_probability,
      sort_by,
      order,
      page,
      limit,
    } = req.query;

    const filters: profileService.ProfileFilters = {
      gender: gender as string,
      age_group: age_group as string,
      country_id: country_id as string,
      min_age: min_age ? parseInt(min_age as string) : undefined,
      max_age: max_age ? parseInt(max_age as string) : undefined,
      min_gender_probability: min_gender_probability ? parseFloat(min_gender_probability as string) : undefined,
      min_country_probability: min_country_probability ? parseFloat(min_country_probability as string) : undefined,
      sort_by: sort_by as any,
      order: order as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    // Basic validation for numeric types
    if (min_age && isNaN(filters.min_age!)) throw new AppError('Invalid parameter type', 422);
    if (max_age && isNaN(filters.max_age!)) throw new AppError('Invalid parameter type', 422);
    if (min_gender_probability && isNaN(filters.min_gender_probability!)) throw new AppError('Invalid parameter type', 422);
    if (min_country_probability && isNaN(filters.min_country_probability!)) throw new AppError('Invalid parameter type', 422);
    if (page && isNaN(filters.page!)) throw new AppError('Invalid parameter type', 422);
    if (limit && isNaN(filters.limit!)) throw new AppError('Invalid parameter type', 422);

    const result = await profileService.getProfiles(filters);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const searchProfiles = async (req: Request, res: Response) => {
  try {
    const { q, page, limit } = req.query;

    if (!q || (q as string).trim() === '') {
      throw new AppError('Missing or empty parameter', 400);
    }

    const nlFilters = parseNLQuery(q as string);

    if (!nlFilters) {
      return res.status(200).json({
        status: 'error',
        message: 'Unable to interpret query'
      });
    }

    const filters: profileService.ProfileFilters = {
      ...nlFilters,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const result = await profileService.getProfiles(filters);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
