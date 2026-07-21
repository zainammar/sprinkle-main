function postK2() {
    var x = document.getElementById("YourextB").value;
    document.getElementById("yourTextB").innerHTML = x;
  }

  function changeBackgroundAg() {
    const color = document.getElementById('colorPickerAg').value;
    document.getElementById('bgdark33').style.backgroundColor = color;
  }


  // New


   
  (function(){
    const main = document.getElementById('main-div');
    const viewport = document.getElementById('viewport');
    const zoomRange = document.getElementById('zoom-range');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetBtn = document.getElementById('reset');
    const fitBtn = document.getElementById('fit');

    let scale = 1; // current scale
    let translate = {x:0,y:0}; // translation in px

    // pointer pan state
    let isPanning = false;
    let lastPointer = {x:0,y:0};

    // pinch tracking
    const pointers = new Map();
    function updateTransform(){
      main.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
      zoomRange.value = scale.toFixed(2);
    }

    function clampScale(s){ return Math.min(3, Math.max(0.2, s)); }

    // wheel zoom (center on cursor)
    viewport.addEventListener('wheel', (e)=>{
      if(!e.ctrlKey && !e.metaKey){ /* zoom with wheel without ctrl only */ }
      e.preventDefault();
      const rect = main.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const delta = -e.deltaY;
      const zoomFactor = delta > 0 ? 1.08 : 0.92;
      const newScale = clampScale(scale * zoomFactor);

      // adjust translate so the point under cursor stays in place
      const scaleRatio = newScale/scale;
      translate.x = (translate.x - offsetX) * scaleRatio + offsetX;
      translate.y = (translate.y - offsetY) * scaleRatio + offsetY;

      scale = newScale;
      updateTransform();
    }, {passive:false});

    // buttons
    zoomInBtn.addEventListener('click', ()=>{ scale = clampScale(scale * 1.12); updateTransform(); });
    zoomOutBtn.addEventListener('click', ()=>{ scale = clampScale(scale / 1.12); updateTransform(); });
    resetBtn.addEventListener('click', ()=>{ scale = 1; translate = {x:0,y:0}; updateTransform(); });
    zoomRange.addEventListener('input', (e)=>{ scale = clampScale(parseFloat(e.target.value)); updateTransform(); });

    // fit: center and scale to fit viewport
    fitBtn.addEventListener('click', ()=>{
      const vp = viewport.getBoundingClientRect();
      const content = main.getBoundingClientRect();
      const sx = vp.width / content.width;
      const sy = vp.height / content.height;
      const s = clampScale(Math.min(sx, sy, 1));
      scale = s;
      // center
      translate.x = (vp.width - content.width * s)/2;
      translate.y = (vp.height - content.height * s)/2;
      updateTransform();
    });

    // pointer events for pan (and pinch)
    viewport.addEventListener('pointerdown', (e)=>{
      viewport.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, {x:e.clientX,y:e.clientY});

      if(pointers.size === 1){
        isPanning = true;
        lastPointer = {x:e.clientX,y:e.clientY};
      }
    });

    viewport.addEventListener('pointermove', (e)=>{
      if(pointers.has(e.pointerId)) pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});

      if(pointers.size === 1 && isPanning){
        const dx = e.clientX - lastPointer.x;
        const dy = e.clientY - lastPointer.y;
        translate.x += dx;
        translate.y += dy;
        lastPointer = {x:e.clientX,y:e.clientY};
        updateTransform();
      } else if(pointers.size === 2){
        // pinch to zoom
        const it = pointers.values();
        const p1 = it.next().value;
        const p2 = it.next().value;
        const curDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        // store baseline on first pinch move
        if(!viewport._pinch){
          viewport._pinch = {startDist:curDist, startScale:scale, center:{x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2}};
        }
        const {startDist, startScale, center} = viewport._pinch;
        if(startDist === 0) return;
        const newScale = clampScale(startScale * (curDist / startDist));

        // adjust translate to keep the center point stable
        const rect = main.getBoundingClientRect();
        const offsetX = center.x - rect.left;
        const offsetY = center.y - rect.top;
        const scaleRatio = newScale / scale;
        translate.x = (translate.x - offsetX) * scaleRatio + offsetX;
        translate.y = (translate.y - offsetY) * scaleRatio + offsetY;

        scale = newScale;
        updateTransform();
      }
    });

    function endPointer(e){
      if(pointers.has(e.pointerId)) pointers.delete(e.pointerId);
      if(pointers.size < 2) viewport._pinch = null;
      if(pointers.size === 0) isPanning = false;
    }
    viewport.addEventListener('pointerup', endPointer);
    viewport.addEventListener('pointercancel', endPointer);
    viewport.addEventListener('pointerleave', endPointer);

    // double click to reset center
    viewport.addEventListener('dblclick', (e)=>{
      // center the clicked point
      const vp = viewport.getBoundingClientRect();
      const rect = main.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      // zoom in a step and center the clicked position
      const newScale = clampScale(scale * 1.5);
      const scaleRatio = newScale/scale;
      translate.x = (translate.x - offsetX) * scaleRatio + offsetX;
      translate.y = (translate.y - offsetY) * scaleRatio + offsetY;
      scale = newScale;
      updateTransform();
    });

    // prevent image dragging or selection inside main-div
    main.addEventListener('dragstart', (e)=>e.preventDefault());

    // initial fit so UI looks nice on load
    window.addEventListener('load', ()=>{ fitBtn.click(); });

    // accessibility: keyboard zoom
    window.addEventListener('keydown', (e)=>{
      if(e.key === '+' || (e.key === '=' && (e.ctrlKey || e.metaKey))){ scale = clampScale(scale * 1.12); updateTransform(); }
      if(e.key === '-' ) { scale = clampScale(scale / 1.12); updateTransform(); }
      if(e.key === '0') { resetBtn.click(); }
    });

  })();



  function toUpperCaseText() {
    let text = document.getElementById("userInput").value;
    document.getElementById("result").innerText = text.toUpperCase();
}

function toLowerCaseText() {
    let text = document.getElementById("userInput").value;
    document.getElementById("result").innerText = text.toLowerCase();
}

function toTitleCaseText() {
    let text = document.getElementById("userInput").value;
    document.getElementById("result").innerText = text
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}


