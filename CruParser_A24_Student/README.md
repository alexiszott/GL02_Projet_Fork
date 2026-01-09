# CruParser_A24_Student

---

## Setup

Open a terminal in the project folder:
```bash
cd //YourProject/GL02_Projet_Fork/CruParser_A24_Student
```

Install dependencies:
```bash
npm install
```

The project uses `@caporal/core`, `colors`, `vega`, and `vega-lite`.  
Missing dependencies identified during maintenance have been added.

Test the installation:
```bash
node caporalCli.js check SujetA_data/AB/edt.cru
```

---

## Project Structure

- `CruParser.js`: CRU parser implementation
- `cours.js`: course data structure
- `caporalCli.js`: command-line interface
- `package.json`: dependencies and scripts
- `spec/`: Jasmine unit tests
  - `F2_capacity.spec.js`: tests for maxcap
  - `F3_freeroom.spec.js`: tests for freeroom
- `node_modules/`: installed dependencies

If npm is missing, install Node.js LTS from https://nodejs.org/

---

## Commands

All commands run from `CruParser_A24_Student/`

**Syntax:**
```bash
node caporalCli.js  [options]
```

### check
Validates a CRU file.
```bash
node caporalCli.js check path/to/file.cru
```

### search
Searches entries in a CRU file.
```bash
node caporalCli.js search file.cru                # All entries
node caporalCli.js search file.cru -n INFO        # By keyword
node caporalCli.js search file.cru -d L           # By day
```

Options:
- `-n | --needle <keyword>`: search keyword
- `-d | --day <day>`: filter by day (L, MA, ME, J, V)

### ical
Generates an iCalendar file for courses between two dates.
```bash
node caporalCli.js ical 2024-01-15 2024-06-30 SY02 MT09 -o mon_calendrier.ics
```

Parameters:
- `<start>`: start date (YYYY-MM-DD)
- `<end>`: end date (YYYY-MM-DD)
- `<courses...>`: course codes
- `-o | --output <filename>`: output file (default: calendar.ics)

### maxcap
Returns maximum capacity for a room (Spec F2).
```bash
node caporalCli.js maxcap D102
```

Handles errors for empty/non-existent rooms.

### freeroom
Lists free time slots for a room (Spec F3).
```bash
node caporalCli.js freeroom D102
```

### freeclasses
Lists available rooms for a day and time range.
```bash
node caporalCli.js freeclasses L 08:00 10:00
```

### checkconflicts
Checks for scheduling conflicts.
```bash
node caporalCli.js checkconflicts              # Basic report
node caporalCli.js checkconflicts --detailed   # Detailed report
```

### salleCours
Lists classrooms for a course.
```bash
node caporalCli.js salleCours GL02
node caporalCli.js salleCours MA03 -c    # CM only
node caporalCli.js salleCours AP03 -t    # TP only
```

Options:
- `-c | --filtercm`: CM only
- `-t | --filtertp`: TP only
- `-d | --filtertd`: TD only

### tauxSalles
Computes room occupation rates. Generates SVG output and optional CSV export.
```bash
node caporalCli.js tauxSalles L 8:30 F1 J 17:00 F2
node caporalCli.js tauxSalles ME 9:30 F1 J 16:30 F2 -e
```

Parameters:
- `firstDay`, `lastDay`: L, MA, ME, J, V
- `firstHour`, `lastHour`: 08:00 to 20:00
- `firstWeek`, `lastWeek`: F0 to F9

Options:
- `-c | --filtercm`
- `-t | --filtertp`
- `-d | --filtertd`
- `-e | --export`: export to CSV

CSV export and graphical dependencies issues corrected during maintenance.

---

## Tests

**Max Capacity (F2)**
```bash
npm run test:f2
```

Tests: capacity calculation, empty room, non-existent room

**Free Room Slots (F3)**
```bash
npm run test:f3
```

Tests: free slots (8h–19h), empty room, non-existent room

---

## Documentation

GitHub Wiki:
- User Guide
- Developer Guide

https://github.com/alexiszott/GL02_Projet_Fork/wiki

---

## Authors

- Alexis Zott
- Othmane Houasli
- Enzo Mougin
- Mouad El Khalifi
