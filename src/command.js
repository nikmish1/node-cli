import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { findNotes, getAllNotes, newNote, removeAllNotes, removeNote } from './notes.js'

// should be in utils.js

const listNotes = (notes) => {
    console.log("Notes: ");

    notes.forEach(({ id, content, tags }) => {
        console.log(`ID: ${id} - ${content}`);
        if (tags.length) {
            console.log(`Tags: ${tags.join(', ')}`);
        }

        console.log("\n");
    })
}

yargs(hideBin(process.argv))
    .command('new <note>', 'Create a new note', yargs => {
        return yargs.positional('note', {
            description: 'the content of note to create',
            type: 'string'
        })
    }, async (argv) => {
        const tags = argv.tags ? argv.tags?.split(',') : [];

        const note = await newNote(argv.note, tags);
        console.log("New Note Created: ", note);
    }).option('tags', {
        alias: 't',
        type: 'string',
        description: 'add tags to the note'
    })
    .command('all', 'get all notes', () => { }, async (argv) => {
        const notes = await getAllNotes();
        listNotes(notes);
    })
    .command('find <filter>', 'get matching notes', yargs => {
        return yargs.positional('filter', {
            describe: 'The search term to filter notes by, will be applied to note.content',
            type: 'string'
        })
    }, async (argv) => {
        const notes = await findNotes(argv.filter);
        listNotes(notes);
    })
    .command('remove <id>', 'remove a note by id', yargs => {
        return yargs.positional('id', {
            type: 'number',
            description: 'The id of the note you want to remove'
        })
    }, async (argv) => {
        try {
            await removeNote(argv.id);
            console.log(`Note with id ${argv.id} removed`);
        } catch (e) {
            console.error(e.message);
        }

    })
    .command('web [port]', 'launch website to see notes', yargs => {
        return yargs
            .positional('port', {
                describe: 'port to bind on',
                default: 5000,
                type: 'number'
            })
    }, async (argv) => {

    })
    .command('clean', 'remove all notes', () => { }, async (argv) => {
        await removeAllNotes();
        console.log("All notes removed");
    })
    .demandCommand(1)
    .parse()