class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // search product
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  //filter product
  filter() {
    const queryCopy = { ...this.queryStr };

    //remove some feild from url
    const removeField = ["keyword", "page", "limit"];
    removeField.forEach((key) => delete queryCopy[key]);

    //filter price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    console.log("queryCopy", queryCopy);

    return this;
  }
  //pagination 
  pagination(ResultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = ResultPerPage * (currentPage - 1);

    this.query = this.query.limit(ResultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
