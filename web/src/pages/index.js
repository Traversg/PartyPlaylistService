import BindingClass from '../util/bindingClass';
import DataStore from '../util/DataStore';
import Header from '../components/header';
import PartyPlaylistClient from '../api/partyPlaylistClient';

class CreatePlaylist extends BindingClass {
    constructor(){
        super();
        this.bindClassMethods(['mount', 'submit', 'redirectToAdmin', 'hostLogin'], this);
        this.dataStore = new DataStore();
        this.dataStore.addChangeListener(this.redirectToAdmin);
        this.header = new Header(this.dataStore);
    }


    mount() {
        document.getElementById('createPlaylist').addEventListener('click', this.submit);
        document.getElementById('adminLoginButton').addEventListener('click', this.hostLogin);
        this.header.addHeaderToPage();
        this.header.loadData();
        this.client = new PartyPlaylistClient();
    }

    async submit() {
        document.getElementById('createPlaylist').innerText = 'Creating Playlist...';
        const playlistName = document.getElementById('newPlaylistName').value;
        const hostFirstName = document.getElementById('hostFirstName').value;
        const hostLastName = document.getElementById('hostLastName').value;

        const host = await this.client.createHost(hostFirstName, hostLastName);
        this.dataStore.set('user', host);

        const playlistHost = hostFirstName +'\xa0'+ hostLastName;
        const playlist = await this.client.createPlaylist(playlistName, playlistHost);
        this.dataStore.set('playlist', playlist);
        document.getElementById('createPlaylist').innerText = 'Created';
    }

    async hostLogin() {
        document.getElementById('adminLoginButton').innerText = 'Logging In...';
        const playlistName = document.getElementById('adminPlaylistName');
        const hostName = document.getElementById('hostName');

        const playlistId = await this.client.getHost;
        
        document.getElementById('adminLoginButton').innerHTML = 'Logged In';
        window.location.href = `/admin.html/${playlistId}`
    }

    redirectToAdmin() {
        const playlist = this.dataStore.get('playlist');
        if (playlist != null) {
            window.location.href = `/admin.html`;
        }
    }

}

class GetPlaylist extends BindingClass {
    constructor(){
        super();
        this.bindClassMethods(['mount', 'submit', 'redirectToPlaylist'], this);
        this.pDataStore = new DataStore();
        this.pDataStore.addChangeListener(this.redirectToPlaylist);
        this.pHeader = new Header(this.pDataStore);
    }

    async submit() {
        document.getElementById('playlist-login').innerText = 'Logging in...';
        const partyPlaylist = await this.client.getPlaylist('01');
        this.pDataStore.set('playlist', partyPlaylist);
        document.getElementById('guestLoginButton').innerText = 'Logged in';
    }

    mount() {
        document.getElementById('guestLoginButton').addEventListener('click', this.submit);
        this.pHeader.addHeaderToPage();
        this.pHeader.loadData();
        this.client = new PartyPlaylistClient();
    }

    redirectToPlaylist() {
        const playlist = this.pDataStore.get('playlist');
        if (playlist != null) {
            window.location.href = `/playlist.html`;
        }
    }

}

    const main = async () => {
        const createPlaylist = new CreatePlaylist();
        createPlaylist.mount();
        const getPlaylist = new GetPlaylist();
        getPlaylist.mount();
    }
    window.addEventListener('DOMContentLoaded', main);