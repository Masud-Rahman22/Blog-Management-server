import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "minPrice",
      "maxPrice",
    ];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Handle price range filtering
    if (this.query.minPrice || this.query.maxPrice) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceFilter: any = {};
      if (this.query.minPrice) priceFilter.$gte = Number(this.query.minPrice);
      if (this.query.maxPrice) priceFilter.$lte = Number(this.query.maxPrice);

      // Apply the price filter
      this.modelQuery = this.modelQuery.find({
        ...queryObj,
        price: priceFilter,
      } as FilterQuery<T>);
    } else {
      this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    }

    return this;
  }

  sort() {
    const sortField = (this.query.sort as string) || "createdAt";
    const sortOrder = sortField.startsWith("-") ? -1 : 1;

    const cleanSortField = sortField.replace(/^-/, "");
    this.modelQuery = this.modelQuery.sort({ [cleanSortField]: sortOrder });

    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this.query.fields as string)?.split(",")?.join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async execute() {
    const totalData = await this.countTotal();
    const results = await this.modelQuery.exec();

    return {
      results,
      pagination: totalData,
    };
  }

  public async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model
      .countDocuments(totalQueries)
      .exec();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;