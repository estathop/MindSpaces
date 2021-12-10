var fs = require('fs')
var popjson = JSON.parse(fs.readFileSync('/Users/evan/Downloads/Merged_VA_TA_V2.json'))
var {points} = require('/Users/evan/Downloads/Merged_VA_TA_V2.json');
const { v4: uuidv4 } = require('uuid')


//console.log(points[0]['id'])
fs.writeFileSync('images66.ttl', '@prefix : <http://www.semanticweb.org/estathop/ontologies/2021/9/untitled-ontology-17#> . \n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix owl: <http://www.w3.org/2002/07/owl#> . \n@prefix geo: <http://www.opengis.net/ont/geosparql#> . \n', function (err) {
                if (err) return console.log(err);
                console.log('something with files went wrong !');
              });
count = 0;
points.forEach(element => {
    
  let textuuid = uuidv4();
    //console.log (element.Textual_Analysis_Body.ta.dbpedia_linking.nodes.length)
    if (element.Textual_Analysis_Body.ta.dbpedia_linking.nodes.length>0){
      //count++;
      //console.log(count)
      //console.log(element.Textual_Analysis_Body.ta.dbpedia_linking.nodes[0])
      element.Textual_Analysis_Body.ta.dbpedia_linking.nodes.forEach(element =>{
        //console.log(element.metadata.uri)
        //console.log(element.metadata.confidence)
        fs.appendFileSync('images66.ttl', '<'+element.metadata.uri+'> rdf:type owl:NamedIndividual , \n :URI ; \n :hasConfidence '+element.metadata.confidence+' . \n', function (err) {
                if (err) return console.log(err);
                console.log('something with files went wrong !');
              });
      })
    }

    //console.log(element.id.replace(/ /g,"_"))
    fs.appendFileSync('images66.ttl', ':'+element.id.replace(/ /g,"_")+' rdf:type owl:NamedIndividual , \n :Image ; \n :hasArousal :arousal'+element.id.replace(/ /g,"_")+' ; \n ')

      nerstring =':hasNer ';
      element.Textual_Analysis_Body.ta.ner.nodes.forEach( (element2, index) => {
        nerstring += ':ner'+(index+1)+''+element.id.replace(/ /g,"_")+' ,\n'
      })
      nerstring= nerstring.replace(/,([^,]*)$/, ';')

      fs.appendFileSync('images66.ttl', nerstring+'\n')

      fs.appendFileSync('images66.ttl', ':hasText :'+textuuid+' ; \n')
      fs.appendFileSync('images66.ttl', ':hasValence :valence'+element.id.replace(/ /g,"_")+' ; \n')

      semsegstring =':isSemSegContainer ';
      element.Visual_Analysis_Body.segmentation.segm_labels.forEach((element3, index2) => {
        semsegstring += ':semsegtop'+(index2+1)+'class'+element.id.replace(/ /g,"_")+' , \n'
      })
      semsegstring = semsegstring.replace(/,([^,]*)$/, ';')
      fs.appendFileSync('images66.ttl', semsegstring+'\n')

      vergestring = ':isVergeContainer '
      element.Visual_Analysis_Body.classification.verge_labels.forEach((element4, index3 ) => {
        vergestring += ':vergetop'+(index3+1)+'class'+element.id.replace(/ /g,"_")+' , \n'
      })
      vergestring = vergestring.replace(/,([^,]*)$/, ';')
      if (vergestring.length>18){
      fs.appendFileSync('images66.ttl', vergestring+'\n')}
      
      fs.appendFileSync('images66.ttl', ':hasDirection "'+element.direction+'" ; \n \
      :hasFocalLength "'+element.meta.FocalLength+'" ; \n \
      :hasFocalLengthIn35 "'+element.meta.FocalLengthIn35+'" ; \n \
      :hasImageHeight "'+element.meta.ImageHeight+'" ; \n \
      :hasImageWidth "'+element.meta.ImageWidth+'" ; \n \
      :hasLat "'+element.lat+'" ; \n \
      :hasLng "'+element.lng+'" ; \n \
      :hasPitch "'+element.pitch+'" ; \n \
      :hasSegmImageability "'+element.Textual_Analysis_Body.segm_imageability+'" ; \n \
      :hasTextImageability "'+element.Textual_Analysis_Body.ta.imageability.metadata.text_imageability+'" ; \n \
      :hasVergeImageability "'+element.Textual_Analysis_Body.verge_imageability+'" ; \n\
      :hasVisualAnalysisTimestamp "'+element.Visual_Analysis_Body.timestamp+'" ; \n \
      :hasXResolution "'+element.meta.XResulution+'" ; \n \
      :hasYResolution "'+element.meta.YResulution+'" ; \n \
      :hasZoom "'+element.zoom+'" ; \n\
      :isLandmark "'+element.landmark+'"^^xsd:boolean ; \n \ \
      :isName "'+element.id+'" . \n \
      \
      ')

      fs.appendFileSync('images66.ttl', ':arousal'+element.id.replace(/ /g,"_")+' rdf:type owl:NamedIndividual , \n \
      :Arousal ; \n \
      :hasProbability '+element.Visual_Analysis_Body.sentiment.arousal_probability+' ; \n \
      :hasValue "'+element.Visual_Analysis_Body.sentiment.arousal+'" . \n \
      ')

      element.Textual_Analysis_Body.ta.ner.nodes.forEach( (element2, index) => {
      fs.appendFileSync('images66.ttl', ':ner'+(index+1)+''+element.id.replace(/ /g,"_")+' rdf:type owl:NamedIndividual  , \n \
      :Ner ; \n\
      :hasBegin '+element2.metadata.begin+' ; \n \
      :hasEnd '+element2.metadata.end+' ; \n \
      :isCategory "'+element2.metadata.category+'" ; \n \
      :hasCoveredText "'+element2.metadata.covered_text.replace(/"/g," ")+'" ; \n \
      :hasLabel "'+element2.label+'" \
      ')
      logical_counter1=0;
      logical_counter2=0;
      logical_counter3=0;
      try{ element.Textual_Analysis_Body.ta.imageability.nodes.forEach(variablelabel => {
        if(element2.label === variablelabel.label){
          logical_counter1++;
          logical_counter2++;
          fs.appendFileSync('images66.ttl', ' ; \n \
          :NerhasImageabilityScore '+variablelabel.metadata.imageability_score+'\
          ')
        }
        element.Textual_Analysis_Body.ta.dbpedia_linking.nodes.forEach(dbvariable => {
        if (element2.label.includes(dbvariable.label)){
          logical_counter1++;
          logical_counter3++;
          fs.appendFileSync('images66.ttl', ' ; \n \
          :hasURI <'+dbvariable.metadata.uri+'> \
          ')
          }
        })
      })
      if(logical_counter1 ==0){
        fs.appendFileSync('images66.ttl', ' . \n')
      }
      if((logical_counter2>0) || (logical_counter3>0)){
        fs.appendFileSync('images66.ttl', ' . \n')
      }
      }
      catch (e) {}
      })

      element.Visual_Analysis_Body.segmentation.segm_labels.forEach((element3, index2) => {
        fs.appendFileSync('images66.ttl', ':semsegtop'+(index2+1)+'class'+element.id.replace(/ /g,"_")+' rdf:type owl:NamedIndividual , \n \
        :SemSegContainer ; \n \
        :isSemSegLabel :'+element3.replace(/ /g,"_")+' ; \n\
        :hasAccuracy "'+element.Visual_Analysis_Body.segmentation.segm_probabilities[index2]+'" ; \n \
        :hasPercentage "'+element.Visual_Analysis_Body.segmentation.segm_percentages[index2]+'" ; \n \
        :semseg_ta_contr_imageability "'+element.Textual_Analysis_Body.segm_labels_contribution_to_imageability[index2]+'" . \n \
        ')
      })

      element.Textual_Analysis_Body.ta.emotion_detection.nodes.forEach((element6, index6) => {
        fs.appendFileSync('images66.ttl', ':sentence_'+(index6+1)+'_'+element.id.replace(/ /g,"_")+' rdf:type owl:NamedIndividual , \n \
        :Sentence ; \n \
        :hasBegin "'+element6.metadata.begin+'" ; \n \
        :hasCoveredText "'+element6.metadata.covered_text.replace(/"/g," ")+'" ; \n \
        :hasEmotag "'+element6.metadata.emotag+'" ; \n \
        :hasEmotagConfidence "'+element6.metadata.confidence+'" ; \n \
        :hasEnd "'+element6.metadata.end+'" . \n \
        ')        
      })

      fs.appendFileSync('images66.ttl', ':'+textuuid+' rdf:type owl:NamedIndividual , \n \
      :Text ; \n \
      :isLang  "'+element.text.lang+'" ; \n \
      :isText "'+element.text.comment.replace(/"/g," ")+'" ; \n \ ')
      sentencestring = "";
      element.Textual_Analysis_Body.ta.emotion_detection.nodes.forEach((element6, index77) => {
        sentencestring += ':hasSentence :sentence_'+(index77+1)+'_'+element.id.replace(/ /g,"_")+' ; \n '

      })
      sentencestring = sentencestring.replace(/;[^;]*$/, '.')
      fs.appendFileSync('images66.ttl', sentencestring+' \n')

      fs.appendFileSync('images66.ttl', ':valence'+element.id.replace(/ /g,"_")+' rdf:type owl:NamedIndividual , \n \
      :Valence ; \n \
      :hasProbability "'+element.Visual_Analysis_Body.sentiment.valence_probability+'" ; \n \
      :hasValue "'+element.Visual_Analysis_Body.sentiment.valence+'" . \n \
      ')

      //vergestring2 = '';
      element.Visual_Analysis_Body.classification.verge_labels.forEach((element78, index88 ) => {
        fs.appendFileSync('images66.ttl', ':vergetop'+(index88+1)+'class'+element.id.replace(/ /g,"_")+'  rdf:type owl:NamedIndividual , \n \
        :VergeContainer ; \n \
        :isVergeLabel "'+element.Visual_Analysis_Body.classification.verge_labels[index88]+'" ; \n \
        :hasProbability "'+element.Visual_Analysis_Body.classification.verge_probabilities[index88]+'" ; \n \
        :verge_ta_contr_imageability "'+element.Textual_Analysis_Body.verge_labels_contribution_to_imageability[index88]+'" . \n \
        ')
      })
      //vergestring = vergestring.replace(/,([^,]*)$/, ';')
      //if (vergestring.length>18){
      //fs.appendFileSync('images66.ttl', vergestring+'\n')}
      

  })
