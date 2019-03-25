//map.js
import Pin from './pin';
import Card from './card';
import OnError from './on-error';
import Backend from './backend';
import Filters, {filterFields} from './filters';
import RoomsCap from './rooms-cap';
import DragNDrop from './drag-n-drop';

/* to do
    post request
    fix post response
    complex validation
    file loader
    no pins case after filters
    features filter doesnt work
    card closing after filters
*/

const minPrice = {
    'flat': '1000',
    'house': '5000',
    'bungalo': '0',
    'palace': '10000'
};

export default class{
    constructor(){
        this.map = document.querySelector('.map');
        this.pins = document.querySelector('.map__pins');
        this.filters = document.querySelector('.map__filters-container');
        this.mainPin = this.pins.querySelector('.map__pin--main');
        this.notice = document.querySelector('.notice__form');
        this.address = this.notice.querySelector('#address');
        this.type = document.querySelector('#type');
        this.price = document.querySelector('#price');
        this.render = this.render.bind(this);
        this.mainPin.addEventListener('mouseup', this.render);
        new DragNDrop(this.mainPin, this.map);
        this._isCard = false;
        this.data;
    }
    async render(){
        this.map.classList.remove('map--faded');
        this.notice.classList.remove('notice__form--disabled');
        this.mainPin.addEventListener('click', () => {
            this.mainPin.removeEventListener('mouseup', this.render);
        });
        this.address.value = `${(this.mainPin.getBoundingClientRect().left - this.mainPin.offsetWidth/2).toFixed(0)}, ${(this.mainPin.getBoundingClientRect().bottom + window.pageYOffset).toFixed(0)}`;
        document.querySelectorAll('fieldset').forEach(fs => fs.disabled = false);
        new RoomsCap();
        const onError = new OnError();
        this.data = await new Backend('https://js.dump.academy/keksobooking/data', onError).get();
        this.addFilters(filterFields);
        this.renderPins(this.data);
        this.notice.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const values = new FormData(this.notice);
            values.append('address', this.address.value);
            const result = new Backend('https://js.dump.academy/keksobooking', onError).post(values);
            console.log(result);
        });
    }

    pinHandler(pin){
        pin.addEventListener('click', () => {
            this.map.replaceChild(new Card(pin.data).render(), this.map.querySelector('.map__card'));
        });
        pin.addEventListener('keydown', (evt) => {
            evt.preventDefault();
            this.map.replaceChild(new Card(pin.data).render(), this.map.querySelector('.map__card'));
        });
        return pin;
    }

    renderPins(arr){
        this.map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(pin => pin.remove());
        const fragment = document.createDocumentFragment();
        arr.forEach(item => fragment.appendChild(this.pinHandler(new Pin(item).render())));
        if(this._isCard){
            this.map.replaceChild(new Card(arr[0]).render(), this.map.querySelector('.map__card'));
        } else{
            this.map.insertBefore(new Card(arr[0]).render(), this.filters);
            this._isCard = true;
        }
        this.type.addEventListener('change', () => {
            this.price.setAttribute('min', minPrice[this.type.value]);
            this.price.setAttribute('placeholder', minPrice[this.type.value]);
        });
        this.pins.appendChild(fragment);
    }

    addFilters (obj) {
        for(let elem in obj){
            if(obj[elem] instanceof HTMLCollection) {
                this.addFilters(obj[elem]);
            } else if(obj[elem] instanceof HTMLElement){
                obj[elem].addEventListener('change', () => {
                    this.renderPins(new Filters(this.data));
                });
            }
        }
    };
};