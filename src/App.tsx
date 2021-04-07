import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./routes/Homepage/Home";
import Login from "./routes/LogIn/Login";
import Register from "./routes/Register/Register";
import { login } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import Products from "./routes/products/Products";
import Orders from "./routes/orders/Orders";
import Category from "./routes/Category/Category";
import Page from "./routes/Page/Page";
import { categoryLoading, getAllCategories } from "./redux/categorySlice";
import { getAllProducts } from "./redux/productSlice";

function App() {
  const token = localStorage.getItem("token");
  const localUserInfo = localStorage.getItem("userInfo");
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && localUserInfo) {
      dispatch(
        login({
          token,
          ...JSON.parse(localUserInfo!),
        })
      );
    }

    dispatch(categoryLoading("pending"));
    dispatch(getAllCategories());
    dispatch(getAllProducts());
    dispatch(categoryLoading("finished"));
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/page" component={Page} />
          <Route path="/register" component={Register} />
          <Route path="/products" component={Products} />
          <Route path="/category" component={Category} />
          <Route path="/orders" component={Orders} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
