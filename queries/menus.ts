import { fetchAPI } from '../lib/api-utils';

export const getAllMenus = async () => {
  const data = await fetchAPI(`
    {
      menus(first: 100) {
        nodes {
          name
          id
        }
      }
    }
  `);

  return data;
};

export const getMenuByID = async (id: string) => {
  const data = await fetchAPI(`
    {
      menu(id: "${id}") {
        menuItems(first: 100) {
          nodes {
            id
            label
            url
          }
        }
      }
    }
  `);

  return data;
};

export const getMenuByLocation = async (location: string) => {
  const data = await fetchAPI(`
    {
      menus(where: {location: ${location}}) {
        nodes {
          id
          name
          menuItems(first: 100) {
            nodes {
              key: id,
              parentId,
              label
              path
              target
              title
              cssClasses
            }
          }
        }
      }
    }
  `);
  return data?.menus?.nodes[0];
};
