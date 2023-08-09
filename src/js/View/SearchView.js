class SearchView {
  _parentEle = document.querySelector(".search");
  getQuery() {
    const query = this._parentEle.querySelector(".search__field").value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    return (this._parentEle.querySelector(".search__field").value = "");
  }
  addHandlerSearch(handlerFun) {
    this._parentEle.addEventListener("submit", function (e) {
      e.preventDefault();
      handlerFun();
    });
  }
}
export default new SearchView();
