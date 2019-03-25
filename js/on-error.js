//on-error.js

export default class{
    constructor(){
        this.error = document.querySelector('.form__error');
        this.error.querySelector('button').addEventListener('click', (evt) => {
            evt.preventDefault();
            this.error.style.display = 'none';
        });
        this.error.querySelector('button').addEventListener('keydown', (evt) => {
            evt.preventDefault();
            if(evt.code === 'Enter') this.error.style.display = 'none';
        });
    }
    render(message){
        this.error.querySelector('p').textContent = message;
        this.error.style.display = 'block';
    }
};