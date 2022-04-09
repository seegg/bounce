/*! For license information please see bounce.bundle.js.LICENSE.txt */
(()=>{"use strict";var t={"./scripts/add-controls.ts":(t,e,n)=>{n.r(e),n.d(e,{insertBounceElements:()=>r});var i=n("./scripts/modal.ts"),r=function(){var t=document.querySelector(".bounce-app")||document.querySelector(".intro"),e=document.createElement("section");e.id="bounce",e.classList.add("bounce-container"),e.innerHTML='<section id="app-controls" class="controls">\x3c!-- Thumbnail container --\x3e<section id="ball-select" class="balls-container"><section id="ball-scroll-controls" class="btn-scroll-container"><button id="img-up" class="btn-scroll bounce-button">&#9650;</button><button id="img-down" class="btn-scroll bounce-button">&#9660;</button></section><section id="bounce-img-container" class="bounce-img-container"></section></section>\x3c!-- Button controls --\x3e<section id="button-controls" class="btn-container"><button id="image-upload-btn" class="btn-ctrl bounce-button"><span class="material-icons">add_photo_alternate</span></button><button id="party-btn" class="btn-ctrl bounce-button"><span class="material-icons">celebration</span></button><button id="gravity-btn" class="btn-ctrl btn-gravity bounce-button">G</button></section></section>';var n=document.createElement("section");n.classList.add("canvas-container"),n.innerHTML='<canvas id="canvas" class="bounce-canvas">Your browser doesn\'t support canvas.</canvas>';var r=(0,i.addModal)();e.append(n,r),null==t||t.append(e)}},"./scripts/app.ts":(t,e,n)=>{n.r(e),n.d(e,{appProps:()=>v,init:()=>y});var i=n("./scripts/ball.ts"),r=n("./scripts/images.ts"),o=n("./scripts/utility.ts");function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var i,r,o=[],a=!0,l=!1;try{for(n=n.call(t);!(a=(i=n.next()).done)&&(o.push(i.value),!e||o.length!==e);a=!0);}catch(t){l=!0,r=t}finally{try{a||null==n.return||n.return()}finally{if(l)throw r}}return o}(t,e)||d(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){s(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function u(t){return function(t){if(Array.isArray(t))return p(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||d(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(t,e){if(t){if("string"==typeof t)return p(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(t,e):void 0}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var v={count:0,isRunning:!0,isRunningW:!0,radiusSizes:{s:40,m:40,l:50,current:50},screenBreakPoints:{l:1280,m:768},gravity:{value:.01,isOn:!1,btn:document.getElementById("gravity-btn")},balls:[],selectedImgEle:null,selectedBall:null,selectedPositions:{prev:{x:0,y:0},current:{x:0,y:0},reference:{x:0,y:0}},selectedAngleThreshold:10,mouseMoveDistThreshold:10,velocityThreshould:.05,overlapThreshold:.05,wallModifiers:{left:1,right:1,top:1,bottom:1},currentTime:0,selectedTime:0,deceleration:.995,canvas:document.getElementById("canvas"),canvasHorizontalGap:10,canvasTopOffset:70,party:{isActive:!1,start:0,duration:1e4,maxVelocity:2,minVelocity:.5,wallModRef:{left:1.1,right:1.1,top:1,bottom:1.8},gravityRef:!1,colourRef:[],partyBtn:document.getElementById("party-btn")},rainBow:["#ff0000","#ffa500","#ffff00","#008000","#0000ff","#4b0082","#ee82ee"]};function y(){v.canvas=document.getElementById("canvas"),v.gravity.btn=document.getElementById("gravity-btn"),v.party.partyBtn=document.getElementById("party-btn"),function(){var t,e;window.onresize=function(){f(),window.innerWidth<570?v.isRunningW&&b():v.isRunningW||b()},v.canvas.addEventListener("pointerdown",M),v.canvas.addEventListener("pointermove",O),v.canvas.addEventListener("pointerup",E),v.canvas.addEventListener("pointerleave",P),v.canvas.addEventListener("contextmenu",(function(t){t.preventDefault(),function(t){var e=a(B(t),2),n=e[0],i=e[1],r=v.balls.findIndex((function(t){return t.containsPoint(n,i)}));r>=0&&function(t){try{v.balls.splice(t,1)}catch(t){console.error(t)}}(r)}(t)}));var n=document.getElementById("gravity-btn");null==n||n.addEventListener("click",(function(){v.party.isActive||(v.gravity.isOn=!v.gravity.isOn,m(v.gravity.isOn))})),null===(t=document.getElementById("party-btn"))||void 0===t||t.addEventListener("click",(function(){!function(){var t;if(v.party.start=(new Date).getTime(),null===(t=document.getElementById("party-btn"))||void 0===t||t.classList.add("btn-progress-bar"),v.party.isActive)return void v.balls.forEach((function(t){t.velocity=I()}));v.party.gravityRef=v.gravity.isOn,v.gravity.isOn&&m(v.gravity.isOn);v.gravity.isOn=!1,v.party.isActive=!0,v.balls.forEach((function(t){v.party.colourRef[t.id]=[Math.floor(Math.random()*v.rainBow.length),0],t.velocity=I()}))}()}));var i=null===(e=document.querySelector(".bounce-container"))||void 0===e?void 0:e.parentElement;new IntersectionObserver((function(t){t[0].isIntersecting?(null==i||i.children[0].classList.remove("bounce-hide"),v.isRunning||h()):(null==i||i.children[0].classList.add("bounce-hide"),v.isRunning&&h())}),{rootMargin:"0px",threshold:.5}).observe(i)}(),f(),localStorage.getItem("ballImgSrcs")&&r.imageList.push.apply(r.imageList,u(localStorage.getItem("ballImgSrcs").split(","))),Promise.all(r.imageList.map((function(t){return(0,r.addImage)(t,r.imageCache,50)}))).then((function(t){g(),v.currentTime=(new Date).getTime(),w()}))}var g=function(){for(var t=Math.ceil(3*Math.random())+2,e=0;e<t;e++){var n=new i.Ball(r.imageCache[Math.floor(Math.random()*r.imageCache.length)],Math.random()*v.canvas.width,Math.random()*v.canvas.height,v.radiusSizes.current);n.velocity.vX=.5*Math.random(),n.velocity.vY=.5*Math.random(),v.balls.push(n)}};function m(t){var e,n;t?null===(e=v.gravity.btn)||void 0===e||e.classList.add("bounce-selected"):null===(n=v.gravity.btn)||void 0===n||n.classList.remove("bounce-selected");if(v.gravity.isOn){var i=v.party.wallModRef;v.party.wallModRef=c({},v.wallModifiers),v.wallModifiers=c({},i)}else{var r=v.wallModifiers;v.wallModifiers=c({},v.party.wallModRef),v.party.wallModRef=c({},r)}}function f(){try{if(null===v.canvas)throw new Error("canvas is null");var t=window.innerWidth-20,e=window.innerHeight-10;t<v.screenBreakPoints.m?v.radiusSizes.current=v.radiusSizes.s:t<v.screenBreakPoints.l?v.radiusSizes.current=v.radiusSizes.m:v.radiusSizes.current=v.radiusSizes.l,v.canvas.width=t-v.canvasHorizontalGap,v.canvas.height=e-v.canvasTopOffset,v.balls.forEach((function(t){return t.radius=v.radiusSizes.current}))}catch(t){console.error(t)}}function h(){v.isRunning=!v.isRunning,v.isRunning&&v.isRunningW&&w()}function b(){v.isRunningW=!v.isRunningW,v.isRunning&&v.isRunningW&&w()}function w(){var t,e,n,i,r=v.canvas.getContext("2d"),l=(new Date).getTime()-v.currentTime;if(v.currentTime=(new Date).getTime(),v.party.isActive){r.fillStyle="rgba(220, 219, 60, 0.05)",r.fillRect(0,0,v.canvas.width,v.canvas.height);var s=(new Date).getTime()-v.party.start,u=s/v.party.duration*100;s>v.party.duration?(u=0,v.party.isActive=!1,v.gravity.isOn!=v.party.gravityRef&&m(v.party.gravityRef),v.gravity.isOn=v.party.gravityRef,v.party.colourRef=[]):v.party.colourRef.forEach((function(t,e){v.party.colourRef[e]=[t[0],s]})),t=v.party.partyBtn,e=u,t.style.backgroundPosition="".concat(e,"% 100%")}else r.clearRect(0,0,v.canvas.width,v.canvas.height);v.balls.forEach((function(t){t.selected||x(r,t),function(t,e){var n=t.position,i=t.selected,r=t.velocity;if(!i){t.prevPosition=c({},n);var l=v.gravity.value/3;Math.abs(t.velocity.vX)<l&&(t.velocity.vX=0),Math.abs(t.velocity.vY)<l&&(t.velocity.vY=0),v.gravity.isOn&&(r.vY+=v.gravity.value);var s=r.vX*e;n.x+=s,n.y+=r.vY*e,v.gravity.isOn&&(r.vX*=v.deceleration),function(t){var e=[];if(v.balls.forEach((function(n){t.id===n.id||n.selected||t.getOverlap(n)>v.overlapThreshold&&e.push(n)})),e.length>0){e.sort((function(e,n){return o.util.distanceBetween2Points(t.position,e.position)-o.util.distanceBetween2Points(t.position,n.position)})),t.reversePosition(t.getOverlap(e[0]));var n=a(function(t,e){var n=c({},t.velocity),i=c({},e.velocity);t.checkBallCollision(e)&&(n=o.util.getBallCollisionVelocity(t,e),i=o.util.getBallCollisionVelocity(e,t));return[n,i]}(t,e[0]),2),i=n[0],r=n[1];t.velocity=i,e[0].velocity=r}e=[]}(t),function(t){var e=t.position,n=t.radius,i=t.velocity,r=v.canvas,o=v.wallModifiers;e.x+n>r.width&&(e.x=r.width-n,i.vX<0||(t.velocity.vX*=-1/o.right),Math.abs(i.vX)<.05&&(i.vX=0));e.x-n<0&&(e.x=n,i.vX>0||(t.velocity.vX*=-1/o.left),Math.abs(i.vX)<.05&&(i.vX=0));e.y+n>r.height&&(e.y=r.height-n,i.vY<0||(t.velocity.vY*=-1/o.bottom),Math.abs(i.vY)<.05&&(i.vY=0));e.y-n<0&&(e.y=n,i.vY>0||(t.velocity.vY*=-1/o.top))}(t)}}(t,l)})),n=v.balls,i=function(t){var e=[];return t.forEach((function(t){var n=e.findIndex((function(e){return t.position.y>e.position.y||t.position.y===e.position.y&&t.position.x<e.position.x}));-1===n?e.push(t):e.splice(n,0,t)})),e}(n),i.forEach((function(t){!t.selected&&i.forEach((function(e){if(!e.selected){var n=t.getOverlap(e);if(!(n<v.overlapThreshold)){var i=t.position.y-e.position.y;if(t.id!==e.id&&n>.03){var r=a(o.util.xyDiffBetweenPoints(t.position,e.position),2),l=r[0],c=r[1],s=Math.abs(l)+Math.abs(c),u=l/s*n,d=c/s*n;0===i?(t.position.x-=.5*n,e.position.x+=.5*n):i>0?(e.position.x+=u,e.position.y+=d):(t.position.x+=u,t.position.y+=d)}}}}))})),v.balls.forEach((function(t){t.selected||(t.rotation+=function(t){var e=2*Math.PI*t.radius;return(t.position.x-t.prevPosition.x)/e*360}(t))})),x(r,v.selectedBall),v.isRunning&&v.isRunningW&&window.requestAnimationFrame((function(){w()}))}function x(t,e){if(null!==e){var n=e.id,i=e.position,r=e.radius,o=e.selected,a=e.rotation,l=e.img;t.save(),t.translate(i.x,i.y),t.rotate(Math.PI/180*a),t.drawImage(l,-r,-r,2*r,2*r),v.party.isActive&&(t.lineWidth=Math.round(r/10)+1,t.strokeStyle=v.rainBow[(v.party.colourRef[n][0]+Math.floor(v.party.colourRef[n][1]/1e3))%v.rainBow.length],t.beginPath(),t.arc(0,0,r,0,2*Math.PI),t.stroke()),o&&(t.lineWidth=4,t.strokeStyle="cyan",t.beginPath(),t.arc(0,0,r,0,2*Math.PI),t.stroke()),t.restore()}}function I(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v.party.maxVelocity,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:v.party.minVelocity,n=-1,i=-1;return Math.random()>.5&&(n=1),Math.random()>.5&&(i=1),{vX:Math.max(Math.random()*e,t)*n,vY:Math.max(Math.random()*e,t)*i}}function B(t){var e=t.target.getBoundingClientRect();return[t.clientX-e.x,t.clientY-e.y]}function M(t){if(0===t.button){var e=a(B(t),2),n=e[0],o=e[1];v.selectedImgEle?v.selectedBall=function(t,e,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:v.radiusSizes.current,a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];try{var l=Number(t.dataset.index),c=new i.Ball(r.imageCache[l],e,n,o,a);return v.balls.push(c),v.count++,v.party&&(v.party.colourRef[c.id]=[Math.floor(Math.random()*v.rainBow.length),0]),c}catch(t){console.error(t)}}(v.selectedImgEle,n,o)||null:v.selectedBall=v.balls.find((function(t){return t.containsPoint(n,o)}))||null,v.selectedBall&&(v.selectedTime=(new Date).getTime(),v.selectedBall.selected=!0,v.selectedBall.velocity={vX:0,vY:0},v.selectedPositions.current={x:n,y:o},v.selectedPositions.prev={x:n,y:o},v.selectedPositions.reference={x:n,y:o})}}function O(t){if(v.selectedBall){var e=a(B(t),2),n=e[0],i=e[1],r=a(o.util.xyDiffBetweenPoints(v.selectedPositions.current,{x:n,y:i}),2),l=r[0],c=r[1];if(v.selectedBall.move(l,c),v.selectedPositions.current={x:n,y:i},o.util.distanceBetween2Points({x:n,y:i},v.selectedPositions.prev)>v.mouseMoveDistThreshold){var s=v.selectedPositions,u=s.reference,d=s.prev,p=s.current;(o.util.angleBetween3Points(u,d,p)||0)>v.selectedAngleThreshold&&(v.selectedPositions.reference={x:n,y:i},v.selectedTime=(new Date).getTime()),v.selectedPositions.prev={x:n,y:i}}}}function E(t){if(v.selectedBall){try{var e=a(B(t),2),n=e[0],i=e[1],r=a(o.util.xyDiffBetweenPoints(v.selectedPositions.reference,{x:n,y:i}),2),l=r[0],c=r[1],s=(new Date).getTime()-v.selectedTime;v.selectedBall.velocity.vX=l/s,v.selectedBall.velocity.vY=c/s}catch(t){v.selectedBall.position={x:50,y:50},console.error(t)}v.selectedBall.selected=!1,v.selectedBall=null}}function P(t){v.selectedBall&&(v.selectedBall.selected=!1,v.selectedBall.velocity={vX:0,vY:0},v.selectedBall=null)}},"./scripts/ball.ts":(t,e,n)=>{n.r(e),n.d(e,{Ball:()=>s});var i=n("./scripts/utility.ts");function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){c(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function l(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s=function(){function t(e,n,i,r){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4];a(this,t),this.id=t.baseId,this.position={x:n,y:i},this.prevPosition={x:n,y:i},this.radius=r,this.rotation=0,this.velocity={vX:0,vY:0},this.img=e,this.selected=o,t.baseId++}var e,n,r;return e=t,(n=[{key:"move",value:function(t,e){this.position.x+=t,this.position.y+=e}},{key:"reversePosition",value:function(t){if(0===this.getTotalVelocity());else{var e=-1*Math.sqrt(Math.pow(t,2)/(Math.pow(this.velocity.vX,2)+Math.pow(this.velocity.vY,2)));this.position.x+=this.velocity.vX*e,this.position.y+=this.velocity.vY*e}}},{key:"getTotalVelocity",value:function(){return Math.sqrt(Math.pow(this.velocity.vX,2)+Math.pow(this.velocity.vY,2))}},{key:"containsPoint",value:function(t,e){return Math.pow(t-this.position.x,2)+Math.pow(e-this.position.y,2)<=Math.pow(this.radius,2)}},{key:"getOverlap",value:function(t){var e=i.util.distanceBetween2Points(this.position,t.position),n=this.radius+t.radius-e;return n>=0?n:-1}},{key:"checkBallCollision",value:function(t){if(this.getOverlap(t)>=0){var e=i.util.xyDiffBetweenPoints(this.position,t.position);return(i.util.angleBetween2DVector(this.velocity.vX,this.velocity.vY,e[0],e[1])||0)<=90}return!1}},{key:"getCircle",value:function(){return o(o({},this.position),{},{r:this.radius})}}])&&l(e.prototype,n),r&&l(e,r),Object.defineProperty(e,"prototype",{writable:!1}),t}();c(s,"baseId",1)},"./scripts/images.ts":(t,e,n)=>{n.r(e),n.d(e,{addImage:()=>d,appendImgElemToContainer:()=>p,createImgEleWithIndex:()=>v,imageCache:()=>u,imageList:()=>l,imgContainerScrollUpDown:()=>m,scrollToImgElement:()=>g,setUpImages:()=>s,toggleSelectedImgElement:()=>y});var i=n("./scripts/app.ts"),r=n("./scripts/utility.ts");function o(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var l=["me.jpeg","grumpy.webp","smileface.webp","spongebob.webp","pepper.png"].map((function(t){return"https://raw.githubusercontent.com/seegg/bounce/main/images/"+t})).concat(["https://raw.githubusercontent.com/seegg/seegg.github.io/main/public/images/crow.png"]),c=document.getElementById("bounce-img-container"),s=function(){var t;c=document.getElementById("bounce-img-container"),null===(t=document.getElementById("ball-scroll-controls"))||void 0===t||t.addEventListener("pointerdown",m)},u=[];function d(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:c,o=["bounce-img-thumb","grayscale"],a=document.createElement("img");return a.classList.add("bounce-img-thumb"),a.src="https://raw.githubusercontent.com/seegg/bounce/main/images/spinner.gif",null==i||i.appendChild(a),r.util.createCircleImg(t,n).then((function(n){var i=e.push(n)-1;return v(t,i,o)})).then((function(t){if(null===i)throw new Error("image container is null");p(t,i,a)})).catch((function(t){throw null==i||i.removeChild(a),console.error(t),t}))}function p(t,e,n){n?e.replaceChild(t,n):e.append(t)}function v(t,e,n){var i,r=document.createElement("img");return(i=r.classList).add.apply(i,o(n)),r.onclick=function(t){y(t.target)},r.setAttribute("data-index",e+""),r.onload=function(){URL.revokeObjectURL(t)},r.src=t,r}function y(t){var e,n="grayscale";null===(e=i.appProps.selectedImgEle)||void 0===e||e.classList.toggle(n),t===i.appProps.selectedImgEle?i.appProps.selectedImgEle=null:(t.classList.toggle(n),i.appProps.selectedImgEle=t),g(t)}function g(t){var e=document.getElementById("bounce-img-container"),n=t.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scroll(0,n)}function m(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:48;t.preventDefault();var i=e.scrollTop%n;switch(t.target.id){case"img-up":e.scroll(0,0===i?e.scrollTop-n:e.scrollTop-i);break;case"img-down":e.scroll(0,e.scrollTop+n-i)}}},"./scripts/modal.ts":(t,e,n)=>{n.r(e),n.d(e,{addModal:()=>a,modalInit:()=>o});var i=n("./scripts/app.ts"),r=n("./scripts/images.ts"),o=function(){var t,e,n,o,a={modal:document.getElementById("modal"),overlay:document.getElementById("modal-overlay"),openButton:document.getElementById("image-upload-btn"),toggle:function(){var t,e;null===(t=a.modal)||void 0===t||t.classList.toggle("close"),null===(e=a.overlay)||void 0===e||e.classList.toggle("close"),l.imgFileInput.value="",l.imgURLInput.value="",l.imgFileDisplay.value=""}},l={form:document.getElementById("image-upload-form"),okButton:document.getElementById("form-ok-btn"),imgFileInput:document.getElementById("img-file"),imgURLInput:document.getElementById("img-URL"),imgFileDisplay:document.getElementById("file-name"),imgFileDisplayButton:document.getElementById("upload-button"),cancelButton:document.getElementById("form-cancel-btn"),handleFileDisplayClick:function(t){t.preventDefault(),l.imgFileInput.click()},handleFileChange:function(){var t,e;l.imgFileDisplay.value=(null===(t=l.imgFileInput.files)||void 0===t||null===(e=t.item(0))||void 0===e?void 0:e.name)||"No Image Selected"},handleSubmit:function(t){var e;t.preventDefault();var n="",o=!1;if(null!==(e=l.imgFileInput.files)&&void 0!==e&&e.item(0))try{n=URL.createObjectURL(l.imgFileInput.files[0])}catch(t){console.error(t)}else n=l.imgURLInput.value,o=!0;(0,r.addImage)(n,r.imageCache,i.appProps.radiusSizes.current).then((function(t){if(o){var e="ballImgSrcs",i="";localStorage.getItem(e)&&(i=localStorage.getItem(e)),i.split(",").includes(n)||(localStorage.getItem(e)?i+=",".concat(n):i=n,localStorage.setItem(e,i))}a.toggle()})).catch((function(t){console.log("something")}))},handleCancel:function(t){l.imgURLInput.value="",l.imgFileInput.value="",l.imgFileDisplay.value="",a.toggle()}};null===(t=a.overlay)||void 0===t||t.addEventListener("click",a.toggle),null===(e=a.openButton)||void 0===e||e.addEventListener("click",a.toggle),null===(n=l.form)||void 0===n||n.addEventListener("submit",l.handleSubmit),l.imgFileDisplayButton.addEventListener("click",l.handleFileDisplayClick),l.imgFileInput.addEventListener("change",l.handleFileChange),null===(o=l.cancelButton)||void 0===o||o.addEventListener("click",l.handleCancel),document.addEventListener("keydown",(function(t){var e;null!==(e=a.modal)&&void 0!==e&&e.classList.contains("close")||"Escape"===t.key&&a.toggle()}))},a=function(){var t=document.createElement("div");t.innerHTML='<div class="modal-overlay close" id="modal-overlay"></div>';var e=document.createElement("section");e.id="modal",e.classList.add("upload-modal","close"),e.innerHTML='<form id="image-upload-form" class="upload-form"><h2 class="bounce-title">Upload Image</h2><input class="bounce-input" hidden type="file" id="img-file" name="imgFile" accept="image/*"><section class="img-upload"><label for="fileName" class="font-bold">Image File:</label><section class="img-file-display"><input class="bounce-input" readonly type="text" name="fileName" placeholder="No file selected"id="file-name"><button type="button" class="btn-file bounce-button" id="upload-button">Select Image</button></section></section><section class="img-upload"><label for="imgUrl" class="font-bold">Image URL:</label><section><input class="bounce-input" type="text" name="imgURL" id="img-URL" placeholder="Image URL"></section></section><section class="upload-controls"><button type="submit" class="mx-1 bounce-button btn-ctrl" id="form-ok-btn"><span class="material-icons">check</span></button><button type="button" class="mx-1 bounce-button btn-ctrl" id="form-cancel-btn"><span class="material-icons">close</span></button></section></form>';var n=new DocumentFragment;return n.append(e,t),n}},"./scripts/utility.ts":(t,e,n)=>{function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var i,r,o=[],a=!0,l=!1;try{for(n=n.call(t);!(a=(i=n.next()).done)&&(o.push(i.value),!e||o.length!==e);a=!0);}catch(t){l=!0,r=t}finally{try{a||null==n.return||n.return()}finally{if(l)throw r}}return o}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return l(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function c(t,e,n,i,r,o,a,l,c,s){var u=c&&s?2*s/(c+s):1,d=t-r,p=e-o,v=(d*(n-a)+p*(i-l))/(Math.pow(d,2)+Math.pow(p,2))*u;return{vX:n-v*d,vY:i-v*p}}function s(t,e){return[e.x-t.x,e.y-t.y]}function u(t,e){var n=document.createElement("canvas");n.height=t.height,n.width=t.width;var i=n.getContext("2d");i.drawImage(t,0,0,n.width,n.height);for(var r=t.width/e.w,o=t.height/e.h,a=Math.ceil(Math.log(r>=o?o:r)/Math.log(2)),l=document.createElement("canvas"),c=l.getContext("2d"),s=1;s<a;s++)l.width=n.width/2,l.height=n.height/2,c.drawImage(n,0,0,l.width,l.height),n.width=l.width,n.height=l.height,i.drawImage(l,0,0);return l.width=e.w,l.height=e.h,c.drawImage(n,0,0,l.width,l.height),l}function d(t,e){var n=a(s(t,e),2),i=n[0],r=n[1];return Math.sqrt(Math.pow(i,2)+Math.pow(r,2))}function p(t,e,n,i){var r=t*n+e*i,o=Math.sqrt(Math.pow(t,2)+Math.pow(e,2)),a=Math.sqrt(Math.pow(n,2)+Math.pow(i,2));return Math.acos(r/(o*a))*(180/Math.PI)}function v(t,e,n){var i={x:t.x-n.x,y:t.y-n.y},o={x:e.x-n.x,y:e.y-n.y},a=o.x-i.x,l=o.y-i.y,c=d(i,o),s=i.x*o.y-o.x*i.y,u=l<0?-1:1,p=Math.pow(n.r,2),v=Math.pow(c,2),y=p*v-Math.pow(s,2),g=y<0?0:0===y?1:2;if(y<0)return[g,null,null];var m=Math.sqrt(y),f=(s*l+u*a*m)/v+n.x,h=(-1*s*a+Math.abs(l)*m)/v+n.y,b=(s*l-u*a*m)/v+n.x,w=(-1*s*a-Math.abs(l)*m)/v+n.y,x={x:f,y:h},I={x:b,y:w};return(f>b||f===b&&h>w)&&(I=r({},x),x={x:b,y:w}),[g,x,0===y?null:I]}n.r(e),n.d(e,{util:()=>y});var y={calculateCollisionVelocity:c,createCircleImg:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"white",i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3;return new Promise((function(r,o){var a=document.createElement("canvas"),l=2*e;a.width=l,a.height=l;var c=document.createElement("img");c.src=t,c.onload=function(){var t=c.width/l,o=c.height/l;t>=o?a.width=Math.floor(c.width/o):a.height=Math.floor(c.height/t);var s=u(c,{w:l,h:l}),d=a.getContext("2d");if(null===d)throw new Error("context2D is null");d.drawImage(s,0,0,a.width,a.height),d.beginPath(),d.arc(a.width/2,a.height/2,e,0,2*Math.PI),d.closePath(),d.lineWidth=i,d.strokeStyle=n,d.stroke(),d.globalCompositeOperation="destination-in",d.arc(a.width/2,a.height/2,e,0,2*Math.PI),d.fill(),r(createImageBitmap(a,a.width/2-e,a.height/2-e,l,l))},c.onerror=o}))},convertBmpToBlob:function(t){return new Promise((function(e,n){var i=document.createElement("canvas");i.width=t.width,i.height=t.height;var r,o=i.getContext("bitmaprenderer");o?o.transferFromImageBitmap(t):null===(r=i.getContext("2d"))||void 0===r||r.drawImage(t,0,0);i.toBlob((function(t){null===t&&n("Blob is null"),e(t)}))}))},getBallCollisionVelocity:function(t,e){return c(t.position.x,t.position.y,t.velocity.vX,t.velocity.vY,e.position.x,e.position.y,e.velocity.vX,e.velocity.vY)},xyDiffBetweenPoints:s,angleBetween2DVector:p,angleBetween3Points:function(t,e,n){return p(e.x-t.x,e.y-t.y,n.x-e.x,n.y-e.y)},distanceBetween2Points:d,circleLineIntersect:v,maxIntersectHeight:function(t,e){var n=d({x:t.x,y:t.y},{x:e.x,y:e.y}),i=n-t.r-e.r;if(i>=0)return 0;var o=(t.r+.5*i)/n,l={x:(1-o)*t.x+o*e.x,y:(1-o)*t.y+o*e.y},c=r(r({},l),{},{y:l.y+1}),s=a(v(l,c,t),3),u=(s[0],s[1]),p=s[2],y=a(v(l,c,e),3),g=(y[0],y[1]),m=y[2],f=[u.y,p.y,g.y,m.y].sort();return f[2]-f[1]},maxIntersectWidth:function(t,e){var n=d({x:t.x,y:t.y},{x:e.x,y:e.y}),i=n-t.r-e.r;if(i>=0)return 0;var o=(t.r+.5*i)/n,l={x:(1-o)*t.x+o*e.x,y:(1-o)*t.y+o*e.y},c=r(r({},l),{},{x:l.x+1}),s=a(v(l,c,t),3),u=(s[0],s[1]),p=s[2],y=a(v(l,c,e),3),g=(y[0],y[1]),m=y[2],f=[u.x,p.x,g.x,m.x].sort();return f[2]-f[1]}}}},e={};function n(i){var r=e[i];if(void 0!==r)return r.exports;var o=e[i]={exports:{}};return t[i](o,o.exports,n),o.exports}n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var i={};(()=>{n.r(i);var t=n("./scripts/app.ts"),e=n("./scripts/images.ts"),r=n("./scripts/modal.ts"),o=n("./scripts/add-controls.ts");setTimeout((function(){(0,o.insertBounceElements)(),(0,e.setUpImages)(),(0,r.modalInit)(),(0,t.init)()}),1e3)})()})();
//# sourceMappingURL=bounce.bundle.js.map