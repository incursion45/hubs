import { HubConnectionBuilder } from "../vendor/signalr/esm";



export default class SlipSpaceManger{
    jwtToken = "";
    baseUri = "";
    connection = null;
    user = {};
    roomName = "";

    constructor(baseUri, roomName){
        this.baseUri = baseUri;
        this.roomName = roomName;

        console.log(`baseUri : ${baseUri}`);
        console.log(`roomName : ${roomName}`);
        console.log("SlipSpaceManger init start");
        
        this.init()
        .then(() => {
            console.log("SlipSpaceManger init finshed");
        });
    }

    enterRoom(){
        this.connection.invoke('JoinRoom', this.roomName).catch(e => {
            return console.error(e);
        });
    }

    leaveRoom(){
        this.connection.invoke('LeaveRoom', this.roomName).catch(e => {
            return console.error(e);
        });
    }

    async init() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const userToken = urlSearchParams.get('user_token')
        
        this.connection = new HubConnectionBuilder().withUrl(`${this.baseUri}LobbyHub`).build();

        this.connection.on('roomUpdate',(count) => {
            console.log(`Room Count is ${count}`);
        });
        
        var model = this;
        window.addEventListener('beforeunload', function(e) {
            model.leaveRoom();
        });


        if(userToken){
            let loginResponse = await fetch(`${this.baseUri}users/login/${userToken}`);
            let loginObj = await loginResponse.json();
            
            if(loginResponse.status === 200){
                this.jwtToken = loginObj.jwt;
                let meResponse = await fetch(`${this.baseUri}users/me?time=${(Date.now())}`,{
                    method:"GET",
                    headers: new Headers({
                        'Authorization': `Bearer ${this.jwtToken}`
                      })
                });

                let me = await meResponse.json();
                
                if(me.isLogin === true){
                    this.user = me.user;
                    var manger = this;
                    this.connection.start().then(function () {
                       console.log(`connection made`);
                       manger.enterRoom();
                    }).catch(function (err) {
                        return console.error(err.toString());
                    });
                }
            }
        }
    }
}

function wireupSignlREvents(connection){
    connection.on('roomUpdate',(count) => {
        console.log(`Room Count is ${count}`);
    })
}