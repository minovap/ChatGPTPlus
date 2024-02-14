export const setSettingsInLocalStorage = (settings) => {
  try {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings to localStorage", e);
  }
};

export const getSettingsFromLocalStorage = () => {
  try {
    const settings = localStorage.getItem('appSettings');
    return settings ? JSON.parse(settings) : null;
  } catch (e) {
    console.error("Error reading settings from localStorage", e);
    return null;
  }
};