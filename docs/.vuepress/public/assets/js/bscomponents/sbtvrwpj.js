/*! Built with http://stenciljs.com */
const{h:t}=window.bscomponents;import{p as e,o as s,t as i,s as o,r as a,q as d}from"./chunk-89dac778.js";import{a as n}from"./chunk-96a54a48.js";import{c as h}from"./chunk-79b4afa6.js";import{a as l}from"./chunk-6568b9ed.js";import{a as r}from"./chunk-89796593.js";import{a as c}from"./chunk-c1b19ebe.js";class m{constructor(){this.showEventName="show.bs.modal",this.shownEventName="shown.bs.modal",this.hideEventName="hide.bs.modal",this.hiddenEventName="hidden.bs.modal",this.showModal=!1,this.handleDataDismissModalClick=(t=>{this.modalEl.contains(t.target)||this.hide(),this.elementIsOrInADataDismissForThisModal(t.target)&&this.hide()}),this.handleResizeEvent=(()=>{this.adjustDialog()}),this.hideModalBecauseEscapePressed=(t=>{27===t.which&&this.hide()}),this.handleFocusIn=(t=>{document===t.target||this.modalEl.contains(t.target)||this.modalEl.focus()}),this.backdropClickDismiss=(t=>{t.target===t.currentTarget&&("static"===n(this.config,"backdrop","")?this.modalEl.focus():this.hide())})}componentWillLoad(){if(this.isShown=i(this.modalEl,"show"),this.isTransitioning=!1,this.showModal&&!this.isShown){if(this.getConfig(),!i(this.modalEl,"fade"))return void this.show();a(this.modalEl,"fade");const t=l(this.modalEl);this.show(),setTimeout(()=>{o(this.modalEl,"fade")},t)}else if(!this.showModal&&this.isShown){if(this.getConfig(),!i(this.modalEl,"fade"))return void this.hide();const t=l(this.modalEl);a(this.modalEl,"fade"),this.hide(),setTimeout(()=>{o(this.modalEl,"fade")},t)}}componentDidUnload(){this.unbindAllEventListenersUsed()}unbindAllEventListenersUsed(){document.removeEventListener("focusin",this.handleFocusIn),this.modalEl.removeEventListener("click",this.backdropClickDismiss),document.removeEventListener("click",this.handleDataDismissModalClick),window.removeEventListener("resize",this.handleResizeEvent),document.removeEventListener("keydown",this.hideModalBecauseEscapePressed)}getScrollbarWidth(){const t=document.createElement("div");t.className="modal-scrollbar-measure",document.body.appendChild(t);const e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e}checkScrollbar(){const t=document.body.getBoundingClientRect();this.isBodyOverflowing=t.left+t.right<window.innerWidth,this.scrollbarWidth=this.getScrollbarWidth()}setScrollbar(){if(this.isBodyOverflowing){const t=Array.prototype.slice.call(document.querySelectorAll(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top")),e=Array.prototype.slice.call(document.querySelectorAll(".sticky-top"));for(let e=0,s=t.length;e<s;e+=1){const s=t[e].style.paddingRight,i=window.getComputedStyle(t[e])["padding-right"];t[e].dataset.paddingRight=s,t[e].style.paddingRight=`${parseFloat(i)+this.scrollbarWidth}px`}for(let t=0,s=e.length;t<s;t+=1){const s=e[t].style.marginRight,i=window.getComputedStyle(e[t])["margin-right"];e[t].dataset.marginRight=s,e[t].style.marginRight=`${parseFloat(i)-this.scrollbarWidth}px`}const s=document.body.style.paddingRight,i=window.getComputedStyle(document.body)["padding-right"];document.body.dataset.paddingRight=s,document.body.style.paddingRight=`${parseFloat(i)+this.scrollbarWidth}px`}}static resetScrollbar(){const t=Array.prototype.slice.call(document.querySelectorAll(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top"));for(let e=0,s=t.length;e<s;e+=1){const s=t[e].dataset.paddingRight;delete t[e].dataset.paddingRight,t[e].style.paddingRight=s||""}const e=Array.prototype.slice.call(document.querySelectorAll(".sticky-top"));for(let t=0,s=e.length;t<s;t+=1){const s=e[t].dataset.marginRight;void 0!==s&&(e[t].style.marginRight=s,delete e[t].dataset.marginRight)}const s=document.body.dataset.paddingRight;delete document.body.dataset.paddingRight,document.body.style.paddingRight=s||""}adjustDialog(){const t=this.modalEl.scrollHeight>document.documentElement.clientHeight;!this.isBodyOverflowing&&t&&(this.modalEl.style.paddingLeft=`${this.scrollbarWidth}px`),this.isBodyOverflowing&&!t&&(this.modalEl.style.paddingRight=`${this.scrollbarWidth}px`)}hide(){if(this.isTransitioning||!this.isShown)return;const t=d(this.modalEl,this.hideEventName);if(!this.isShown||t.defaultPrevented)return;this.isShown=!1;const e=i(this.modalEl,"fade");if(e&&(this.isTransitioning=!0),this.setEscapeEvent(),this.setResizeEvent(),document.removeEventListener("focusin",this.handleFocusIn),a(this.modalEl,"show"),document.removeEventListener("click",this.handleDataDismissModalClick),e){const t=l(this.modalEl);setTimeout(()=>{this.hideModal()},t)}else this.hideModal()}hideModal(){this.modalEl.style.display="none",this.modalEl.setAttribute("aria-hidden","true"),this.isTransitioning=!1,this.showBackdrop(()=>{a(document.body,"modal-open"),this.resetAdjustments(),m.resetScrollbar(),this.relatedTarget&&(this.relatedTarget.focus(),this.relatedTarget=null);const t=l(this.modalEl);setTimeout(()=>{window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>{d(this.modalEl,this.hiddenEventName)})})},t),this.unbindAllEventListenersUsed()})}resetAdjustments(){this.modalEl.style.paddingLeft="",this.modalEl.style.paddingRight=""}show(t=null){if(this.isTransitioning||this.isShown)return;i(this.modalEl,"fade")&&(this.isTransitioning=!0);const e=d(this.modalEl,this.showEventName,{},t);this.isShown||e.defaultPrevented||(t&&(this.relatedTarget=t),this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.adjustDialog(),o(document.body,"modal-open"),this.setEscapeEvent(),this.setResizeEvent(),this.setClicksThatCanCloseModalEvent(),this.showBackdrop(()=>this.showElement()))}elementIsOrInADataDismissForThisModal(t){const e=Array.prototype.slice.call(this.modalEl.querySelectorAll('[data-dismiss="modal"]'));for(let s=0,i=e.length;s<i;s+=1)if(e[s].contains(t))return!0;return!1}setClicksThatCanCloseModalEvent(){this.isShown?setTimeout(()=>{document.addEventListener("click",this.handleDataDismissModalClick)},0):this.isShown||document.removeEventListener("click",this.handleDataDismissModalClick)}setResizeEvent(){this.isShown?window.addEventListener("resize",this.handleResizeEvent):window.removeEventListener("resize",this.handleResizeEvent)}setEscapeEvent(){this.isShown&&this.config.keyboard?document.addEventListener("keydown",this.hideModalBecauseEscapePressed):this.isShown||document.removeEventListener("keydown",this.hideModalBecauseEscapePressed)}getConfig(t={}){this.config={};const e={};if(h(t,"backdrop")){const i=s(n(t,"backdrop","true"));e.backdrop="static"===i?"static":c(i)}else if(h(this.modalEl.dataset,"backdrop")){const t=s(this.modalEl.dataset.backdrop);e.backdrop="static"===t?"static":c(t)}else e.backdrop=!0;h(t,"focus")?e.focus=c(n(t,"focus",!0)):h(this.modalEl.dataset,"focus")?e.focus=c(this.modalEl.dataset.focus):e.focus=!0,h(t,"keyboard")?e.keyboard=c(n(t,"keyboard",!0)):h(this.modalEl.dataset,"keyboard")?e.keyboard=c(this.modalEl.dataset.keyboard):e.keyboard=!0,h(t,"show")?e.show=c(n(t,"show",!0)):h(this.modalEl.dataset,"show")?e.show=c(this.modalEl.dataset.show):e.show=!0,this.config=e}enforceFocus(){document.removeEventListener("focusin",this.handleFocusIn),document.addEventListener("focusin",this.handleFocusIn)}showElement(){const t=i(this.modalEl,"fade");if(this.modalEl.parentNode&&this.modalEl.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this.modalEl),this.modalEl.style.display="block",this.modalEl.removeAttribute("aria-hidden"),this.modalEl.scrollTop=0,t&&r(this.modalEl),o(this.modalEl,"show"),this.config.focus&&this.enforceFocus(),t){const t=l(this.modalEl);setTimeout(()=>{this.config.focus&&this.modalEl.focus(),this.isTransitioning=!1,window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>{setTimeout(()=>{d(this.modalEl,this.shownEventName,{},this.relatedTarget)},0)})})},t)}else window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>{setTimeout(()=>{d(this.modalEl,this.shownEventName,{},this.relatedTarget)},0)})})}showBackdrop(t=(()=>{})){const e=i(this.modalEl,"fade")?"fade":"";if(this.isShown&&this.config.backdrop){if(this.backdrop=document.createElement("div"),this.backdrop.className="modal-backdrop",e&&this.backdrop.classList.add(e),document.body.appendChild(this.backdrop),this.modalEl.addEventListener("click",this.backdropClickDismiss),e&&r(this.backdrop),o(this.backdrop,"show"),!t)return;if(!e)return void t();const s=l(this.backdrop);setTimeout(()=>{t()},s)}else if(!this.isShown&&this.backdrop)if(a(this.backdrop,"show"),i(this.modalEl,"fade")){const e=l(this.backdrop);setTimeout(()=>{this.removeBackdrop(t)},e)}else this.removeBackdrop(t);else t()}removeBackdrop(t=(()=>{})){this.backdrop&&(this.backdrop.parentNode.removeChild(this.backdrop),this.backdrop=null),t()}handleActiveWatch(t){if(!0===t)return this.getConfig(),void this.show();this.hide()}modal(t={},s=null){if(0===e(t))return this.modalEl;if("object"==typeof t)return this.getConfig(t),this.config.show&&!this.isShown&&this.show(),!0;if("toggle"===t)return this.getConfig(),this.isShown?this.hide():this.show(s),!0;if("show"===t)return this.getConfig(),this.show(),!0;if("hide"===t)return this.hide(),!0;if("handleUpdate"===t)return this.adjustDialog(),!0;if("string"==typeof t)throw new Error(`No method named "${t}"`);return null}render(){return t("slot",null)}static get is(){return"bs-modal"}static get properties(){return{backdrop:{state:!0},config:{state:!0},getScrollbarWidth:{method:!0},hiddenEventName:{type:String,attr:"hidden-event-name"},hideEventName:{type:String,attr:"hide-event-name"},isBodyOverflowing:{state:!0},isShown:{state:!0},isTransitioning:{state:!0},modal:{method:!0},modalEl:{elementRef:!0},relatedTarget:{state:!0},scrollbarWidth:{state:!0},showEventName:{type:String,attr:"show-event-name"},showModal:{type:Boolean,attr:"show-modal",reflectToAttr:!0,mutable:!0,watchCallbacks:["handleActiveWatch"]},shownEventName:{type:String,attr:"shown-event-name"}}}}export{m as BsModal};