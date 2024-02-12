// cache.js
export const set = (key, value) => {
    try {
        // Wrap the value in an object and stringify the object
        const wrappedValue = JSON.stringify({ value });
        localStorage.setItem(key, wrappedValue);
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
};

export const get = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        // Parse the stored string back into an object and return its value property
        const parsedItem = JSON.parse(item);
        return parsedItem.value !== undefined ? parsedItem.value : defaultValue;
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return defaultValue;
    }
};
