import React, { createContext, useContext, useState } from 'react';
import { AdvanceLoadingPopup } from '../components/ui/AdvanceLoadingPopup';

interface LoadingContextType {
  showLoader: (title?: string, subtitle?: string, duration?: number) => void;
  hideLoader: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [subtitle, setSubtitle] = useState<string | undefined>();
  const [duration, setDuration] = useState<number | undefined>();

  const showLoader = (customTitle?: string, customSubtitle?: string, customDuration?: number) => {
    setTitle(customTitle);
    setSubtitle(customSubtitle);
    setDuration(customDuration);
    setIsOpen(true);
  };

  const hideLoader = () => {
    setIsOpen(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader, isLoading: isOpen }}>
      {children}
      <AdvanceLoadingPopup
        isOpen={isOpen}
        onClose={hideLoader}
        title={title}
        subtitle={subtitle}
        duration={duration}
      />
    </LoadingContext.Provider>
  );
};

export const useAdvanceLoading = () => useContext(LoadingContext);
