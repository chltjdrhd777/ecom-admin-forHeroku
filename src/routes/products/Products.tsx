import React, { useEffect, useState } from "react";
import { Col, Container, Row, Modal, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/UI/Input/Input";
import Modals from "../../components/UI/modal/Modals";
import { categoryLoading, createCategories, getAllCategories } from "../../redux/categorySlice";
import { selectCategory, selectProduct } from "../../redux/mainReducer";
import { deleteProducts, getAllProducts, setProducts } from "../../redux/productSlice";

function Products() {
  const dispatch = useDispatch();

  //*for category rendering
  const { categoryList } = useSelector(selectCategory).categories;

  const createCategoryList = (categories: any, options: any[] = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }

    return options;
  };

  //*for modal

  //! 1. for add modal
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [productPictures, setProductPictures] = useState([] as any[]);
  const [addShow, setAddShow] = useState(false);

  const handleAddClose = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setQuantity(0);
    setProductPictures([]);

    setAddShow(false);
  };
  const handleAddShow = () => setAddShow(true);

  const handleAddChanges = () => {
    const renderPrice = price.toString().replace(".", ",");

    dispatch(categoryLoading("pending"));
    const form = new FormData();

    form.append("name", name);
    form.append("price", renderPrice);

    form.append("description", description);
    form.append("quantity", quantity.toString().replace(/(^0+)/, ""));
    for (let pic of productPictures) {
      form.append("productPictures", pic);
    }
    form.append("category", categoryId);

    dispatch(setProducts(form));
    handleAddClose();
    dispatch(categoryLoading("finisihed"));
  };

  const addModalBody = () => {
    return (
      <>
        <Input
          label="Name"
          value={name}
          placeholder="Product name"
          onChange={(e: any) => {
            setName(e.target.value);
          }}
        />

        <Input
          label="Price"
          type="number"
          value={price}
          placeholder="price"
          onChange={(e: any) => {
            setPrice(e.target.value);
          }}
        />

        <Input
          label="Description"
          value={description}
          placeholder="description"
          onChange={(e: any) => {
            setDescription(e.target.value);
          }}
        />

        <Input
          label="Quantity"
          type="number"
          value={quantity}
          placeholder="quantity"
          onChange={(e: any) => {
            setQuantity(e.target.value);
          }}
        />

        <select
          className="form-control"
          value={categoryId}
          onChange={(e: any) => {
            setCategoryId(e.target.value);
          }}
        >
          <option>select category</option>
          {categoryList &&
            createCategoryList(categoryList).map((e) => (
              <option key={e.value} value={e.value}>
                {e.name}
              </option>
            ))}
        </select>

        <article style={{ marginTop: "0.5rem", marginBottom: "0.5rem", border: " 1px solid black" }}>
          <p style={{ fontWeight: 800 }}>selected file list</p>
          {productPictures.length > 0 &&
            productPictures.map((pic, index): any => {
              return <div key={index}>{pic.name}</div>;
            })}
        </article>

        <input
          type="file"
          name="productPictures"
          multiple
          onChange={(e: any) => {
            setProductPictures([...productPictures, ...e.target.files]);
          }}
        />
      </>
    );
  };

  //! 2. for productModal
  const [productShow, setProductShow] = useState(false);
  const [productInfo, setProductInfo] = useState({} as any);
  const handleProductShow = () => setProductShow(true);
  const handleProductClose = () => setProductShow(false);
  const handleProductChanges = () => {
    console.log(productInfo);
    new Promise((resolve) => {
      resolve(dispatch(deleteProducts(productInfo._id)));
    }).then(() => {
      dispatch(getAllProducts);
      document.location.reload();
      handleProductClose();
    });
  };
  const ProductModalBody = (productInfo: any) => {
    return (
      <ProductDetailModalSection>
        <Row>
          <Col md={6}>
            <label className="product_detail_key">Name</label>
            <p className="product_detail_value">{productInfo.name}</p>
          </Col>
          <Col md={6}>
            <label className="product_detail_key">Price</label>
            <p className="product_detail_value">{productInfo.price}</p>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <label className="product_detail_key">Quantity</label>
            <p className="product_detail_value">{productInfo.quantity}</p>
          </Col>
          <Col md={6}>
            <label className="product_detail_key">Category</label>
            <p className="product_detail_value">{productInfo.category && productInfo.category.name} </p>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <label className="product_detail_key">Description</label>
            <p className="product_detail_value">{productInfo.description}</p>
          </Col>
        </Row>

        <Row>
          <Col style={{ display: "flex", flexDirection: "column" }}>
            <label className="product_detail_key">Product Pictures</label>
            <div>
              {productInfo &&
                productInfo.productPictures &&
                productInfo.productPictures.map((productPic: any) => (
                  <img
                    key={productPic._id}
                    src={
                      window.location.hostname === "localhost"
                        ? `http://localhost:8080/public/${productPic.img}`
                        : `https://flipkartserverdelpoyed.herokuapp.com/public/${productPic.img}`
                    }
                    alt=""
                    className="product_detail_img"
                  />
                ))}
            </div>
          </Col>
        </Row>
      </ProductDetailModalSection>
    );
  };

  //* for table rendering
  const { productList } = useSelector(selectProduct).products;
  const tableRendering = () => {
    return (
      <Table responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => {
            return (
              <tr
                key={product._id}
                onClick={() => {
                  handleProductShow();

                  setProductInfo(product);
                }}
                className="product_tableRows"
              >
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
                <td>{product.category && product.category.name}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <ProductSection>
              <h3>Product</h3>
              <button onClick={handleAddShow}>add</button>
            </ProductSection>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <ProductDetailtable>{tableRendering()}</ProductDetailtable>
          </Col>
        </Row>
      </Container>

      <Modals show={addShow} handleChanges={handleAddChanges} handleClose={handleAddClose} modalBody={addModalBody} title="product" />
      <Modals
        show={productShow}
        handleChanges={handleProductChanges}
        handleClose={handleProductClose}
        modalBody={() => ProductModalBody(productInfo)}
        title="product detail"
        saveMessage="delete this item"
        size="lg"
      />
    </Layout>
  );
}

const ProductSection = styled.section`
  display: flex;
  justify-content: space-between;
`;

const ProductDetailtable = styled.section`
  .product_tableRows {
    cursor: pointer;
    font-size: small;
    &:hover {
      background-color: #eee;
    }
  }
`;

const ProductDetailModalSection = styled.section`
  .product_detail_key {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .product_detail_value {
    font-size: 1.2rem;
  }

  .product_detail_img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    object-fit: cover;
  }
`;

export default Products;
