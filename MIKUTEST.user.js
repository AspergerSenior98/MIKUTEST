// ==UserScript==
// @name MIKUTEST
// @description A script that gives students more motivation to work on progtest
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://progtest.fit.cvut.cz/*
// @grant        GM_addStyle
// ==/UserScript==

/*

Author: "roulfield"


LICENSE

The userscript's original source code is licensed under the MIT License.

Third-party images and other assets are NOT covered by this license.
They remain the property of their respective copyright holders and
are subject to their original licenses. 
If a picture you own is being used here against your wishes, 
please contact me at identificationegg@gmail.com

*/
function lerpColor(a, b, t) {
    if(t > 1){
      t = 1;
    } 
    else if(t<0){
      return `rgb(11,11,11)`;
    }
    const ah = a.replace("#", "");
    const bh = b.replace("#", "");

    const ar = parseInt(ah.substring(0, 2), 16);
    const ag = parseInt(ah.substring(2, 4), 16);
    const ab = parseInt(ah.substring(4, 6), 16);

    const br = parseInt(bh.substring(0, 2), 16);
    const bg = parseInt(bh.substring(2, 4), 16);
    const bb = parseInt(bh.substring(4, 6), 16);

    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);

    return `rgb(${r}, ${g}, ${bl})`;
};

ri={
  1:"https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/ratings/Goku-Staring-meme-7iskwn.jpg",
  2:"https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/ratings/kasane-teto-sad.png",
  3:"https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/ratings/pear.jpg",
  4:"https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/ratings/mikuyippeee.png",
  5:"https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/ratings/sigma.png",
  6:"https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/ratings/thinking.png"
}

function fetchimage(t){
  if(t<0.1){
    return ri[1]
  }else if(t<0.4){;
    return ri[2];
  }else if(t<0.7){
    return ri[3];
  }else if(t<1){
    return ri[4];
  }else if(t<=1.1){
    return ri[5];
  }else{
    return ri[6]
  }
}

GM_addStyle(`

  summary,.toolItem2,.menuItem2 {
  background-color : #555555 !important;
  }

  .menuItem3 {
  background-color : #ebebeb !important;
  }

  b{
    color: #FF24DE;
     text-shadow: -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff;
  }

  body{
  background-color : #242424 !important;
  }

  .mikutest{
  padding-right : 200px
  }

  .navcontainer {
  height : 80% !important;
  padding : 0px !important;
  display : flex;
  align-items : center;
  justify-content : space-between;
  flex-direction: row;
  }

  div.navLink {
  height : 120px;
  align-items: center;
  background-image : linear-gradient(to bottom, #00FFFF 0%, #27BEF5 100%);
  }

  .resultimg{
    height : 60px; 
    ratio : 1/1;
  }

  .gokufade{
    opacity: 0;
    transition: opacity 3s ease;
  }

  .gokufade.visible{
    opacity: 1;
  }
`);


//BANNER
const container = document.querySelector("div.navLink > div");
const mainImg = document.createElement("img");
mainImg.classList.add("mikutest");
mainImg.src = "https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/mikutest.png";
const logout = document.querySelector("div.navLink  > div:nth-child(2)");
logout.style.paddingRight = "20px";
container.classList.add("navcontainer");
container.appendChild(mainImg);
container.appendChild(logout);
const guide = document.querySelector("div.navLink > div > span");
guide.style.paddingLeft = "20px";

//ASSIGNMENTS
const img = document.querySelectorAll(".menuItem3 img");
if(img.length>0){
  img.forEach(im => {
    im.style.height = "40px"
    im.src = "https://raw.githubusercontent.com/AspergerSenior98/MIKUTEST/refs/heads/main/sideways.png" 
  });
}
const unav = document.querySelectorAll(".menuItem3:not(:has(> a)) > div");
if(unav.length>0){
  unav.forEach(di => {
  di.style.backgroundColor="#999999"; 
  });
}

//POINT RESULTS
const resultBoxes = document.querySelectorAll(".newBox > table >tbody");
if(resultBoxes.length > 0){

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
      });
        }, {
      threshold: 0.1
    });

    resultBoxes.forEach(box => {
    if(box.children[2].children.length > 1){
      //Get score value
      var num=box.children[2].children[1].innerText;
      //If it doesn't exist then this tab isnt a score tab
      if (/^\d\.\d+$/.test(num)) {
        box.children[0].style.height = "60px"
        //Load image
        const resImg = document.createElement("img");
        resImg.classList.add("resultimg");
        resImg.src = fetchimage(num);
        if(num < 0.1){
          resImg.classList.add("gokufade");
          observer.observe(resImg)
          console.log("added observer")
        }
        const td = box.children[0].children[1]
        td.appendChild(resImg);
        td.style.display="flex";
        td.style.justifyContent="space-between";
        td.style.alignItems="center";
      }else{
        num = num.slice(0,6);
        if(num == 0.000){
          return;
        }
      }
      //Recolor bar
      for (const child of box.children[0].children) {
        
        child.style.backgroundColor=lerpColor("#fd2a5f", "#00FFFF", num-0.1);
      }
    }
    
  });
}


