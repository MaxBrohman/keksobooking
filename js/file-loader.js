//file-loader.js

const MAX_FILES = 5;

export default class{
    constructor(loader, previews, mode){
        this.loader = loader;
        this.previews = previews;
        this.types = /\.(gif|jpe?g|png|svg)$/i;
        this.loader.addEventListener('change', () => {
            this.loadHandler();
        });
        this.mode = mode;
    }

    async loadHandler(){
        const files = this.loader.files;
        if(this.mode === 'use'){
            if(this.types.test(files[0].name)){
                this.initUseReader(this.previews[0], files[0]);
            }
        } else if(this.mode === 'create'){
            const max = files.length > MAX_FILES ? MAX_FILES : files.length;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < max; i++){
                if(this.types.test(files[i].name)){
                    await this.initCreateReader(files[i])
                    .then(img => {
                        fragment.appendChild(img);
                    });
                }
            }
            this.previews.appendChild(fragment);
        }
    }

    initUseReader(preview, file){
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            preview.src = reader.result;
        });
        reader.readAsDataURL(file);
    }

    initCreateReader(file){
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.dataset.root = 'generated';
                resolve(img);
            });
            reader.readAsDataURL(file);
        });
    }

    reset(){
        if(this.mode === 'use') {
            this.previews[0].src = 'img/muffin.png';
        } else if(this.mode === 'create'){
            this.previews.querySelectorAll('img[data-root="generated"]').forEach(elem => elem.remove());
        }
    }
}