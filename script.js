// Fetch song metadata from the server
async function fetchSongData() {
    try {
        const response = await fetch('data/songs.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching song data:', error);
        return null; // Return null in case of error
    }
}

// Function to populate artists select dropdown
async function populateArtistsSelect() {
    const songData = await fetchSongData();
    if (songData) {
        const artists = songData.map(artistData => artistData.artist).sort();
        const artistsSelect = document.getElementById('artists');
        artists.forEach(artist => {
            const option = document.createElement('option');
            option.text = artist;
            artistsSelect.add(option);
        });
    }
}

// Function to populate albums select dropdown based on selected artist
async function populateAlbumsSelect(artistName) {
    const songData = await fetchSongData();
    if (songData) {
        const artistData = songData.find(artistData => artistData.artist === artistName);
        if (artistData) {
            const albums = artistData.albums.map(album => album.name).sort();
            const albumsSelect = document.getElementById('albums');
            albumsSelect.innerHTML = ''; // Clear previous options
            albums.forEach(album => {
                const option = document.createElement('option');
                option.text = album;
                albumsSelect.add(option);
            });
        }
    }
}

// Function to populate songs select dropdown based on selected album
async function populateSongsSelect(artistName, albumName) {
    const songData = await fetchSongData();
    if (songData) {
        const artistData = songData.find(artistData => artistData.artist === artistName);
        if (artistData) {
            const albumData = artistData.albums.find(album => album.name === albumName);
            if (albumData) {
                const songs = albumData.songs;
                const songsSelect = document.getElementById('songs');
                songsSelect.innerHTML = ''; // Clear previous options
                songs.forEach(song => {
                    const option = document.createElement('option');
                    option.text = song.name;
                    songsSelect.add(option);
                });
            }
        }
    }
}

// Function to update display div with selected song information
async function updateDisplay(artistName, albumName, songName) {
    const displayDiv = document.getElementById('display');
    const songData = await fetchSongData();
    if (songData) {
        let selectedSong;
        for (const artistData of songData) {
            if (artistData.artist === artistName) {
                for (const album of artistData.albums) {
                    if (album.name === albumName) {
                        selectedSong = album.songs.find(song => song.name === songName);
                        break;
                    }
                }
                break;
            }
        }
        if (selectedSong) {
            const albumPath = `data/artists/${artistName.replace(' ', '_').toLowerCase()}/${albumName.replace(' ', '_').toLowerCase()}`;
            const albumCoverPath = `${albumPath}/album_cover.jpg`;
            const mp3Path = `${albumPath}/${selectedSong.audio}`
            displayDiv.innerHTML = `
                <h2>Song</h2>
                <hr>
                <div class="song-container">
                    <div class="album">
                        <img class="album-cover" src="${albumCoverPath}" alt="Album Cover">
                        <p class="label">Album Name: ${albumName}</p>
                    </div>
                    <div class="separator"></div>
                    <div class="info">
                        <p>Artist Name: ${artistName}</p>
                        <p class="label">Song Name: ${songName}</p>
                        <p>Description: ${selectedSong.description}</p>
                        <p>Song Length: ${selectedSong.length}</p>
                    </div>
                    <div class="audio-player">
                        <audio controls id="audio-player">
                            <source src="${mp3Path}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            `;console.log(selectedSong)
        }
    }
}


// Event listeners for artist, album, and song select dropdowns
document.getElementById('artists').addEventListener('change', function() {
    const artistName = this.value;
    populateAlbumsSelect(artistName);
});

document.getElementById('albums').addEventListener('change', function() {
    const artistName = document.getElementById('artists').value;
    const albumName = this.value;
    populateSongsSelect(artistName, albumName);
});

document.getElementById('songs').addEventListener('change', function() {
    const artistName = document.getElementById('artists').value;
    const albumName = document.getElementById('albums').value;
    const songName = this.value;
    updateDisplay(artistName, albumName, songName);
});

// Populate artists select dropdown on page load
populateArtistsSelect();
