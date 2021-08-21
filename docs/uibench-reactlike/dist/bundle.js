!function(){"use strict";function e(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,n(e,t)}function n(e,t){return(n=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,t)}function t(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var r=Array.isArray;function o(e){var n=typeof e;return"string"===n||"number"===n}function l(e){return void 0===e||null===e}function i(e){return null===e||!1===e||!0===e||void 0===e}function a(e){return"function"===typeof e}function u(e){return"string"===typeof e}function c(e){return null===e}function s(e,n){var t={};if(e)for(var r in e)t[r]=e[r];if(n)for(var o in n)t[o]=n[o];return t}function f(e){return!c(e)&&"object"===typeof e}var d={};function p(e){return e.substr(2).toLowerCase()}function h(e,n){e.appendChild(n)}function v(e,n,t){c(t)?h(e,n):e.insertBefore(n,t)}function m(e,n){if(n)return document.createElementNS("http://www.w3.org/2000/svg",e);return document.createElement(e)}function g(e,n,t){e.replaceChild(n,t)}function y(e,n){e.removeChild(n)}function b(e){for(var n=0;n<e.length;n++)e[n]()}function $(e,n,t){var r=e.children;if(4&t)return r.$LI;if(8192&t)return 2===e.childFlags?r:r[n?0:r.length-1];return r}function k(e,n){for(var t;e;){if(2033&(t=e.flags))return e.dom;e=$(e,n,t)}return null}function C(e,n){do{var t=e.flags;if(2033&t)return void y(n,e.dom);var r=e.children;if(4&t&&(e=r.$LI),8&t&&(e=r),8192&t){if(2!==e.childFlags){for(var o=0,l=r.length;o<l;++o)C(r[o],n);return}e=r}}while(e)}function w(e,n,t){do{var r=e.flags;if(2033&r)return void v(n,e.dom,t);var o=e.children;if(4&r&&(e=o.$LI),8&r&&(e=o),8192&r){if(2!==e.childFlags){for(var l=0,i=o.length;l<i;++l)w(o[l],n,t);return}e=o}}while(e)}function U(e,n,t){if(e.constructor.getDerivedStateFromProps)return s(t,e.constructor.getDerivedStateFromProps(n,t));return t}var x={v:!1},P={componentComparator:null,createVNode:null,renderComplete:null};function F(e,n){e.textContent=n}function S(e,n){return f(e)&&e.event===n.event&&e.data===n.data}function N(e,n){for(var t in n)void 0===e[t]&&(e[t]=n[t]);return e}function V(e,n){return!!a(e)&&(e(n),!0)}var L="$";function I(e,n,t,r,o,l,i,a){this.childFlags=e,this.children=n,this.className=t,this.dom=null,this.flags=r,this.key=void 0===o?null:o,this.props=void 0===l?null:l,this.ref=void 0===i?null:i,this.type=a}function B(e,n,t,r,o,l,i,a){var u=void 0===o?1:o,c=new I(u,r,t,e,i,l,a,n);return P.createVNode&&P.createVNode(c),0===u&&H(c,c.children),c}function M(e,n,t){if(4&e)return t;var r=(32768&e?n.render:n).defaultHooks;if(l(r))return t;if(l(t))return r;return N(t,r)}function T(e,n,t){var r=(32768&e?n.render:n).defaultProps;if(l(r))return t;if(l(t))return s(r,null);return N(t,r)}function A(e,n){if(12&e)return e;if(n.prototype&&n.prototype.render)return 4;if(n.render)return 32776;return 8}function D(e,n,t,r,o){var l=new I(1,null,null,e=A(e,n),r,T(e,n,t),M(e,n,o),n);return P.createVNode&&P.createVNode(l),l}function E(e,n){return new I(1,l(e)||!0===e||!1===e?"":e,null,16,n,null,null,null)}function O(e,n,t){var r=B(8192,8192,null,e,n,null,t,null);switch(r.childFlags){case 1:r.children=j(),r.childFlags=2;break;case 16:r.children=[E(e)],r.childFlags=4}return r}function W(e){var n=e.children,t=e.childFlags;return O(2===t?R(n):n.map(R),t,e.key)}function R(e){var n=-16385&e.flags,t=e.props;if(14&n&&!c(t)){var r=t;for(var o in t={},r)t[o]=r[o]}if(0===(8192&n))return new I(e.childFlags,e.children,e.className,n,e.key,t,e.ref,e.type);return W(e)}function j(){return E("",null)}function _(e,n,t,l){for(var a=e.length;t<a;t++){var s=e[t];if(!i(s)){var f=l+L+t;if(r(s))_(s,n,0,f);else{if(o(s))s=E(s,f);else{var d=s.key,p=u(d)&&d[0]===L;(81920&s.flags||p)&&(s=R(s)),s.flags|=65536,p?d.substring(0,l.length)!==l&&(s.key=l+d):c(d)?s.key=f:s.key=l+d}n.push(s)}}}}function H(e,n){var t,l=1;if(i(n))t=n;else if(o(n))l=16,t=n;else if(r(n)){for(var a=n.length,s=0;s<a;++s){var f=n[s];if(i(f)||r(f)){t=t||n.slice(0,s),_(n,t,s,"");break}if(o(f))(t=t||n.slice(0,s)).push(E(f,L+s));else{var d=f.key,p=(81920&f.flags)>0,h=c(d),v=u(d)&&d[0]===L;p||h||v?(t=t||n.slice(0,s),(p||v)&&(f=R(f)),(h||v)&&(f.key=L+s),t.push(f)):t&&t.push(f),f.flags|=65536}}l=0===(t=t||n).length?1:8}else(t=n).flags|=65536,81920&n.flags&&(t=R(n)),l=2;return e.children=t,e.childFlags=l,e}function Q(e){if(i(e)||o(e))return E(e,null);if(r(e))return O(e,0,null);return 16384&e.flags?R(e):e}var X="http://www.w3.org/1999/xlink",G="http://www.w3.org/XML/1998/namespace",K={"xlink:actuate":X,"xlink:arcrole":X,"xlink:href":X,"xlink:role":X,"xlink:show":X,"xlink:title":X,"xlink:type":X,"xml:base":G,"xml:lang":G,"xml:space":G};function q(e){return{onClick:e,onDblClick:e,onFocusIn:e,onFocusOut:e,onKeyDown:e,onKeyPress:e,onKeyUp:e,onMouseDown:e,onMouseMove:e,onMouseUp:e,onTouchEnd:e,onTouchMove:e,onTouchStart:e}}var J=q(0),z=q(null),Y=q(!0);function Z(e,n){var t=n.$EV;return t||(t=n.$EV=q(null)),t[e]||1===++J[e]&&(z[e]=se(e)),t}function ee(e,n){var t=n.$EV;t&&t[e]&&(0===--J[e]&&(document.removeEventListener(p(e),z[e]),z[e]=null),t[e]=null)}function ne(e,n,t,r){if(a(t))Z(e,r)[e]=t;else if(f(t)){if(S(n,t))return;Z(e,r)[e]=t}else ee(e,r)}function te(e){return a(e.composedPath)?e.composedPath()[0]:e.target}function re(e,n,t,r){var o=te(e);do{if(n&&o.disabled)return;var l=o.$EV;if(l){var i=l[t];if(i&&(r.dom=o,i.event?i.event(i.data,e):i(e),e.cancelBubble))return}o=o.parentNode}while(!c(o))}function oe(){this.cancelBubble=!0,this.immediatePropagationStopped||this.stopImmediatePropagation()}function le(){return this.defaultPrevented}function ie(){return this.cancelBubble}function ae(e){var n={dom:document};return e.isDefaultPrevented=le,e.isPropagationStopped=ie,e.stopPropagation=oe,Object.defineProperty(e,"currentTarget",{configurable:!0,get:function(){return n.dom}}),n}function ue(e){return function(n){if(0!==n.button)return void n.stopPropagation();re(n,!0,e,ae(n))}}function ce(e){return function(n){re(n,!1,e,ae(n))}}function se(e){var n="onClick"===e||"onDblClick"===e?ue(e):ce(e);return document.addEventListener(p(e),n),n}function fe(e,n){var t=document.createElement("i");return t.innerHTML=n,t.innerHTML===e.innerHTML}function de(e,n,t){if(e[n]){var r=e[n];r.event?r.event(r.data,t):r(t)}else{var o=n.toLowerCase();e[o]&&e[o](t)}}function pe(e,n){var t=function(t){var r=this.$V;if(!r)return;var o=r.props||d,l=r.dom;if(u(e))de(o,e,t);else for(var i=0;i<e.length;++i)de(o,e[i],t);if(a(n)){var c=this.$V,s=c.props||d;n(s,l,!1,c)}};return Object.defineProperty(t,"wrapped",{configurable:!1,enumerable:!1,value:!0,writable:!1}),t}function he(e,n,t){var r="$"+n,o=e[r];if(o){if(o[1].wrapped)return;e.removeEventListener(o[0],o[1]),e[r]=null}a(t)&&(e.addEventListener(n,t),e[r]=[n,t])}function ve(e){return"checkbox"===e||"radio"===e}var me=pe("onInput",$e),ge=pe(["onClick","onChange"],$e);function ye(e){e.stopPropagation()}function be(e,n){ve(n.type)?(he(e,"change",ge),he(e,"click",ye)):he(e,"input",me)}function $e(e,n){var t=e.type,r=e.value,o=e.checked,i=e.multiple,a=e.defaultValue,u=!l(r);t&&t!==n.type&&n.setAttribute("type",t),l(i)||i===n.multiple||(n.multiple=i),l(a)||u||(n.defaultValue=a+""),ve(t)?(u&&(n.value=r),l(o)||(n.checked=o)):u&&n.value!==r?(n.defaultValue=r,n.value=r):l(o)||(n.checked=o)}function ke(e,n){if("option"===e.type)Ce(e,n);else{var t=e.children,r=e.flags;if(4&r)ke(t.$LI,n);else if(8&r)ke(t,n);else if(2===e.childFlags)ke(t,n);else if(12&e.childFlags)for(var o=0,l=t.length;o<l;++o)ke(t[o],n)}}function Ce(e,n){var t=e.props||d,o=e.dom;o.value=t.value,t.value===n||r(n)&&-1!==n.indexOf(t.value)?o.selected=!0:l(n)&&l(t.selected)||(o.selected=t.selected||!1)}ye.wrapped=!0;var we=pe("onChange",xe);function Ue(e){he(e,"change",we)}function xe(e,n,t,r){var o=Boolean(e.multiple);l(e.multiple)||o===n.multiple||(n.multiple=o);var i=e.selectedIndex;if(-1===i&&(n.selectedIndex=-1),1!==r.childFlags){var a=e.value;"number"===typeof i&&i>-1&&n.options[i]&&(a=n.options[i].value),t&&l(a)&&(a=e.defaultValue),ke(r,a)}}var Pe,Fe,Se=pe("onInput",Le),Ne=pe("onChange");function Ve(e,n){he(e,"input",Se),n.onChange&&he(e,"change",Ne)}function Le(e,n,t){var r=e.value,o=n.value;if(l(r)){if(t){var i=e.defaultValue;l(i)||i===o||(n.defaultValue=i,n.value=i)}}else o!==r&&(n.defaultValue=r,n.value=r)}function Ie(e,n,t,r,o,l){64&e?$e(r,t):256&e?xe(r,t,o,n):128&e&&Le(r,t,o),l&&(t.$V=n)}function Be(e,n,t){64&e?be(n,t):256&e?Ue(n):128&e&&Ve(n,t)}function Me(e){return e.type&&ve(e.type)?!l(e.checked):!l(e.value)}function Te(e){e&&!V(e,null)&&e.current&&(e.current=null)}function Ae(e,n,t){e&&(a(e)||void 0!==e.current)&&t.push((function(){V(e,n)||void 0===e.current||(e.current=n)}))}function De(e,n){Ee(e),C(e,n)}function Ee(e){var n,t=e.flags,r=e.children;if(481&t){n=e.ref;var o=e.props;Te(n);var i=e.childFlags;if(!c(o))for(var u=Object.keys(o),s=0,f=u.length;s<f;s++){var p=u[s];Y[p]&&ee(p,e.dom)}12&i?Oe(r):2===i&&Ee(r)}else r&&(4&t?(a(r.componentWillUnmount)&&r.componentWillUnmount(),Te(e.ref),r.$UN=!0,Ee(r.$LI)):8&t?(!l(n=e.ref)&&a(n.onComponentWillUnmount)&&n.onComponentWillUnmount(k(e,!0),e.props||d),Ee(r)):1024&t?De(r,e.ref):8192&t&&12&e.childFlags&&Oe(r))}function Oe(e){for(var n=0,t=e.length;n<t;++n)Ee(e[n])}function We(e){e.textContent=""}function Re(e,n,t){Oe(t),8192&n.flags?C(n,e):We(e)}function je(e){var n=e.event;return function(t){n(e.data,t)}}function _e(e,n,t,r){if(f(t)){if(S(n,t))return;t=je(t)}he(r,p(e),t)}function He(e,n,t){if(l(n))return void t.removeAttribute("style");var r,o,i=t.style;if(u(n))return void(i.cssText=n);if(l(e)||u(e))for(r in n)o=n[r],i.setProperty(r,o);else{for(r in n)(o=n[r])!==e[r]&&i.setProperty(r,o);for(r in e)l(n[r])&&i.removeProperty(r)}}function Qe(e,n,t,r){var o=e&&e.__html||"",i=n&&n.__html||"";o!==i&&(l(i)||fe(r,i)||(c(t)||(12&t.childFlags?Oe(t.children):2===t.childFlags&&Ee(t.children),t.children=null,t.childFlags=1),r.innerHTML=i))}function Xe(e,n,t,r,o,i,a){switch(e){case"children":case"childrenType":case"className":case"defaultValue":case"key":case"multiple":case"ref":case"selectedIndex":break;case"autoFocus":r.autofocus=!!t;break;case"allowfullscreen":case"autoplay":case"capture":case"checked":case"controls":case"default":case"disabled":case"hidden":case"indeterminate":case"loop":case"muted":case"novalidate":case"open":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"selected":r[e]=!!t;break;case"defaultChecked":case"value":case"volume":if(i&&"value"===e)break;var u=l(t)?"":t;r[e]!==u&&(r[e]=u);break;case"style":He(n,t,r);break;case"dangerouslySetInnerHTML":Qe(n,t,a,r);break;default:Y[e]?ne(e,n,t,r):111===e.charCodeAt(0)&&110===e.charCodeAt(1)?_e(e,n,t,r):l(t)?r.removeAttribute(e):o&&K[e]?r.setAttributeNS(K[e],e,t):r.setAttribute(e,t)}}function Ge(e,n,t,r,o){var l=!1,i=(448&n)>0;for(var a in i&&(l=Me(t))&&Be(n,r,t),t)Xe(a,null,t[a],r,o,l,null);i&&Ie(n,e,r,t,!0,l)}function Ke(e,n,t){var r=Q(e.render(n,e.state,t)),o=t;return a(e.getChildContext)&&(o=s(t,e.getChildContext())),e.$CX=o,r}function qe(e,n,t,r,o,l){var i=new n(t,r),u=i.$N=Boolean(n.getDerivedStateFromProps||i.getSnapshotBeforeUpdate);if(i.$SVG=o,i.$L=l,e.children=i,i.$BS=!1,i.context=r,i.props===d&&(i.props=t),u)i.state=U(i,t,i.state);else if(a(i.componentWillMount)){i.$BR=!0,i.componentWillMount();var s=i.$PS;if(!c(s)){var f=i.state;if(c(f))i.state=s;else for(var p in s)f[p]=s[p];i.$PS=null}i.$BR=!1}return i.$LI=Ke(i,t,r),i}function Je(e,n){var t=e.props||d;return 32768&e.flags?e.type.render(t,e.ref,n):e.type(t,n)}function ze(e,n,t,r,o,l){var i=e.flags|=16384;481&i?nn(e,n,t,r,o,l):4&i?rn(e,n,t,r,o,l):8&i?(on(e,n,t,r,o,l),cn(e,l)):512&i||16&i?en(e,n,o):8192&i?Ze(e,t,n,r,o,l):1024&i&&Ye(e,t,n,o,l)}function Ye(e,n,t,r,o){ze(e.children,e.ref,n,!1,null,o);var l=j();en(l,t,r),e.dom=l.dom}function Ze(e,n,t,r,o,l){var i=e.children,a=e.childFlags;12&a&&0===i.length&&(a=e.childFlags=2,i=e.children=j()),2===a?ze(i,t,o,r,o,l):tn(i,t,n,r,o,l)}function en(e,n,t){var r=e.dom=document.createTextNode(e.children);c(n)||v(n,r,t)}function nn(e,n,t,r,o,i){var a=e.flags,u=e.props,s=e.className,f=e.childFlags,d=e.dom=m(e.type,r=r||(32&a)>0),p=e.children;if(l(s)||""===s||(r?d.setAttribute("class",s):d.className=s),16===f)F(d,p);else if(1!==f){var h=r&&"foreignObject"!==e.type;2===f?(16384&p.flags&&(e.children=p=R(p)),ze(p,d,t,h,null,i)):8!==f&&4!==f||tn(p,d,t,h,null,i)}c(n)||v(n,d,o),c(u)||Ge(e,a,u,d,r),Ae(e.ref,d,i)}function tn(e,n,t,r,o,l){for(var i=0;i<e.length;++i){var a=e[i];16384&a.flags&&(e[i]=a=R(a)),ze(a,n,t,r,o,l)}}function rn(e,n,t,r,o,l){var i=qe(e,e.type,e.props||d,t,r,l);ze(i.$LI,n,i.$CX,r,o,l),an(e.ref,i,l)}function on(e,n,t,r,o,l){ze(e.children=Q(Je(e,t)),n,t,r,o,l)}function ln(e){return function(){e.componentDidMount()}}function an(e,n,t){Ae(e,n,t),a(n.componentDidMount)&&t.push(ln(n))}function un(e,n){return function(){e.onComponentDidMount(k(n,!0),n.props||d)}}function cn(e,n){var t=e.ref;l(t)||(V(t.onComponentWillMount,e.props||d),a(t.onComponentDidMount)&&n.push(un(t,e)))}function sn(e,n,t,r,o,l){Ee(e),0!==(n.flags&e.flags&2033)?(ze(n,null,r,o,null,l),g(t,n.dom,e.dom)):(ze(n,t,r,o,k(e,!0),l),C(e,t))}function fn(e,n,t,r,o,l,i){var a=n.flags|=16384;e.flags!==a||e.type!==n.type||e.key!==n.key||2048&a?16384&e.flags?sn(e,n,t,r,o,i):ze(n,t,r,o,l,i):481&a?mn(e,n,r,o,a,i):4&a?kn(e,n,t,r,o,l,i):8&a?Cn(e,n,t,r,o,l,i):16&a?wn(e,n):512&a?n.dom=e.dom:8192&a?hn(e,n,t,r,o,i):vn(e,n,r,i)}function dn(e,n,t){e!==n&&(""!==e?t.firstChild.nodeValue=n:F(t,n))}function pn(e,n){e.textContent!==n&&(e.textContent=n)}function hn(e,n,t,r,o,l){var i=e.children,a=n.children,u=e.childFlags,c=n.childFlags,s=null;12&c&&0===a.length&&(c=n.childFlags=2,a=n.children=j());var f=0!==(2&c);if(12&u){var d=i.length;(8&u&&8&c||f||!f&&a.length>d)&&(s=k(i[d-1],!1).nextSibling)}yn(u,c,i,a,t,r,o,s,e,l)}function vn(e,n,t,r){var o=e.ref,l=n.ref,a=n.children;if(yn(e.childFlags,n.childFlags,e.children,a,o,t,!1,null,e,r),n.dom=e.dom,o!==l&&!i(a)){var u=a.dom;y(o,u),h(l,u)}}function mn(e,n,t,r,o,i){var a,u=n.dom=e.dom,c=e.props,s=n.props,f=!1,p=!1;if(r=r||(32&o)>0,c!==s){var h=c||d;if((a=s||d)!==d)for(var v in(f=(448&o)>0)&&(p=Me(a)),a){var m=h[v],g=a[v];m!==g&&Xe(v,m,g,u,r,p,e)}if(h!==d)for(var y in h)l(a[y])&&!l(h[y])&&Xe(y,h[y],null,u,r,p,e)}var b=n.children,$=n.className;e.className!==$&&(l($)?u.removeAttribute("class"):r?u.setAttribute("class",$):u.className=$),4096&o?pn(u,b):yn(e.childFlags,n.childFlags,e.children,b,u,t,r&&"foreignObject"!==n.type,null,e,i),f&&Ie(o,n,u,a,!1,p);var k=n.ref,C=e.ref;C!==k&&(Te(C),Ae(k,u,i))}function gn(e,n,t,r,o,l){Ee(e),tn(n,t,r,o,k(e,!0),l),C(e,t)}function yn(e,n,t,r,o,l,i,a,u,c){switch(e){case 2:switch(n){case 2:fn(t,r,o,l,i,a,c);break;case 1:De(t,o);break;case 16:Ee(t),F(o,r);break;default:gn(t,r,o,l,i,c)}break;case 1:switch(n){case 2:ze(r,o,l,i,a,c);break;case 1:break;case 16:F(o,r);break;default:tn(r,o,l,i,a,c)}break;case 16:switch(n){case 16:dn(t,r,o);break;case 2:We(o),ze(r,o,l,i,a,c);break;case 1:We(o);break;default:We(o),tn(r,o,l,i,a,c)}break;default:switch(n){case 16:Oe(t),F(o,r);break;case 2:Re(o,u,t),ze(r,o,l,i,a,c);break;case 1:Re(o,u,t);break;default:var s=0|t.length,f=0|r.length;0===s?f>0&&tn(r,o,l,i,a,c):0===f?Re(o,u,t):8===n&&8===e?xn(t,r,o,l,i,s,f,a,u,c):Un(t,r,o,l,i,s,f,a,c)}}}function bn(e,n,t,r,o){o.push((function(){e.componentDidUpdate(n,t,r)}))}function $n(e,n,t,r,o,l,i,u,c){var f=e.state,d=e.props,p=Boolean(e.$N),h=a(e.shouldComponentUpdate);if(p&&(n=U(e,t,n!==f?s(f,n):n)),i||!h||h&&e.shouldComponentUpdate(t,n,o)){!p&&a(e.componentWillUpdate)&&e.componentWillUpdate(t,n,o),e.props=t,e.state=n,e.context=o;var v=null,m=Ke(e,t,o);p&&a(e.getSnapshotBeforeUpdate)&&(v=e.getSnapshotBeforeUpdate(d,f)),fn(e.$LI,m,r,e.$CX,l,u,c),e.$LI=m,a(e.componentDidUpdate)&&bn(e,d,f,v,c)}else e.props=t,e.state=n,e.context=o}function kn(e,n,t,r,o,l,i){var u=n.children=e.children;if(c(u))return;u.$L=i;var f=n.props||d,p=n.ref,h=e.ref,v=u.state;if(!u.$N){if(a(u.componentWillReceiveProps)){if(u.$BR=!0,u.componentWillReceiveProps(f,r),u.$UN)return;u.$BR=!1}c(u.$PS)||(v=s(v,u.$PS),u.$PS=null)}$n(u,v,f,t,r,o,!1,l,i),h!==p&&(Te(h),Ae(p,u,i))}function Cn(e,n,t,r,o,i,u){var c=!0,s=n.props||d,f=n.ref,p=e.props,h=!l(f),v=e.children;if(h&&a(f.onComponentShouldUpdate)&&(c=f.onComponentShouldUpdate(p,s)),!1!==c){h&&a(f.onComponentWillUpdate)&&f.onComponentWillUpdate(p,s);var m=Q(Je(n,r));fn(v,m,t,r,o,i,u),n.children=m,h&&a(f.onComponentDidUpdate)&&f.onComponentDidUpdate(p,s)}else n.children=v}function wn(e,n){var t=n.children,r=n.dom=e.dom;t!==e.children&&(r.nodeValue=t)}function Un(e,n,t,r,o,l,i,a,u){for(var c,s,f=l>i?i:l,d=0;d<f;++d)c=n[d],s=e[d],16384&c.flags&&(c=n[d]=R(c)),fn(s,c,t,r,o,a,u),e[d]=c;if(l<i)for(d=f;d<i;++d)16384&(c=n[d]).flags&&(c=n[d]=R(c)),ze(c,t,r,o,a,u);else if(l>i)for(d=f;d<l;++d)De(e[d],t)}function xn(e,n,t,r,o,l,i,a,u,c){var s,f,d=l-1,p=i-1,h=0,v=e[h],m=n[h];e:{for(;v.key===m.key;){if(16384&m.flags&&(n[h]=m=R(m)),fn(v,m,t,r,o,a,c),e[h]=m,++h>d||h>p)break e;v=e[h],m=n[h]}for(v=e[d],m=n[p];v.key===m.key;){if(16384&m.flags&&(n[p]=m=R(m)),fn(v,m,t,r,o,a,c),e[d]=m,p--,h>--d||h>p)break e;v=e[d],m=n[p]}}if(h>d){if(h<=p)for(f=(s=p+1)<i?k(n[s],!0):a;h<=p;)16384&(m=n[h]).flags&&(n[h]=m=R(m)),++h,ze(m,t,r,o,f,c)}else if(h>p)for(;h<=d;)De(e[h++],t);else Pn(e,n,r,l,i,d,p,h,t,o,a,u,c)}function Pn(e,n,t,r,o,l,i,a,u,c,s,f,d){var p,h,v,m=0,g=a,y=a,b=l-a+1,$=i-a+1,C=new Int32Array($+1),U=b===r,x=!1,P=0,F=0;if(o<4||(b|$)<32)for(m=g;m<=l;++m)if(p=e[m],F<$){for(a=y;a<=i;a++)if(h=n[a],p.key===h.key){if(C[a-y]=m+1,U)for(U=!1;g<m;)De(e[g++],u);P>a?x=!0:P=a,16384&h.flags&&(n[a]=h=R(h)),fn(p,h,u,t,c,s,d),++F;break}!U&&a>i&&De(p,u)}else U||De(p,u);else{var S={};for(m=y;m<=i;++m)S[n[m].key]=m;for(m=g;m<=l;++m)if(p=e[m],F<$)if(void 0!==(a=S[p.key])){if(U)for(U=!1;m>g;)De(e[g++],u);C[a-y]=m+1,P>a?x=!0:P=a,16384&(h=n[a]).flags&&(n[a]=h=R(h)),fn(p,h,u,t,c,s,d),++F}else U||De(p,u);else U||De(p,u)}if(U)Re(u,f,e),tn(n,u,t,c,s,d);else if(x){var N=Sn(C);for(a=N.length-1,m=$-1;m>=0;m--)0===C[m]?(16384&(h=n[P=m+y]).flags&&(n[P]=h=R(h)),ze(h,u,t,c,(v=P+1)<o?k(n[v],!0):s,d)):a<0||m!==N[a]?w(h=n[P=m+y],u,(v=P+1)<o?k(n[v],!0):s):a--}else if(F!==$)for(m=$-1;m>=0;m--)0===C[m]&&(16384&(h=n[P=m+y]).flags&&(n[P]=h=R(h)),ze(h,u,t,c,(v=P+1)<o?k(n[v],!0):s,d))}var Fn=0;function Sn(e){var n=0,t=0,r=0,o=0,l=0,i=0,a=0,u=e.length;for(u>Fn&&(Fn=u,Pe=new Int32Array(u),Fe=new Int32Array(u));t<u;++t)if(0!==(n=e[t])){if(e[r=Pe[o]]<n){Fe[t]=r,Pe[++o]=t;continue}for(l=0,i=o;l<i;)e[Pe[a=l+i>>1]]<n?l=a+1:i=a;n<e[Pe[l]]&&(l>0&&(Fe[t]=Pe[l-1]),Pe[l]=t)}l=o+1;var c=new Int32Array(l);for(i=Pe[l-1];l-- >0;)c[l]=i,i=Fe[i],Pe[l]=0;return c}function Nn(e,n,t,r){var o=[],i=n.$V;x.v=!0,l(i)?l(e)||(16384&e.flags&&(e=R(e)),ze(e,n,r,!1,null,o),n.$V=e,i=e):l(e)?(De(i,n),n.$V=null):(16384&e.flags&&(e=R(e)),fn(i,e,n,r,!1,null,o),i=n.$V=e),b(o),x.v=!1,a(t)&&t(),a(P.renderComplete)&&P.renderComplete(i,n)}function Vn(e,n,t,r){void 0===t&&(t=null),void 0===r&&(r=d),Nn(e,n,t,r)}"undefined"!==typeof document&&window.Node&&(Node.prototype.$EV=null,Node.prototype.$V=null);var Ln=[],In="undefined"!==typeof Promise?Promise.resolve().then.bind(Promise.resolve()):function(e){window.setTimeout(e,0)},Bn=!1;function Mn(e,n,t,r){var o=e.$PS;if(a(n)&&(n=n(o?s(e.state,o):e.state,e.props,e.context)),l(o))e.$PS=n;else for(var i in n)o[i]=n[i];if(e.$BR)a(t)&&e.$L.push(t.bind(e));else{if(!x.v&&0===Ln.length)return Dn(e,r),void(a(t)&&t.call(e));if(-1===Ln.indexOf(e)&&Ln.push(e),r&&(e.$F=!0),Bn||(Bn=!0,In(An)),a(t)){var u=e.$QU;u||(u=e.$QU=[]),u.push(t)}}}function Tn(e){for(var n=e.$QU,t=0;t<n.length;++t)n[t].call(e);e.$QU=null}function An(){var e;for(Bn=!1;e=Ln.shift();)if(!e.$UN){var n=e.$F;e.$F=!1,Dn(e,n),e.$QU&&Tn(e)}}function Dn(e,n){if(n||!e.$BR){var t=e.$PS;e.$PS=null;var r=[];x.v=!0,$n(e,s(e.state,t),e.props,k(e.$LI,!0).parentNode,e.context,e.$SVG,n,null,r),b(r),x.v=!1}else e.state=e.$PS,e.$PS=null}var En=function(e,n){this.state=null,this.$BR=!1,this.$BS=!0,this.$PS=null,this.$LI=null,this.$UN=!1,this.$CX=null,this.$QU=null,this.$N=!1,this.$L=null,this.$SVG=!1,this.$F=!1,this.props=e||d,this.context=n||d};En.prototype.forceUpdate=function(e){if(this.$UN)return;Mn(this,{},e,!0)},En.prototype.setState=function(e,n){if(this.$UN)return;this.$BS||Mn(this,e,n,!1)},En.prototype.render=function(e,n,t){return null},uibench.init("Inferno [same as react]","7.4.8");var On=function(n){function r(e){var r;return(r=n.call(this,e)||this).onClick=r.onClick.bind(t(r)),r}e(r,n);var o=r.prototype;return o.shouldComponentUpdate=function(e,n){return this.props.text!==e.text},o.onClick=function(e){console.log("Clicked"+this.props.text),e.stopPropagation()},o.render=function(){return B(1,"td","TableCell",this.props.text,0,{onClick:this.onClick},null,null)},r}(En),Wn=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){for(var e=this.props.data,n=e.active?"TableRow active":"TableRow",t=e.props,r=[D(2,On,{text:"#"+e.id},-1,null)],o=0;o<t.length;o++)r.push(D(2,On,{text:t[o]},o,null));return B(1,"tr",n,r,0,{"data-id":e.id},null,null)},t}(En),Rn=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){for(var e=this.props.data.items,n=[],t=0;t<e.length;t++){var r=e[t];n.push(D(2,Wn,{data:r},r.id,null))}return B(1,"table","Table",B(1,"tbody",null,n,0,null,null,null),2,null,null,null)},t}(En),jn=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){var e=this.props.data,n=e.time,t={"border-radius":(n%10).toString()+"px",background:"rgba(0,0,0,"+(.5+n%10/10).toString()+")"};return B(1,"div","AnimBox",null,1,{"data-id":e.id,style:t},null,null)},t}(En),_n=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){for(var e=this.props.data.items,n=[],t=0;t<e.length;t++){var r=e[t];n.push(D(2,jn,{data:r},r.id,null))}return B(1,"div","Anim",n,0,null,null,null)},t}(En),Hn=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){return B(1,"li","TreeLeaf",this.props.data.id,0,null,null,null)},t}(En),Qn=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){for(var e=this.props.data,n=[],r=0;r<e.children.length;r++){var o=e.children[r];o.container?n.push(D(2,t,{data:o},o.id,null)):n.push(D(2,Hn,{data:o},o.id,null))}return B(1,"ul","TreeNode",n,0,null,null,null)},t}(En),Xn=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){return B(1,"div","Tree",D(2,Qn,{data:this.props.data.root},null,null),2,null,null,null)},t}(En),Gn=function(n){function t(){return n.apply(this,arguments)||this}e(t,n);var r=t.prototype;return r.shouldComponentUpdate=function(e,n){return this.props.data!==e.data},r.render=function(){var e,n=this.props.data,t=n.location;return"table"===t?e=D(2,Rn,{data:n.table},null,null):"anim"===t?e=D(2,_n,{data:n.anim},null,null):"tree"===t&&(e=D(2,Xn,{data:n.tree},null,null)),B(1,"div","Main",e,0,null,null,null)},t}(En);document.addEventListener("DOMContentLoaded",(function(e){var n=document.querySelector("#App");uibench.run((function(e){Vn(D(2,Gn,{data:e},null,null),n)}),(function(e){Vn(B(1,"pre",null,JSON.stringify(e,null," "),0,null,null,null),n)}))}))}();
