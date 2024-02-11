// Fetch song metadata from the server
async function fetchSongData() {
    const response = await fetch('songs.json');
    const data = await response.json();
    return data;
}

// Function to populate JavaScript objects representing songs
async function populateSongs() {
    try {
        // Fetch song metadata
        const songData = await fetchSongData();

        // Process song metadata and populate songs array
        const songs = [];
        songData.forEach(album => {
            album.songs.forEach(song => {
                const { name, artist, album: albumName, description, length, albumCover, songCover } = song;
                songs.push({
                    name,
                    artist,
                    album: albumName,
                    description,
                    length,
                    albumCover,
                    songFile: song.songFile, // Assuming the server provides direct link to song file
                    songCover
                });
            });
        });

        return songs;
    } catch (error) {
        console.error('Error fetching song data:', error);
        return []; // Return empty array in case of error
    }
}

// Usage example
populateSongs().then(songs => {
    console.log(songs);
});
