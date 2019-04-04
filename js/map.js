//map.js
import Pin from './pin';
import Card from './card';
import OnError from './on-error';
import Backend from './backend';
import Filters, {minPrice, filterFields} from './filters';
import RoomsCap from './rooms-cap';
import DragNDrop, {getAdress} from './drag-n-drop';
import FileLoader from './file-loader';

//Основной класс, инициализирующий работу приложения
export default class Map{
    constructor(){
        this.map = document.querySelector('.map');
        this.pins = document.querySelector('.map__pins');
        this.filters = document.querySelector('.map__filters-container');
        this.mainPin = this.pins.querySelector('.map__pin--main');
        this.notice = document.querySelector('.notice__form');
        this.type = document.querySelector('#type');
        this.price = document.querySelector('#price');
        this.reRender = this.reRender.bind(this);
        this.mainPin.addEventListener('mouseup', this.reRender);
        this.fieldsets = document.querySelectorAll('fieldset');
        this.fieldsets.forEach(fs => fs.disabled = true);
        this.drag = new DragNDrop(this.mainPin, this.map);
        this.avatarLoader = new FileLoader(document.querySelector('#avatar'), document.querySelector('.notice__preview').querySelectorAll('img'), 'use');
        this.previewsLoader = new FileLoader(document.querySelector('#images'), document.querySelector('.form__photo-container'), 'create');
        this.appendCard = this.appendCard.bind(this);
        this.clearPinsAndCard = this.clearPinsAndCard.bind(this);
        this.onError = new OnError();
        this._isRendered = false;
        this._isCard = false;
        this.data;
    }
    
    /*Срабатывает единожды при первоначальном запуске, в дальнейшем при выходе из неактивного состояния, срабатывает только reRender*/
    initialRender(){
        new RoomsCap();
        filterFields.addFilters(filterFields.elems, this.filtersHandler.bind(this));
        this.notice.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const values = new FormData(this.notice);
            values.append('address', this.notice.querySelector('#address').value);
            new Backend('https://js.dump.academy/keksobooking').post(values)
            .then(response => {
                if(response.ok) {
                    this.resetMap();
                } else{
                    throw new Error('при отправке данных');
                }
            })
            .catch(error => this.onError.render(`Не удалось отправить данные на сервер. Ошибка ${error.message}. Попробуйте позже.`));
        });
        this.type.addEventListener('change', () => {
            this.price.setAttribute('min', minPrice[this.type.value]);
            this.price.setAttribute('placeholder', minPrice[this.type.value]);
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
        getAdress(this.mainPin);
        this.fieldsets.forEach(fs => fs.disabled = false);
        this.data = await new Backend('https://js.dump.academy/keksobooking/data', this.onError).get();
        this.pins.appendChild(Pin.renderAllPins(this.data, this.clearPinsAndCard, this.appendCard));
    }

    clearPinsAndCard(){
        this.map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(pin => pin.remove());
        if(this._isCard){
            this.map.querySelector('.map__card').remove();
            this._isCard = false;
        }
    }
    /*Карточка объявления отрисовывается по информации об объявлении, сохраненной 
    в объекте pin при его создании */
    appendCard(pin){
        if(this._isCard){
            this.map.replaceChild(new Card(pin.data).render(),                  this.map.querySelector('.map__card'));
        } else{
            this.map.insertBefore(new Card(pin.data).render(), 
                this.filters);
            this._isCard = true;
        }
    }

    filtersHandler(){
        this.pins.appendChild(Pin.renderAllPins(new Filters(this.data), this.clearPinsAndCard, this.appendCard));
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