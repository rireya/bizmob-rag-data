/**
 * @author mhchoi@mcnc.co.kr
 * @title polyfill
 */

/**
 * string.padStart polyfill
 * https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 */
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

/**
 * string.padEnd polyfill
 * https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
 */
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}

if (typeof Object.keys != 'function') {
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{}.propertyIsEnumerable.call({ toString: null }, 'toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

/**
 * Object.values polyfill
 */
if (typeof Object.values != 'function') {
    Object.values = function(target) {
        'use strict';
        var values = [];

        for (var key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                values.push(target[key]);
            }
        }

        return values;
    };
}

/**
 * Object.assign polyfill
 * https://github.com/auth0/auth0-cordova/issues/46#issuecomment-311923820
 */
if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

/**
 * Object.entries polyfill
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */
if (!Object.entries) {
    Object.entries = function(obj) {
        var ownProps = Object.keys( obj ),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}

/**
 * Array.includes
 * https://tc39.github.io/ecma262/#sec-array.prototype.includes
 */
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1.
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

/**
 * promise-polyfill
 * https://github.com/taylorhakes/promise-polyfill
 */
// eslint-disable-next-line no-undef, no-prototype-builtins, no-self-assign, @typescript-eslint/no-empty-function
!function(e,t){'object'==typeof exports&&'undefined'!=typeof module?t():'function'==typeof define&&define.amd?define(t):t();}(0,function(){'use strict';function e(e){var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n;});},function(n){return t.resolve(e()).then(function(){return t.reject(n);});});}function t(e){return new this(function(t,n){function o(e,n){if(n&&('object'==typeof n||'function'==typeof n)){var f=n.then;if('function'==typeof f)return void f.call(n,function(t){o(e,t);},function(n){r[e]={status:'rejected',reason:n},0==--i&&t(r);});}r[e]={status:'fulfilled',value:n},0==--i&&t(r);}if(!e||'undefined'==typeof e.length)return n(new TypeError(typeof e+' '+e+' is not iterable(cannot read property Symbol(Symbol.iterator))'));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);for(var i=r.length,f=0;r.length>f;f++)o(f,r[f]);});}function n(e){return!(!e||'undefined'==typeof e.length);}function o(){}function r(e){if(!(this instanceof r))throw new TypeError('Promises must be constructed via new');if('function'!=typeof e)throw new TypeError('not a function');this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],l(e,this);}function i(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,r._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var o;try{o=n(e._value);}catch(r){return void u(t.promise,r);}f(t.promise,o);}else(1===e._state?f:u)(t.promise,e._value);})):e._deferreds.push(t);}function f(e,t){try{if(t===e)throw new TypeError('A promise cannot be resolved with itself.');if(t&&('object'==typeof t||'function'==typeof t)){var n=t.then;if(t instanceof r)return e._state=3,e._value=t,void c(e);if('function'==typeof n)return void l(function(e,t){return function(){e.apply(t,arguments);};}(n,t),e);}e._state=1,e._value=t,c(e);}catch(o){u(e,o);}}function u(e,t){e._state=2,e._value=t,c(e);}function c(e){2===e._state&&0===e._deferreds.length&&r._immediateFn(function(){e._handled||r._unhandledRejectionFn(e._value);});for(var t=0,n=e._deferreds.length;n>t;t++)i(e,e._deferreds[t]);e._deferreds=null;}function l(e,t){var n=!1;try{e(function(e){n||(n=!0,f(t,e));},function(e){n||(n=!0,u(t,e));});}catch(o){if(n)return;n=!0,u(t,o);}}var a=setTimeout;r.prototype['catch']=function(e){return this.then(null,e);},r.prototype.then=function(e,t){var n=new this.constructor(o);return i(this,new function(e,t,n){this.onFulfilled='function'==typeof e?e:null,this.onRejected='function'==typeof t?t:null,this.promise=n;}(e,t,n)),n;},r.prototype['finally']=e,r.all=function(e){return new r(function(t,o){function r(e,n){try{if(n&&('object'==typeof n||'function'==typeof n)){var u=n.then;if('function'==typeof u)return void u.call(n,function(t){r(e,t);},o);}i[e]=n,0==--f&&t(i);}catch(c){o(c);}}if(!n(e))return o(new TypeError('Promise.all accepts an array'));var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u]);});},r.allSettled=t,r.resolve=function(e){return e&&'object'==typeof e&&e.constructor===r?e:new r(function(t){t(e);});},r.reject=function(e){return new r(function(t,n){n(e);});},r.race=function(e){return new r(function(t,o){if(!n(e))return o(new TypeError('Promise.race accepts an array'));for(var i=0,f=e.length;f>i;i++)r.resolve(e[i]).then(t,o);});},r._immediateFn='function'==typeof setImmediate&&function(e){setImmediate(e);}||function(e){a(e,0);},r._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn('Possible Unhandled Promise Rejection:',e);};var s=function(){if('undefined'!=typeof self)return self;if('undefined'!=typeof window)return window;if('undefined'!=typeof global)return global;throw Error('unable to locate global object');}();'function'!=typeof s.Promise?s.Promise=r:(s.Promise.prototype['finally']||(s.Promise.prototype['finally']=e),s.Promise.allSettled||(s.Promise.allSettled=t));});

/**
 * fetch api
 * https://github.com/github/fetch
 * - export 구문 제거
 * - (function() { }) 으로 소스 랩핑
 */
// eslint-disable-next-line no-undef, no-prototype-builtins, no-self-assign, @typescript-eslint/no-empty-function
!function(a){var f={searchParams:'URLSearchParams'in a,iterable:'Symbol'in a&&'iterator'in Symbol,blob:'FileReader'in a&&'Blob'in a&&function(){try{return new Blob,!0;}catch(a){return!1;}}(),formData:'FormData'in a,arrayBuffer:'ArrayBuffer'in a};if(f.arrayBuffer)var i=['[object Int8Array]','[object Uint8Array]','[object Uint8ClampedArray]','[object Int16Array]','[object Uint16Array]','[object Int32Array]','[object Uint32Array]','[object Float32Array]','[object Float64Array]'],j=ArrayBuffer.isView||function(a){return a&&i.indexOf(Object.prototype.toString.call(a))> -1;};function k(a){if('string'!=typeof a&&(a=String(a)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(a)||''===a)throw new TypeError('Invalid character in header field name: "'+a+'"');return a.toLowerCase();}function l(a){return'string'!=typeof a&&(a=String(a)),a;}function m(b){var a={next:function(){var a=b.shift();return{done:void 0===a,value:a};}};return f.iterable&&(a[Symbol.iterator]=function(){return a;}),a;}function b(a){this.map={},a instanceof b?a.forEach(function(a,b){this.append(b,a);},this):Array.isArray(a)?a.forEach(function(a){this.append(a[0],a[1]);},this):a&&Object.getOwnPropertyNames(a).forEach(function(b){this.append(b,a[b]);},this);}function n(a){if(a.bodyUsed)return Promise.reject(new TypeError('Already read'));a.bodyUsed=!0;}function o(a){return new Promise(function(b,c){a.onload=function(){b(a.result);},a.onerror=function(){c(a.error);};});}function p(b){var a=new FileReader,c=o(a);return a.readAsArrayBuffer(b),c;}function q(a){if(a.slice)return a.slice(0);var b=new Uint8Array(a.byteLength);return b.set(new Uint8Array(a)),b.buffer;}function g(){return this.bodyUsed=!1,this._initBody=function(a){if(this.bodyUsed=this.bodyUsed,this._bodyInit=a,a){if('string'==typeof a)this._bodyText=a;else if(f.blob&&Blob.prototype.isPrototypeOf(a))this._bodyBlob=a;else if(f.formData&&FormData.prototype.isPrototypeOf(a))this._bodyFormData=a;else if(f.searchParams&&URLSearchParams.prototype.isPrototypeOf(a))this._bodyText=a.toString();else{var b;f.arrayBuffer&&f.blob&&(b=a)&&DataView.prototype.isPrototypeOf(b)?(this._bodyArrayBuffer=q(a.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):f.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(a)||j(a))?this._bodyArrayBuffer=q(a):this._bodyText=a=Object.prototype.toString.call(a);}}else this._bodyText='';!this.headers.get('content-type')&&('string'==typeof a?this.headers.set('content-type','text/plain;charset=UTF-8'):this._bodyBlob&&this._bodyBlob.type?this.headers.set('content-type',this._bodyBlob.type):f.searchParams&&URLSearchParams.prototype.isPrototypeOf(a)&&this.headers.set('content-type','application/x-www-form-urlencoded;charset=UTF-8'));},f.blob&&(this.blob=function(){var a=n(this);if(a)return a;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(!this._bodyFormData)return Promise.resolve(new Blob([this._bodyText]));throw new Error('could not read FormData body as blob');},this.arrayBuffer=function(){var a;if(!this._bodyArrayBuffer)return this.blob().then(p);return n(this)||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer));}),this.text=function(){var b,a,c,d=n(this);if(d)return d;if(this._bodyBlob)return b=this._bodyBlob,a=new FileReader,c=o(a),a.readAsText(b),c;if(this._bodyArrayBuffer)return Promise.resolve(function(d){for(var b=new Uint8Array(d),c=new Array(b.length),a=0;a<b.length;a++)c[a]=String.fromCharCode(b[a]);return c.join('');}(this._bodyArrayBuffer));if(!this._bodyFormData)return Promise.resolve(this._bodyText);throw new Error('could not read FormData body as text');},f.formData&&(this.formData=function(){return this.text().then(s);}),this.json=function(){return this.text().then(JSON.parse);},this;}b.prototype.append=function(a,b){a=k(a),b=l(b);var c=this.map[a];this.map[a]=c?c+', '+b:b;},b.prototype.delete=function(a){delete this.map[k(a)];},b.prototype.get=function(a){return a=k(a),this.has(a)?this.map[a]:null;},b.prototype.has=function(a){return this.map.hasOwnProperty(k(a));},b.prototype.set=function(a,b){this.map[k(a)]=l(b);},b.prototype.forEach=function(b,c){for(var a in this.map)this.map.hasOwnProperty(a)&&b.call(c,this.map[a],a,this);},b.prototype.keys=function(){var a=[];return this.forEach(function(c,b){a.push(b);}),m(a);},b.prototype.values=function(){var a=[];return this.forEach(function(b){a.push(b);}),m(a);},b.prototype.entries=function(){var a=[];return this.forEach(function(b,c){a.push([c,b]);}),m(a);},f.iterable&&(b.prototype[Symbol.iterator]=b.prototype.entries);var r=['DELETE','GET','HEAD','OPTIONS','POST','PUT'];function e(c,d){if(!(this instanceof e))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var h,g,f=(d=d||{}).body;if(c instanceof e){if(c.bodyUsed)throw new TypeError('Already read');this.url=c.url,this.credentials=c.credentials,d.headers||(this.headers=new b(c.headers)),this.method=c.method,this.mode=c.mode,this.signal=c.signal,f||null==c._bodyInit||(f=c._bodyInit,c.bodyUsed=!0);}else this.url=String(c);if(this.credentials=d.credentials||this.credentials||'same-origin',(d.headers||!this.headers)&&(this.headers=new b(d.headers)),this.method=(g=(h=d.method||this.method||'GET').toUpperCase(),r.indexOf(g)> -1?g:h),this.mode=d.mode||this.mode||null,this.signal=d.signal||this.signal||function(){if('AbortController'in a)return new AbortController().signal;}(),this.referrer=null,('GET'===this.method||'HEAD'===this.method)&&f)throw new TypeError('Body not allowed for GET or HEAD requests');if(this._initBody(f),('GET'===this.method||'HEAD'===this.method)&&('no-store'===d.cache||'no-cache'===d.cache)){var i=/([?&])_=[^&]*/;if(i.test(this.url))this.url=this.url.replace(i,'$1_='+new Date().getTime());else{var j=/\?/;this.url+=(j.test(this.url)?'&':'?')+'_='+new Date().getTime();}}}function s(a){var b=new FormData;return a.trim().split('&').forEach(function(a){if(a){var c=a.split('='),d=c.shift().replace(/\+/g,' '),e=c.join('=').replace(/\+/g,' ');b.append(decodeURIComponent(d),decodeURIComponent(e));}}),b;}function c(d,a){if(!(this instanceof c))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');a||(a={}),this.type='default',this.status=void 0===a.status?200:a.status,this.ok=this.status>=200&&this.status<300,this.statusText=void 0===a.statusText?'':''+a.statusText,this.headers=new b(a.headers),this.url=a.url||'',this._initBody(d);}e.prototype.clone=function(){return new e(this,{body:this._bodyInit});},g.call(e.prototype),g.call(c.prototype),c.prototype.clone=function(){return new c(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new b(this.headers),url:this.url});},c.error=function(){var a=new c(null,{status:0,statusText:''});return a.type='error',a;};var t=[301,302,303,307,308];c.redirect=function(b,a){if(-1===t.indexOf(a))throw new RangeError('Invalid status code');return new c(null,{status:a,headers:{location:b}});};var d=a.DOMException;try{new d;}catch(u){(d=function(a,b){this.message=a,this.name=b;var c=Error(a);this.stack=c.stack;}).prototype=Object.create(Error.prototype),d.prototype.constructor=d;}function h(g,h){return new Promise(function(n,k){var i=new e(g,h);if(i.signal&&i.signal.aborted)return k(new d('Aborted','AbortError'));var j=new XMLHttpRequest;function m(){j.abort();}j.onload=function(){var a,d,e={status:j.status,statusText:j.statusText,headers:(a=j.getAllResponseHeaders()||'',d=new b,a.replace(/\r?\n[\t ]+/g,' ').split('\r').map(function(a){return 0===a.indexOf('\n')?a.substr(1,a.length):a;}).forEach(function(c){var a=c.split(':'),b=a.shift().trim();if(b){var e=a.join(':').trim();d.append(b,e);}}),d)};e.url='responseURL'in j?j.responseURL:e.headers.get('X-Request-URL');var f='response'in j?j.response:j.responseText;setTimeout(function(){n(new c(f,e));},0);},j.onerror=function(){setTimeout(function(){k(new TypeError('Network request failed'));},0);},j.ontimeout=function(){setTimeout(function(){k(new TypeError('Network request failed'));},0);},j.onabort=function(){setTimeout(function(){k(new d('Aborted','AbortError'));},0);},j.open(i.method,function(b){try{return''===b&&a.location.href?a.location.href:b;}catch(c){return b;}}(i.url),!0),'include'===i.credentials?j.withCredentials=!0:'omit'===i.credentials&&(j.withCredentials=!1),'responseType'in j&&(f.blob?j.responseType='blob':f.arrayBuffer&&i.headers.get('Content-Type')&& -1!==i.headers.get('Content-Type').indexOf('application/octet-stream')&&(j.responseType='arraybuffer')),!h||'object'!=typeof h.headers||h.headers instanceof b?i.headers.forEach(function(a,b){j.setRequestHeader(b,a);}):Object.getOwnPropertyNames(h.headers).forEach(function(a){j.setRequestHeader(a,l(h.headers[a]));}),i.signal&&(i.signal.addEventListener('abort',m),j.onreadystatechange=function(){4===j.readyState&&i.signal.removeEventListener('abort',m);}),j.send(void 0===i._bodyInit?null:i._bodyInit);});}h.polyfill=!0,a.fetch||(a.fetch=h,a.Headers=b,a.Request=e,a.Response=c);}('undefined'!=typeof window?window:'undefined'!=typeof global?global:'undefined'!=typeof self?self:this);