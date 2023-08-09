const icons = new URL("../../img/icons.svg", import.meta.url);
export default class View {
  _data;

  /**
   * Render the recived object to DOM
   * @Params {object | object[]} The data to be render (e.g recipe)
   * @Params {boolean | [render=true]} if false, Create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is return if render is false
   * this {object} view instance
   * @author Aakash Yadav
   * @todo Finish Implementation
   */

  render(data, renderr = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();
    this._data = data;
    const markup = this._generateMarkup();
    if (!renderr) return markup;
    this._clear();
    this._parentEle.insertAdjacentHTML("afterbegin", markup);
  }
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDOM.querySelectorAll("*"));
    const currElement = Array.from(this._parentEle.querySelectorAll("*"));

    newElement.forEach((newEle, i) => {
      const curEle = currElement[i];
      //   console.log(newEle.isEqualNode(curEle));
      //we can also see the Nodevalue in MDN

      //Udate Change only Text
      if (
        !newEle.isEqualNode(curEle) &&
        newEle.firstChild?.nodeValue.trim() !== ""
      ) {
        curEle.textContent = newEle.textContent;
      }

      //Update change attribute also
      if (!newEle.isEqualNode(curEle)) {
        Array.from(newEle.attributes).forEach((att) =>
          curEle.setAttribute(att.name, att.value)
        );
      }
    });
  }

  _clear = () => {
    this._parentEle.innerHTML = "";
  };

  renderSpiner = () => {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clear();
    this._parentEle.insertAdjacentHTML("afterbegin", markup);
  };

  // For showing Error
  renderErrorMessage(message = this._errormessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentEle.insertAdjacentHTML("afterbegin", markup);
  }
  // After getting Success
  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentEle.insertAdjacentHTML("afterbegin", markup);
  }
}
