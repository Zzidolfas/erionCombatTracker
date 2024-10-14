let baseStats = {};  // To hold original creature stats
        let currentHP = {};  // To hold current HP values for each creature

        // Function to process the creature file
        function processFile(fileContent) {
            const creatures = fileContent.trim().split('\n').map(line => {
                const parts = line.split(',');
                const stats = {};
                parts.forEach((part, index) => {
                    const [key, value] = part.trim().split(':');
                    if (index === 0) {
                        stats.name = key.trim();
                    } else {
                        stats[key.trim()] = parseInt(value);
                    }
                });
                return { name: stats.name, stats: stats };
            });

            const tbody = document.querySelector('#creatureTable tbody');
            tbody.innerHTML = '';

            creatures.forEach(creature => {
                addCreatureToTable(creature);
            });
        }

        // Function to add a creature to the table
        function addCreatureToTable(creature) {
            const tbody = document.querySelector('#creatureTable tbody');

            const row = document.createElement('tr');

            baseStats[creature.name] = {
                Will: creature.stats['Will'],
                Reflex: creature.stats['Reflex'],
                Fortitude: creature.stats['Fortitude'],
                HP: creature.stats['HP']
            };

            currentHP[creature.name] = creature.stats['HP'];

            row.innerHTML = `
                <td>${creature.name}</td>
                <td class="initiative">${creature.stats['Initiative']}</td>
                <td id="${creature.name}-Will">
                    <span class="original-value">(${creature.stats['Will']})</span> ${creature.stats['Will']}
                </td>
                <td id="${creature.name}-Reflex">
                    <span class="original-value">(${creature.stats['Reflex']})</span> ${creature.stats['Reflex']}
                </td>
                <td id="${creature.name}-Fortitude">
                    <span class="original-value">(${creature.stats['Fortitude']})</span> ${creature.stats['Fortitude']}
                </td>
                <td id="${creature.name}-HP">${creature.stats['HP']}</td>
                <td>
                    <input type="number" id="${creature.name}-damage" placeholder="Damage">
                    <button onclick="applyDamage('${creature.name}')">Apply Damage</button>
                </td>
                <td><button onclick="rollDice('${creature.name}')">Roll Dice</button></td>
            `;

            tbody.appendChild(row);
        }

        // Function to apply damage
        function applyDamage(creatureName) {
            const damageInput = document.getElementById(`${creatureName}-damage`);
            const damageValue = parseInt(damageInput.value) || 0;
            currentHP[creatureName] -= damageValue;

            const hpElement = document.getElementById(`${creatureName}-HP`);
            if (currentHP[creatureName] <= 0) {
                hpElement.textContent = "Slain";
                hpElement.style.color = "red";
            } else {
                hpElement.textContent = currentHP[creatureName];
            }

            damageInput.value = '';
        }

        // Function to roll a dice
        function rollDice(creatureName) {
            const d20Roll = Math.floor(Math.random() * 20) + 1;

            ['Will', 'Reflex', 'Fortitude'].forEach(stat => {
                const element = document.getElementById(`${creatureName}-${stat}`);
                const baseValue = baseStats[creatureName][stat];

                element.innerHTML = `<span class="original-value">(${baseValue})</span> ${baseValue + d20Roll}`;
            });
        }

        // Add monster to the table dynamically
        function addMonster() {
            const name = document.getElementById('monsterName').value.trim();
            const initiative = parseInt(document.getElementById('monsterInitiative').value);
            const will = parseInt(document.getElementById('monsterWill').value);
            const reflex = parseInt(document.getElementById('monsterReflex').value);
            const fortitude = parseInt(document.getElementById('monsterFortitude').value);
            const hp = parseInt(document.getElementById('monsterHP').value);

            if (name && initiative && will && reflex && fortitude && hp) {
                const newCreature = {
                    name: name,
                    stats: {
                        Initiative: initiative,
                        Will: will,
                        Reflex: reflex,
                        Fortitude: fortitude,
                        HP: hp
                    }
                };

                addCreatureToTable(newCreature);  // Add new creature to the table

                // Clear input fields after adding
                document.getElementById('monsterName').value = '';
                document.getElementById('monsterInitiative').value = '';
                document.getElementById('monsterWill').value = '';
                document.getElementById('monsterReflex').value = '';
                document.getElementById('monsterFortitude').value = '';
                document.getElementById('monsterHP').value = '';
            } else {
                alert('Please fill out all fields!');
            }
        }

        // Setup event listener for Add Monster button
        document.getElementById('addMonsterButton').addEventListener('click', addMonster);

        // Function to handle file reading
        function readFile(file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileContent = event.target.result;
                processFile(fileContent);
            };
            reader.readAsText(file);
        }

        // Setup drag-and-drop functionality
        const dropZone = document.getElementById('dropZone');

        // Drag and drop event handlers
        dropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropZone.style.backgroundColor = '#f0f0f0';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.backgroundColor = '#fff';
        });

        dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropZone.style.backgroundColor = '#fff';
            const file = event.dataTransfer.files[0];
            if (file && file.type === 'text/plain') {
                readFile(file);
            } else {
                alert('Please drop a valid .txt file!');
            }
        });

        // Function to sort table rows by Initiative
        function sortTableByInitiative() {
            const tbody = document.querySelector('#creatureTable tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.sort((a, b) => {
                const aInitiative = parseInt(a.querySelector('.initiative').textContent);
                const bInitiative = parseInt(b.querySelector('.initiative').textContent);
                return bInitiative - aInitiative; // Sort descending
            });

            rows.forEach(row => tbody.appendChild(row)); // Reorder rows
        }

        // Setup event listener for Sort by Initiative button
        document.getElementById('sortByInitiativeButton').addEventListener('click', sortTableByInitiative);