/*! For license information please see main.bundle.js.LICENSE.txt */
(()=>{"use strict";var t={"./scripts/add-controls.ts":(t,e,n)=>{n.r(e),n.d(e,{insertBounceElements:()=>o});var i=n("./scripts/modal.ts"),o=function(){var t=document.querySelector(".bounce-container"),e=document.createElement("section");e.id="app-controls",e.classList.add("controls"),e.innerHTML='\x3c!-- Thumbnail container --\x3e<section id="ball-select" class="balls-container"><section id="ball-scroll-controls" class="btn-scroll-container"><button id="img-up" class="btn-scroll bounce-button">&#9650;</button><button id="img-down" class="btn-scroll bounce-button">&#9660;</button></section><section id="bounce-img-container" class="bounce-img-container"></section></section>\x3c!-- Button controls --\x3e<section id="button-controls" class="btn-container"><button id="image-upload-btn" class="btn-ctrl bounce-button"><span class="material-icons">add_photo_alternate</span></button><button id="party-btn" class="btn-ctrl bounce-button"><span class="material-icons">celebration</span></button><button id="gravity-btn" class="btn-ctrl btn-gravity bounce-button">G</button></section>';var n=document.createElement("section");n.classList.add("canvas-container"),n.innerHTML='<canvas id="canvas" class="bounce-canvas">Your browser doesn\'t support canvas.</canvas>';var o=(0,i.addModal)();null==t||t.append(e,n,o)}},"./scripts/app.ts":(t,e,n)=>{n.r(e),n.d(e,{appProps:()=>d,init:()=>p});var i=n("./scripts/ball.ts"),o=n("./scripts/images.ts"),r=n("./scripts/utility.ts");function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var i,o,r=[],a=!0,l=!1;try{for(n=n.call(t);!(a=(i=n.next()).done)&&(r.push(i.value),!e||r.length!==e);a=!0);}catch(t){l=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(l)throw o}}return r}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return l(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function c(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function s(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?c(Object(n),!0).forEach((function(e){u(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function u(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var d={count:0,radiusSizes:{s:40,m:40,l:50,current:50},screenBreakPoints:{l:1280,m:768},gravity:{value:.01,isOn:!1,btn:document.getElementById("gravity-btn")},balls:[],selectedImgEle:null,selectedBall:null,selectedPositions:{prev:{x:0,y:0},current:{x:0,y:0},reference:{x:0,y:0}},selectedAngleThreshold:10,mouseMoveDistThreshold:10,velocityThreshould:.05,overlapThreshold:.05,wallModifiers:{left:1.1,right:1.1,top:1,bottom:1.8},currentTime:0,selectedTime:0,deceleration:.995,canvas:document.getElementById("canvas"),canvasHorizontalGap:10,canvasTopOffset:70,party:{isActive:!1,start:0,duration:1e4,maxVelocity:2,minVelocity:.5,wallModRef:{left:1,right:1,top:1,bottom:1},gravityRef:!0,colourRef:[],partyBtn:document.getElementById("party-btn")},rainBow:["#ff0000","#ffa500","#ffff00","#008000","#0000ff","#4b0082","#ee82ee"]};function p(){d.canvas=document.getElementById("canvas"),d.gravity.btn=document.getElementById("gravity-btn"),function(){var t;window.onresize=function(){y()},d.canvas.addEventListener("pointerdown",b),d.canvas.addEventListener("pointermove",w),d.canvas.addEventListener("pointerup",x),d.canvas.addEventListener("pointerleave",B);var e=document.getElementById("gravity-btn");null==e||e.addEventListener("click",(function(){d.party.isActive||(d.gravity.isOn=!d.gravity.isOn,v(d.gravity.isOn))})),null===(t=document.getElementById("party-btn"))||void 0===t||t.addEventListener("click",(function(){!function(){var t;if(d.party.start=(new Date).getTime(),null===(t=document.getElementById("party-btn"))||void 0===t||t.classList.add("btn-progress-bar"),d.party.isActive)return void d.balls.forEach((function(t){t.velocity=g()}));d.party.gravityRef=d.gravity.isOn,d.gravity.isOn=!1,v(d.gravity.isOn),d.party.wallModRef=s({},d.wallModifiers),d.wallModifiers={left:1,right:1,top:1,bottom:1},d.party.isActive=!0,d.balls.forEach((function(t){d.party.colourRef[t.id]=[Math.floor(Math.random()*d.rainBow.length),0],t.velocity=g()}))}()}))}(),y(),Promise.all(o.imageList.map((function(t){return(0,o.addImage)(t,o.imageCache,50)}))).then((function(t){d.currentTime=(new Date).getTime(),window.requestAnimationFrame(f)}))}function v(t){var e,n;t?null===(e=d.gravity.btn)||void 0===e||e.classList.add("bounce-selected"):null===(n=d.gravity.btn)||void 0===n||n.classList.remove("bounce-selected")}function y(){try{if(null===d.canvas)throw new Error("canvas is null");var t=window.innerWidth-50,e=window.innerHeight-30;t<d.screenBreakPoints.m?d.radiusSizes.current=d.radiusSizes.s:t<d.screenBreakPoints.l?d.radiusSizes.current=d.radiusSizes.m:d.radiusSizes.current=d.radiusSizes.l,d.canvas.width=t-d.canvasHorizontalGap,d.canvas.height=e-d.canvasTopOffset,d.balls.forEach((function(t){return t.radius=d.radiusSizes.current}))}catch(t){console.error(t)}}function f(){var t,e,n,i,o=d.canvas.getContext("2d"),l=(new Date).getTime()-d.currentTime;if(d.currentTime=(new Date).getTime(),d.party.isActive){o.fillStyle="rgba(220, 219, 6, 0.1)",o.fillRect(0,0,d.canvas.width,d.canvas.height);var c=(new Date).getTime()-d.party.start,u=c/d.party.duration*100;c>d.party.duration?(u=0,d.party.isActive=!1,d.wallModifiers=s({},d.party.wallModRef),d.gravity.isOn=d.party.gravityRef,v(d.gravity.isOn),d.party.colourRef=[]):d.party.colourRef.forEach((function(t,e){d.party.colourRef[e]=[t[0],c]})),t=d.party.partyBtn,e=u,t.style.backgroundPosition="".concat(e,"% 100%")}else o.clearRect(0,0,d.canvas.width,d.canvas.height);d.balls.forEach((function(t){t.selected||m(o,t),function(t,e){var n=t.position,i=t.selected,o=t.velocity;if(!i){t.prevPosition=s({},n);var l=d.gravity.value/3;Math.abs(t.velocity.vX)<l&&(t.velocity.vX=0),Math.abs(t.velocity.vY)<l&&(t.velocity.vY=0),d.gravity.isOn&&(o.vY+=d.gravity.value);var c=o.vX*e;n.x+=c,n.y+=o.vY*e,o.vX*=d.deceleration,function(t){var e=[];if(d.balls.forEach((function(n){t.id===n.id||n.selected||t.getOverlap(n)>d.overlapThreshold&&e.push(n)})),e.length>0){e.sort((function(e,n){return r.util.distanceBetween2Points(t.position,e.position)-r.util.distanceBetween2Points(t.position,n.position)})),t.reversePosition(t.getOverlap(e[0]));var n=a(function(t,e){var n=s({},t.velocity),i=s({},e.velocity);t.checkBallCollision(e)&&(n=r.util.getBallCollisionVelocity(t,e),i=r.util.getBallCollisionVelocity(e,t));return[n,i]}(t,e[0]),2),i=n[0],o=n[1];t.velocity=i,e[0].velocity=o}e=[]}(t),function(t){var e=t.position,n=t.radius,i=t.velocity,o=d.canvas,r=d.wallModifiers;e.x+n>o.width&&(e.x=o.width-n,i.vX<0||(t.velocity.vX*=-1/r.right),Math.abs(i.vX)<.05&&(i.vX=0));e.x-n<0&&(e.x=n,i.vX>0||(t.velocity.vX*=-1/r.left),Math.abs(i.vX)<.05&&(i.vX=0));e.y+n>o.height&&(e.y=o.height-n,i.vY<0||(t.velocity.vY*=-1/r.bottom),Math.abs(i.vY)<.05&&(i.vY=0));e.y-n<0&&(e.y=n,i.vY>0||(t.velocity.vY*=-1/r.top))}(t)}}(t,l)})),n=d.balls,i=function(t){var e=[];return t.forEach((function(t){var n=e.findIndex((function(e){return t.position.y>e.position.y||t.position.y===e.position.y&&t.position.x<e.position.x}));-1===n?e.push(t):e.splice(n,0,t)})),e}(n),i.forEach((function(t){!t.selected&&i.forEach((function(e){if(!e.selected){var n=t.getOverlap(e);if(!(n<d.overlapThreshold)){var i=t.position.y-e.position.y;if(t.id!==e.id&&n>.03){var o=a(r.util.xyDiffBetweenPoints(t.position,e.position),2),l=o[0],c=o[1],s=Math.abs(l)+Math.abs(c),u=l/s*n,p=c/s*n;0===i?(t.position.x-=.5*n,e.position.x+=.5*n):i>0?(e.position.x+=u,e.position.y+=p):(t.position.x+=u,t.position.y+=p)}}}}))})),d.balls.forEach((function(t){t.selected||(t.rotation+=function(t){var e=2*Math.PI*t.radius;return(t.position.x-t.prevPosition.x)/e*360}(t))})),m(o,d.selectedBall),window.requestAnimationFrame((function(){f()}))}function m(t,e){if(null!==e){var n=e.id,i=e.position,o=e.radius,r=e.selected,a=e.rotation,l=e.img;t.save(),t.translate(i.x,i.y),t.rotate(Math.PI/180*a),t.drawImage(l,-o,-o,2*o,2*o),d.party.isActive&&(t.lineWidth=Math.round(o/10)+1,t.strokeStyle=d.rainBow[(d.party.colourRef[n][0]+Math.floor(d.party.colourRef[n][1]/1e3))%d.rainBow.length],t.beginPath(),t.arc(0,0,o,0,2*Math.PI),t.stroke()),r&&(t.lineWidth=4,t.strokeStyle="cyan",t.beginPath(),t.arc(0,0,o,0,2*Math.PI),t.stroke()),t.restore()}}function g(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d.party.maxVelocity,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:d.party.minVelocity,n=-1,i=-1;return Math.random()>.5&&(n=1),Math.random()>.5&&(i=1),{vX:Math.max(Math.random()*e,t)*n,vY:Math.max(Math.random()*e,t)*i}}function h(t){var e=t.target.getBoundingClientRect();return[t.clientX-e.x,t.clientY-e.y]}function b(t){if(0===t.button){var e=a(h(t),2),n=e[0],r=e[1];d.selectedImgEle?d.selectedBall=function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:d.radiusSizes.current,a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];try{var l=Number(t.dataset.index),c=new i.Ball(o.imageCache[l],e,n,r,a);return d.balls.push(c),d.count++,d.party&&(d.party.colourRef[c.id]=[Math.floor(Math.random()*d.rainBow.length),0]),c}catch(t){console.error(t)}}(d.selectedImgEle,n,r)||null:d.selectedBall=d.balls.find((function(t){return t.containsPoint(n,r)}))||null,d.selectedBall&&(d.selectedTime=(new Date).getTime(),d.selectedBall.selected=!0,d.selectedBall.velocity={vX:0,vY:0},d.selectedPositions.current={x:n,y:r},d.selectedPositions.prev={x:n,y:r},d.selectedPositions.reference={x:n,y:r})}}function w(t){if(d.selectedBall){var e=a(h(t),2),n=e[0],i=e[1],o=a(r.util.xyDiffBetweenPoints(d.selectedPositions.current,{x:n,y:i}),2),l=o[0],c=o[1];if(d.selectedBall.move(l,c),d.selectedPositions.current={x:n,y:i},r.util.distanceBetween2Points({x:n,y:i},d.selectedPositions.prev)>d.mouseMoveDistThreshold){var s=d.selectedPositions,u=s.reference,p=s.prev,v=s.current;(r.util.angleBetween3Points(u,p,v)||0)>d.selectedAngleThreshold&&(d.selectedPositions.reference={x:n,y:i},d.selectedTime=(new Date).getTime()),d.selectedPositions.prev={x:n,y:i}}}}function x(t){if(d.selectedBall){try{var e=a(h(t),2),n=e[0],i=e[1],o=a(r.util.xyDiffBetweenPoints(d.selectedPositions.reference,{x:n,y:i}),2),l=o[0],c=o[1],s=(new Date).getTime()-d.selectedTime;d.selectedBall.velocity.vX=l/s,d.selectedBall.velocity.vY=c/s}catch(t){d.selectedBall.position={x:50,y:50},console.error(t)}d.selectedBall.selected=!1,d.selectedBall=null}}function B(t){d.selectedBall&&(d.selectedBall.selected=!1,d.selectedBall.velocity={vX:0,vY:0},d.selectedBall=null)}},"./scripts/ball.ts":(t,e,n)=>{n.r(e),n.d(e,{Ball:()=>s});var i=n("./scripts/utility.ts");function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){c(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function l(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s=function(){function t(e,n,i,o){var r=arguments.length>4&&void 0!==arguments[4]&&arguments[4];a(this,t),this.id=t.baseId,this.position={x:n,y:i},this.prevPosition={x:n,y:i},this.radius=o,this.rotation=0,this.velocity={vX:0,vY:0},this.img=e,this.selected=r,t.baseId++}var e,n,o;return e=t,(n=[{key:"move",value:function(t,e){this.position.x+=t,this.position.y+=e}},{key:"reversePosition",value:function(t){if(0===this.getTotalVelocity());else{var e=-1*Math.sqrt(Math.pow(t,2)/(Math.pow(this.velocity.vX,2)+Math.pow(this.velocity.vY,2)));this.position.x+=this.velocity.vX*e,this.position.y+=this.velocity.vY*e}}},{key:"getTotalVelocity",value:function(){return Math.sqrt(Math.pow(this.velocity.vX,2)+Math.pow(this.velocity.vY,2))}},{key:"containsPoint",value:function(t,e){return Math.pow(t-this.position.x,2)+Math.pow(e-this.position.y,2)<=Math.pow(this.radius,2)}},{key:"getOverlap",value:function(t){var e=i.util.distanceBetween2Points(this.position,t.position),n=this.radius+t.radius-e;return n>=0?n:-1}},{key:"checkBallCollision",value:function(t){if(this.getOverlap(t)>=0){var e=i.util.xyDiffBetweenPoints(this.position,t.position);return(i.util.angleBetween2DVector(this.velocity.vX,this.velocity.vY,e[0],e[1])||0)<=90}return!1}},{key:"getCircle",value:function(){return r(r({},this.position),{},{r:this.radius})}}])&&l(e.prototype,n),o&&l(e,o),Object.defineProperty(e,"prototype",{writable:!1}),t}();c(s,"baseId",1)},"./scripts/images.ts":(t,e,n)=>{n.r(e),n.d(e,{addImage:()=>d,appendImgElemToContainer:()=>p,createImgEleWithIndex:()=>v,imageCache:()=>u,imageList:()=>l,imgContainerScrollUpDown:()=>m,scrollToImgElement:()=>f,setUpImages:()=>s,toggleSelectedImgElement:()=>y});var i=n("./scripts/app.ts"),o=n("./scripts/utility.ts");function r(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var l=["me.jpeg","grumpy.webp","smileface.webp","spongebob.webp","pepper.png"].map((function(t){return"https://raw.githubusercontent.com/seegg/bounce/main/images/"+t})).concat([]),c=document.getElementById("bounce-img-container"),s=function(){var t;c=document.getElementById("bounce-img-container"),null===(t=document.getElementById("ball-scroll-controls"))||void 0===t||t.addEventListener("pointerdown",m)},u=[];function d(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:c,r=["bounce-img-thumb","grayscale"],a=document.createElement("img");return a.classList.add("bounce-img-thumb"),a.src="images/spinner.gif",null==i||i.appendChild(a),o.util.createCircleImg(t,n).then((function(n){var i=e.push(n)-1;return v(t,i,r)})).then((function(t){if(null===i)throw new Error("image container is null");p(t,i,a)})).catch((function(t){null==i||i.removeChild(a),console.error(t)}))}function p(t,e,n){n?e.replaceChild(t,n):e.append(t)}function v(t,e,n){var i,o=document.createElement("img");return(i=o.classList).add.apply(i,r(n)),o.onclick=function(t){y(t.target)},o.setAttribute("data-index",e+""),o.onload=function(){URL.revokeObjectURL(t)},o.src=t,o}function y(t){var e,n="grayscale";null===(e=i.appProps.selectedImgEle)||void 0===e||e.classList.toggle(n),t===i.appProps.selectedImgEle?i.appProps.selectedImgEle=null:(t.classList.toggle(n),i.appProps.selectedImgEle=t),f(t)}function f(t){var e=document.getElementById("bounce-img-container"),n=t.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scroll(0,n)}function m(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:48;t.preventDefault();var i=e.scrollTop%n;switch(t.target.id){case"img-up":e.scroll(0,0===i?e.scrollTop-n:e.scrollTop-i);break;case"img-down":e.scroll(0,e.scrollTop+n-i)}}},"./scripts/modal.ts":(t,e,n)=>{n.r(e),n.d(e,{addModal:()=>a,modalInit:()=>r});var i=n("./scripts/app.ts"),o=n("./scripts/images.ts"),r=function(){var t,e,n,r,a={modal:document.getElementById("modal"),overlay:document.getElementById("modal-overlay"),openButton:document.getElementById("image-upload-btn"),toggle:function(){var t,e;null===(t=a.modal)||void 0===t||t.classList.toggle("close"),null===(e=a.overlay)||void 0===e||e.classList.toggle("close")}},l={form:document.getElementById("image-upload-form"),okButton:document.getElementById("form-ok-btn"),imgFileInput:document.getElementById("img-file"),imgURLInput:document.getElementById("img-URL"),imgFileDisplay:document.getElementById("file-name"),imgFileDisplayButton:document.getElementById("upload-button"),cancelButton:document.getElementById("form-cancel-btn"),handleFileDisplayClick:function(t){t.preventDefault(),l.imgFileInput.click()},handleFileChange:function(){var t,e;l.imgFileDisplay.value=(null===(t=l.imgFileInput.files)||void 0===t||null===(e=t.item(0))||void 0===e?void 0:e.name)||"No Image Selected"},handleSubmit:function(t){var e;t.preventDefault();var n="";if(null!==(e=l.imgFileInput.files)&&void 0!==e&&e.item(0))try{n=URL.createObjectURL(l.imgFileInput.files[0])}catch(t){console.error(t)}else n=l.imgURLInput.value;(0,o.addImage)(n,o.imageCache,i.appProps.radiusSizes.current).then((function(t){console.log("whatever"),a.toggle()})).catch((function(t){console.log("something")}))},handleCancel:function(t){l.imgURLInput.value="",l.imgFileInput.value="",l.imgFileDisplay.value="",a.toggle()}};null===(t=a.overlay)||void 0===t||t.addEventListener("click",a.toggle),null===(e=a.openButton)||void 0===e||e.addEventListener("click",a.toggle),null===(n=l.form)||void 0===n||n.addEventListener("submit",l.handleSubmit),l.imgFileDisplayButton.addEventListener("click",l.handleFileDisplayClick),l.imgFileInput.addEventListener("change",l.handleFileChange),null===(r=l.cancelButton)||void 0===r||r.addEventListener("click",l.handleCancel),document.addEventListener("keydown",(function(t){var e;null!==(e=a.modal)&&void 0!==e&&e.classList.contains("close")||"Escape"===t.key&&a.toggle()}))},a=function(){var t=document.createElement("div");t.innerHTML='<div class="modal-overlay close" id="modal-overlay"></div>';var e=document.createElement("section");e.id="modal",e.classList.add("upload-modal","close"),e.innerHTML='<form id="image-upload-form" class="upload-form"><h2 class="-bounce-title">Upload Image</h2><input class="bounce-input" hidden type="file" id="img-file" name="imgFile" accept="image/*"><section class="img-upload"><label for="fileName" class="font-bold">Image File:</label><section class="img-file-display"><input class="bounce-input" readonly type="text" name="fileName" placeholder="No file selected"id="file-name"><button type="button" class="btn-file bounce-button" id="upload-button">Select Image</button></section></section><section class="img-upload"><label for="imgUrl" class="font-bold">Image URL:</label><section><input class="bounce-input" type="text" name="imgURL" id="img-URL" placeholder="Image URL"></section></section><section class="upload-controls"><button type="submit" class="mx-1 bounce-button btn-ctrl" id="form-ok-btn"><span class="material-icons">check</span></button><button type="button" class="mx-1 bounce-button btn-ctrl" id="form-cancel-btn"><span class="material-icons">close</span></button></section></form>';var n=new DocumentFragment;return n.append(e,t),n}},"./scripts/utility.ts":(t,e,n)=>{function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var i,o,r=[],a=!0,l=!1;try{for(n=n.call(t);!(a=(i=n.next()).done)&&(r.push(i.value),!e||r.length!==e);a=!0);}catch(t){l=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(l)throw o}}return r}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return l(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function c(t,e,n,i,o,r,a,l,c,s){var u=c&&s?2*s/(c+s):1,d=t-o,p=e-r,v=(d*(n-a)+p*(i-l))/(Math.pow(d,2)+Math.pow(p,2))*u;return{vX:n-v*d,vY:i-v*p}}function s(t,e){return[e.x-t.x,e.y-t.y]}function u(t,e){var n=document.createElement("canvas");n.height=t.height,n.width=t.width;var i=n.getContext("2d");i.drawImage(t,0,0,n.width,n.height);for(var o=t.width/e.w,r=t.height/e.h,a=Math.ceil(Math.log(o>=r?r:o)/Math.log(2)),l=document.createElement("canvas"),c=l.getContext("2d"),s=1;s<a;s++)l.width=n.width/2,l.height=n.height/2,c.drawImage(n,0,0,l.width,l.height),n.width=l.width,n.height=l.height,i.drawImage(l,0,0);return l.width=e.w,l.height=e.h,c.drawImage(n,0,0,l.width,l.height),l}function d(t,e){var n=a(s(t,e),2),i=n[0],o=n[1];return Math.sqrt(Math.pow(i,2)+Math.pow(o,2))}function p(t,e,n,i){var o=t*n+e*i,r=Math.sqrt(Math.pow(t,2)+Math.pow(e,2)),a=Math.sqrt(Math.pow(n,2)+Math.pow(i,2));return Math.acos(o/(r*a))*(180/Math.PI)}function v(t,e,n){var i={x:t.x-n.x,y:t.y-n.y},r={x:e.x-n.x,y:e.y-n.y},a=r.x-i.x,l=r.y-i.y,c=d(i,r),s=i.x*r.y-r.x*i.y,u=l<0?-1:1,p=Math.pow(n.r,2),v=Math.pow(c,2),y=p*v-Math.pow(s,2),f=y<0?0:0===y?1:2;if(y<0)return[f,null,null];var m=Math.sqrt(y),g=(s*l+u*a*m)/v+n.x,h=(-1*s*a+Math.abs(l)*m)/v+n.y,b=(s*l-u*a*m)/v+n.x,w=(-1*s*a-Math.abs(l)*m)/v+n.y,x={x:g,y:h},B={x:b,y:w};return(g>b||g===b&&h>w)&&(B=o({},x),x={x:b,y:w}),[f,x,0===y?null:B]}n.r(e),n.d(e,{util:()=>y});var y={calculateCollisionVelocity:c,createCircleImg:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"white",i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3;return new Promise((function(o,r){var a=document.createElement("canvas"),l=2*e;a.width=l,a.height=l;var c=document.createElement("img");c.src=t,c.onload=function(){var t=c.width/l,r=c.height/l;t>=r?a.width=Math.floor(c.width/r):a.height=Math.floor(c.height/t);var s=u(c,{w:l,h:l}),d=a.getContext("2d");if(null===d)throw new Error("context2D is null");d.drawImage(s,0,0,a.width,a.height),d.beginPath(),d.arc(a.width/2,a.height/2,e,0,2*Math.PI),d.closePath(),d.lineWidth=i,d.strokeStyle=n,d.stroke(),d.globalCompositeOperation="destination-in",d.arc(a.width/2,a.height/2,e,0,2*Math.PI),d.fill(),o(createImageBitmap(a,a.width/2-e,a.height/2-e,l,l))},c.onerror=r}))},convertBmpToBlob:function(t){return new Promise((function(e,n){var i=document.createElement("canvas");i.width=t.width,i.height=t.height;var o,r=i.getContext("bitmaprenderer");r?r.transferFromImageBitmap(t):null===(o=i.getContext("2d"))||void 0===o||o.drawImage(t,0,0);i.toBlob((function(t){null===t&&n("Blob is null"),e(t)}))}))},getBallCollisionVelocity:function(t,e){return c(t.position.x,t.position.y,t.velocity.vX,t.velocity.vY,e.position.x,e.position.y,e.velocity.vX,e.velocity.vY)},xyDiffBetweenPoints:s,angleBetween2DVector:p,angleBetween3Points:function(t,e,n){return p(e.x-t.x,e.y-t.y,n.x-e.x,n.y-e.y)},distanceBetween2Points:d,circleLineIntersect:v,maxIntersectHeight:function(t,e){var n=d({x:t.x,y:t.y},{x:e.x,y:e.y}),i=n-t.r-e.r;if(i>=0)return 0;var r=(t.r+.5*i)/n,l={x:(1-r)*t.x+r*e.x,y:(1-r)*t.y+r*e.y},c=o(o({},l),{},{y:l.y+1}),s=a(v(l,c,t),3),u=(s[0],s[1]),p=s[2],y=a(v(l,c,e),3),f=(y[0],y[1]),m=y[2],g=[u.y,p.y,f.y,m.y].sort();return g[2]-g[1]},maxIntersectWidth:function(t,e){var n=d({x:t.x,y:t.y},{x:e.x,y:e.y}),i=n-t.r-e.r;if(i>=0)return 0;var r=(t.r+.5*i)/n,l={x:(1-r)*t.x+r*e.x,y:(1-r)*t.y+r*e.y},c=o(o({},l),{},{x:l.x+1}),s=a(v(l,c,t),3),u=(s[0],s[1]),p=s[2],y=a(v(l,c,e),3),f=(y[0],y[1]),m=y[2],g=[u.x,p.x,f.x,m.x].sort();return g[2]-g[1]}}}},e={};function n(i){var o=e[i];if(void 0!==o)return o.exports;var r=e[i]={exports:{}};return t[i](r,r.exports,n),r.exports}n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var i={};(()=>{n.r(i);var t=n("./scripts/app.ts"),e=n("./scripts/images.ts"),o=n("./scripts/modal.ts");(0,n("./scripts/add-controls.ts").insertBounceElements)(),(0,e.setUpImages)(),(0,o.modalInit)(),(0,t.init)()})()})();
//# sourceMappingURL=main.bundle.js.map