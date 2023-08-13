function generateRandomJSCode() {
    const statements = [
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "try",
      "catch",
      "function",
      "return",
      " ",
      " "
    ];
  
    const expressions = [
      "1",
      "2",
      "'Hello'",
      "true",
      "false",
      "null",
      "undefined",
      "Math.random()",
      "x + y",
      "arr.length",
      "obj.property",
      "x > 0 ? 'positive' : 'negative'",
      "arr.map(item => item * 2)",
      "'Some string'.toUpperCase()",
      "arr.filter(item => item > 0)",
      "arr.reduce((acc, item) => acc + item, 0)",
      "arr.find(item => item.id === 53)",
      "arr.some(item => item.id === 24)",
      "arr.every(item => item.id === 245)",
      "arr.sort((a, b) => a - b)",
      "obj.method()",
      "obj.method().property",
      "obj.method().method()",
      "arr.filter(item => item > 0).map(item => item * 2).reduce((acc, item) => acc + item, 0)",
      "arr.filter(item => item > 0).map(item => item * 2).reduce((acc, item) => acc + item, 0)",
      "arr.filter(item => item > 0).map(item => item * 2).reduce((acc, item) => acc + item, 0)",
      "arr.filter(item => item > 0).map(item => item * 2).reduce((acc, item) => acc + item, 0)",
      "arr.filter(item => item > 0).map(item => item * 2)",
      "obj.method().property.filter(item => item > 0).map(item => item * 2).reduce((acc, item) => acc + item, 0)",
      "obj.method().property.filter(item => item > 0)",
      "obj.method().property.filter(item => item > 0).map(item => item * 2)",
      "myProp.filter(item => item > 0).map(item => item * 2).reduce((acc, item) => acc + item, 0)",
      " ",
      " "
    ];
  
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
  
    let randomCode = "";
  
    for (let i = 0; i < 2; i++) {
      if (Math.random() < 0.7) {
        randomCode += getRandomElement(statements) + " ";
  
        if (Math.random() < 0.5) {
          randomCode += "name" + i + " = ";
        }
      }
  
      randomCode += getRandomElement(expressions);
  
      if (Math.random() < 0.3) {
        randomCode += " " + getRandomElement(["+", "-", "*", "/"]) + " " + getRandomElement(expressions);
      }
  
      randomCode += ";\n";
    }
  
    return randomCode;
  }
  
window.onload = function() {
    simulateConsole();
};

//Keep randomly generating code and appending it to an element, until overflow.
//Then, remove the first child of the element, and append the new code to the end.
//This will simulate a console, where the code is constantly being generated and printed.

function simulateConsole(){
    let code = generateRandomJSCode();
    let codeElement = document.getElementById("desktopBkGroundOverlay");
    codeElement.innerHTML += "<p>"+code+"</p>";
    while(codeElement.scrollHeight > codeElement.clientHeight){
        //Remove the first child of the element with a scroll up effect.
        codeElement.removeChild(codeElement.firstChild);
    }
    setTimeout(simulateConsole, Math.random()*50 + 450);
}

function generateRandomData(){
    let data = [];
    for(let i = 0; i < 100; i++){
        data.push(Math.random());
    }
    return data;
}

function generateRandomGraph(){
    let data = generateRandomData();
    let graph = document.createElement("p");
    graph.style.float = "right";
    graph.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        let bar = document.createElement("div");
        bar.setAttribute("class", "bar");
        bar.style.height = data[i]*100 + "%";
        graph.appendChild(bar);
    }
    return graph;
}
