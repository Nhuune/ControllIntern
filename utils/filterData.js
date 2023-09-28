const filterData = (data, filters) => {
    return data.filter(data => {
        let isValid = true;
        for (key in filters) {
            isValid = isValid && data[key] == filters[key];
        }
        return isValid;
    });
};

module.exports = {
    filterData,
}