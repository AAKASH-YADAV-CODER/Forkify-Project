import View from './View.js';
import preview from './preview.js';
class ResultView extends View {
  _parentEle = document.querySelector('.results');
  _errormessage = 'No recipe related found ! Please try another:)';
  _message = '';

  _generateMarkup = () => {
    return this._data.map(result => preview.render(result, false)).join('');
  };
}
export default new ResultView();
