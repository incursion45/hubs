

export default class SlipSpaceManger{
    jwtToken = "";
    baseUri = "";
    constructor(baseUri){
        this.baseUri = baseUri;
        console.log(`baseUri : ${baseUri}`);
        console.log("SlipSpaceManger init start");
        this.init()
        .then(() => {
            console.log("SlipSpaceManger init finshed");
        });
    }

    async init() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const userToken = urlSearchParams.get('userToken')

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
                
                console.dir(me);
            }
        }
    }
}