import View from './View.js';
import preview from './preview.js';
class ResultView extends View {
  _parentEle = document.querySelector('.bookmarks__list');
  _errormessage =
    'You have not bookmark any recipe! bookmark your Favourate recipe:)';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup = () => {
    return this._data.map(bookmark => preview.render(bookmark, false)).join('');
  };
}
export default new ResultView();
