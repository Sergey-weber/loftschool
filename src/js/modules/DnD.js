export function DnD(modal) {
  modal.onmousedown = function(e) {

  var coords = getCoords(modal);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  moveAt(e);

  modal.style.zIndex = 1000; 

  function moveAt(e) {
    modal.style.left = e.pageX - shiftX + 'px';
    modal.style.top = e.pageY - shiftY + 'px';
  }

  document.onmousemove = function(e) {
    moveAt(e);
  };

  modal.onmouseup = function() {
    document.onmousemove = null;
    modal.onmouseup = null;
  };

}


function getCoords(elem) {   
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}
}

