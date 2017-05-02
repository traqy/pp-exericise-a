var template = require('../views/average-psi');  
var average_psi_model = require('../model/average-psi');  

exports.get = function(req, res) {  
  var average_psi = average_psi_model.average_psi;
  var website_title = average_psi_model.average_psi_website_title;
  var website_page_title = average_psi_model.average_psi_website_page_title;

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write(template.build(website_title, website_page_title, average_psi ));
  
  res.end();
};
