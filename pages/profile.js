import Head from 'next/head';
import styles from './profile';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {

    const [id, setId] = useState(1);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({});
    const [username, setUsername] = useState('');
    const [activeNotes, setActiveNotes] = useState(0);
    const [archiveArr, setArchiveArr] = useState([]);
    const [archivedNotes, setArchivedNotes] = useState(0);

    const route = useRouter();

    useEffect(() => {
        const userName = sessionStorage.getItem('user');
        if (userName === '' || userName === null) {
            route.push('/');
        } else {
            setUsername(userName);
        }
        getLocalNotes();
        getArchiveArr();

    }, []);

    function getArchiveArr() {
        const localArchiveArr = JSON.parse(localStorage.getItem('archiveNotes'));
        if (localArchiveArr != '' && localArchiveArr != null) {
            setArchiveArr(localArchiveArr);
            setArchivedNotes(localArchiveArr.length);
        } else {
            setArchivedNotes(0);
        }
    }

    function getLocalNotes() {
        const localNotesArr = JSON.parse(localStorage.getItem('localNotes'));
        if (localNotesArr != '' && localNotesArr != null) {
            setNotes(localNotesArr);
            setActiveNotes(localNotesArr.length);
            setId(localNotesArr[localNotesArr.length - 1].id + 1);
        } else {
            setActiveNotes(0);
        }
    }

    function handleAddNote() {
        document.getElementById('title-name').value = null;
        document.getElementById('content-text').value = null;
    }

    function handleSubmit() {
        const date = new Date();
        const fullDate = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        if (title !== '' || content !== '') {
            const noteDetails = { id: id, title: title, content: content, creationDate: fullDate, updationDate: fullDate };
            notes.push(noteDetails);
            setNotes(notes);
            setId(id + 1);
            localStorage.setItem('localNotes', JSON.stringify(notes));
            setTitle('');
            setContent('');
            setActiveNotes(notes.length);
        } else {
            alert('Atleast one detail needed, you cannot submit empty note !');
        }
    }

    function handleEdit(noteId) {
        let reqNote;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === noteId) {
                reqNote = notes[i];
                setCurrentNote(reqNote);
                break;
            }
        }
        document.getElementById('updated-title-name').value = reqNote.title;
        document.getElementById('updated-content-text').value = reqNote.content;
    }


    function handleUpdate() {
        const date = new Date();
        const fullDate = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        let updatedNote;
        if (title === '' && content === '') {
            updatedNote = { id: currentNote.id, title: currentNote.title, content: currentNote.content, creationDate: currentNote.creationDate, updationDate: fullDate };
        } else if (title !== '' && content === '') {
            updatedNote = { id: currentNote.id, title: title, content: currentNote.content, creationDate: currentNote.creationDate, updationDate: fullDate };
        } else if (title === '' && content !== '') {
            updatedNote = { id: currentNote.id, title: currentNote.title, content: content, creationDate: currentNote.creationDate, updationDate: fullDate };
        } else if (title !== '' && content !== '') {
            updatedNote = { id: currentNote.id, title: title, content: content, creationDate: currentNote.creationDate, updationDate: fullDate };
        }

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === currentNote.id) {
                notes[i] = updatedNote;
                setNotes(notes);
                localStorage.setItem('localNotes', JSON.stringify(notes));
                break;
            }
        }
        setTitle('');
        setContent('');
        route.replace('/profile');
    }

    function handleDelete(noteId) {
        const confirmation = prompt('Please type "YES" to confirm delete.');
        if (confirmation === 'YES' || confirmation === 'yes') {
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].id === noteId) {
                    notes.splice(i, 1);
                    break;
                }
            }
            setNotes(notes);
            localStorage.setItem('localNotes', JSON.stringify(notes));
            setActiveNotes(notes.length);
            route.replace('/profile');
        }
    }

    function handleArchive(noteId) {
        let archNote;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === noteId) {
                archNote = notes.splice(i, 1);
                break;
            }
        }
        archiveArr.push(archNote[0]);
        console.log(archNote[0]);
        setArchiveArr(archiveArr);
        localStorage.setItem('archiveNotes', JSON.stringify(archiveArr));
        setNotes(notes);
        localStorage.setItem('localNotes', JSON.stringify(notes));
        setArchivedNotes(archiveArr.length);
        setActiveNotes(notes.length);
        route.replace('/profile');
    }

    function handleLogout() {
        sessionStorage.removeItem('user');
        route.push('/');
    }

    function handleArchievBtn() {
        if (archivedNotes !== 0) {
            route.push('/profile/archivednotes');
        } else {
            alert('No Archieved Notes');
        }
    }


    return (
        <div>
            <Head>
                <title>Profile Dashboard</title>
                <meta name="Simple Note App" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div>
                    <nav className="navbar sticky-top bg-light" style={{ height: 70 }}>
                        <div className="container-fluid">
                            <Link className="navbar-brand" href="/profile">Sample Note</Link>
                            <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-whatever="@mdo" onClick={handleAddNote}>Add Note</button>
                            <button type="button" class="btn btn-outline-dark" style={{ width: 90, marginRight: 20 }} onClick={handleLogout}>Log Out</button>
                        </div>
                    </nav>
                </div>
                <div>
                    <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Note</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label for="recipient-name" class="col-form-label">Title</label>
                                            <input type="text" className="form-control" id="title-name" onChange={(event) => setTitle(event.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label for="message-text" className="col-form-label">Content</label>
                                            <textarea className="form-control" id="content-text" onChange={(event) => setContent(event.target.value)}></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-warning" data-bs-dismiss="modal" onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: 500, marginTop: 40 }}>
                    <h3 style={{ fontSize: 40 }}>Welcome {username}</h3>
                </div>
                <div style={{ paddingLeft: 10, width: 170, marginLeft: 60, marginTop: 30, color: 'blue', float: 'left' }}>
                    <h5>Active Notes : {activeNotes}</h5>
                </div>
                <div style={{ marginTop: 30 }}>
                    <button type="button" class="btn btn-success position-relative" onClick={handleArchievBtn}>Archived Notes<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{archivedNotes}</span>
                    </button>
                </div>
                <div className="row" style={{ marginLeft: 50, width: 1200 }}>
                    {
                        notes.map((list) => {
                            return (
                                <>
                                    <div className="col-sm-4" style={{ marginTop: 15 }}>
                                        <div className="card" style={{ backgroundColor: "lightgoldenrodyellow" }}>
                                            <div className="card-body">
                                                <p className="card-text" style={{ color: "lightsalmon", fontSize: 15 }}>Created - {list.creationDate}</p>
                                                <h5 className="card-title">{list.title}</h5>
                                                <p className="card-text">{list.content}</p>
                                                <p className="card-text" style={{ color: "lightgrey", fontSize: 15 }}>Last updated on {list.updationDate}</p>
                                                <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@fat" onClick={() => handleEdit(list.id)}>Edit</button>
                                                <button className="btn btn-outline-danger" style={{ marginLeft: 5 }} onClick={() => handleDelete(list.id)}>Delete</button>
                                                <button className="btn btn-outline-success" style={{ marginLeft: 5 }} onClick={() => handleArchive(list.id)}>Archive</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                <div>
                    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label for="recipient-name" class="col-form-label">Title</label>
                                            <input type="text" className="form-control" id="updated-title-name" onChange={(event) => setTitle(event.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label for="message-text" className="col-form-label">Content</label>
                                            <textarea className="form-control" id="updated-content-text" onChange={(event) => setContent(event.target.value)}></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-warning" data-bs-dismiss="modal" onClick={handleUpdate}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}