class SearchFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.search
        ? {
            name: {
              $regex: this.queryStr.search,
              $options: "i", // Case insensitive
            },
          }
        : {};
      this.query = this.query.find({ ...keyword });
      return this;
    }
  
    filter() {
      // Add additional filtering logic if needed
      return this;
    }
  
    pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
      const skip = resultPerPage * (currentPage - 1);
      this.query = this.query.limit(resultPerPage).skip(skip);
      return this;
    }
  }
  
  module.exports = SearchFeatures;
  