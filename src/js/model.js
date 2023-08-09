import { async } from "regenerator-runtime";
import { URL, RES_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helpers";
export const state = {
  recipe: {},
  search: {
    query: {},
    results: [],
    resultpage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const createRecipeObject = (data) => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async (id) => {
  try {
    const data = await AJAX(`${URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    //So by this when go back after mark true it remains true.
    if (state.bookmarks.some((ele) => ele.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;
    const data = await AJAX(`${URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    //This is For every load Search Result it start with 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultpage;
  const end = page * state.search.resultpage;
  return state.search.results.slice(start, end);
};
export const updateServings = (newServings) => {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newqunt=oldqunt * newServings / oldServings formula
  });
  state.recipe.servings = newServings;
};

const persistBookmark = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = (recipe) => {
  state.bookmarks.push(recipe);

  //Mark true bookmark as we use ternory to reflect css
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const deleteBookmark = (id) => {
  const index = state.bookmarks.findIndex((rec) => rec.id === id);
  state.bookmarks.splice(index, 1);

  // Unmark mean false(vice-vers)
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const loadBookmarkToRender = () => {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
loadBookmarkToRender();

const clear = function () {
  localStorage.clear();
};
// clear();

export const uploadUserRecipe = async (usrdata) => {
  try {
    const ingredients = Object.entries(usrdata)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(",").map((ele) => ele.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong Ingredient format! please provide correct format :)"
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : "", unit, description };
      });
    const recipe = {
      title: usrdata.title,
      source_url: usrdata.sourceUrl,
      image_url: usrdata.image,
      publisher: usrdata.publisher,
      cooking_time: +usrdata.cookingTime,
      servings: +usrdata.servings,
      ingredients,
    };
    const data = await AJAX(`${URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
