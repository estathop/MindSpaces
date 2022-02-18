var fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios');
const { RDFMimeType } = require('graphdb').http;
const { RepositoryClientConfig, RDFRepositoryClient } = require('graphdb').repository;
var PROTO_PATH = __dirname + '/echo.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
const { config } = require('process');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var routeguide = protoDescriptor.unary;

function main() {
    var server = new grpc.Server();
    server.addService(routeguide.Unary.service, {

        GetServerResponse: getServerResponse,
        GetTAResponse: getTAResponse

    });
    server.bindAsync('160.40.52.155:49500', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });

}

function getServerResponse(call, callback) {
    console.log(call.request)
    callback(null, { message: "ok", received: 0 })
}

function getTAResponse(call, callback) {
    console.log(call.request)

    fs.writeFileSync('integrtest.ttl', '@prefix : <http://www.semanticweb.org/estathop/ontologies/2021/9/untitled-ontology-17#> . \n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix owl: <http://www.w3.org/2002/07/owl#> . \n@prefix geo: <http://www.opengis.net/ont/geosparql#> . \n@prefix xsd: <http://www.w3.org/2001/XMLSchema#>. \n', function (err) {
        if (err) return console.log(err);
        console.log('something with files went wrong !');
    });
    count = 0;
    var element = {}
    element.va_body = JSON.parse(call.request.message.va_body)
    element.ta_body = JSON.parse(call.request.message.ta_body)
    element.meta_body = JSON.parse(call.request.message.meta_body)

    let textuuid = uuidv4();
    if (element.ta_body.ta.dbpedia_linking.nodes.length > 0) {
        element.ta_body.ta.dbpedia_linking.nodes.forEach(element => {

            fs.appendFileSync('integrtest.ttl', '<' + element.metadata.uri + '> rdf:type owl:NamedIndividual , \n :URI ; \n :hasConfidence ' + element.metadata.confidence + ' . \n', function (err) {
                if (err) return console.log(err);
                console.log('something with files went wrong !');
            });
        })
    }
    fs.appendFileSync('integrtest.ttl', ':' + element.meta_body.id.replace(/ /g, "_") + ' rdf:type owl:NamedIndividual , \n :Image ; \n :hasArousal :arousal' + element.meta_body.id.replace(/ /g, "_") + ' ; \n ')

    nerstring = ':hasNer ';
    element.ta_body.ta.ner.nodes.forEach((element2, index) => {
        nerstring += ':ner' + (index + 1) + '' + element.meta_body.id.replace(/ /g, "_") + ' ,\n'
    })
    nerstring = nerstring.replace(/,([^,]*)$/, ';')

    fs.appendFileSync('integrtest.ttl', nerstring + '\n')

    fs.appendFileSync('integrtest.ttl', ':hasText :' + textuuid + ' ; \n')
    fs.appendFileSync('integrtest.ttl', ':hasValence :valence' + element.meta_body.id.replace(/ /g, "_") + ' ; \n')

    semsegstring = ':isSemSegContainer ';
    element.va_body.segmentation.segm_labels.forEach((element3, index2) => {
        semsegstring += ':semsegtop' + (index2 + 1) + 'class' + element.meta_body.id.replace(/ /g, "_") + ' , \n'
    })
    semsegstring = semsegstring.replace(/,([^,]*)$/, ';')
    fs.appendFileSync('integrtest.ttl', semsegstring + '\n')

    vergestring = ':isVergeContainer '
    element.va_body.classification.verge_labels.forEach((element4, index3) => {
        vergestring += ':vergetop' + (index3 + 1) + 'class' + element.meta_body.id.replace(/ /g, "_") + ' , \n'
    })
    vergestring = vergestring.replace(/,([^,]*)$/, ';')
    if (vergestring.length > 18) {
        fs.appendFileSync('integrtest.ttl', vergestring + '\n')
    }

    fs.appendFileSync('integrtest.ttl', ':hasDirection "' + element.meta_body.direction + '" ; \n \
:hasFocalLength "'+ element.meta_body.meta.FocalLength + '" ; \n \
:hasFocalLengthIn35 "'+ element.meta_body.meta.FocalLengthIn35 + '" ; \n \
:hasImageHeight "'+ element.meta_body.meta.ImageHeight + '" ; \n \
:hasImageWidth "'+ element.meta_body.meta.ImageWidth + '" ; \n \
:hasLat "'+ element.meta_body.lat + '" ; \n \
:hasLng "'+ element.meta_body.lng + '" ; \n \
:hasPitch "'+ element.meta_body.pitch + '" ; \n \
:hasSegmImageability "'+ element.ta_body.segm_imageability + '" ; \n \
:hasTextImageability "'+ element.ta_body.ta.imageability.metadata.text_imageability + '" ; \n \
:hasVergeImageability "'+ element.ta_body.verge_imageability + '" ; \n\
:hasVisualAnalysisTimestamp "'+ element.va_body.timestamp + '" ; \n \
:hasXResolution "'+ element.meta_body.meta.XResulution + '" ; \n \
:hasYResolution "'+ element.meta_body.meta.YResulution + '" ; \n \
:hasZoom "'+ element.meta_body.zoom + '" ; \n\
:isLandmark "'+ element.meta_body.landmark + '"^^xsd:boolean ; \n \ \
:isName "'+ element.meta_body.id + '" . \n \
\
')

    fs.appendFileSync('integrtest.ttl', ':arousal' + element.meta_body.id.replace(/ /g, "_") + ' rdf:type owl:NamedIndividual , \n \
:Arousal ; \n \
:hasProbability '+ element.va_body.sentiment.arousal_probability + ' ; \n \
:hasValue "'+ element.va_body.sentiment.arousal + '" . \n \
')

    element.ta_body.ta.ner.nodes.forEach((element2, index) => {
        fs.appendFileSync('integrtest.ttl', ':ner' + (index + 1) + '' + element.meta_body.id.replace(/ /g, "_") + ' rdf:type owl:NamedIndividual  , \n \
:Ner ; \n\
:hasBegin '+ element2.metadata.begin + ' ; \n \
:hasEnd '+ element2.metadata.end + ' ; \n \
:isCategory "'+ element2.metadata.category + '" ; \n \
:hasCoveredText "'+ JSON.stringify(element2.metadata.covered_text.replace(/"/g, " ")).replace(/(^"|"$)/g, '') + '" ; \n \
:hasLabel "'+ JSON.stringify(element2.label.replace(/\"/g, "")).replace(/(^"|"$)/g, '') + '" \
')
        logical_counter1 = 0;
        logical_counter2 = 0;
        logical_counter3 = 0;
        try {
            element.ta_body.ta.imageability.nodes.forEach(variablelabel => {
                if (element2.label === variablelabel.label) {
                    logical_counter1++;
                    logical_counter2++;
                    fs.appendFileSync('integrtest.ttl', ' ; \n \
  :NerhasImageabilityScore '+ variablelabel.metadata.imageability_score + '\
  ')
                }
                element.ta_body.ta.dbpedia_linking.nodes.forEach(dbvariable => {
                    if (element2.label.includes(dbvariable.label)) {
                        logical_counter1++;
                        logical_counter3++;
                        fs.appendFileSync('integrtest.ttl', ' ; \n \
  :hasURI <'+ dbvariable.metadata.uri + '> \
  ')
                    }
                })
            })
            if (logical_counter1 == 0) {
                fs.appendFileSync('integrtest.ttl', ' . \n')
            }
            if ((logical_counter2 > 0) || (logical_counter3 > 0)) {
                fs.appendFileSync('integrtest.ttl', ' . \n')
            }
        }
        catch (e) { }
    })

    element.va_body.segmentation.segm_labels.forEach((element3, index2) => {
        fs.appendFileSync('integrtest.ttl', ':semsegtop' + (index2 + 1) + 'class' + element.meta_body.id.replace(/ /g, "_") + ' rdf:type owl:NamedIndividual , \n \
:SemSegContainer ; \n \
:isSemSegLabel :'+ element3.replace(/ /g, "_") + ' ; \n\
:hasAccuracy "'+ element.va_body.segmentation.segm_probabilities[index2] + '" ; \n \
:hasPercentage "'+ element.va_body.segmentation.segm_percentages[index2] + '" ; \n \
:semseg_ta_contr_imageability "'+ element.ta_body.segm_labels_contribution_to_imageability[index2] + '" . \n \
')
    })

    element.ta_body.ta.emotion_detection.nodes.forEach((element6, index6) => {
        fs.appendFileSync('integrtest.ttl', ':sentence_' + (index6 + 1) + '_' + element.meta_body.id.replace(/ /g, "_") + ' rdf:type owl:NamedIndividual , \n \
:Sentence ; \n \
:hasBegin "'+ element6.metadata.begin + '" ; \n \
:hasCoveredText "'+ JSON.stringify(element6.metadata.covered_text.replace(/"/g, " ")).replace(/(^"|"$)/g, '') + '" ; \n \
:hasEmotag "'+ element6.metadata.emotag + '" ; \n \
:hasEmotagConfidence "'+ element6.metadata.confidence + '" ; \n \
:hasEnd "'+ element6.metadata.end + '" . \n \
')
    })

    fs.appendFileSync('integrtest.ttl', ':' + textuuid + ' rdf:type owl:NamedIndividual , \n \
:Text ; \n \
:isLang  "'+ element.meta_body.text.lang + '" ; \n \
:isText "'+ JSON.stringify(element.meta_body.text.comment.replace(/"/g, " ")).replace(/(^"|"$)/g, '') + '" ; \n \ ')
    sentencestring = "";
    element.ta_body.ta.emotion_detection.nodes.forEach((element6, index77) => {
        sentencestring += ':hasSentence :sentence_' + (index77 + 1) + '_' + element.meta_body.id.replace(/ /g, "_") + ' ; \n '

    })
    sentencestring = sentencestring.replace(/;[^;]*$/, '.')
    fs.appendFileSync('integrtest.ttl', sentencestring + ' \n')

    fs.appendFileSync('integrtest.ttl', ':valence' + element.meta_body.id.replace(/ /g, "_") + ' rdf:type owl:NamedIndividual , \n \
:Valence ; \n \
:hasProbability "'+ element.va_body.sentiment.valence_probability + '" ; \n \
:hasValue "'+ element.va_body.sentiment.valence + '" . \n \
')

    element.va_body.classification.verge_labels.forEach((element78, index88) => {
        fs.appendFileSync('integrtest.ttl', ':vergetop' + (index88 + 1) + 'class' + element.meta_body.id.replace(/ /g, "_") + '  rdf:type owl:NamedIndividual , \n \
:VergeContainer ; \n \
:isVergeLabel "'+ element.va_body.classification.verge_labels[index88] + '" ; \n \
:hasProbability "'+ element.va_body.classification.verge_probabilities[index88] + '" ; \n \
:verge_ta_contr_imageability "'+ element.ta_body.verge_labels_contribution_to_imageability[index88] + '" . \n \
')
    })

    console.log("ok")

    axios.post('http://160.40.52.155:7200/rest/login/admin', null, {
        headers: {
            'X-GraphDB-Password': 'mindspaces'
        }
    }).then(function (token) {
        const contentType = RDFMimeType.TURTLE;
        const readTimeout = 300000;
        const writeTimeout = 300000;
        const repositoryClientConfig = new RepositoryClientConfig('http://160.40.52.155:7200/repositories/mindspacespuc1')
            .setEndpoints(['http://160.40.52.155:7200/repositories/mindspacespuc1'])
            .setDefaultRDFMimeType(contentType)
            .setHeaders({ 'authorization': token.headers.authorization }, '', readTimeout, writeTimeout);
        const repositoryClient = new RDFRepositoryClient(repositoryClientConfig)

        repositoryClient.addFile('integrtest.ttl', contentType).catch((e) => console.log(e));
    })

        console.log("populated successfully")
        callback(null, { message: "ok", received: 1 })
    }

main()