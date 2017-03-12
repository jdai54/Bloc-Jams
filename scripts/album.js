var createSongRow = function (songNumber, songName, songLength) {
  
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  var $row = $(template);
  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

	if (currentlyPlayingSongNumber !== null) {
      // Revert to song number for currently playing song because user started playing new song.
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	if (currentlyPlayingSongNumber !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing.
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSongNumber = songNumber;
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updatePlayerBarSong();
	} else if (currentlyPlayingSongNumber === songNumber) {
      // Switch from Pause -> Play button to pause currently playing song.
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      currentlyPlayingSongNumber = null;
      currentSongFromAlbum = null;
	}
  };
  
  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
    }
  };
  
  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);
    }
  };
  // jQuery find method is similar to querySelector. Called here to find th element with the .song-item-number class that's contained in whichever row is clicked. jQuery's click event listener executes the callback we pass to it when the target element is clicked.
  $row.find('.song-item-number').click(clickHandler);
  // the hover event listener combines the mouseover and mouseleave functions. The first argument is a callback that executes when the user jouses over the $row element and the second is a callback executed when the mouse leaves $row
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  // #1
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  // #2
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  // #3
  $albumSongList.empty();

  // #4
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

// helper method that returns the index of a song fund in album's songs array
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  // updates the HTML of the play/pause button to the cotent of the playerBarPauseButton
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
  // Obtains the previous song number and accounts for when the next song is the first song of the album allowing it to "loop" from last song to first song - conditional ternary operator
  var getLastSongNumber = function(index) {
    return index == 0 ? currentAlbum.songs.length : index;
  };
  // Increments the index of the current song up one with the use of trackIndex helper function
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum)
    currentSongIndex++;
  // resets the next song to the first song of the album if the player finishes the last song
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }
  // Set a new current song
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  
  // Update the Player Bar information to show the new song
  updatePlayerBarSong();
  
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
  
  // update the HTML of the new song's .song-item-number element with a pause button
  $nextSongNumberCell.html(pauseButtonTemplate);
  // update the HTML of the previous song's .song-item-number element with a number
  $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  // Obtains the previous song number and accounts for when the next song is the first song of the album allowing it to "loop" from last song to first song - conditional ternary operator
  var getLastSongNumber = function(index) {
    return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
  };
  // Decrements the index of the current song down one with the use of trackIndex helper function
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum)
    currentSongIndex--;
  // resets the previous song to the last song of the album of the user selects previous song from the first song
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }
  // Set a new current song
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  
  // Update the Player Bar information to show the new song
  updatePlayerBarSong();
  
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
  
  // update the HTML of the new song's .song-item-number element with a pause button
  $previousSongNumberCell.html(pauseButtonTemplate);
  // update the HTML of the previous song's .song-item-number element with a number
  $lastSongNumberCell.html(lastSongNumber);

};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
// the two templates below hold the Ionicon for the play and pause button, so we can easily set the HTML of the player bar when we've played a new song
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
// Added variable below to hold the curently playing song object from the songs array
var currentSongFromAlbum = null;
// create variables to hold jQuery selectors for the next and previous buttons
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  // jQuery click event handlers on each respective variable
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});