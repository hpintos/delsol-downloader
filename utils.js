const MONTHS = ['Enero','Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const formatDate = ()=> {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
};

const getMonth = (str)=> {
    if (str === '' || str === undefined) {
        return '';
    }
    let monthNumber = (MONTHS.map(m => m.toLocaleLowerCase()).indexOf(str.toLocaleLowerCase()) + 1).toString();
    if (monthNumber.toString().length === 1) {
        monthNumber = '0' + monthNumber; 
    }
    return monthNumber;
}

const getDay = (day)=> {
    if (day === '' || day === undefined) {
        return '';
    }
    if (day.toString().length === 1) {
        day = '0' + day; 
    }
    return day;
}

module.exports = {
    formatDate, getMonth, getDay
};