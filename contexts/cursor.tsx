import { createContext, useState } from 'react';

export const CursorContext = createContext({
  isActive: false,
  onChange: (isActive: boolean) => {},
});

const CursorContextProvider = (props: any) => {
  const [isActive, setIsActive] = useState(false);

  const onChange = (isActive: boolean) => {
    setIsActive(isActive);
  };

  return (
    <CursorContext.Provider value={{
      isActive: isActive,
      onChange: onChange,
    }}>
      {props.children}
    </CursorContext.Provider>
  );
};

export default CursorContextProvider;