'use strict';
window.addEventListener('DOMContentLoaded', () =>{

    //Tabs
    const tabsContent = document.querySelectorAll(".tabcontent"),
          tabs = document.querySelectorAll('.tabheader__item'),
          tabsParent = document.querySelector('.tabheader__items');


        function hideTabContent () {
            tabsContent.forEach(item =>{
                item.classList.add('hide');
                item.classList.remove('show');

            });
            tabs.forEach(item =>{
                  item.classList.remove('tabheader__item_active');
            });
        }

        function showTabContent (i = 0){
            tabsContent[i].classList.add('show');
            tabsContent[i].classList.remove('hide');
            tabs[i].classList.add('tabheader__item_active');
            
        }
        hideTabContent();
        showTabContent();
        tabsParent.addEventListener('click', (event) =>{
            const target = event.target;
            if(target && target.classList.contains('tabheader__item')){
                tabs.forEach((item, i) =>{
                    if(target == item){
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
        });

//Timer

const deadLine = '2020-05-27';

function getTimeRemaining(endTime){
    const t = Date.parse(endTime) - Date.parse(new Date()),
          days = Math.floor(t/(1000*60*60*24)),
          hours = Math.floor((t/(1000*60*60))%24),
          minutes = Math.floor((t/1000/60)%60),
          seconds = Math.floor((t/1000)%60);


          return{
              'total' : t,
              'days' : days,
              'hours' : hours,
              'minutes' : minutes,
              'seconds' : seconds
          };

}

function getZero(num){
    if(num >= 0 && num < 10){
        return `0${num}`;
    }else if(num < 0){
        return '00';
    }else{
        return num;
    }
}
function setClock(selector, endTime){
     const timer = document.querySelector(selector),
           days = timer.querySelector('#days'),
           hours = timer.querySelector('#hours'),
           minutes = timer.querySelector('#minutes'),
           seconds = timer.querySelector('#seconds'),
           timeInterval = setInterval(updateClock, 1000);
           updateClock();

           function updateClock(){
               const t = getTimeRemaining(endTime);

               days.innerHTML = getZero(t.days);
               hours.innerHTML = getZero(t.hours);
               minutes.innerHTML = getZero(t.minutes);
               seconds.innerHTML = getZero(t.seconds);
               if(t.total <= 0 ){
                    clearInterval(timeInterval);
               }
           }
}

setClock('.timer', deadLine);

//modal

const modalTrigger = document.querySelectorAll('[data-modal]'),
      modal = document.querySelector('.modal');
      

      function openModal(){
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.body.style.overflow = "hidden";
          //  clearInterval(modalTimerId);
      }
      modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
      });

      function closeModal(){
           modal.classList.add('hide');
           modal.classList.remove('show');
           document.body.style.overflow = "";
      }

      

      modal.addEventListener('click', (e) => {
        if(e.target === modal|| e.target.getAttribute('data-close') == ""){
            closeModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modal.classList.contains('show')){
            closeModal();
        }
      });

      //const modalTimerId = setInterval(openModal, 10000);

      function showModalByScroll(){
          if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
              openModal();
              window.removeEventListener('scroll',showModalByScroll);
          }
      }

      window.addEventListener('scroll', showModalByScroll);
// add menu cards
      class menuCard{

        constructor(src, alt, title, descr, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            }else{
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        `;
        this.parent.append(element);
        }
      }
    //get data from db.json
      const getResourse = async (url) => {
        const res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
       };

       //new card with gerResoure
      /* getResourse('http://localhost:3000/menu')
       .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new menuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
       });*/

       axios.get('http://localhost:3000/menu')
       .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
         new menuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

       // Create new card without classes
     /*  getResourse('http://localhost:3000/menu')
       .then(data => createCard(data));
       

       function createCard(data){
           data.forEach(({img, altimg, title, descr, price}) =>{
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
            <img src=${img} alt=${altimg}>
            <h3 class="menu__item-subtitle">${title}</h3>
            <div class="menu__item-descr">${descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${price}</span> грн/день</div>
            </div>
        `;
           document.querySelector('.menu .container').append(element);
        });
       }*/

      //Forms, send info to server with JSON format
        const forms = document.querySelectorAll('form');

        const message = {
            loading: "Загрузка...",
            success: "Спасибо! Скоро мы с Вами свяжемся",
            failure: "Что-то пошло не так..."
        };

        forms.forEach(item => {
            bindPostData(item);
        });

        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
            });
            return await res.json();
        };

        function bindPostData(form){
            form.addEventListener('submit',(e) => {
                e.preventDefault();

                const statusMessage = document.createElement('div');
                statusMessage.classList.add('status');
                statusMessage.textContent = message.loading;
                form.append(statusMessage);

                const formData = new FormData(form);
                
                const json = JSON.stringify(Object.fromEntries(formData.entries()));
               
                postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal( message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });

            });
        }

        function showThanksModal(message){
            const prevModalDialog = document.querySelector('.modal__dialog');

            prevModalDialog.classList.add('hide');
            openModal();

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `<div class = "modal__content">
             <div class = "modal__close" data-close>×</div>
             <div class = "modal__title">${message}</div>
            </div>`;
            document.querySelector('.modal').append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');
                closeModal();
            }, 4000);
        }
        //fetch('http://localhost:3000/menu')
        //    .then(data => data.json())
         //   .then(res => console.log(res));
            
});

