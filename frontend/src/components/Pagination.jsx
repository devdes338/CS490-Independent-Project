function Pagination({ totalRows, rowsPerPage, setCurrentPage, currentPage }) {
    let pages = [];

    for(let i =1; i<=Math.ceil(totalRows/rowsPerPage); i++) {
        pages.push(i)
    }

    return (
        <div>
            {
                pages.map((page, index) => {
                    return (
                        <button key={index} onClick={() => setCurrentPage(page)} className={page == currentPage ? 'active' : ''}>
                            {page}
                        </button>
                    );
                })
            }
        </div>
    );
}

export default Pagination;