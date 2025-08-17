type MenuNode = {
  key: string,
  parentId: string,
  label: string;
  path: string;
  target: string,
  title: string,
  cssClasses: string[],
  children?: MenuNode[],
}

type FlatListMenu = {
  id: string,
  name: string,
  menuItems: {
    nodes: MenuNode[],
  };
};

type HierarchicalMenu = MenuNode[];

type MenusList = {
  [key: string]: HierarchicalMenu,
}

export type { MenuNode, FlatListMenu, HierarchicalMenu, MenusList };