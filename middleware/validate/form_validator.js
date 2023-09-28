const checkInvalidData = async (req, res, next) => {
    const data = req.body
    const regexWhiteSpace = /^\s+$/;
    for (let prop in data) {
        if (regexWhiteSpace.test(data[prop]) || data[prop] == null || data[prop] === "") {
            return res.status(400).json(`Invalid data ${prop} = ${data[prop]}`);
        }
    }
    next()
};

let regexEmail = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
let dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;
let regexPhone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

module.exports = {
    checkInvalidData,
    regexEmail,
    dateRegex,
    regexPhone
}