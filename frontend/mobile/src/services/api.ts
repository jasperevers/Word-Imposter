const API_URL = "http://192.168.2.29:8080"; // localhost voor emulator, LAN IP voor telefoon

export async function createLobby() {
    console.log("Creating new lobby");
    const res = await fetch(`${API_URL}/lobby`, { method: "POST" });
    console.log("result:",res);
    return res.json(); // { code: "4DB921" }
}

export async function joinLobby(code: string, name: string) {
    const res = await fetch(`${API_URL}/lobby/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    return res.json(); // { players: [{id, name}, ...] }
}
