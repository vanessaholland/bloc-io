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

var albumStyrofoam = {
        title: 'Non-Biodegradable',
        artist: 'Someone Awful',
        label: 'Hazard',
        year: '1941',
        albumArtUrl: 'assets/images/album_covers/styrofoam.jpg',
        songs: [
            { title: 'Not Going Away', duration: '3:41' },
            { title: 'Nope, Still Here', duration: '4:11' },
            { title: 'extruded polystyrene foam', duration: '6:66'},
            { title: '98% air', duration: '3:37' },
            { title: 'carcinogenic', duration: '5:15'}
        ]
    };


var createSongRow = function (songNumber, songName, songLength) {
      var template =
      '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>';

      var $row = $(template);

      var clickHandler = function() {
        // clickHandler logic
        var songItem = $(this).attr('data-song-number');
        if (currentlyPlayingSong !== null) {
          var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
          currentlyPlayingCell.html(currentlyPlayingSong);
        }
        if (currentlyPlayingSong === songItem) {
          $(this).html(playButtonTemplate);
          currentlyPlayingSong = null;
        } else if (currentlyPlayingSong !== songItem) {
          $(this).html(pauseButtonTemplate);
          currentlyPlayingSong = songItem;
        }
      };

      var onHover = function(event) {
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = songNumberItem.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
          songNumberItem.html(playButtonTemplate);
        }
      };

      var offHover = function(event) {
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = songNumberItem.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
          songNumberItem.html(songNumber);
        }
      };

      $row.find('.song-item-number').click(clickHandler);
      // #2
      $row.hover(onHover, offHover);
      // #3
      return $row;
};



var setCurrentAlbum = function (album) {
     // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     var i = 0;
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     // #3
     $albumSongList.empty();

     // #4
     for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
     }
    };

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
 });
