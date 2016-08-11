function nav(ele){
	hideAll();
	document.getElementById(ele).style.display = 'block';
}
function hideAll(){
	document.getElementById('introduction').style.display = 'none';
	document.getElementById('history').style.display = 'none';
	document.getElementById('usage').style.display = 'none';
	document.getElementById('ecdsa').style.display = 'none';
	document.getElementById('sample ecdsa').style.display = 'none';
	document.getElementById('hash').style.display = 'none';
	document.getElementById('rsa').style.display = 'none';
	document.getElementById('sample rsa').style.display = 'none';
	document.getElementById('key lib').style.display = 'none';
}

function doOnClick(){
	document.getElementById('switchBtn').style.color = 'red';
	return false;
}

function clickValue(){
	var x = "ECDSA";
	if(document.getElementById('switchBtn').style.color == 'red'){
		x = "RSA";
	} else {
		x = "ESDSA"
	}
	return x;
}
function showMenu(){
	var menu = document.getElementsByClassName('small-menu')[0];
	console.log(menu);
	console.log(menu.className);
	if(menu.className == 'small-menu hide'){
		console.log('showing');
		menu.style.display = 'visible';
		menu.className = 'small-menu show';
	}else if(menu.className == 'small-menu show'){
		console.log('hidding');
		menu.style.display = 'hidden';
		menu.className = 'small-menu hide';
	}
	
}