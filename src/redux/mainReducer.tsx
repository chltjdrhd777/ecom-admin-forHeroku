import user, { UserState } from "./userSlice";
import category, { CategoryState } from "./categorySlice";
import product, { ProductState } from "./productSlice";
import page, { PageState } from "./pageSlice";

export const mainReducer = {
  user: user.reducer,
  category: category.reducer,
  product: product.reducer,
  page: page.reducer,
};

interface StateType {
  user: UserState;
  category: CategoryState;
  product: ProductState;
  page: PageState;
}

export const selectUser = (state: StateType) => {
  return state.user;
};

export const selectCategory = (state: StateType) => {
  return state.category;
};

export const selectProduct = (state: StateType) => {
  return state.product;
};

export const selectPage = (state: StateType) => {
  return state.page;
};
