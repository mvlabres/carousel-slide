import { api, LightningElement } from 'lwc';

const INVALID_NUMBER_OF_ELEMENTS = 'Número de elementos inválido.';
const ELEMENT_MARGIN = 5;
const ELEMENT_SIZE_BY_QUANTITY = {
    1: '90%',
    2: '45%',
    3: '30%'
}

export default class CarouselSlide extends LightningElement {
    
    scroll = 0;
    elementSize; 
    hasError = false;
    messageError;
    isScrollButtonVisible = true;

    @api isElementsSizeFlex = false;

    @api 
    get numberOfElementsShown(){
        return this._numberOfElementsShown;
    }

    set numberOfElementsShown(value){

        this._numberOfElementsShown = parseInt(value);
         
        if(!this._numberOfElementsShown || this._numberOfElementsShown > 3) {
            this.setError(INVALID_NUMBER_OF_ELEMENTS);
            return;
        }
    }

    get container(){
        return this.template.querySelector('[data-id="container-slide"]') ;
    }

    get scrollEnd(){
        return this.container.scrollWidth - (this.elementWidth * this.numberOfElementsShown);
    }

    get numberOfElements(){
        return this.querySelectorAll('c-carousel-element').length;
    }

    get elementDescription(){
        if( this.numberOfElements <= 0 ) return;
        return this.querySelectorAll('c-carousel-element')[0];
    }

    get elementWidth(){
        return this.elementDescription.clientWidth + this.elementMargin;
    }

    get elementMargin(){
        return ELEMENT_MARGIN * 2;
    }

    toPrevious(){

        if( this.scroll <= 0 ) return;

        this.scroll = this.scroll - this.elementWidth

        if(this.scroll < this.elementWidth){
            this.scroll = 0;
        }

        this.moveScroll();
    }

    toNext(){

        if(this.scroll >= this.scrollEnd ) return;

        this.scroll = this.scroll + this.elementWidth

        if( this.scroll > (this.scrollEnd - this.elementWidth)){
            this.scroll = this.scrollEnd;
        }

        this.moveScroll();
    }

    moveScroll(){
        this.template.querySelector('[data-id="container-slide"]').scrollLeft = this.scroll;
    }

    formatElementsLayout(){

        this.isScrollButtonVisible = this.numberOfElements > 3;

        const quantityElements = (this.numberOfElements <= 3 && this.isElementsSizeFlex) ? this.numberOfElements : this.numberOfElementsShown;

        this.querySelectorAll('c-carousel-element').forEach(element => {
            element.style.minWidth = ELEMENT_SIZE_BY_QUANTITY[quantityElements];
            element.style.marginRight = ELEMENT_MARGIN + 'px';
            element.style.marginLeft = ELEMENT_MARGIN + 'px';
        });
    }

    setError(error){
        this.hasError = true;
        this.messageError = error;
    }

    renderedCallback(){
        this.formatElementsLayout();
    }
}