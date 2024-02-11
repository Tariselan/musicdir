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

// Event listeners for artist and album select dropdowns
document.getElementById('artists').addEventListener('change', function() {
    const artistName = this.value;
    populateAlbumsSelect(artistName);
});

document.getElementById('albums').addEventListener('change', function() {
    const artistName = document.getElementById('artists').value;
    const albumName = this.value;
    populateSongsSelect(artistName, albumName);
});

// Populate artists select dropdown on page load
populateArtistsSelect();
