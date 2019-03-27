//map.js
import Pin from './pin';
import Card from './card';
import OnError from './on-error';
import Backend from './backend';
import Filters, {minPrice, filterFields} from './filters';
import RoomsCap from './rooms-cap';
import DragNDrop from './drag-n-drop';
import FileLoader from './file-loader';

/* to do
    file loader
*/

export default class{
    constructor(){
        this.map = document.querySelector('.map');
        this.pins = document.querySelector('.map__pins');
        this.filters = document.querySelector('.map__filters-container');
        this.mainPin = this.pins.querySelector('.map__pin--main');
        this.notice = document.querySelector('.notice__form');
        this.publishBtn = this.notice.querySelector('.form__submit');
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
        new FileLoader(document.querySelector('#avatar'), document.querySelector('.notice__preview').querySelectorAll('img'), 'use');
        new FileLoader(document.querySelector('#images'), document.querySelector('.form__photo-container'), 'create');
        const onError = new OnError();
        this.data = await new Backend('https://js.dump.academy/keksobooking/data', onError).get();
        this.addFilters(filterFields);
        this.renderPins(this.data);
        this.notice.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const values = new FormData(this.notice);
            values.append('address', this.address.value);
            new Backend('https://js.dump.academy/keksobooking').post(values)
            .then(response => {
                if(response.ok) {
                    this.publishBtn.textContent = 'Готово!';
                    this.notice.reset();
                } else{
                    throw new Error('при отправке данных');
                }
            })
            .catch(error => onError.render(`Не удалось отправить данные на сервер. Ошибка ${error.message}. Попробуйте позже.`));
        });
    }

    pinHandler(pin){
        pin.addEventListener('click', () => {
            this.appendCard(pin);
        });
        pin.addEventListener('keydown', (evt) => {
            evt.preventDefault();
            this.appendCard(pin);
        });
        return pin;
    }

    renderPins(arr){
        this.map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(pin => pin.remove());
        if(this._isCard){
            this.map.querySelector('.map__card').remove();
            this._isCard = false;
        }
        const fragment = document.createDocumentFragment();
        arr.forEach(item => fragment.appendChild(this.pinHandler(new Pin(item).render())));
        this.type.addEventListener('change', () => {
            this.price.setAttribute('min', minPrice[this.type.value]);
            this.price.setAttribute('placeholder', minPrice[this.type.value]);
        });
        this.pins.appendChild(fragment);
    }

    appendCard(pin){
        if(this._isCard){
            this.map.replaceChild(new Card(pin.data).render(),                  this.map.querySelector('.map__card'));
        } else{
            this.map.insertBefore(new Card(pin.data).render(), 
                this.filters);
            this._isCard = true;
        }
    }

    addFilters (obj) {
        for(let elem in obj){
            if(obj[elem] instanceof NodeList) {
                this.addFilters(obj[elem]);
            } else if(obj[elem] instanceof HTMLElement){
                obj[elem].addEventListener('change', () => {
                    this.renderPins(new Filters(this.data));
                });
            }
        }
    };
};