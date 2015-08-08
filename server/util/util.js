function newDocument(res, requestData, Model, fieldData){
  var field, requestValue, modelDocument;

  var documentData = {};
  for(var key in fieldData){
    field = fieldData[key];
    requestValue = requestData[key];
    if(!requestValue){
      if(field.required !== false){
        // Field not passed in
        return res.error("400", field.error);
      }
    }else{
      if(field.process){
        documentData[key] = field.process(res, requestValue);
      }else{
        documentData[key] = requestValue;
      }
    }
  }

  modelDocument = new Model(documentData);
  modelDocument.save(function(err){
    if(err){
      console.log(err);
      return res.error("500");
    }else{
      return res.ok(true);
    }
  });

  
}

module.exports = {
  newDocument: newDocument
}