//card.js
const offerTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
};
export default class{
    constructor(options){
        this.card = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);
        this.title = this.fillElem('.popup__tittle', 'textContent', options['offer']['tittle']);
        this.adress = this.fillElem('.popup__text--address', 'textContent', options['offer']['address']);
        this.price = this.fillElem('.popup__price', 'textContent', `${options['offer']['price']} \u20BD /ночь`);
        this.type = this.fillElem('.popup__type', 'textContent', offerTypes[options['offer']['type']]);
        this.capacity = this.fillElem('.popup__text--capacity', 'textContent', `Количество комнат:  ${options['offer']['rooms']}, количество гостей: ${options['offer']['guests']}`);
        this.time = this.fillElem('.popup__text--time', 'textContent', `Заезд после ${options['offer']['checkin']}, выезд до ${options['offer']['checkout']}`);
        this.features = this.card.querySelector('.popup__features');
        options['offer']['features'].forEach(feature => {
            this.features.innerHTML += `<li class="feature feature--${feature}"></li>`;
        });
        this.description = this.fillElem('.popup__description', 'textContent', options['offer']['description']);
        this.pictures = this.card.querySelector('.popup__pictures');
        options['offer']['photos'].forEach(photo => {
            this.pictures.innerHTML += `<li><img src="${photo}"></li>`;
        });
        this.avatar = this.fillElem('.popup__avatar', 'src', options['author']['avatar']);
        this.close = this.card.querySelector('.popup__close');

        this.closeKeydownHandler = this.closeKeydownHandler.bind(this);
    }

    fillElem(elem, attr, content){
        this.card.querySelector(elem)[attr] = content;
    }
    render(){
        document.addEventListener('keydown', this.closeKeydownHandler);
        this.close.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.closeHandler();
        });
        return this.card;
    }
    closeHandler(){
        this.card.classList.add('hidden');
    }
    closeKeydownHandler(evt){
        if(evt.code === 'Escape'){
            evt.preventDefault();
            this.closeHandler();
            document.removeEventListener('keydown', this.closeKeydownHandler);
        }
    }
};