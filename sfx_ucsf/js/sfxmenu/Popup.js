/*************************************************************************
  
  dw_writedrag.js 
  requires dw_event.js, dw_drag.js, and dw_viewport.js
  
*************************************************************************/

var writeDrag = {
  // offX and offY can be numbers or "c"
  offX: 20,
  offY: 20,
  dragId:   "dragDiv",  // id of positioned div to be dragged
  handleId: "",         // optional, place null or "" if no handle
  writeId:  "",    // optional, will write to dragId if null or empty string
  // end of settings area - no need to edit below this line
  
  draggable: true,   // set true once dragObj.init called
  hideFlag: true,     // used in checkHide (document click)
  
  init: function() {   // initialize for dragging
    if (this.handleId) dragObj.init(this.handleId, this.dragId);
    else dragObj.init(this.dragId);
    this.draggable = true;
    // add handlers for hiding layer (esc key and doc click)
    dw_event.add( document, "click",   writeDrag.checkHide, false );
    dw_event.add( document, "keydown", writeDrag.checkKey,  true );
  },
  
  // called onclick of links (from wrapContent)
  set: function(e, cntnt, wd, offx, offy) {
    this.hideFlag = false;  // click on link to show layer is also document click, which would hide it
    var wobj ;
        wobj = document.getElementById( this.dragId );
    //var wobj = this.writeId? document.getElementById( this.writeId ): document.getElementById( this.dragId );
    var dobj = document.getElementById( this.dragId );
    if ( !this.draggable )  {
           this.init();
    }
    this.hide();
    wobj.innerHTML = cntnt;
    
    if (wd) {
      // wd might be width of image, so add border and padding
      // rely on styles set inline (or lengthy code needed)
      var bw = dobj.style.borderWidth? parseInt(dobj.style.borderWidth): 0;
      var pw = wobj.style.padding? parseInt(wobj.style.padding): 0;
      wd += 2 * bw + 2 * pw;
      dobj.style.width = wd + "px"; 
    }
    this.positionIt(e, dobj, offx, offy);
  }, 
  
  positionIt: function(e, o, offx, offy) {
    var x=0, y=0; viewport.getAll();
    // check positioning choices
    if ( this.offX == "c" ) {
      x = Math.round( (viewport.width - o.offsetWidth)/2 ) + viewport.scrollX;
    } 
    else {  // use mouse location onclick to position
      x = e.pageX? e.pageX: e.clientX + viewport.scrollX;
      offx = offx || this.offX;  // check for passed offsets
      if ( x + o.offsetWidth + offx > viewport.width - 30 + viewport.scrollX ) 
        x = viewport.width - 30 + viewport.scrollX - o.offsetWidth;
      else x = x + offx;
    }
    
    if ( this.offY == "c" ) {
      y = Math.round( (viewport.height - o.offsetHeight)/2 ) + viewport.scrollY;    
    } else {
      y = e.pageY? e.pageY: e.clientY + viewport.scrollY; 
      offy = offy || this.offY; 
      if ( y + o.offsetHeight + offy > viewport.height + viewport.scrollY )
        y = viewport.height + viewport.scrollY - o.offsetHeight - 30;
      else y = y + offy;
    }
    o.style.left = x + "px"; o.style.top = y + "px";
    document.getElementById(this.dragId).style.visibility = "visible";
    setTimeout("writeDrag.hideFlag = true",200);  // delayed until after checkHide 
  },
  
  checkKey: function(e) { // check for esc key
    e = e? e: window.event;  if ( e.keyCode == 27 ) writeDrag.hide();
  }, 

  // doc click hides
  checkHide: function(e) { 
    dw_event.DOMit(e);
    // hide the layer if you click anywhere in the document 
    // except a link that displays the layer (hideFlag), or on the layer itself, 
    // unless that click on the layer is on the layer's close box    
    if (e.tgt.nodeType && e.tgt.nodeType == 3) e.tgt = e.tgt.parentNode;  // text node?
    if ( contained( e.tgt, document.getElementById("dragDiv") ) ) {
      if ( e.tgt.tagName && e.tgt.tagName == "IMG" ) e.tgt = e.tgt.parentNode; 
      if ( e.tgt.tagName == "A" && e.tgt.href.indexOf("writeDrag.hide") != -1 ) writeDrag.hide();
      else return;
    }
    if (writeDrag.hideFlag) writeDrag.hide();
  },

  hide: function() { document.getElementById(writeDrag.dragId).style.visibility = "hidden"; }
}

// returns true of oNode is contained by oCont (container)
function contained(oNode, oCont) {
  while ( oNode.parentNode ) {
    oNode = oNode.parentNode;
    if ( oNode == oCont ) return true;
  }
  return false;
}





/******************************************************************************************
  
  dw_drag.js 
  
******************************************************************************************/

var dragObj = {
  supported: document.getElementById && (document.addEventListener || document.attachEvent),
  obj: null,
  zOrder: 1000,
  // a class can be attached to close box (or other elements) so mousedown on it won't trigger drag
  skipClass: "xBox",
  
  // id is that of object you mousedown on when you want to drag,
  // which may or may not be inside another element (rootID) which gets dragged
  init: function(id, rootID, x, y, minX, maxX, minY, maxY) {
    if (this.supported) {
      var o = document.getElementById(id);
      o.root = rootID? document.getElementById(rootID): o;
      o.idx = id; // used for checking in start
      //  pass x/y, set left/top inline or via script, or it gets set to 0,0
      if ( isNaN( parseInt(o.root.style.left) ) ) o.root.style.left = x? x + "px": 0 + "px"; 
      if ( isNaN( parseInt(o.root.style.top) ) )  o.root.style.top =  y? y + "px": 0 + "px";
      o.minX = minX; o.maxX = maxX; o.minY = minY; o.maxY = maxY;
      o.root.on_drag_start = function() {}
      o.root.on_drag = function() {}
      o.root.on_drag_end = function() {}
      dw_event.add( o, "mousedown", dragObj.start, false );
    }
  },
  
  start: function(e) {
    var o;
    e = dw_event.DOMit(e);
    
    // Check if moused down on an object that shouldn't trigger drag (close box, for example)
    if (e.tgt.nodeType && e.tgt.nodeType == 3) e.tgt = e.tgt.parentNode;  // text node?
    if (e.tgt.className && e.tgt.className == dragObj.skipClass ) return;
    
    if (this.idx) o = dragObj.obj = this;
    else {  // o != this for ie when using attachEvent
     while (!e.tgt.idx) e.tgt = e.tgt.parentNode;
     o = dragObj.obj = e.tgt; 
    }
    o.root.style.zIndex = dragObj.zOrder++;
    o.downX = e.clientX; o.downY = e.clientY;
    o.startX = parseInt(o.root.style.left);
    o.startY = parseInt(o.root.style.top);
    o.root.on_drag_start(o.startX, o.startY);
    dw_event.add( document, "mousemove", dragObj.drag, true );
    dw_event.add( document, "mouseup",   dragObj.end,  true );
    e.preventDefault();
  },

  drag: function(e) {
    e = e? e: window.event;
    var o = dragObj.obj; 
    // calculate new x/y values
    var nx = o.startX + e.clientX - o.downX;
    var ny = o.startY + e.clientY - o.downY;
    if ( o.minX != null ) nx = Math.max( o.minX, nx );
    if ( o.maxX != null ) nx = Math.min( o.maxX, nx );
    if ( o.minY != null ) ny = Math.max( o.minY, ny );
    if ( o.maxY != null ) ny = Math.min( o.maxY, ny );
    o.root.style.left = nx + "px"; o.root.style.top  = ny + "px";
    o.root.on_drag(nx,ny);
    return false;
  },

  end: function() {
    dw_event.remove( document, "mousemove", dragObj.drag, true );
    dw_event.remove( document, "mouseup",   dragObj.end,  true );
    if ( !dragObj.obj ) return; // avoid errors in ie if inappropriate selections
    dragObj.obj.root.on_drag_end( parseInt(dragObj.obj.root.style.left), parseInt(dragObj.obj.root.style.top) );
    dragObj.obj = null;
  }

}





/*************************************************************************

    dw_event.js
    
    to negotiate cross-browser differences in event models
    for browsers that support addEventListener and attachEvent 
        
*************************************************************************/

var dw_event = {
  
  add: function(obj, etype, fp, cap) {
    cap = cap || false;
    if (obj.addEventListener) obj.addEventListener(etype, fp, cap);
    else if (obj.attachEvent) obj.attachEvent("on" + etype, fp);
  }, 

  remove: function(obj, etype, fp, cap) {
    cap = cap || false;
    if (obj.removeEventListener) obj.removeEventListener(etype, fp, cap);
    else if (obj.detachEvent) obj.detachEvent("on" + etype, fp);
  }, 

  DOMit: function(e) {
    e = e? e: window.event;
    e.tgt = e.srcElement? e.srcElement: e.target;
    
    if (!e.preventDefault) e.preventDefault = function () { return false; }
    if (!e.stopPropogation) e.stopPropogation = function () { if (window.event) window.event.cancelBubble = true; }
        
    return e;
  }
  
}




/*************************************************************************

  dw_viewport.js

*************************************************************************/  
  
var viewport = {
  getWinWidth: function () {
    this.width = 0;
    if (window.innerWidth) this.width = window.innerWidth - 18;
    else if (document.documentElement && document.documentElement.clientWidth) 
  		this.width = document.documentElement.clientWidth;
    else if (document.body && document.body.clientWidth) 
  		this.width = document.body.clientWidth;
  },
  
  getWinHeight: function () {
    this.height = 0;
    if (window.innerHeight) this.height = window.innerHeight - 18;
  	else if (document.documentElement && document.documentElement.clientHeight) 
  		this.height = document.documentElement.clientHeight;
  	else if (document.body && document.body.clientHeight) 
  		this.height = document.body.clientHeight;
  },
  
  getScrollX: function () {
    this.scrollX = 0;
  	if (typeof window.pageXOffset == "number") this.scrollX = window.pageXOffset;
  	else if (document.documentElement && document.documentElement.scrollLeft)
  		this.scrollX = document.documentElement.scrollLeft;
  	else if (document.body && document.body.scrollLeft) 
  		this.scrollX = document.body.scrollLeft; 
  	else if (window.scrollX) this.scrollX = window.scrollX;
  },
  
  getScrollY: function () {
    this.scrollY = 0;    
    if (typeof window.pageYOffset == "number") this.scrollY = window.pageYOffset;
    else if (document.documentElement && document.documentElement.scrollTop)
  		this.scrollY = document.documentElement.scrollTop;
  	else if (document.body && document.body.scrollTop) 
  		this.scrollY = document.body.scrollTop; 
  	else if (window.scrollY) this.scrollY = window.scrollY;
  },
  
  getAll: function () {
    this.getWinWidth(); this.getWinHeight();
    this.getScrollX();  this.getScrollY();
  }
  
}



/*************************************************************************
*************************************************************************/

writeDrag.writeId = "cntnt";

// required arg's: event, image path and file name (as this.href)
// important but optional arg's: width of image, height of image 
// other optional arg's: txt, layer width, offx, offy
function wrapContent(e, img, w, h, txt, wd, offx, offy) {
  var imgStr, cntnt, win, str;
  imgStr = '';
  if ( dragObj.supported && typeof document.body.innerHTML != "undefined" ) {
    cntnt = '<div>' + imgStr + '</div>';
    if (txt) cntnt += '<div>' + txt + '</div>';  
    if (!wd) wd = w; 
    writeDrag.set(e, cntnt, wd, offx, offy);
  } else { // non-capable browsers will open sub window
    w = w+80 || wd || 250; h = h+80 || 250; // size
    win = window.open('', 'subwin', 'resizable,width='+w+',height='+h+',left=100,top=100');
    if (win && !win.closed) win.resizeTo(w,h); 
    str = '<html><head><title>Image Display</title></head>';
  	str += '<body style="text-align:center">';
    str += imgStr + (txt? '<p>' + txt + '</p>':"");
  	str += '</body></html>'
  	win.document.write(str);
  	win.document.close();
    if (win && !win.closed) win.focus(); 
  } 
  return false;
}
