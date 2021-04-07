const createCategoryList = (categories: any[], wantChildrenData?: boolean, options: any[] = []) => {
  for (let category of categories) {
    let pushData = { value: category._id, name: category.name, parentId: category.parentId, type: category.type } as {
      value: string;
      name: string;
      parentId: string;
      type: string;
      children?: any[] | undefined;
    };
    if (wantChildrenData === true && category.children) {
      pushData.children = category.children;
    }
    options.push(pushData);

    if (category.children && category.children.length > 0) {
      createCategoryList(category.children, wantChildrenData, options);
    }
    /* 
    options.push({ value: category._id, name: category.name, parentId: category.parentId, type: category.type });
    if (category.children && category.children.length > 0) {
      createCategoryList(category.children, options);
    } */
  }

  return options;
};

export { createCategoryList };
