import "./pagination.styles.scss";

type PaginationProps = {
  totalPosts: number;
  postsPerPage: number;
  setCurrentPage: (pageNumber: number) => void;
  currentPage: number;
};

const Pagination = ({
  totalPosts,
  postsPerPage,
  setCurrentPage,
  currentPage,
}: PaginationProps) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }
  return (
    <div className="pagination-container">
      &#10092;
      {pages.map((page, index) => {
        return (
          <button
            className="pagination-btn"
            id={page == currentPage ? "active-page-btn" : ""}
            key={index}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        );
      })}
      &#10093;
    </div>
  );
};

export default Pagination;
