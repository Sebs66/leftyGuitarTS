export class GuitarHTML {
    constructor(id) {
        this.frets = [];
        this.openStrings = [];
        const guitarRoot = document.getElementById(id);
        guitarRoot.classList.add('guitarra');
        const fret0 = document.createElement("div");
        fret0.classList.add('cuerdasCuello');
        for (let i = 0; i < 6; i++) {
            const string = document.createElement("div");
            string.classList.add('cuerda');
            fret0.appendChild(string);
        }
        guitarRoot.appendChild(fret0);
        const neck = document.createElement("div");
        neck.classList.add('cuello');
        guitarRoot.appendChild(neck);
        for (let i = 0; i < 24; i++) {
            const fret = document.createElement("div");
            fret.classList.add('traste');
            for (let i = 0; i < 6; i++) {
                const string = document.createElement("div");
                string.classList.add('cuerda');
                fret.appendChild(string);
            }
            neck.appendChild(fret);
            this.frets.push(fret);
        }
        const openNotes = document.createElement("div");
        openNotes.classList.add('notasCuerdas');
        guitarRoot.appendChild(openNotes);
        const fret = document.createElement('div');
        fret.classList.add('traste');
        openNotes.appendChild(fret);
        for (let i = 0; i < 6; i++) {
            const string = document.createElement("div");
            string.classList.add('open');
            fret.appendChild(string);
            this.openStrings.push(string);
        }
    }
    /**
     * The number of frets to be displayed. Up to 24.
     * @param quantity
     */
    displayFrets(quantity) {
        this.frets.slice(quantity).forEach((htmlElement) => {
            htmlElement.setAttribute('style', 'display:None');
        });
    }
    fillNotes(guitar) {
        this.openStrings.forEach((string, index) => {
            const notas = guitar.getAt(0);
            string.textContent = notas[index];
        });
        this.frets.forEach((fret, index) => {
            const cuerdas = Array.from(fret.querySelectorAll('.cuerda'));
            const notas = guitar.getAt(index + 1);
            cuerdas.forEach((cuerda, indexCuerda) => {
                const notaHTML = document.createElement('p');
                notaHTML.classList.add("nota", "seleccionado");
                notaHTML.textContent = notas[indexCuerda];
                cuerda.appendChild(notaHTML);
            });
        });
    }
    showScale(guitar) {
    }
}
class Fret {
    constructor(parent, index, stringType) {
        this.parent = parent;
        this.index = index;
        this.stringType = stringType;
        this.strings = [];
        this.html = document.createElement("div");
        this.html.classList.add('traste');
        for (let i = 0; i < 6; i++) {
            const string = document.createElement("div");
            string.classList.add(stringType, `cuerda${i + 1}`);
            const note = document.createElement('p');
            note.classList.add('nota');
            string.append(note);
            this.html.appendChild(string);
            this.strings.push(string);
        }
    }
}
class Strings {
    constructor(parent) {
        this.html = document.createElement("div");
        this.html.classList.add('cuerdasCuello');
        for (let i = 0; i < 6; i++) {
            const string = document.createElement("div");
            string.classList.add('cuerda');
            this.html.appendChild(string);
        }
        parent.append(this.html);
    }
}
class Neck {
    constructor(parent) {
        this.parent = parent;
        this.frets = [];
        this.strings = {};
        const html = document.createElement("div");
        html.classList.add('cuello');
        for (let i = 0; i < 24; i++) {
            const fret = new Fret(html, i, 'cuerda');
            html.appendChild(fret.html);
            this.frets.push(fret);
        }
        this.html = html;
        parent.appendChild(html);
        for (let i = 1; i <= 6; i++) {
            this.strings[`cuerda${i}`] = Array.from(this.html.querySelectorAll(`.cuerda${i} p.nota`));
        }
    }
    fillNotes(tuning, scale) {
        console.log('neck.fillNotes');
        //tuning.reverse();
        for (let i = 0; i < 6; i++) {
            const indexOfRoot = scale.scaleCromatic.indexOf(tuning[i]);
            let notes = [...scale.scaleCromatic.slice(indexOfRoot), ...scale.scaleCromatic.slice(1, indexOfRoot)]; /// Rearranging the notes in the guitarString order.
            notes = [...notes, ...notes, ...notes];
            let activeNotes = [...scale.activeNotes.slice(indexOfRoot), ...scale.activeNotes.slice(1, indexOfRoot)]; /// Rearranging the notes in the guitarString order. 
            activeNotes = [...activeNotes, ...activeNotes, ...activeNotes];
            this.strings[`cuerda${i + 1}`].forEach((nota, index) => {
                nota.innerText = notes[index + 1];
                if (activeNotes[index + 1]) {
                    nota.classList.add('seleccionado');
                }
            });
        }
    }
    toggleNote(note) {
    }
}
class OpenFret {
    constructor(parent) {
        this.parent = parent;
        this.html = document.createElement("div");
        this.html.classList.add('notasCuerdas');
        this.fret = new Fret(this.html, -1, 'open');
        this.parent.appendChild(this.html);
        this.html.append(this.fret.html);
    }
    fillOpenNotes(tuning) {
        tuning.reverse();
        tuning.forEach((openNote, index) => {
            this.fret.strings[index].innerText = openNote;
        });
    }
}
export class GuitarView {
    constructor(id, scale, tuning) {
        this.scale = scale;
        this.tuning = tuning;
        const parent = document.getElementById(id);
        if (!parent)
            throw new Error(`No element with id "${id}" found!`);
        parent.classList.add('guitarra');
        this.strings = new Strings(parent);
        this.neck = new Neck(parent);
        this.openFret = new OpenFret(parent);
        this.fillNotes();
    }
    fillNotes() {
        this.openFret.fillOpenNotes(this.tuning);
        this.neck.fillNotes(this.tuning, this.scale);
    }
}
