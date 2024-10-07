const getData = (url, callback) => {
    let xhr = new XMLHttpRequest();

    xhr.onload = callback;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
};

const dataError = () => {
    console.log("An error occurred");
};

export { getData };