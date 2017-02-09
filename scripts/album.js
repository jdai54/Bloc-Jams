// Example Album
var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26' },
    { title: 'Green', duration: '3:14' },
    { title: 'Red', duration: '5:01' },
    { title: 'Pink', duration: '3:21'},
    { title: 'Magenta', duration: '2:15'}
  ]
};

// Another Example Album
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    { title: 'Hello, Operator?', duration: '1:01' },
    { title: 'Ring, ring, ring', duration: '5:01' },
    { title: 'Fits in your pocket', duration: '3:21'},
    { title: 'Can you hear me now?', duration: '3:14' },
    { title: 'Wrong phone number', duration: '2:15'}
  ]
};

// 3rd Example Album
var albumPororo = {
  title: 'Pororo Sing Along',
  artist: 'Pororo Band',
  label: 'Iconix',
  year: '2015',
  albumArtUrl: 'assets/images/album_covers/PororoBand.jpg',
  songs: [
    { title: 'Opening', duration: '0:38' },
    { title: 'Rabbit Frog', duration: '3:00' },
    { title: 'Good Morning', duration: '3:01' },
    { title: 'Hide and Seek', duration: '3:00' },
    { title: 'Playing with Numbers', duration: '3:01' },
    { title: 'Rainbow', duration: '3:01' },
    { title: 'Naughty Boy', duration: '3:00' },
    { title: 'Good Child', duration: '3:00' },
    { title: 'For Sure', duration: '3:00' },
    { title: 'Ding Dong Dang', duration: '3:00' },
    { title: 'Para Pam', duration: '3:01' },
    { title: 'It\'s Alright', duration: '2:59' },
    { title: 'Mommy Pig, Baby Pig', duration: '3:01' },
    { title: 'Lovely Baby Bear', duration: '3:00' },
    { title: 'Ending', duration: '0:28' }
  ]
};

var createSongRow = function (songNumber, songName, songLength) {
   var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

   return template;
 };

// #1
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
  
  // #2
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  // #3
  albumSongList.innerHTML = '';

  // #4
  for (var i = 0; i < album.songs.length; i++) {
     albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

// This empty array will be used as an array of albums to be looped over when users click the album cover art to toggle between various albums
var albumArray = []
 
window.onload = function() {
  setCurrentAlbum(albumPicasso);
   
  var index = 1
  
  albumImage.addEventListener("click", function(event) {
    albumArray.push(albumPicasso, albumMarconi, albumPororo);
    setCurrentAlbum(albumArray[index]);
    index++;
    if (index == albumArray.length) {
      index == 0;
    }
  })
  
};

