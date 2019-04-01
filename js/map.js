//map.js
import Pin from './pin';
import Card from './card';
import OnError from './on-error';
import Backend from './backend';
import Filters, {minPrice, filterFields} from './filters';
import RoomsCap from './rooms-cap';
import DragNDrop from './drag-n-drop';
import FileLoader from './file-loader';

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
        this.reRender = this.reRender.bind(this);
        this.mainPin.addEventListener('mouseup', this.reRender);
        this.fieldsets = document.querySelectorAll('fieldset');
        this.fieldsets.forEach(fs => fs.disabled = true);
        this.drag = new DragNDrop(this.mainPin, this.map);
        this.avatarLoader = new FileLoader(document.querySelector('#avatar'), document.querySelector('.notice__preview').querySelectorAll('img'), 'use');
        this.previewsLoader = new FileLoader(document.querySelector('#images'), document.querySelector('.form__photo-container'), 'create');
        this.onError = new OnError();
        this._isRendered = false;
        this._isCard = false;
        this.data;
    }
    
    initialRender(){
        new RoomsCap();
        this.addFilters(filterFields);
        this.notice.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const values = new FormData(this.notice);
            values.append('address', this.address.value);
            new Backend('https://js.dump.academy/keksobooking').post(values)
            .then(response => {
                if(response.ok) {
                    this.resetMap();
                } else{
                    throw new Error('при отправке данных');
                }
            })
            .catch(error => onError.render(`Не удалось отправить данные на сервер. Ошибка ${error.message}. Попробуйте позже.`));
        });
        this._isRendered = true;
        this.notice.addEventListener('reset', () => {
            this.resetMap();
        });
    }

    async reRender(){
        if(!this._isRendered) this.initialRender();
        this.map.classList.remove('map--faded');
        this.notice.classList.remove('notice__form--disabled');
        this.mainPin.addEventListener('click', () => {
            this.mainPin.removeEventListener('mouseup', this.render);
        });
        this.address.value = `${(this.mainPin.getBoundingClientRect().left - this.mainPin.offsetWidth/2).toFixed(0)}, ${(this.mainPin.getBoundingClientRect().bottom + window.pageYOffset).toFixed(0)}`;
        this.fieldsets.forEach(fs => fs.disabled = false);
        this.data = await new Backend('https://js.dump.academy/keksobooking/data', this.onError).get();
        this.renderPins(this.data);
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
        this.clearPinsAndCard();
        const fragment = document.createDocumentFragment();
        arr.forEach(item => fragment.appendChild(this.pinHandler(new Pin(item).render())));
        this.type.addEventListener('change', () => {
            this.price.setAttribute('min', minPrice[this.type.value]);
            this.price.setAttribute('placeholder', minPrice[this.type.value]);
        });
        this.pins.appendChild(fragment);
    }

    clearPinsAndCard(){
        this.map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(pin => pin.remove());
        if(this._isCard){
            this.map.querySelector('.map__card').remove();
            this._isCard = false;
        }
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
    }

    resetMap(){
        this.fieldsets.forEach(fs => fs.disabled = true);
        this.notice.reset();
        this.drag.reset();
        this.avatarLoader.reset();
        this.previewsLoader.reset();
        this.clearPinsAndCard();
        this.map.classList.add('map--faded');
        this.notice.classList.add('notice__form--disabled');
        this.mainPin.addEventListener('mouseup', this.reRender);
    }
};