import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { CategoryListType, categoryLoading, createCategories, deleteCategories, updateCategory } from "../../redux/categorySlice";
import { selectCategory } from "../../redux/mainReducer";
import { useState } from "react";
import Input from "../../components/UI/Input/Input";
import ModalMaker from "../../components/UI/modal/Modals";
import CheckboxTree, { Node } from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { IoIosCheckbox, IoIosCheckboxOutline, IoIosArrowForward, IoIosArrowDown, IoIosAdd, IoIosTrash, IoIosFiling } from "react-icons/io";
import { ChangeEvent } from "react";
import { createCategoryList } from "../../controller/common";

function Category() {
  const dispatch = useDispatch();

  //for category rendering
  const [cateName, setCateName] = useState("");
  const [parentCateId, setParentCateId] = useState("");
  const [cateImg, setCateImg] = useState("");

  const { categoryList } = useSelector(selectCategory).categories;

  interface RenderedCategoryReturnType extends Node {}
  type RenederedCategoryType = (categoryList: CategoryListType[]) => RenderedCategoryReturnType[];

  const renderCategory: RenederedCategoryType = (categoryList) => {
    let renderedCategory: Node[] = [];
    if (categoryList) {
      for (let category of categoryList) {
        const childrenForm = (category: CategoryListType) => {
          if (renderCategory(category.children).length > 0) {
            return renderCategory(category.children);
          } else {
            return undefined;
          }
        };

        renderedCategory.push({
          value: category._id,
          label: category.name,

          children: childrenForm(category),
        });
      }
    }

    return renderedCategory;
  };

  /*  const createCategoryList = (categories: any, options: any[] = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name, parentId: category.parentId, type: category.type });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }

    return options;
  }; */

  //for modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChanges = () => {
    dispatch(categoryLoading("pending"));

    if (cateName === "") {
      alert("please enter the category name");
    } else {
      const form = new FormData();
      form.append("name", cateName);
      form.append("parentId", parentCateId);
      form.append("categoryImage", cateImg);

      dispatch(createCategories(form));

      dispatch(categoryLoading("finisihed"));
      setShow(false);

      window.location.reload();
    }
  };

  //for react-check-box
  const [checked, setChecked] = useState([] as any[]);
  const [expanded, setExpanded] = useState([] as any[]);
  const [checkedForShowing, setCheckedForShowing] = useState([] as any[]);
  const [expandedArrForshowing, setExpandedArrForshowing] = useState([] as any[]);
  console.log(checkedForShowing, expandedArrForshowing);

  //* commonly used
  const makingRenderedCheckedAndExpanded = () => {
    const renderedCategory = createCategoryList(categoryList);
    let renderedCheckedArr = [] as any[];
    let renderedExtandArr = [] as any[];

    if (checked.length === 0) {
      setCheckedForShowing([]);
    } else {
      checked.length > 0 &&
        checked.forEach((eachChecked) => {
          const targetData = renderedCategory.find((eachData) => eachData.value === eachChecked);

          targetData && renderedCheckedArr.push(targetData);
          setCheckedForShowing(renderedCheckedArr);
        });
    }

    if (expanded.length === 0) {
      setExpandedArrForshowing([]);
    } else {
      expanded.length > 0 &&
        expanded.forEach((eachExtend) => {
          const targetData = renderedCategory.find((eachData) => eachData.value === eachExtend);
          targetData && renderedExtandArr.push(targetData);
          setExpandedArrForshowing(renderedExtandArr);
        });
    }
  };
  //*    ////////////////////

  //?update functions
  const [updateShow, setUpdateShow] = useState(false);
  const handleUpdateClose = () => setUpdateShow(false);

  const handleUpdateShow = () => {
    makingRenderedCheckedAndExpanded();

    setUpdateShow(true);
  };

  const handleUpdateValues = (
    whatChange: string,
    value: string | undefined,
    index: number,
    type: "checked" | "expanded",
    cb: (arr: any[]) => void
  ) => {
    if (type === "checked") {
      const updatedCheckedArr = checkedForShowing.map((eachChecked, eachIndex) =>
        index === eachIndex ? { ...eachChecked, [whatChange]: value } : eachChecked
      );

      cb(updatedCheckedArr);
    }

    if (type === "expanded") {
      const updatedExpnadArr = expandedArrForshowing.map((eachExpand, eachIndex) =>
        index === eachIndex ? { ...eachExpand, [whatChange]: value } : eachExpand
      );

      cb(updatedExpnadArr);
    }
  };

  const handleUpdateChanges = () => {
    dispatch(categoryLoading("pending"));
    const form = new FormData();

    for (let eachCate of checkedForShowing) {
      form.append("_id", eachCate.value);
      form.append("name", eachCate.name);
      form.append("parentId", eachCate.parentId && eachCate.parentId);
      form.append("type", eachCate.type && eachCate.type);
    }

    for (let eachCate of expandedArrForshowing) {
      form.append("_id", eachCate.value);
      form.append("name", eachCate.name);
      form.append("parentId", eachCate.parentId && eachCate.parentId);
      form.append("type", eachCate.type && eachCate.type);
    }

    dispatch(updateCategory(form));
    setUpdateShow(false);
    dispatch(categoryLoading("finisihed"));
  };

  //for delete

  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = () => {
    makingRenderedCheckedAndExpanded();

    setDeleteShow(true);
  };

  const handleDeleteChanges = () => {
    dispatch(deleteCategories(checkedForShowing));
    handleDeleteClose();
  };

  //* modal body
  const modalBody = () => {
    return (
      <>
        <Input type="text" placeholder="category name" onChange={(e: any) => setCateName(e.target.value)} />
        <select
          className="form-control"
          value={parentCateId}
          onChange={(e: any) => {
            setParentCateId(e.target.value);
          }}
        >
          <option>select category</option>
          {categoryList !== undefined &&
            createCategoryList(categoryList).map((e) => (
              <option key={e.value} value={e.value}>
                {e.name}
              </option>
            ))}
        </select>
        <input
          type="file"
          name="categoryImage"
          onChange={(e: any) => {
            setCateImg(e.target.files[0]);
          }}
        />
      </>
    );
  };

  const modalUpdateBody = () => {
    return (
      <>
        <Row>
          <Col>
            <h6>Checked List</h6>
          </Col>
        </Row>

        {checkedForShowing.length > 0 &&
          checkedForShowing.map((eachChecked, index) => {
            return (
              <Row key={index}>
                <Col>
                  <Input
                    value={eachChecked.name}
                    type="text"
                    placeholder="category name"
                    onChange={(e: any) => {
                      handleUpdateValues("name", e.target.value, index, "checked", setCheckedForShowing);
                    }}
                  />
                </Col>

                <Col>
                  <select
                    className="form-control"
                    onChange={(e: any) => {
                      handleUpdateValues("parentId", e.target.value, index, "checked", setCheckedForShowing);
                    }}
                  >
                    <option>select category</option>
                    {createCategoryList(categoryList).map((eachCate) => {
                      return (
                        <option key={eachCate.value} value={eachCate.value === eachChecked.value ? eachChecked.parentId : eachCate.value}>
                          {eachCate.name}
                        </option>
                      );
                    })}
                  </select>
                </Col>

                <Col>
                  <select
                    defaultValue={eachChecked.type ? eachChecked.type : ""}
                    className="form-control"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleUpdateValues("type", e.target.value, index, "checked", setCheckedForShowing);
                    }}
                  >
                    <option value="">select type</option>
                    <option value="store">Store</option>
                    <option value="product">Product</option>
                    <option value="page">Page</option>
                  </select>
                </Col>
              </Row>
            );
          })}

        <Row>
          <Col>
            <h6>Expanded List</h6>
          </Col>
        </Row>

        {expandedArrForshowing.length > 0 &&
          expandedArrForshowing.map((eachExpand, index) => {
            return (
              <Row key={index}>
                <Col>
                  <Input
                    value={eachExpand.name}
                    type="text"
                    placeholder="category name"
                    onChange={(e: any) => {
                      handleUpdateValues("name", e.target.value, index, "expanded", setExpandedArrForshowing);
                    }}
                  />
                </Col>

                <Col>
                  <select
                    className="form-control"
                    onChange={(e: any) => {
                      /*  setParentCateId(e.target.value); */
                      handleUpdateValues("parentId", e.target.value, index, "expanded", setExpandedArrForshowing);
                    }}
                  >
                    <option>select category</option>
                    {categoryList !== undefined &&
                      createCategoryList(categoryList).map((e) => {
                        const valueTester = () => {
                          if (e.value === eachExpand.value && eachExpand.parentId !== undefined) {
                            return eachExpand.parentId;
                          } else if (e.value === eachExpand.value && eachExpand.parentId === undefined) {
                            return "undefined";
                          }
                        };
                        return (
                          <option key={e.value} value={valueTester()}>
                            {e.name}
                          </option>
                        );
                      })}
                  </select>
                </Col>

                <Col>
                  <select
                    defaultValue={eachExpand.type ? eachExpand.type : ""}
                    className="form-control"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleUpdateValues("type", e.target.value, index, "expanded", setExpandedArrForshowing);
                    }}
                  >
                    <option value="">select type</option>
                    <option value="store">Store</option>
                    <option value="product">Product</option>
                    <option value="page">Page</option>
                  </select>
                </Col>
              </Row>
            );
          })}
      </>
    );
  };

  const modalDeleteBody = () => {
    return (
      <>
        <Row>
          <Col>
            <p>{"<Extended List>"}</p>
            {expandedArrForshowing.length > 0 && expandedArrForshowing.map((eachEx, index) => <div key={index}>{eachEx.name}</div>)}
          </Col>
        </Row>

        <Row>
          <Col>
            <p>{"<Checked List>"}</p>
            {checkedForShowing.length > 0 && checkedForShowing.map((eachChecked, index) => <div key={index}>{eachChecked.name}</div>)}
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <CateSection>
              <h3>category</h3>
              <div className="actionsdiv">
                <span>Actions : </span>
                <button onClick={handleShow}>
                  <IoIosAdd />
                  add
                </button>
                <button onClick={handleDeleteShow}>
                  <IoIosTrash />
                  delete
                </button>
                <button onClick={handleUpdateShow}>
                  <IoIosFiling />
                  update
                </button>
              </div>
            </CateSection>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CheckboxTree
              nodes={renderCategory(categoryList)}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpanded(expanded)}
              icons={{
                check: <IoIosCheckbox />,
                uncheck: <IoIosCheckboxOutline />,
                halfCheck: <IoIosCheckboxOutline />,
                expandClose: <IoIosArrowForward />,
                expandOpen: <IoIosArrowDown />,
              }}
            />
          </Col>
        </Row>
      </Container>

      {/*add modal*/}
      <ModalMaker show={show} handleClose={handleClose} handleChanges={handleChanges} modalBody={modalBody} title="category" />

      {/* update modal */}
      <ModalMaker
        show={updateShow}
        handleClose={handleUpdateClose}
        handleChanges={handleUpdateChanges}
        modalBody={modalUpdateBody}
        title="Update"
        size="lg"
      />

      {/* delete modal */}
      <ModalMaker
        show={deleteShow}
        handleClose={handleDeleteClose}
        modalBody={modalDeleteBody}
        title="Delete"
        buttons={[
          {
            label: "close",
            color: "danger",
            onClick: handleDeleteClose,
          },
          {
            label: "delete",
            color: "primary",
            onClick: handleDeleteChanges,
          },
        ]}
      />
    </Layout>
  );
}

const CateSection = styled.section`
  display: flex;
  justify-content: space-between;

  & .actionsdiv {
    display: flex;
    align-items: center;

    & button {
      border: none;
      margin: 0 5px;
      font-size: 1rem;
      &:hover {
        background-color: #bdbdbd;
      }
    }
  }
`;

export default Category;
