//filters.js

export const minPrice = {
    'flat': '1000',
    'house': '5000',
    'bungalo': '0',
    'palace': '10000'
};

export const filterFields = {
    'type': document.querySelector('#housing-type'),
    'rooms': document.querySelector('#housing-rooms'),
    'guests': document.querySelector('#housing-guests'),
    'prices': document.querySelector('#housing-price'),
    'features': document.querySelector('#housing-features').querySelectorAll('input')
};

export default class{
    constructor(arr){
        this.arr = arr;
        this.arr = this.filterDefault('type', filterFields['type'].value);
        this.arr = this.filterDefault('rooms', filterFields['rooms'].value);
        this.arr = this.filterDefault('guests', filterFields['guests'].value);
        this.arr = this.filterPrice(filterFields['prices'].value);
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
        filterFields['features'].forEach(elem => {
            if(elem.checked) checkedFeatures.push(elem.value);
        }); 
        return this.arr.filter(item => {
            return checkedFeatures.every(feature => item['offer']['features'].includes(feature));
        });
    }
};