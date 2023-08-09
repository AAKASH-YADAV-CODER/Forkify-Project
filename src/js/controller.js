import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import RecipeView from "./View/RecipeView.js";
import SearchView from "./View/SearchView.js";
import ResultView from "./View/ResultView.js";
import bookMarkView from "./View/bookMarkView.js";
import PaginationView from "./View/PaginationView.js";
import addUserRecipeView from "./View/addUserRecipeView.js";
import { MODLCLOSE_TIME } from "./config.js";
import { async } from "regenerator-runtime";

// https://forkify-api.herokuapp.com/v2 This is API of this forkify

const controlShowRecipe = async () => {
  try {
    //Getting hash ID
    const id = window.location.hash.slice(1);
    if (!id) return;
    RecipeView.renderSpiner();

    //1 update result view to mark selected result search and Also of bookmark penal
    ResultView.update(model.getSearchResultPage());
    bookMarkView.update(model.state.bookmarks);

    //2. Fetching the Data for recipe
    await model.loadRecipe(id);

    //3. Rendering recipe
    RecipeView.render(model.state.recipe);
  } catch (error) {
    //4. showing error in hash id is not correct
    RecipeView.renderErrorMessage();
  }
};
const controlSearchRecipe = async () => {
  try {
    //1 Get Query ID
    const query = await SearchView.getQuery();
    if (!query) return;
    ResultView.renderSpiner();

    //2  load Query Result
    await model.loadSearchResults(query);

    //3 Render Search Result
    ResultView.render(model.getSearchResultPage());

    //4.Render Pagination button
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPaginationResult = (gotoPage) => {
  //1 Render New Search Result
  ResultView.render(model.getSearchResultPage(gotoPage));

  //2.Render New Pagination button
  PaginationView.render(model.state.search);
};
const controllServings = (newServingvvalue) => {
  //3 update the recipe sevings (in state)
  model.updateServings(newServingvvalue); //this value we get of dataset form handler(UpdateTo)

  //4. Rendering recipe
  RecipeView.update(model.state.recipe);
  //
};

const controllupdateBookmark = () => {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //1. Render recipe
  RecipeView.update(model.state.recipe);

  //2. Show bookmarks in penal(bookmarks container)
  bookMarkView.render(model.state.bookmarks);
};

const controllBookmarkRender = () => {
  bookMarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async (userData) => {
  try {
    //1. Loading Spinner
    addUserRecipeView.renderSpiner();

    //2. Upload user Data(new Recipe)
    await model.uploadUserRecipe(userData);

    //3. Render Recipe
    RecipeView.render(model.state.recipe);

    //4. Successfully message
    addUserRecipeView.renderMessage();

    //5. Render Bookmark View
    bookMarkView.render(model.state.bookmarks);

    //6. Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //7. Close form Window
    setTimeout(() => {
      addUserRecipeView.toogleWindow();
    }, MODLCLOSE_TIME * 1000);
  } catch (err) {
    console.log(err);
    addUserRecipeView.renderErrorMessage(err.message);
  }
};

const init = () => {
  //Publisher-Subscriber Pattern
  bookMarkView.addHandlerRender(controllBookmarkRender);
  RecipeView.addHandlerRender(controlShowRecipe);
  SearchView.addHandlerSearch(controlSearchRecipe);
  PaginationView.addHandlerClick(controlPaginationResult);
  RecipeView.addHandlerUpdateServings(controllServings);
  RecipeView.addHandlerUpdatebookMark(controllupdateBookmark);
  addUserRecipeView.addHandlerAddRecipe(controlAddRecipe);
};
init();
