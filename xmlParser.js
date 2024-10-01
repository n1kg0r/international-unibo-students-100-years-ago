xmlRenderedOnPage=false


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function splitCamelCase(string) {
    return capitalizeFirstLetter(string.replace(/([a-z])([A-Z])/g, '$1 $2'))
}


function parseXML(kind='render', xmlPath="XML/Madorski_2.0.xml", elementToStickToID='rec549083178'){
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
            console.log(n)
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


    } else if (kind === 'download') {

        node = document.getElementById(elementToStickToID);

        let csv_data = [];
                

        for (n of personXMLTree.childNodes) {
            csv_row = []
            console.log(n)
            if (n.nodeName === 'persName') {
                csv_row.push('Person name')
                csv_row.push(n.innerHTML)
                csv_data.push(csv_row)
                // csv_data.push('\n')
            }

            else if (n.nodeName === 'birth') {
                csv_row.push('Birth date')
                csv_row.push(n.getAttribute("when"))
                csv_data.push(csv_row)

                csv_row.push('Birth place')
                csv_row.push(n.querySelector('placeName').innerHTML)
                csv_data.push(csv_row)
                // csv_data.push('\n')
            }

            else if (n.nodeName === 'listEvent') {

                for (ev of n.childNodes) {
                    //if (typeof ev === 'string')
                    //console.log(ev);
                    if ( (ev.nodeName === '#text') === false) {
                        //console.log(ev.getAttribute("type"))
                        csv_row = []
                        csv_row.push(splitCamelCase(ev.getAttribute("type")))
                        csv_row.push(ev.querySelector('p').innerHTML)
                        csv_data.push(csv_row)
                        csv_data.push('\n')
                        
                
                    }
                }
            }

            
            
        }

        downloadCSVFile(csv_data);

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
