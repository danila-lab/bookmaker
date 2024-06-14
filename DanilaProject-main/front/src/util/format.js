export const formatGameDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth} ${hours}:${minutes}`;
};

export const format2Num = (num) => {
    if (num) {
        const n = parseFloat(num);
        if (!isNaN(n)) {
            return parseFloat(n.toFixed(2));
        }
    }
    return null;
}

export const convertDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
