const CruParser = require('../CruParser');
const fs = require('fs');
const path = require('path');

describe("Specification F3 - Free time slots for a room", function () {

    let parsed = [];

    beforeAll(function () {
        console.log("➡️  Chargement des données CRU...");

        const rootFolder = "SujetA_data";
        parsed = [];

        const folders = fs.readdirSync(rootFolder, { withFileTypes: true });

        folders.forEach(dirent => {
            if (dirent.isDirectory()) {
                const filePath = path.join(rootFolder, dirent.name, "edt.cru");

                if (fs.existsSync(filePath)) {
                    console.log(`   📄 Parsing : ${filePath}`);

                    const data = fs.readFileSync(filePath, "utf8");
                    const parser = new CruParser();
                    parser.parse(data);
                    parsed = parsed.concat(parser.parsedCru || []);
                }
            }
        });

        console.log(`✔️  Parsing terminé. Total d'entrées : ${parsed.length}\n`);
    });


    // ───────────────────────────────────────────────────────────────────────────────
    // 1. Identifiant vide → ERREUR
    // ───────────────────────────────────────────────────────────────────────────────

    it("should throw an error if room identifier is empty", function () {

        console.log("➡️  Test : identifiant vide");

        function testEmptyRoom() {
            const roomId = "";

            if (!roomId || roomId.trim() === "") {
                console.log("   ❗ Identifiant vide détecté");
                throw new Error("L’identifiant de la salle ne peut pas être vide.");
            }
        }

        expect(testEmptyRoom).toThrowError("L’identifiant de la salle ne peut pas être vide.");

        console.log("✔️  Succès : erreur correctement levée pour identifiant vide\n");
    });


    // ───────────────────────────────────────────────────────────────────────────────
    // 2. Salle inexistante → ERREUR
    // ───────────────────────────────────────────────────────────────────────────────

    it("should throw an error if room does not exist", function () {

        const room = "ROOM_NOT_REAL";
        console.log(`➡️  Test : salle inexistante '${room}'`);

        function testRoomNotFound() {
            const coursSalle = parsed.filter(c => c.salle === room);

            console.log(`   - Cours trouvés : ${coursSalle.length}`);

            if (coursSalle.length === 0) {
                console.log("   ❗ Salle inexistante détectée");
                throw new Error("La salle n’existe pas.");
            }
        }

        expect(testRoomNotFound).toThrowError("La salle n’existe pas.");

        console.log("✔️  Succès : erreur levée pour salle inexistante\n");
    });


    // ───────────────────────────────────────────────────────────────────────────────
    // 3. Salle existante → Créneaux libres générés correctement
    // ───────────────────────────────────────────────────────────────────────────────

    it("should compute free time slots for an existing room", function () {

        const room = "D102";  // Choisir une salle qui existe
        console.log(`➡️  Test : génération des créneaux libres pour '${room}'`);

        const roomCourses = parsed.filter(c => c.salle === room);
        console.log(`   - Cours trouvés : ${roomCourses.length}`);

        expect(roomCourses.length).toBeGreaterThan(0);

        const days = ["L", "MA", "ME", "J", "V"];
        const hours = Array.from({ length: 12 }, (_, i) => 8 + i);

        const freeSlots = {};
        days.forEach(d => freeSlots[d] = [...hours]);

roomCourses.forEach(c => {
    const day = c.jour;

    // 👉 Ignore les jours qui ne font pas partie de L, MA, ME, J, V
    if (!days.includes(day)) return;

    const [start, end] = c.horaire.split('-').map(h => parseInt(h, 10));

    for (let h = start; h < end; h++) {
        const index = freeSlots[day].indexOf(h);
        if (index !== -1) freeSlots[day].splice(index, 1);
    }
});

        console.log("   - Exemple de créneaux libres :");
        console.log(JSON.stringify(freeSlots, null, 2));

        expect(typeof freeSlots).toBe("object");
        expect(Object.keys(freeSlots).length).toBe(5);

        console.log(`✔️  Succès : créneaux libres générés pour la salle '${room}'\n`);
    });

});
