xmlRenderedOnPage=false


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function splitCamelCase(string) {
    return capitalizeFirstLetter(string.replace(/([a-z])([A-Z])/g, '$1 $2'))
}


function parseXML(kind='render', xmlPath="XML/Madorski_2.0.xml", elementToStickToID='bio-header'){
    personXMLTree = null
    fetch(xmlPath)
    .then((response) => response.text())
    .then((text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/xml");
    personXMLTree = doc.documentElement.querySelector('profileDesc particDesc listPerson person')
    geoXMLTree = doc.documentElement.querySelector('profileDesc settingDesc listPlace')
    rdfDescriptionTree = doc.documentElement.querySelector('xenoData RDF Description')
    if (kind === 'render' && xmlRenderedOnPage === false){
        xmlRenderedOnPage = true

        node = document.getElementById(elementToStickToID);

        innerHTMLToAdd = ''
                

        for (n of personXMLTree.childNodes) {
            if (n.nodeName === 'persName') {
                innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">'+'<div>Person name: </div>'+'<div>'+n.innerHTML+'</div>'+'</div>'
            }

            if (n.nodeName === 'birth') {
                innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">'+'<div>Birth date: </div>'+'<div>'+n.getAttribute("when")+'</div>'+'</div>'
                innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">'+'<div>Birth place: </div>'+'<div>'+n.querySelector('placeName').innerHTML+'</div>'+'</div>'
            }

        }


        level = 0
        for (n of rdfDescriptionTree.childNodes) {

        
            if (n.nodeName === 'dcterms:educationLevel') {
                level += 1 

                const val = n.querySelector('Description value')?.innerHTML
                const grad = n.querySelector('Description date')?.innerHTML
                const org = n.querySelector('spatial name')?.innerHTML
                
                if (!!val) {
                    innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; margin-top: 0.5rem">'+'<div>'+'Education Level ' + level +':</div>'+'<div>'+val+'</div>'+'</div>'
                }
                if (!!org) {
                    innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">'+'<div>'+'Institution' +':</div>'+'<div style="text-align: right">'+org+'</div>'+'</div>'
                }
                if (!!grad) {
                    innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">'+'<div>'+'Graduation Date' +':</div>'+'<div>'+grad+'</div>'+'</div>'
                }
                   

                
            }
        }


        node.insertAdjacentHTML('beforeend', '<div style="display: flex; text-align: left; align-items: center; justify-content: center; width: 100%;  flex-direction: row; ">'+'<div style="display: flex; justify-content: center;  flex-direction: column; gap:0.2rem; margin-top: 0.8rem; width: 100%; font-family: Arial, sans-serif; font-size: 1.2rem">'+innerHTMLToAdd+'</div></div>');


    } else if (kind === 'download') {

        node = document.getElementById(elementToStickToID);

        let csv_text = ''
                
        for (n of personXMLTree.childNodes) {
            console.log(n)
            if (n.nodeName === 'persName') {

                csv_text += 'Person name' + ',' + n.innerHTML + ',' + '\n'
                
            }

            else if (n.nodeName === 'birth') {

                csv_text += 'Birth date' + ',' + n.getAttribute("when") + ',' + '\n'

                csv_text += 'Birth place' + ',' + n.querySelector('placeName').innerHTML + ',' + '\n'
                
            }

        }


        level = 0
        for (n of rdfDescriptionTree.childNodes) {

            if (n.nodeName === 'dcterms:educationLevel') {
                level += 1 

                const val = n.querySelector('Description value')?.innerHTML
                const grad = n.querySelector('Description date')?.innerHTML
                const org = n.querySelector('spatial name')?.innerHTML
                
                if (!!val) {
                    csv_text += 'Education Level ' + level +','+ val + ',' + '\n'
                }
                if (!!org) {
                    csv_text += 'Institution' + ','+ org + ',' + '\n'
                }
                if (!!grad) {
                    csv_text += 'Graduation date' + ','+ grad + ',' + '\n'
                }
                   
                

                
            }
        }
        downloadCSVFile(csv_text);

    } else if (kind === 'map'){

        node = document.getElementById(elementToStickToID);

        innerHTMLToAdd = ''
        

        console.log('here')

        


        level = 0
        geoList = []
        for (n of geoXMLTree.childNodes) {
            
        
            if (n.nodeName === 'place') {
                level += 1 
                
                const name = n.querySelector('placeName')?.innerHTML
                const geo = n.querySelector('location geo')?.innerHTML
                
                let geoDesc = {
                    'name': '',
                    'geo': [0,0]
                }

                if (!!name) {
                    geoDesc['name'] = name
                    // innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; margin-top: 0.5rem">'+'<div>'+'Education Level ' + level +':</div>'+'<div>'+name+'</div>'+'</div>'
                }
                if (!!geo) {
                    geoDesc['geo'][0] = geo.split(',')[0]
                    geoDesc['geo'][1] = geo.split(',')[1]
                    // innerHTMLToAdd += '<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">'+'<div>'+'Graduation Date' +':</div>'+'<div>'+geo+'</div>'+'</div>'
                }

                geoList.push(geoDesc)
                   

                console.log(name, geo)

                
            }
        }
        console.log(geoList)


        let x0 = geoList[0]['geo'][0]
        let y0 = geoList[0]['geo'][1]
        var map = L.map('map').setView([x0, y0], 2);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)


        for (place of geoList) {
            L.marker([place['geo'][0], place.geo[1]]).addTo(map)
                .bindPopup(place['name'])
                .openPopup();
        }
        
        mapNode = document.getElementById('map');

        innerHTMLToAdd = ''

        for (n of personXMLTree.childNodes) {
            if (n.nodeName === 'persName') {
                innerHTMLToAdd += 'Key places for '+n.innerHTML+' Career'
            }

            

        }


        mapNode.insertAdjacentHTML('beforebegin', '<div style="display: flex; text-align: left; align-items: center; justify-content: center; width: 100%;  flex-direction: row; ">'+'<div style="display: flex; justify-content: center;  flex-direction: column; gap:0.2rem; margin-top: 0.8rem; width: 100%; font-family: Arial, sans-serif; font-size: 1.2rem; font-weight: 600">'+innerHTMLToAdd+'</div></div>');


    }



    });
}
        



function downloadCSVFile(csv_data) {

    // Create CSV file object and feed
    // our csv_data into it
    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    // Create to temporary link to initiate
    // download process
    let temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = "parsed_xml.csv";
    let url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}
