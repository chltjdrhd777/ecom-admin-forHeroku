import React, { ChangeEvent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/UI/Input/Input";
import Modals from "../../components/UI/modal/Modals";
import { createCategoryList } from "../../controller/common";
import { selectCategory, selectPage } from "../../redux/mainReducer";
import Select from "react-select";
import styled from "styled-components";
import axios from "../../axios/axios";
import { useDispatch } from "react-redux";
import { createPage, loading } from "../../redux/pageSlice";

function Page() {
  const dispatch = useDispatch();
  const { loadingState } = useSelector(selectPage);

  //# for createPage modal
  const [createPageShow, setCreatePageShow] = useState(false);

  const [renderedCata, setRenderedCate] = useState([] as { value: string; name: string; parentId: string; type: string }[]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [banners, setBannsers] = useState([] as any[]);
  const [products, setProducts] = useState([] as any[]);
  const [type, setType] = useState("");

  const {
    categories: { categoryList },
  } = useSelector(selectCategory);

  useEffect(() => {
    if (categoryList !== undefined) {
      const renderedList = createCategoryList(categoryList);
      setRenderedCate(renderedList);
    }
  }, [categoryList]);

  const handleCreatePageShow = () => {
    setCreatePageShow(true);
  };
  const handleCreatePageClose = () => {
    setCreatePageShow(false);
  };
  const handleCreatePageChanges = async () => {
    dispatch(loading("pending"));

    if (title === "") {
      alert("title is required");
      return;
    }

    if (banners.length === 0 || products.length === 0) {
      alert("you should upload at leat one photo");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("categoryId", categoryId);
    form.append("type", type);

    for (let banner of banners) {
      form.append("banners", banner);
    }

    for (let product of products) {
      form.append("products", product);
    }

    const response = await axios.post("/page/createPage", form, { withCredentials: true });

    dispatch(createPage(response));

    dispatch(loading("finished"));

    setTitle("");
    setDescription("");
    setCategoryId("");
    setType("");
    setBannsers([]);
    setProducts([]);

    handleCreatePageClose();
  };

  const handleBanners = (e: ChangeEvent<HTMLInputElement>) => {
    let files = [] as any;
    for (let i = 0; i < e.target.files!.length; i++) {
      files.push(e.target.files![i]);
    }

    setBannsers([...banners, ...files]);
  };
  const handleProducts = (e: ChangeEvent<HTMLInputElement>) => {
    let files = [] as any;
    for (let i = 0; i < e.target.files!.length; i++) {
      files.push(e.target.files![i]);
    }

    setProducts([...products, ...files]);
  };
  //////////////////////////

  const createPageModalBody = () => {
    if (loadingState === "pending") {
      return (
        <Container>
          <Row>
            <Col>
              <h1>please wait</h1>
              <Spinner animation="border" variant="primary" />
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <Row>
            <Col>
              <Input
                label="Create Page"
                type="text"
                placeholder="title"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Input
                type="text"
                placeholder="description"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Select
                onChange={(value) => {
                  const categoryTypeFind = renderedCata.find((eachRendered) => eachRendered.value === value!.value);
                  setCategoryId(value!.value);
                  categoryTypeFind !== undefined && setType(categoryTypeFind.type);
                }}
                options={renderedCata.map((eachCate) => {
                  return { value: eachCate.value, label: eachCate.name };
                })}
              />
            </Col>
          </Row>

          <FileSelectDiv>
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <p>select banner</p>
                <input
                  type="file"
                  name="banners"
                  multiple
                  onChange={handleBanners}
                  className="form-control form-control-sm"
                  style={{ height: "50px", paddingTop: "10px" }}
                />

                <div style={{ border: "1px solid lightgray", marginTop: "5px" }}>
                  <p style={{ fontWeight: "bold" }}>what you select List</p>
                  {banners.length > 0 &&
                    banners.map((eachBanenr, index) => {
                      return (
                        <Row key={index}>
                          <Col>{eachBanenr.name}</Col>
                        </Row>
                      );
                    })}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <p>select product</p>
                <input
                  type="file"
                  name="products"
                  multiple
                  onChange={handleProducts}
                  className="form-control form-control-sm"
                  style={{ height: "50px", paddingTop: "10px" }}
                />

                <div style={{ border: "1px solid lightgray", marginTop: "5px" }}>
                  <p style={{ fontWeight: "bold" }}>what you select List</p>
                  {products.length > 0 &&
                    products.map((eachProduct, index) => {
                      return (
                        <Row key={index}>
                          <Col>{eachProduct.name}</Col>
                        </Row>
                      );
                    })}
                </div>
              </Col>
            </Row>
          </FileSelectDiv>
        </Container>
      );
    }
  };
  return (
    <>
      <Layout sidebar>
        {}
        <button onClick={handleCreatePageShow}>create pages</button>
      </Layout>

      <Modals
        show={createPageShow}
        handleClose={handleCreatePageClose}
        modalBody={createPageModalBody}
        title="Create Pages"
        buttons={[
          {
            label: "ok",
            color: "primary",
            onClick: handleCreatePageChanges,
          },
        ]}
        css={true}
      />
    </>
  );
}

const FileSelectDiv = styled.div`
  border: 1px solid lightgray;
  margin-top: 10px;
  padding: 5px 10px 10px;

  & p {
    margin: 5px 0;
  }
`;

export default Page;
