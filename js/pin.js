//pin.js

//Создание метки объявления
export default class Pin{
    constructor(options){
        this.pin = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
        this.pin.data = options;
        this.pin.style.left = options['location']['x'] - this.pin.offsetWidth/2 + 'px';
        this.pin.style.top = options['location']['y'] - this.pin.offsetHeight + 'px';
        this.avatar = this.pin.querySelector('img');
        this.avatar.src = options['author']['avatar'];
        this.avatar.alt = options['offer']['tittle'];
    }
    pinHandler(handler){
        this.pin.addEventListener('click', () => {
            handler(this.pin);
        });
        this.pin.addEventListener('keydown', (evt) => {
            if(evt.code === 'Enter'){
                evt.preventDefault();
                handler(this.pin);
            }
        });
    }
    render(func){
        this.pin.setAttribute('tabindex', '0');
        this.pinHandler(func)
        return this.pin;
    }

    //Метод не требует создания экземпляра класса, поскольку сам их создает
    static renderAllPins(arr, clearPins, handler){
        clearPins();
        const fragment = document.createDocumentFragment();
        arr.forEach(item => fragment.appendChild(new this(item).render(handler)));
        return fragment;
    }
};