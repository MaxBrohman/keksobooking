//filters.js

export const minPrice = {
    'flat': '1000',
    'house': '5000',
    'bungalo': '0',
    'palace': '10000'
};

export const filterFields = {
    elems: {
        'type': document.querySelector('#housing-type'),
        'rooms': document.querySelector('#housing-rooms'),
        'guests': document.querySelector('#housing-guests'),
        'prices': document.querySelector('#housing-price'),
        'features': document.querySelector('#housing-features').querySelectorAll('input')
    },
    //Рекурсивная функция навешивания обработчиков
    addFilters(obj, handler){
        Object.values(obj).forEach(elem => {
            if(elem instanceof NodeList){
                this.addFilters(elem, handler);
            } else{
                elem.addEventListener('change', handler);
            }
        });
    }
};
//Фильтрация массива данных, полученных с сервера
export default class Filters{
    constructor(arr){
        this.arr = arr;
        this.arr = this.filterDefault('type', filterFields.elems['type'].value);
        this.arr = this.filterDefault('rooms', filterFields.elems['rooms'].value);
        this.arr = this.filterDefault('guests', filterFields.elems['guests'].value);
        this.arr = this.filterPrice(filterFields.elems['prices'].value);
        this.arr = this.filterFeatures();
        return this.arr;
    }
    filterDefault(type, value) {
        if(value ==='any') return this.arr;
        return this.arr.filter(item => item['offer'][type] == value);
    }
    filterPrice (value) {
        if(value ==='any') return this.arr;
        return this.arr.filter(item => {
            switch(value){
                case 'low':
                    return item['offer']['price'] < minPrice['flat'];
                case 'middle':
                    return item['offer']['price'] >= minPrice['palace'] && item['offer']['price'] < 50000;
                case 'high':
                    return item['offer']['price'] >= 50000;
            }
        });
    }
    filterFeatures () {
        const checkedFeatures = [];
        filterFields.elems['features'].forEach(elem => {
            if(elem.checked) checkedFeatures.push(elem.value);
        }); 
        return this.arr.filter(item => {
            return checkedFeatures.every(feature => item['offer']['features'].includes(feature));
        });
    }
};