var express = require('express');
var router = express.Router();
var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");
    crypto = require("crypto");
    secp256k1 = require('secp256k1');

/* GET home page. */

router.post('/sign',function(req, res, next) {
  console.log("req handler 'sign' was called.");
  const hash = crypto.createHash('sha256');
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  var key;
  form.parse(req, function(error, fields, files) {
    console.log("parsing done");
    console.log(fields);
    console.log("files:\n");
    console.log(files);
    var oldPath=files.file.path;
    var newPath='/public/upload/test';

    key=fields['key'];
    
    
    
    
    var priv=Buffer.from(key,'base64');
    
    if(key.length!=44||!secp256k1.privateKeyVerify(priv)){
      res.end("Error: Key no proper!");
    }
    else if(!secp256k1.privateKeyVerify(priv)){
      res.end("Error: Not a private key");
    }
    else{
    fs.readFile(oldPath,function(err,data){
      hash.update(data);
      fileHash=hash.digest('base64');
      var bufferHash=Buffer.from(fileHash,'base64');
    	sig=secp256k1.sign(bufferHash,priv);
    	signature=secp256k1.signatureExport(sig['signature']);
    	sigToDisplay=signature.toString('base64');
    
    	res.send(sigToDisplay);
    	//res.send("\n"+fileHash);
    
    	res.end();

    	});
    }
  });
    
});
router.post('/verify',function(req, res, next) {
  console.log("req handler 'sign' was called.");
  const hash = crypto.createHash('sha256');
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  
  var key;
  form.parse(req, function(error, fields, files) {
    console.log("parsing done");
    var oldPath=files.file.path;
    var newPath='/public/upload/test';
    var signature=fields['signature'];
    key=fields['key'];
    
    var pub=Buffer.from(key,'base64');
    
    console.log(fields);
    if(key.length!=44){
      res.end("Error: Key no proper!");
    }
    else if(!secp256k1.publicKeyVerify(pub)){
      res.end("Error: Not a public key!");
    }
    else if(signature.length!=96){
      res.end("Error: Signature no proper!");

    }
    else{
    fs.readFile(oldPath,function(err,data){
    hash.update(data);

    fileHash=hash.digest('base64');
    
    var bufferHash=Buffer.from(fileHash,'base64');
    var sig=Buffer.from(fields['signature'],'base64');
    sig=secp256k1.signatureImport(sig);
    var v=secp256k1.verify(bufferHash, sig, pub);
    var answer;
    if(v){
      answer="YES";
    }
    else{
      answer="NO";
    }
    
    res.send(answer);
    
    res.end();
	});

    	}
    
  });
    
});
router.get('/genkey',function(req, res, next){
	console.log("req handler 'genKey' was called.");
  var privKey
  do {
  privKey = crypto.randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privKey));

// get the public key in a compressed format
  var pubKey = secp256k1.publicKeyCreate(privKey);
  var priv=privKey.toString('base64');
  var pub=pubKey.toString('base64');
  var pubKeyU=secp256k1.publicKeyConvert(pubKey,false);
  var pubU=pubKeyU.toString('base64');

  var body = '\<html\>'+
    '\<head\>'+
    '\<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" /\>'+
    '\</head\>'+
    '\<body\>'+
    
    'Privatekey:'+
    priv+
    '\</br\>'+
    'Publickey:'+
    pub+
    '\</br\>'+
    'PubU'+
    pubU+

    '\</body\>'+
    '\</html\>';
    res.send(body);
    res.end();
});
router.get('/introduction',function(req, res, next){
  res.render('index', { title: 'Introduction' ,
                        content:'Cryptography is the study of information hiding and verification. It includes the protocols, algorithms and strategies to securely and consistently prevent or delay unauthorized access to sensitive information and enable verifiability of every component in a communication. Cryptography is derived from the Greek words: kryptós, "hidden", and gráphein, "to write" - or "hidden writing". People who study and develop cryptography are called cryptographers. The study of how to circumvent the use of cryptography for unintended recipients is called cryptanalysis, or codebreaking. Cryptography and cryptanalysis are sometimes grouped together under the umbrella term cryptology, encompassing the entire subject. In practice, "cryptography" is also often used to refer to the field as a whole, especially as an applied science. Cryptography is an interdisciplinary subject, drawing from several fields. Before the time of computers, it was closely related to linguistics. Nowadays the emphasis has shifted, and cryptography makes extensive use of technical areas of mathematics, especially those areas collectively known as discrete mathematics. This includes topics from number theory, information theory, computational complexity, statistics and combinatorics. It is also a branch of engineering, but an unusual one as it must deal with active, intelligent and malevolent opposition.'});
});
router.get('/history',function(req, res, next){
  res.render('index', { title: 'History',
                        content:'Cryptology is a young science. Though it has been used for thousands of years to hide secret messages, systematic study of cryptology as a science (and perhaps an art) just started around one hundred years ago. During the 16th century, Vigenere designed a cipher that was supposedly the first cipher which used an encryption key. In one of his ciphers, the encryption key was repeated multiple times spanning the entire message, and then the cipher text was produced by adding the message character with the key character modulo 26. At the start of the 19th century when everything became electric, Hebern designed an electro-mechanical contraption which was called the Hebern rotor machine. It uses a single rotor, in which the secret key is embedded in a rotating disc. Up to the Second World War, most of the work on cryptography was for military purposes, usually used to hide secret military information. However, cryptography attracted commercial attention post-war, with businesses trying to secure their data from competitors. In the early 1970\'s, IBM realized that their customers were demanding some form of encryption, so they formed a "crypto group" headed by Horst-Feistel. They designed a cipher called Lucifer. In 1973, the Nation Bureau of Standards (now called NIST) in the US put out a request for proposals for a block cipher which would become a national standard.' });
});
router.get('/what-is-ecdsa',function(req, res, next){
  res.render('index', { title: 'What is ECDSA' ,
                        content: 'There are two fundamentally different authentication schemes: symmetric systems, which rely on secret keys shared by host and authenticator, and asymmetric systems, such as the Elliptic Curve Digital Signature Algorithm (ECDSA), which rely on a private key in the authenticator and a public key that the host uses to verify the authenticator. In open systems where third-party entities need to be authenticated, the management and protection of the secret keys can be a problem. Here is where ECDSA offers the required flexibility.'});
});
router.get(['/ecdsa','/'],function(req, res, next){
  data=fs.readFileSync('form.html');

  res.render('index', { title: 'ECDSA Signing Tool',
                        content: data.toString('utf8')
                      });

});
router.get('/what-is-hash',function(req, res, next){
  res.render('index', { title: 'What is Hash' ,
                        content:'Producing hash values for accessing data or for security. A hash value (or simply hash), also called a message digest, is a number generated from a string of text. The hash is substantially smaller than the text itself, and is generated by a formula in such a way that it is extremely unlikely that some other text will produce the same hash value. Hashes play a role in security systems where they\'re used to ensure that transmitted messages have not been tampered with. The sender generates a hash of the message, encrypts it, and sends it with the message itself. The recipient then decrypts both the message and the hash, produces another hash from the received message, and compares the two hashes. If they\'re the same, there is a very high probability that the message was transmitted intact.'});
});
router.get('/What is RSA',function(req, res, next){
  res.render('index', { title: 'What is RSA' ,
                        content: 'A public-key encryption technology developed by RSA Data Security, Inc. The acronym stands for Rivest, Shamir, and Adelman, the inventors of the technique. The RSA algorithm is based on the fact that there is no efficient way to factor very large numbers. Deducing an RSA key, therefore, requires an extraordinary amount of computer processing power and time. The RSA algorithm has become the de facto standard for industrial-strength encryption, especially for data sent over the Internet. It is built into many software products, including Netscape Navigator and Microsoft Internet Explorer. The technology is so powerful that the U.S. government has restricted exporting it to foreign countries.'});
});
router.get('/RSA',function(req, res, next){
  res.send('Under construction...');
  
});
module.exports = router;
