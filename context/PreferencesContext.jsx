import { createContext, useContext, useState } from "react";

const PreferencesContext = createContext(null);

export const supportedCurrencies = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "TRY", label: "Turkish Lira" },
  { code: "GBP", label: "British Pound" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
];

export function PreferencesProvider({ children }) {
  const [currency, setCurrency] = useState("USD");

  return (
    <PreferencesContext.Provider value={{ currency, setCurrency }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }

  return context;
}