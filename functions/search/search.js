/* eslint-disable */
const fetch = require('node-fetch')
const cheerio = require('cheerio')
exports.handler = async function(event, context) {
  // console.log(event.queryStringParameters)
  const q = event.queryStringParameters.q || 'no search term'
  try {
    var links = await searchMe(q)
    return {
      statusCode: 200,
      body: JSON.stringify({ links })
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}


// search the top 20 google results
async function searchMe(query) {
  var response = await fetch('https://www.google.com/search?q=' + query, {
    headers: { 
      'user-agent': 'Mozilla/5.0 (MSIE; Windows 10)'
    }
  })
  if (!response.ok) {
    // NOT res.status >= 200 && res.status < 300
    return { statusCode: response.status, body: response.statusText }
  }
  var tmp = await response.text()
  var $ = cheerio.load(tmp)
  var links = []
  $('#main a').each(function(i, link){
    var linktext = $(link).text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/\s+/g, " ").trim()
    var siblingtext = $($(link).parent().siblings()).text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/\s+/g, " ").trim()
    var href = $(link).attr('href')
    links.push({linktext, siblingtext, href})
  });

  response = await fetch('https://www.google.com/search?start=10&q=' + query, {
    headers: { 
      'user-agent': 'Mozilla/5.0 (MSIE; Windows 10)'
    }
  })
  if (!response.ok) {
    // NOT res.status >= 200 && res.status < 300
    return { statusCode: response.status, body: response.statusText }
  }
  var tmp = await response.text()
  var $ = cheerio.load(tmp)
  $('#main a').each(function(i, link){
    var linktext = $(link).text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/\s+/g, " ").trim()
    var siblingtext = $($(link).parent().siblings()).text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/\s+/g, " ").trim()
    var href = $(link).attr('href')
    links.push({linktext, siblingtext, href})
  });
  return links
}