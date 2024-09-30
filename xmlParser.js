
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function splitCamelCase(string) {
    return capitalizeFirstLetter(string.replace(/([a-z])([A-Z])/g, '$1 $2'))
}



function parseXML(kind='render', xmlPath="XML/Madorski_2.0.xml", elementToStickToID='rec549083178', xmlRenderedOnPage=false){
    personXMLTree = null
    fetch(xmlPath)
    .then((response) => response.text())
    .then((text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/xml");
    personXMLTree = doc.documentElement.querySelector('profileDesc particDesc listPerson person')

    if (kind === 'render' && xmlRenderedOnPage === false){
        xmlRenderedOnPage = true


        node = document.getElementById(elementToStickToID);

        innerHTMLToAdd = ''
                

        for (n of personXMLTree.childNodes) {
            // console.log(n)
            if (n.nodeName === 'persName') {
                innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: center; gap: 2rem">'+'<div>Person name: </div>'+'<div>'+n.innerHTML+'</div>'+'</div>'
            }

            if (n.nodeName === 'birth') {
                innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">'+'<div>Birth date: </div>'+'<div>'+n.getAttribute("when")+'</div>'+'</div>'
                innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">'+'<div>Birth place: </div>'+'<div>'+n.querySelector('placeName').innerHTML+'</div>'+'</div>'
            }

            if (n.nodeName === 'listEvent') {

                for (ev of n.childNodes) {
                    //if (typeof ev === 'string')
                    //console.log(ev);
                    if ( (ev.nodeName === '#text') === false) {
                        //console.log(ev.getAttribute("type"))
                        innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">'+'<div>'+splitCamelCase(ev.getAttribute("type"))+':</div>'+'<div>'+ev.querySelector('p').innerHTML+'</div>'+'</div>'
                
                    }
                }
            }
        }


        node.insertAdjacentHTML('beforebegin', '<div style="display: flex; text-align: left; align-items: center; justify-content: center; width: 100vw;  flex-direction: row; "">'+'<div style="display: flex; text-align: center; align-items: center; justify-content: center;  flex-direction: column; width: 30rem;">'+innerHTMLToAdd+'</div></div>');


    }

    });
}
        

