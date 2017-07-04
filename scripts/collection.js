var buildCollectionItemTemplate = function() {
  var template = 
    '<div class="collection-album-container column fourth">'
  + '  <img src="assets/images/album_covers/Goblin.jpg"/>'
  + '  <div class="collection-album-info caption">'
  + '    <p>'
  + '      <a class="album-name" href="album.html"> Goblin OST </a>'
  + '      <br/>'
  + '      <a href="album.html"> Chan Yeol of EXO feat. Punch </a>'
  + '      <br/>'
  + '      7 songs'
  + '      <br/>'
  + '    </p>'
  + '  </div>'
  + '</div>'
  ;
  return $(template);
};

$(window).load(function() {
  var $collectionContainer = $('.album-covers'); 
  $collectionContainer.empty();
  
  for (var i = 0; i < 1; i++) {
    var $newThumbnail = buildCollectionItemTemplate();
    $collectionContainer.append($newThumbnail);
  }
});