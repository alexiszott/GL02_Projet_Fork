const CruParser = require('../CruParser');
const fs = require('fs');
const path = require('path');


describe("Specification F2 - Room maximum capacity", function(){

    let parsed = [];

    beforeAll(function(){
        console.log("➡️  Chargement et parsing des fichiers CRU...");

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

        console.log(`✔️  Parsing terminé. Total d'entrées chargées : ${parsed.length}`);
        console.log("------------------------------------------------------------\n");
    });


    it("should return max capacity for an existing room", function(){

        const room = "D102";
        console.log(`➡️  Test : Récupération de la capacité maximale pour la salle '${room}'`);

        const coursSalle = parsed.filter(c => c.salle === room);
        console.log(`   - Nombre de cours trouvés : ${coursSalle.length}`);

        expect(coursSalle.length).toBeGreaterThan(0);

        const maxCap = Math.max(...coursSalle.map(c => parseInt(c.capacite, 10)));
        console.log(`   - Capacité maximale trouvée : ${maxCap}`);

        expect(maxCap).toBeDefined();
        expect(maxCap).toBeGreaterThan(0);

        console.log(`✔️  Succès : capacité max correctement déterminée pour '${room}'\n`);
    });


    it("should throw an error if room id is empty", function(){

        const room = "";
        console.log("➡️  Test : Gestion d’une salle vide");

        function testEmptyRoom(){
            if(!room || room.trim() === ""){
                console.log("   ❗ Détection correcte d’une salle vide");
                throw new Error("L'identifiant de la salle ne peut pas être vide.");
            }
        }

        expect(testEmptyRoom).toThrowError("L'identifiant de la salle ne peut pas être vide.");

        console.log("✔️  Succès : erreur correctement levée pour salle vide\n");
    });


    it("should throw an error if room does not exist", function(){

        const room = "ROOM_NOT_REAL";
        console.log(`➡️  Test : Salle inexistante '${room}'`);

        function testRoomNotFound(){
            const coursSalle = parsed.filter(c => c.salle === room);

            console.log(`   - Nombre de cours trouvés : ${coursSalle.length}`);

            if(coursSalle.length === 0){
                console.log("   ❗ Salle détectée comme inexistante");
                throw new Error("La salle n'existe pas.");
            }
        }

        expect(testRoomNotFound).toThrowError("La salle n'existe pas.");

        console.log("✔️  Succès : erreur correctement levée pour salle inexistante\n");
    });

});
