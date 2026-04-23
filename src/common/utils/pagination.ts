import { Request } from "express";

export const getPagination = (req: Request) => {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit as string) || 10, 1),
    50,
  );

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const getUserFilters = (req: Request) => {
  const filters: Record<string, any> = {};

  if (req.query.firstName) {
    filters.firstName = {
      $regex: new RegExp(req.query.firstName as string, "i"),
    };
  }

  if (req.query.lastName) {
    filters.lastName = {
      $regex: new RegExp(req.query.lastName as string, "i"),
    };
  }

  if (req.query.email) {
    filters.email = { $regex: new RegExp(req.query.email as string, "i") };
  }

  return filters;
};
