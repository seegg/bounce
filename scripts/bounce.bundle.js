/*! For license information please see bounce.bundle.js.LICENSE.txt */
(()=>{"use strict";var t={"./scripts/add-controls.ts":(t,e,n)=>{n.r(e),n.d(e,{insertBounceElements:()=>o});var i=n("./scripts/modal.ts"),o=function(){var t=document.querySelector(".bounce-app")||document.querySelector(".intro"),e=document.createElement("section");e.id="bounce",e.classList.add("bounce-container"),e.innerHTML='<section id="app-controls" class="controls">\x3c!-- Thumbnail container --\x3e<section id="ball-select" class="balls-container"><section id="ball-scroll-controls" class="btn-scroll-container"><button id="img-up" class="btn-scroll bounce-button">&#9650;</button><button id="img-down" class="btn-scroll bounce-button">&#9660;</button></section><section id="bounce-img-container" class="bounce-img-container"></section></section>\x3c!-- Button controls --\x3e<section id="button-controls" class="btn-container"><button id="image-upload-btn" class="btn-ctrl bounce-button"><span class="material-icons">add_photo_alternate</span></button><button id="party-btn" class="btn-ctrl bounce-button"><span class="material-icons">celebration</span></button><button id="gravity-btn" class="btn-ctrl btn-gravity bounce-button">G</button></section></section>';var n=document.createElement("section");n.classList.add("canvas-container"),n.innerHTML='<canvas id="canvas" class="bounce-canvas">Your browser doesn\'t support canvas.</canvas><section class="canvas-instructions"><span class="material-icons md-light">help</span><section class="instructions-container anim-fadein close"><h3>With no image icons selected</h3><ul><li>Click on a ball to select it.</li><li>Click and hold on the canvas to create zones that repel and attract.</li></ul><h3>With an image icon selected</h3><ul><li>Click and fling pointer on the canvas to create a new ball with the desired velocity.</li></ul><h3>Buttons</h3><ul><li>Upload and link your own images for balls</li><li>Party(see the rainbow)</li><li>Toggle gravity</li></section></section>';var o=(0,i.addModal)();e.append(n,o);var r=n.querySelector(".canvas-instructions"),a=function(){var t,e,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(null!==n)return null==r||r.classList[n?"add":"remove"]("instructions-active"),void(null==r||null===(e=r.querySelector(".instructions-container"))||void 0===e||e.classList[n?"remove":"add"]("close"));null==r||r.classList.toggle("instructions-active"),null==r||null===(t=r.querySelector(".instructions-container"))||void 0===t||t.classList.toggle("close")};null==r||r.addEventListener("click",(function(){a()})),document.addEventListener("keydown",(function(t){"Escape"===t.code&&a(!1)})),null==t||t.append(e)}},"./scripts/app.ts":(t,e,n)=>{n.r(e),n.d(e,{appProps:()=>g,init:()=>p});var i=n("./scripts/ball.ts"),o=n("./scripts/images.ts"),r=n("./scripts/utility.ts");function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var i,o,r=[],a=!0,l=!1;try{for(n=n.call(t);!(a=(i=n.next()).done)&&(r.push(i.value),!e||r.length!==e);a=!0);}catch(t){l=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(l)throw o}}return r}(t,e)||d(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){s(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function u(t){return function(t){if(Array.isArray(t))return v(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||d(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(t,e){if(t){if("string"==typeof t)return v(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(t,e):void 0}}function v(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var g={count:0,isRunning:!0,isRunningW:!0,isSucking:!1,isBlowing:!1,suckingArr:[],currentSuckingDistance:50,maxSuckingDistance:500,suckingPosition:{x:0,y:0},suckingPower:.2,lesserSuckingPower:.1,radiusSizes:{s:40,m:40,l:50,current:50},screenBreakPoints:{l:1280,m:768},gravity:{value:.01,isOn:!1,btn:document.getElementById("gravity-btn")},balls:[],selectedImgEle:null,selectedBall:null,selectedPositions:{prev:{x:0,y:0},current:{x:0,y:0},reference:{x:0,y:0}},selectedAngleThreshold:10,mouseMoveDistThreshold:10,velocityThreshould:.05,overlapThreshold:.05,wallModifiers:{left:1,right:1,top:1,bottom:1},currentTime:0,selectedTime:0,deceleration:.995,canvas:document.getElementById("canvas"),canvasHorizontalGap:10,canvasTopOffset:70,party:{isActive:!1,start:0,duration:1e4,maxVelocity:2,minVelocity:.5,wallModRef:{left:1.1,right:1.1,top:1,bottom:1.8},gravityRef:!1,colourRef:[],partyBtn:document.getElementById("party-btn")},rainBow:["#ff0000","#ffa500","#ffff00","#008000","#0000ff","#4b0082","#ee82ee"],latestFrame:0};function p(){g.canvas=document.getElementById("canvas"),g.gravity.btn=document.getElementById("gravity-btn"),g.party.partyBtn=document.getElementById("party-btn"),function(){var t,e;window.onresize=function(){f(),window.innerWidth<570&&document.querySelector(".intro")?g.isRunningW&&b():g.isRunningW||b()},g.canvas.addEventListener("pointerdown",S),g.canvas.addEventListener("pointermove",O),g.canvas.addEventListener("pointerup",k),g.canvas.addEventListener("pointerleave",L),g.canvas.addEventListener("contextmenu",(function(t){t.preventDefault(),function(t){var e=a(E(t),2),n=e[0],i=e[1],o=g.balls.findIndex((function(t){return t.containsPoint(n,i)}));o>=0&&function(t){try{g.balls.splice(t,1)}catch(t){console.error(t)}}(o)}(t)})),g.canvas.addEventListener("touchstart",(function(t){t.preventDefault()}));var n=document.getElementById("gravity-btn");null==n||n.addEventListener("click",(function(){g.party.isActive||(g.gravity.isOn=!g.gravity.isOn,m(g.gravity.isOn))})),null===(t=document.getElementById("party-btn"))||void 0===t||t.addEventListener("click",(function(){!function(){var t;if(g.party.start=(new Date).getTime(),null===(t=document.getElementById("party-btn"))||void 0===t||t.classList.add("btn-progress-bar"),g.party.isActive)return void g.balls.forEach((function(t){t.velocity=M()}));g.party.gravityRef=g.gravity.isOn,g.gravity.isOn&&m(g.gravity.isOn);g.gravity.isOn=!1,g.party.isActive=!0,g.balls.forEach((function(t){g.party.colourRef[t.id]=[Math.floor(Math.random()*g.rainBow.length),0],t.velocity=M()}))}()}));var i=null===(e=document.querySelector(".bounce-container"))||void 0===e?void 0:e.parentElement;new IntersectionObserver((function(t){t[0].isIntersecting?(null==i||i.children[0].classList.remove("bounce-hide"),g.isRunning||h()):(null==i||i.children[0].classList.add("bounce-hide"),g.isRunning&&h())}),{rootMargin:"0px",threshold:.5}).observe(i)}(),f(),localStorage.getItem("ballImgSrcs")&&o.imageList.push.apply(o.imageList,u(localStorage.getItem("ballImgSrcs").split(","))),Promise.all(o.imageList.map((function(t){return(0,o.addImage)(t,o.imageCache,50)}))).then((function(t){y(),g.currentTime=(new Date).getTime(),w()}))}var y=function(){for(var t=Math.ceil(3*Math.random())+2,e=0;e<t;e++){var n=new i.Ball(o.imageCache[Math.floor(Math.random()*o.imageCache.length)],Math.random()*g.canvas.width,Math.random()*g.canvas.height,g.radiusSizes.current);n.velocity.vX=.5*Math.random(),n.velocity.vY=.5*Math.random(),g.balls.push(n)}};function m(t){var e,n;t?null===(e=g.gravity.btn)||void 0===e||e.classList.add("bounce-selected"):null===(n=g.gravity.btn)||void 0===n||n.classList.remove("bounce-selected");if(g.gravity.isOn){var i=g.party.wallModRef;g.party.wallModRef=c({},g.wallModifiers),g.wallModifiers=c({},i)}else{var o=g.wallModifiers;g.wallModifiers=c({},g.party.wallModRef),g.party.wallModRef=c({},o)}}function f(){try{if(null===g.canvas)throw new Error("canvas is null");var t=window.innerWidth-10,e=window.innerHeight-20;t<g.screenBreakPoints.m?g.radiusSizes.current=g.radiusSizes.s:t<g.screenBreakPoints.l?g.radiusSizes.current=g.radiusSizes.m:g.radiusSizes.current=g.radiusSizes.l,g.canvas.width=t-g.canvasHorizontalGap,g.canvas.height=e-g.canvasTopOffset,g.balls.forEach((function(t){return t.radius=g.radiusSizes.current}))}catch(t){console.error(t)}}function h(){g.isRunning=!g.isRunning,g.isRunning&&g.isRunningW&&(g.currentTime=(new Date).getTime(),w())}function b(){g.isRunningW=!g.isRunningW,g.isRunning&&g.isRunningW&&(g.currentTime=(new Date).getTime(),w())}function w(){var t,e,n,i,o=g.canvas.getContext("2d"),l=(new Date).getTime()-g.currentTime;if(g.currentTime=(new Date).getTime(),g.party.isActive){o.fillStyle="rgba(1, 1, 1, 0.1)",o.fillRect(0,0,g.canvas.width,g.canvas.height);var s=(new Date).getTime()-g.party.start,u=s/g.party.duration*100;s>g.party.duration?(u=0,g.party.isActive=!1,g.gravity.isOn!=g.party.gravityRef&&m(g.party.gravityRef),g.gravity.isOn=g.party.gravityRef,g.party.colourRef=[]):g.party.colourRef.forEach((function(t,e){g.party.colourRef[e]=[t[0],s]})),t=g.party.partyBtn,e=u,t.style.backgroundPosition="".concat(e,"% 100%")}else o.clearRect(0,0,g.canvas.width,g.canvas.height);g.isSucking&&(g.currentSuckingDistance<g.maxSuckingDistance&&(g.currentSuckingDistance=Math.min(g.maxSuckingDistance,g.currentSuckingDistance+5)),x(o,g.suckingPosition.x,g.suckingPosition.y,g.currentSuckingDistance-g.radiusSizes.current,g.isBlowing,g.party.isActive)),g.suckingArr.forEach((function(t){x(o,t.pos.x,t.pos.y,t.curr-g.radiusSizes.current,t.isBlow,g.party.isActive)})),g.balls.forEach((function(t){t.selected||B(o,t),function(t,e){var n=t.position,i=t.selected,o=t.velocity;if(!i){t.prevPosition=c({},n);var l=g.gravity.value/3;Math.abs(t.velocity.vX)<l&&(t.velocity.vX=0),Math.abs(t.velocity.vY)<l&&(t.velocity.vY=0),g.gravity.isOn&&(o.vY+=g.gravity.value);var s=o.vX*e;n.x+=s,n.y+=o.vY*e,g.gravity.isOn&&(o.vX*=g.deceleration),function(t){var e=[];if(g.balls.forEach((function(n){t.id===n.id||n.selected||t.getOverlap(n)>g.overlapThreshold&&e.push(n)})),e.length>0){e.sort((function(e,n){return r.util.distanceBetween2Points(t.position,e.position)-r.util.distanceBetween2Points(t.position,n.position)})),t.reversePosition(t.getOverlap(e[0]));var n=a(function(t,e){var n=c({},t.velocity),i=c({},e.velocity);t.checkBallCollision(e)&&(n=r.util.getBallCollisionVelocity(t,e),i=r.util.getBallCollisionVelocity(e,t));return[n,i]}(t,e[0]),2),i=n[0],o=n[1];t.velocity=i,e[0].velocity=o}e=[]}(t),function(t){var e=t.position,n=t.radius,i=t.velocity,o=g.canvas,r=g.wallModifiers;e.x+n>o.width&&(e.x=o.width-n,i.vX<0||(t.velocity.vX*=-1/r.right),Math.abs(i.vX)<.05&&(i.vX=0));e.x-n<0&&(e.x=n,i.vX>0||(t.velocity.vX*=-1/r.left),Math.abs(i.vX)<.05&&(i.vX=0));e.y+n>o.height&&(e.y=o.height-n,i.vY<0||(t.velocity.vY*=-1/r.bottom),Math.abs(i.vY)<.05&&(i.vY=0));e.y-n<0&&(e.y=n,i.vY>0||(t.velocity.vY*=-1/r.top))}(t),g.isSucking&&P(t,g.suckingPosition.x,g.suckingPosition.y,g.currentSuckingDistance,g.suckingPower,g.isBlowing),function(t){g.suckingArr.forEach((function(e){P(t,e.pos.x,e.pos.y,e.curr,g.lesserSuckingPower,e.isBlow)}))}(t)}}(t,l)})),n=g.balls,i=function(t){var e=[];return t.forEach((function(t){var n=e.findIndex((function(e){return t.position.y>e.position.y||t.position.y===e.position.y&&t.position.x<e.position.x}));-1===n?e.push(t):e.splice(n,0,t)})),e}(n),i.forEach((function(t){!t.selected&&i.forEach((function(e){if(!e.selected){var n=t.getOverlap(e);if(!(n<g.overlapThreshold)){var i=t.position.y-e.position.y;if(t.id!==e.id&&n>.03){var o=a(r.util.xyDiffBetweenPoints(t.position,e.position),2),l=o[0],c=o[1],s=Math.abs(l)+Math.abs(c),u=l/s*n,d=c/s*n;0===i?(t.position.x-=.5*n,e.position.x+=.5*n):i>0?(e.position.x+=u,e.position.y+=d):(t.position.x+=u,t.position.y+=d)}}}}))})),g.balls.forEach((function(t){t.selected||(t.rotation+=function(t){var e=2*Math.PI*t.radius;return(t.position.x-t.prevPosition.x)/e*360}(t))})),B(o,g.selectedBall),g.isRunning&&g.isRunningW?g.latestFrame=window.requestAnimationFrame((function(){w()})):window.cancelAnimationFrame(g.latestFrame),g.suckingArr.forEach((function(t){t.curr-=.1})),g.suckingArr=g.suckingArr.filter((function(t){return t.curr>=g.radiusSizes.current}))}var x=function(t,e,n,i,o,r){var a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:.05,l=i*a;I(t,e,n,i-l+Math.random()*l,o,r),I(t,e,n,i-l+Math.random()*l,o,r)},I=function(t,e,n,i,o,r){var a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:2,l=arguments.length>7&&void 0!==arguments[7]?arguments[7]:"rgba(255, 235, 205, 0.3)";i<=0||(o&&(l="rgba(238, 35, 35, 0.3)"),t.beginPath(),t.arc(e,n,i,0,2*Math.PI),r?(t.lineWidth=a,t.strokeStyle=l,t.stroke()):(t.fillStyle=l,t.fill()))};function P(t,e,n,i,o,a){var l=r.util.distanceBetween2Points({x:e,y:n},t.position);if(l<=i){var c=(i-l)/i*o;l<t.radius/2&&(t.velocity.vX*=.95,t.velocity.vY*=.95),a&&(c*=-1),t.position.x>e?t.velocity.vX-=c:t.position.x<e&&(t.velocity.vX+=c),t.position.y>n?t.velocity.vY-=c:t.position.y<n&&(t.velocity.vY+=c)}}function B(t,e){if(null!==e){var n=e.id,i=e.position,o=e.radius,r=e.selected,a=e.rotation,l=e.img;t.save(),t.translate(i.x,i.y),t.rotate(Math.PI/180*a),t.drawImage(l,-o,-o,2*o,2*o),g.party.isActive&&(t.lineWidth=Math.round(o/10)+1,t.strokeStyle=g.rainBow[(g.party.colourRef[n][0]+Math.floor(g.party.colourRef[n][1]/1e3))%g.rainBow.length],t.beginPath(),t.arc(0,0,o,0,2*Math.PI),t.stroke()),r&&(t.lineWidth=4,t.strokeStyle="cyan",t.beginPath(),t.arc(0,0,o,0,2*Math.PI),t.stroke()),t.restore()}}function M(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:g.party.maxVelocity,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g.party.minVelocity,n=-1,i=-1;return Math.random()<.5&&(n=1),Math.random()<.5&&(i=1),{vX:Math.max(Math.random()*e,t)*n,vY:Math.max(Math.random()*e,t)*i}}function E(t){var e=t.target.getBoundingClientRect();return[t.clientX-e.x,t.clientY-e.y]}function S(t){if(0===t.button){var e=a(E(t),2),n=e[0],r=e[1];if(g.selectedImgEle?g.selectedBall=function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:g.radiusSizes.current,a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];try{var l=Number(t.dataset.index),c=new i.Ball(o.imageCache[l],e,n,r,a);return g.balls.push(c),g.count++,g.party&&(g.party.colourRef[c.id]=[Math.floor(Math.random()*g.rainBow.length),0]),c}catch(t){console.error(t)}}(g.selectedImgEle,n,r)||null:g.selectedBall=g.balls.find((function(t){return t.containsPoint(n,r)}))||null,g.selectedBall)g.selectedTime=(new Date).getTime(),g.selectedBall.selected=!0,g.selectedBall.velocity={vX:0,vY:0},g.selectedPositions.current={x:n,y:r},g.selectedPositions.prev={x:n,y:r},g.selectedPositions.reference={x:n,y:r};else{g.isSucking=!0,Math.random()<.5&&(g.isBlowing=!0);var l=[n,r];g.suckingPosition.x=l[0],g.suckingPosition.y=l[1]}}}function O(t){if(g.selectedBall||g.isSucking){var e=a(E(t),2),n=e[0],i=e[1];if(g.selectedBall){var o=a(r.util.xyDiffBetweenPoints(g.selectedPositions.current,{x:n,y:i}),2),l=o[0],c=o[1];if(g.selectedBall.move(l,c),g.selectedPositions.current={x:n,y:i},r.util.distanceBetween2Points({x:n,y:i},g.selectedPositions.prev)>g.mouseMoveDistThreshold){var s=g.selectedPositions,u=s.reference,d=s.prev,v=s.current;(r.util.angleBetween3Points(u,d,v)||0)>g.selectedAngleThreshold&&(g.selectedPositions.reference={x:n,y:i},g.selectedTime=(new Date).getTime()),g.selectedPositions.prev={x:n,y:i}}}g.isSucking&&(g.suckingPosition={x:n,y:i})}}function k(t){if(g.selectedBall){try{var e=a(E(t),2),n=e[0],i=e[1],o=a(r.util.xyDiffBetweenPoints(g.selectedPositions.reference,{x:n,y:i}),2),l=o[0],c=o[1],s=(new Date).getTime()-g.selectedTime;g.selectedBall.velocity.vX=l/s,g.selectedBall.velocity.vY=c/s}catch(t){g.selectedBall.position={x:50,y:50},console.error(t)}g.selectedBall.selected=!1,g.selectedBall=null}g.isSucking&&D()}function L(t){g.selectedBall&&(g.selectedBall.selected=!1,g.selectedBall.velocity={vX:0,vY:0},g.selectedBall=null),g.isSucking&&D()}function D(){var t=g.suckingPosition,e=g.currentSuckingDistance;g.suckingArr.push({pos:c({},t),curr:e,isBlow:g.isBlowing}),g.isSucking=!1,g.isBlowing=!1,g.currentSuckingDistance=g.radiusSizes.current}},"./scripts/ball.ts":(t,e,n)=>{n.r(e),n.d(e,{Ball:()=>s});var i=n("./scripts/utility.ts");function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){c(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function l(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s=function(){function t(e,n,i,o){var r=arguments.length>4&&void 0!==arguments[4]&&arguments[4];a(this,t),this.id=t.baseId,this.position={x:n,y:i},this.prevPosition={x:n,y:i},this.radius=o,this.rotation=0,this.velocity={vX:0,vY:0},this.img=e,this.selected=r,t.baseId++}var e,n,o;return e=t,(n=[{key:"move",value:function(t,e){this.position.x+=t,this.position.y+=e}},{key:"reversePosition",value:function(t){if(0===this.getTotalVelocity());else{var e=-1*Math.sqrt(Math.pow(t,2)/(Math.pow(this.velocity.vX,2)+Math.pow(this.velocity.vY,2)));this.position.x+=this.velocity.vX*e,this.position.y+=this.velocity.vY*e}}},{key:"getTotalVelocity",value:function(){return Math.sqrt(Math.pow(this.velocity.vX,2)+Math.pow(this.velocity.vY,2))}},{key:"containsPoint",value:function(t,e){return Math.pow(t-this.position.x,2)+Math.pow(e-this.position.y,2)<=Math.pow(this.radius,2)}},{key:"getOverlap",value:function(t){var e=i.util.distanceBetween2Points(this.position,t.position),n=this.radius+t.radius-e;return n>=0?n:-1}},{key:"checkBallCollision",value:function(t){if(this.getOverlap(t)>=0){var e=i.util.xyDiffBetweenPoints(this.position,t.position);return(i.util.angleBetween2DVector(this.velocity.vX,this.velocity.vY,e[0],e[1])||0)<=90}return!1}},{key:"getCircle",value:function(){return r(r({},this.position),{},{r:this.radius})}}])&&l(e.prototype,n),o&&l(e,o),Object.defineProperty(e,"prototype",{writable:!1}),t}();c(s,"baseId",1)},"./scripts/images.ts":(t,e,n)=>{n.r(e),n.d(e,{addImage:()=>d,appendImgElemToContainer:()=>v,createImgEleWithIndex:()=>g,imageCache:()=>u,imageList:()=>l,imgContainerScrollUpDown:()=>m,scrollToImgElement:()=>y,setUpImages:()=>s,toggleSelectedImgElement:()=>p});var i=n("./scripts/app.ts"),o=n("./scripts/utility.ts");function r(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var l=["me.jpeg","grumpy.webp","smileface.webp","spongebob.webp","pepper.png"].map((function(t){return"https://raw.githubusercontent.com/seegg/bounce/main/images/"+t})).concat(["https://raw.githubusercontent.com/seegg/seegg.github.io/main/public/images/crow.png"]),c=document.getElementById("bounce-img-container"),s=function(){var t;c=document.getElementById("bounce-img-container"),null===(t=document.getElementById("ball-scroll-controls"))||void 0===t||t.addEventListener("pointerdown",m)},u=[];function d(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:c,r=["bounce-img-thumb","grayscale"],a=document.createElement("img");return a.classList.add("bounce-img-thumb"),a.src="https://raw.githubusercontent.com/seegg/bounce/main/images/spinner.gif",null==i||i.appendChild(a),o.util.createCircleImg(t,n).then((function(n){var i=e.push(n)-1;return g(t,i,r)})).then((function(t){if(null===i)throw new Error("image container is null");v(t,i,a)})).catch((function(t){throw null==i||i.removeChild(a),console.error(t),t}))}function v(t,e,n){n?e.replaceChild(t,n):e.append(t)}function g(t,e,n){var i,o=document.createElement("img");return(i=o.classList).add.apply(i,r(n)),o.onclick=function(t){p(t.target)},o.setAttribute("data-index",e+""),o.onload=function(){URL.revokeObjectURL(t)},o.src=t,o}function p(t){var e,n="grayscale";null===(e=i.appProps.selectedImgEle)||void 0===e||e.classList.toggle(n),t===i.appProps.selectedImgEle?i.appProps.selectedImgEle=null:(t.classList.toggle(n),i.appProps.selectedImgEle=t),y(t)}function y(t){var e=document.getElementById("bounce-img-container"),n=t.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scroll(0,n)}function m(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:48;t.preventDefault();var i=e.scrollTop%n;switch(t.target.id){case"img-up":e.scroll(0,0===i?e.scrollTop-n:e.scrollTop-i);break;case"img-down":e.scroll(0,e.scrollTop+n-i)}}},"./scripts/modal.ts":(t,e,n)=>{n.r(e),n.d(e,{addModal:()=>a,modalInit:()=>r});var i=n("./scripts/app.ts"),o=n("./scripts/images.ts"),r=function(){var t,e,n,r,a={modal:document.getElementById("modal"),overlay:document.getElementById("modal-overlay"),openButton:document.getElementById("image-upload-btn"),toggle:function(){var t,e;null===(t=a.modal)||void 0===t||t.classList.toggle("close"),null===(e=a.overlay)||void 0===e||e.classList.toggle("close"),l.imgFileInput.value="",l.imgURLInput.value="",l.imgFileDisplay.value=""}},l={form:document.getElementById("image-upload-form"),okButton:document.getElementById("form-ok-btn"),imgFileInput:document.getElementById("img-file"),imgURLInput:document.getElementById("img-URL"),imgFileDisplay:document.getElementById("file-name"),imgFileDisplayButton:document.getElementById("upload-button"),cancelButton:document.getElementById("form-cancel-btn"),handleFileDisplayClick:function(t){t.preventDefault(),l.imgFileInput.click()},handleFileChange:function(){var t,e;l.imgFileDisplay.value=(null===(t=l.imgFileInput.files)||void 0===t||null===(e=t.item(0))||void 0===e?void 0:e.name)||"No Image Selected"},handleSubmit:function(t){var e;t.preventDefault();var n="",r=!1;if(null!==(e=l.imgFileInput.files)&&void 0!==e&&e.item(0))try{n=URL.createObjectURL(l.imgFileInput.files[0])}catch(t){console.error(t)}else n=l.imgURLInput.value,r=!0;(0,o.addImage)(n,o.imageCache,i.appProps.radiusSizes.current).then((function(t){if(r){var e="ballImgSrcs",i="";localStorage.getItem(e)&&(i=localStorage.getItem(e)),i.split(",").includes(n)||(localStorage.getItem(e)?i+=",".concat(n):i=n,localStorage.setItem(e,i))}a.toggle()})).catch((function(t){console.log("something")}))},handleCancel:function(t){l.imgURLInput.value="",l.imgFileInput.value="",l.imgFileDisplay.value="",a.toggle()}};null===(t=a.overlay)||void 0===t||t.addEventListener("click",a.toggle),null===(e=a.openButton)||void 0===e||e.addEventListener("click",a.toggle),null===(n=l.form)||void 0===n||n.addEventListener("submit",l.handleSubmit),l.imgFileDisplayButton.addEventListener("click",l.handleFileDisplayClick),l.imgFileInput.addEventListener("change",l.handleFileChange),null===(r=l.cancelButton)||void 0===r||r.addEventListener("click",l.handleCancel),document.addEventListener("keydown",(function(t){var e;null!==(e=a.modal)&&void 0!==e&&e.classList.contains("close")||"Escape"===t.key&&a.toggle()}))},a=function(){var t=document.createElement("div");t.innerHTML='<div class="modal-overlay close" id="modal-overlay"></div>';var e=document.createElement("section");e.id="modal",e.classList.add("upload-modal","close"),e.innerHTML='<form id="image-upload-form" class="upload-form"><h2 class="bounce-title">Upload Image</h2><input class="bounce-input" hidden type="file" id="img-file" name="imgFile" accept="image/*"><section class="img-upload"><label for="fileName" class="font-bold">Image File:</label><section class="img-file-display"><input class="bounce-input" readonly type="text" name="fileName" placeholder="No file selected"id="file-name"><button type="button" class="btn-file bounce-button" id="upload-button">Upload Image</button></section></section><section class="img-upload"><label for="imgUrl" class="font-bold">Image URL:</label><section><input class="bounce-input" type="text" name="imgURL" id="img-URL" placeholder="Image URL"></section></section><section class="upload-controls"><button type="submit" class="mx-1 bounce-button btn-ctrl" id="form-ok-btn"><span class="material-icons">check</span></button><button type="button" class="mx-1 bounce-button btn-ctrl" id="form-cancel-btn"><span class="material-icons">close</span></button></section></form>';var n=new DocumentFragment;return n.append(e,t),n}},"./scripts/utility.ts":(t,e,n)=>{function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var i,o,r=[],a=!0,l=!1;try{for(n=n.call(t);!(a=(i=n.next()).done)&&(r.push(i.value),!e||r.length!==e);a=!0);}catch(t){l=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(l)throw o}}return r}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return l(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function c(t,e,n,i,o,r,a,l,c,s){var u=c&&s?2*s/(c+s):1,d=t-o,v=e-r,g=(d*(n-a)+v*(i-l))/(Math.pow(d,2)+Math.pow(v,2))*u;return{vX:n-g*d,vY:i-g*v}}function s(t,e){return[e.x-t.x,e.y-t.y]}function u(t,e){var n=document.createElement("canvas");n.height=t.height,n.width=t.width;var i=n.getContext("2d");i.drawImage(t,0,0,n.width,n.height);for(var o=t.width/e.w,r=t.height/e.h,a=Math.ceil(Math.log(o>=r?r:o)/Math.log(2)),l=document.createElement("canvas"),c=l.getContext("2d"),s=1;s<a;s++)l.width=n.width/2,l.height=n.height/2,c.drawImage(n,0,0,l.width,l.height),n.width=l.width,n.height=l.height,i.drawImage(l,0,0);return l.width=e.w,l.height=e.h,c.drawImage(n,0,0,l.width,l.height),l}function d(t,e){var n=a(s(t,e),2),i=n[0],o=n[1];return Math.sqrt(Math.pow(i,2)+Math.pow(o,2))}function v(t,e,n,i){try{if(0===t&&0===e||0===n&&0===i)return-1;var o=t*n+e*i,r=Math.sqrt(Math.pow(t,2)+Math.pow(e,2)),a=Math.sqrt(Math.pow(n,2)+Math.pow(i,2)),l=Math.acos(o/(r*a))*(180/Math.PI);return isNaN(l)?-1:l}catch(t){return-1}}function g(t,e,n){var i={x:t.x-n.x,y:t.y-n.y},r={x:e.x-n.x,y:e.y-n.y},a=r.x-i.x,l=r.y-i.y,c=d(i,r),s=i.x*r.y-r.x*i.y,u=l<0?-1:1,v=Math.pow(n.r,2),g=Math.pow(c,2),p=v*g-Math.pow(s,2),y=p<0?0:0===p?1:2;if(p<0)return[y,null,null];var m=Math.sqrt(p),f=(s*l+u*a*m)/g+n.x,h=(-1*s*a+Math.abs(l)*m)/g+n.y,b=(s*l-u*a*m)/g+n.x,w=(-1*s*a-Math.abs(l)*m)/g+n.y,x={x:f,y:h},I={x:b,y:w};return(f>b||f===b&&h>w)&&(I=o({},x),x={x:b,y:w}),[y,x,0===p?null:I]}function p(t,e,n,i){return t*i-e*n}n.r(e),n.d(e,{addCssClassToTouchDevices:()=>y,util:()=>m});var y=function(t){if(null!==t){var e=0;t.classList.add("hasHover");document.addEventListener("touchstart",(function(){e=(new Date).getTime()}),!0),document.addEventListener("touchstart",(function(){t.classList.add("touch-device"),t.classList.remove("hasHover")}),!0),document.addEventListener("mousemove",(function(){(new Date).getTime()-e<500||(t.classList.add("hasHover"),t.classList.remove("touch-device"))}),!0)}},m={calculateCollisionVelocity:c,createCircleImg:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"white",i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3;return new Promise((function(o,r){var a=document.createElement("canvas"),l=2*e;a.width=l,a.height=l;var c=document.createElement("img");c.src=t,c.onload=function(){var t=c.width/l,r=c.height/l;t>=r?a.width=Math.floor(c.width/r):a.height=Math.floor(c.height/t);var s=u(c,{w:l,h:l}),d=a.getContext("2d");if(null===d)throw new Error("context2D is null");d.drawImage(s,0,0,a.width,a.height),d.beginPath(),d.arc(a.width/2,a.height/2,e,0,2*Math.PI),d.closePath(),d.lineWidth=i,d.strokeStyle=n,d.stroke(),d.globalCompositeOperation="destination-in",d.arc(a.width/2,a.height/2,e,0,2*Math.PI),d.fill(),o(createImageBitmap(a,a.width/2-e,a.height/2-e,l,l))},c.onerror=r}))},convertBmpToBlob:function(t){return new Promise((function(e,n){var i=document.createElement("canvas");i.width=t.width,i.height=t.height;var o,r=i.getContext("bitmaprenderer");r?r.transferFromImageBitmap(t):null===(o=i.getContext("2d"))||void 0===o||o.drawImage(t,0,0);i.toBlob((function(t){null===t&&n("Blob is null"),e(t)}))}))},getBallCollisionVelocity:function(t,e){return c(t.position.x,t.position.y,t.velocity.vX,t.velocity.vY,e.position.x,e.position.y,e.velocity.vX,e.velocity.vY)},xyDiffBetweenPoints:s,angleBetween2DVector:v,angleBetween3Points:function(t,e,n){return v(e.x-t.x,e.y-t.y,n.x-e.x,n.y-e.y)},distanceBetween2Points:d,circleLineIntersect:g,maxIntersectHeight:function(t,e){var n=d({x:t.x,y:t.y},{x:e.x,y:e.y}),i=n-t.r-e.r;if(i>=0)return 0;var r=(t.r+.5*i)/n,l={x:(1-r)*t.x+r*e.x,y:(1-r)*t.y+r*e.y},c=o(o({},l),{},{y:l.y+1}),s=a(g(l,c,t),3),u=(s[0],s[1]),v=s[2],p=a(g(l,c,e),3),y=(p[0],p[1]),m=p[2],f=[u.y,v.y,y.y,m.y].sort();return f[2]-f[1]},maxIntersectWidth:function(t,e){var n=d({x:t.x,y:t.y},{x:e.x,y:e.y}),i=n-t.r-e.r;if(i>=0)return 0;var r=(t.r+.5*i)/n,l={x:(1-r)*t.x+r*e.x,y:(1-r)*t.y+r*e.y},c=o(o({},l),{},{x:l.x+1}),s=a(g(l,c,t),3),u=(s[0],s[1]),v=s[2],p=a(g(l,c,e),3),y=(p[0],p[1]),m=p[2],f=[u.x,v.x,y.x,m.x].sort();return f[2]-f[1]},xProduc2DPoints:function(t,e){return p(t.x,t.y,e.x,e.y)},xProduct2D:p,rotateVector:function(t,e){return{vX:t.vX*Math.cos(e)-t.vY*Math.sin(e),vY:t.vX*Math.sin(e)-t.vY*Math.cos(e)}},addCssClassToTouchDevices:y}}},e={};function n(i){var o=e[i];if(void 0!==o)return o.exports;var r=e[i]={exports:{}};return t[i](r,r.exports,n),r.exports}n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var i={};(()=>{n.r(i);var t=n("./scripts/app.ts"),e=n("./scripts/images.ts"),o=n("./scripts/modal.ts"),r=n("./scripts/add-controls.ts");document.querySelector(".intro")?setTimeout((function(){(0,r.insertBounceElements)(),(0,e.setUpImages)(),(0,o.modalInit)(),(0,t.init)()}),1e3):((0,r.insertBounceElements)(),(0,e.setUpImages)(),(0,o.modalInit)(),(0,t.init)())})()})();
//# sourceMappingURL=bounce.bundle.js.map