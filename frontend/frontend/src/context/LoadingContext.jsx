import { createContext, useContext, useState, useEffect } from 'react';

let externalSetLoading = null;

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    externalSetLoading = setIsLoading; // collega lo state alla funzione esterna
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const setGlobalLoading = (value) => {
  if (externalSetLoading) {
    externalSetLoading(value);
  } else {
    console.warn('setGlobalLoading called before context initialized');
  }
};
