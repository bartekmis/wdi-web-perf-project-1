import { createContext, useState } from 'react';

export const CurtainsContext = createContext({
  curtains: null,
  setCurtains: (instance: any) => {},
});

const CurtainsContextProvider = (props: any) => {
  const [curtainsIntance, setCurtainsInstance] = useState(null);

  const setCurtains = (instance: any) => {
    setCurtainsInstance(instance);
  };

  return (
    <CurtainsContext.Provider
      value={{
        curtains: curtainsIntance,
        setCurtains: setCurtains,
      }}
    >
      {props.children}
    </CurtainsContext.Provider>
  );
};

export default CurtainsContextProvider;
