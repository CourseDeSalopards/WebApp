import{b as l}from"./init-e2054226.js";var o=(e=>(e.INSIDE="inside",e.OUTSIDE="outside",e.WALLS="walls",e.START_AREA="startArea",e.CLOCK="clock",e.WELCOME_POP_UP="welcomePopup",e.CLOCK_POP_UP="clockPopUp",e))(o||{});function u(e){c(e.name)}function c(e){let a=WA.ui.openPopup(o.WELCOME_POP_UP,`Welcome : ${e} `,[]);setTimeout(()=>n(a),2e3)}function i(e,a){WA.room.area.onEnter(e).subscribe(async()=>{a()})}function p(e,a){WA.room.area.onEnter(e).subscribe(async()=>{a()})}function y(e){WA.room.area.onEnter(o.CLOCK).subscribe(async()=>{const a=new Date,r=a.getHours()+":"+a.getMinutes();e=WA.ui.openPopup(o.CLOCK_POP_UP,r,[])}),WA.room.area.onLeave(o.CLOCK).subscribe(()=>n(e))}function n(e){e!==void 0&&e.close()}console.log("Script started successfully");let d;const A="startGameBtn";async function t(){WA.state.loadVariable("players")||(console.log("players not found, go undefined"),await WA.state.saveVariable("players",[]));const e=WA.state.loadVariable("players")||[];return new Set(e)}WA.onInit().then(async()=>{await t(),WA.sound.loadSound("../../public/sound/waitingRoom.wav").play({loop:!0}),u(WA.player),i(o.INSIDE,async()=>{if(!WA.player.uuid){console.error("Player UUID not found");return}WA.room.hideLayer(o.WALLS);const a=await t();a.add(WA.player.uuid),await WA.state.saveVariable("players",Array.from(a))}),p(o.OUTSIDE,async()=>{if(!WA.player.uuid){console.error("Player UUID not found");return}WA.room.showLayer(o.WALLS);const a=await t();a.delete(WA.player.uuid),await WA.state.saveVariable("players",Array.from(a))}),WA.event.on("teleportPlayer").subscribe(async a=>{if(WA.player.uuid===a.data){const r=Math.floor(Math.random()*2)+1;await new Promise(s=>setTimeout(s,r*300)),WA.nav.goToRoom("../maps/cds.tmj")}}),y(d),WA.ui.actionBar.addButton({id:A,label:"Start game",callback:async a=>{if((await t()).size<2){const r=WA.ui.openPopup("popup","You need at least 2 players to start the game",[]);setTimeout(()=>n(r),2e3);return}for(const r of Array.from((await t()).values()))console.log("teleport",r),WA.event.broadcast("teleportPlayer",r)}}),l().then(()=>{console.log("Scripting API Extra ready")}).catch(a=>console.error(a))}).catch(e=>console.error(e));