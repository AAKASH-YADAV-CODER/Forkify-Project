import View from "./View.js";
const icons = new URL("../../img/icons.svg", import.meta.url);

class PaginationView extends View {
  _parentEle = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentEle.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      const gotopage = +btn.dataset.goto;
      handler(gotopage);
    });
  }
  _generateMarkup = () => {
    const currPage = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultpage
    );
    //Page 1 and Other Page
    if (currPage === 1 && numPage > 1) {
      return `<button data-goto='${
        currPage + 1
      }' class="btn--inline pagination__btn--next">
            <span>Page${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //Last Page Previous Page
    if (currPage === numPage && numPage > 1) {
      return `<button data-goto='${
        currPage - 1
      }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currPage - 1}</span>
          </button>`;
    }

    //Inbetween Page (Other Page)
    if (currPage < numPage) {
      return `<button data-goto='${
        currPage + 1
      }' class="btn--inline pagination__btn--next">
            <span>Page${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          <button data-goto='${
            currPage - 1
          }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currPage - 1}</span>
          </button>`;
    }
    return;
  };
}
export default new PaginationView();
