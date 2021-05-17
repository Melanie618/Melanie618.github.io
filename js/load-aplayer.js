<link rel="stylesheet" class="aplayer-secondary-style-marker" href="\assets\css\APlayer.min.css"><script src="\assets\js\APlayer.min.js" class="aplayer-secondary-script-marker"></script><script class="meting-secondary-script-marker" src="\assets\js\Meting.min.js"></script>document.addEventListener("DOMContentLoaded", function() {
    let apContainer = document.createElement("div");
    apContainer.id = "aplayer";
    document.body.append(apContainer);
    const ap = new APlayer({
        container: document.getElementById("aplayer"),
        fixed: true,
        audio: [{
            name: "name",
            artist: "artist",
            url: "url.mp3",
            cover: "cover.jpg",
        }, ],
    });
});