import { getMenuByLocation } from '@/queries/menus';
import {
  FlatListMenu,
  HierarchicalMenu,
  MenuNode,
  MenusList,
} from '@/types/menu';

const flatListToHierarchical = (
  data: MenuNode[] = [],
  { idKey = 'key', parentKey = 'parentId', childrenKey = 'children' } = {}
) => {
  const tree: any = [];
  const childrenOf: any = {};

  data.forEach((item: any) => {
    const newItem = { ...item };
    const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
    childrenOf[id] = childrenOf[id] || [];
    newItem[childrenKey] = childrenOf[id];
    parentId
      ? (childrenOf[parentId] = childrenOf[parentId] || []).push(newItem)
      : tree.push(newItem);
  });

  return tree;
};

const getMenus = async () => {
  const primaryNavigation: FlatListMenu = await getMenuByLocation(
    'PRIMARY_NAVIGATION'
  );
  const footerNavigation: FlatListMenu = await getMenuByLocation(
    'FOOTER_NAVIGATION'
  );
  const footerSecondaryNavigation: FlatListMenu = await getMenuByLocation(
    'FOOTER_SECONDARY_NAVIGATION'
  );

  const hierarchicalPrimaryNavigation: HierarchicalMenu = primaryNavigation
    ? flatListToHierarchical(primaryNavigation?.menuItems.nodes)
    : [];

  const hierarchicalFooterNavigation: HierarchicalMenu = footerNavigation
    ? flatListToHierarchical(footerNavigation?.menuItems.nodes)
    : [];

  const hierarchicalSecondaryFooterNavigation: HierarchicalMenu =
    footerSecondaryNavigation
      ? flatListToHierarchical(footerSecondaryNavigation?.menuItems.nodes)
      : [];

  const menusList: MenusList = {
    primary: hierarchicalPrimaryNavigation,
    footer: hierarchicalFooterNavigation,
    footer_secondary: hierarchicalSecondaryFooterNavigation,
  };

  return menusList;
};

export { getMenus };
