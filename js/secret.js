// Hint: Secret Invasion

var ss = ["",""]
const ssf = [
    x=>{
        ss[0] += x.toLowerCase()
        if (!"secretinvasion".includes(ss[0]) && !"shark".includes(ss[0]) && !"bangdream".includes(ss[0]) && !"hikari".includes(ss[0])) {
            ss[0] = ""
        } else if (ss[0] == "secretinvasion") {
            ss[0] = ""
            addPopup({
                html: `
                    "Secret Invasion"?<br><br>Ok, here code is ${ss[1]}<br><br>
                    <b>The code expires in next nearest hour, and is happening!</b>
                `,
                width: 400,
                height: 150,
                otherStyle: {
                    'font-size': "14px",
                },
            })
        } else if (ss[0] == "shark") {
            ss[0] = ""
            addNotify(`Shark!!1!`)
        } else if (ss[0] == "bangdream") {
            ss[0] = ""
            addPopup({
                html: `
                    You input "BanGDream" in the periodic table.
					<br>
					I'm a BanG Dream! Girls Band Party! player.
					<br>
					My favorite BanG Dream! band is Poppin'Party.
					<br>
					And my favorite BanG Dream! character is Kasumi Toyama.
					<br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;---loader3229
					<br>
					<a href="https://discord.gg/bangdream" target="_blank" style="color:yellow;">BanG Dream! Official Discord</a>
					<br>
					<a href="https://qq1010903229.github.io/bandorichartsEN" target="_blank" style="color:yellow;">My BanG Dream! Fanmade Charts</a>
					<br>
					<a href="https://bestdori.com/" target="_blank" style="color:yellow;">Bestdori!</a>
					<br>
					<span style="font-size:100%;color:#666666;">The Answer 2 is "KiraKiraDokiDoki"</span>
					<br>
					<img src="/incremental-mass-rewritten/images/kasumi.png">
                `,
                width: 500,
                height: 400,
                otherStyle: {
                    'font-size': "14px",
                },
            })
        } else if (ss[0] == "hikari") {
            ss[0] = ""
            addNotify(`Hikari!<br><img style="width: 300px;" src="/incremental-mass-rewritten/images/hikari.png">`)
        }
    },
    _=>{
        let t = Math.floor(date/3600000)
        ss[1] = Math.floor(t**(2*(Math.sin(t**3/Math.PI)+1))).toString(36)
    },
    x=>{
        if (x == ss[1]) {
            localStorage.setItem("imr_secret",ss[1])
            window.open("./hidden.html","_self")
            return true
        }
        return false
    },
]